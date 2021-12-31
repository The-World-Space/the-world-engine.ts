import { ComponentConstructor } from "./ComponentConstructor";
import { GameObject } from "./GameObject";
import { GameStateKind } from "../GameState";
import { IEngine } from "../IEngine";
import { EngineGlobalObject } from "../EngineGlobalObject";
import { isUpdateableComponent } from "../SceneProcessor";
import { Coroutine } from "../coroutine/Coroutine";
import { CoroutineIterator } from "../coroutine/CoroutineIterator";
import { ICoroutine } from "../coroutine/ICoroutine";

/**
 * component is the base class from which every engine script derives
 */
export abstract class Component {
    protected readonly _disallowMultipleComponent: boolean = false;
    protected readonly _requiredComponents: ComponentConstructor[] = [];
    protected readonly _executionOrder: number = 0;

    private _enabled: boolean;
    private _awakened: boolean;
    private _awakening: boolean;
    private _startEnqueued: boolean;
    private _started: boolean;
    private _starting: boolean;
    private _updateEnqueued: boolean;
    private _gameObject: GameObject;
    private _runningCoroutines: Coroutine[] = [];

    public constructor(gameObject: GameObject) {
        this._enabled = true;
        this._awakened = false;
        this._awakening = false;
        this._startEnqueued = false;
        this._started = false;
        this._starting = false;
        this._updateEnqueued = false;
        this._gameObject = gameObject;
    }

    /**
     * awake is called when the script instance is being loaded.
     * The order that Unity calls each GameObject"s Awake is not deterministic.
     * Because of this, you should not rely on one GameObject"s Awake being called before or after another
     * (for example, you should not assume that a reference set up by one GameObject"s Awake will be usable in another GameObject"s Awake).
     * Instead, you should use Awake to set up references between scripts, and use Start, which is called after all Awake calls are finished, to pass any information back and forth.
     * https://docs.unity3d.com/ScriptReference/MonoBehaviour.Awake.html
     */
    //eslint-disable-next-line @typescript-eslint/no-empty-function
    protected awake(): void { }

    /**
     * start is called on the frame when a script is enabled just before any of the Update methods are called the first time.
     * https://docs.unity3d.com/ScriptReference/MonoBehaviour.Start.html
     */
    //eslint-disable-next-line @typescript-eslint/no-empty-function
    protected start(): void { }

    /**
     * onDestroy occurs when a component is destroyed
     */
    //eslint-disable-next-line @typescript-eslint/no-empty-function
    public onDestroy(): void { }

    /**
     * this function is called when the object becomes enabled and active
     */
    //eslint-disable-next-line @typescript-eslint/no-empty-function
    public onEnable(): void { }

    /**
     * this function is called when the component becomes disabled
     */
    //eslint-disable-next-line @typescript-eslint/no-empty-function
    public onDisable(): void { }

    /**
     * starts a coroutine
     * @param coroutineIterator coroutine iterator
     * @returns corutine instance. you can stop coroutine by calling stopCoroutine(coroutine: ICoroutine) with this variable
     */
    public startCorutine(coroutineIterator: CoroutineIterator): ICoroutine {
        const coroutine = new Coroutine(this, coroutineIterator, () => {
            const index = this._runningCoroutines.indexOf(coroutine);
            if (index >= 0) {
                this._runningCoroutines.splice(index, 1);
            }
        });
        this._runningCoroutines.push(coroutine);
        (this.engine as EngineGlobalObject).coroutineProcessor.addCoroutine(coroutine);
        return coroutine;
    }

    /**
     * stop all coroutines executed by this component
     */
    public stopAllCoroutines(): void {
        this._runningCoroutines.forEach(coroutine => {
            this.stopCoroutine(coroutine);
        });
        this._runningCoroutines = [];
    }

    /**
     * stop coroutine that is executed by this component
     * @param coroutine coroutine instance
     */
    public stopCoroutine(coroutine: ICoroutine): void {
        if ((coroutine as Coroutine).component !== this) {
            throw new Error("Coroutine is not owned by this component");
        }
        (this.engine as EngineGlobalObject).coroutineProcessor.removeCoroutine(coroutine as Coroutine);
        const index = this._runningCoroutines.indexOf(coroutine as Coroutine);
        if (index >= 0) {
            this._runningCoroutines.splice(index, 1);
        }
    }

    /**
     * this method is called by the engine, do not call it manually
     */
    public unsafeTryCallAwake(): void {
        if (this._awakened) return;
        this._awakening = true;
        this.awake();
        this._awakening = false;
        this._awakened = true;
    }

    /**
     * this method is called by the engine, do not call it manually
     */
    public unsafeTryCallStart(): void {
        if (this._started) return;
        this._starting = true;
        this.start();
        this._starting = false;
        this._started = true;
    }

    /**
     * this method is called by the engine, do not call it manually
     */
    public unsafeSetStartEnqueueState(state: boolean): void {
        this._startEnqueued = state;
    }

    /**
     * this method is called by the engine, do not call it manually
     */
    public unsafeSetUpdateEnqueueState(state: boolean): void {
        this._updateEnqueued = state;
    }

    /**
     * this method is called by the engine, do not call it manually
     */
    public unsafeTryEnqueueStart(): void {
        if (this._startEnqueued) return;
        (this.engine as EngineGlobalObject).sceneProcessor.addStartComponent(this);
        this._startEnqueued = true;
    }

    /**
     * this method is called by the engine, do not call it manually
     */
    public unsafeTryEnqueueUpdate(): void {
        if (this._updateEnqueued) return;
        if (isUpdateableComponent(this)) {
            (this.engine as EngineGlobalObject).sceneProcessor.addUpdateComponent(this);
            this._updateEnqueued = true;
        }
    }

    /**
     * this method is called by the engine, do not call it manually
     */
    public unsafeTryDequeueUpdate(): void {
        if (!this._updateEnqueued) return;
        if (isUpdateableComponent(this)) {
            (this.engine as EngineGlobalObject).sceneProcessor.removeUpdateComponent(this);
            this._updateEnqueued = false;
        }
    }

    /**
     * enabled components are updated, disabled components are not
     */
    public get enabled(): boolean {
        return this._enabled;
    }

    /**
     * enabled components are updated, disabled components are not
     */
    public set enabled(value: boolean) {
        if (this._enabled === value) return;

        this._enabled = value;

        if (this.engine.gameState.kind === GameStateKind.Initializing) {
            return;
        }
        
        if (this._gameObject.activeInHierarchy) {
            const sceneProcessor = (this.engine as EngineGlobalObject).sceneProcessor;

            if (this._enabled) {
                this.onEnable();
                if (!this._startEnqueued) {
                    sceneProcessor.addStartComponent(this);
                    this._startEnqueued = true;
                }
                this.unsafeTryEnqueueUpdate();
            } else {
                this.onDisable();
                if (this._startEnqueued && !this._started) {
                    sceneProcessor.removeStartComponent(this);
                    this._startEnqueued = false;
                }
                this.unsafeTryDequeueUpdate();
            }
        }
    }

    /**
     * when component is executing awake, this is true
     */
    public get awakening(): boolean {
        return this._awakening;
    }

    /**
     * when component is executed awake, this is true
     */
    public get awakened(): boolean {
        return this._awakened;
    }

    /**
     * when component is executing start, this is true
     */
    public get starting(): boolean {
        return this._starting;
    }

    /**
     * when component is executed start, this is true
     */
    public get started(): boolean {
        return this._started;
    }

    /**
     * game object this component belongs to
     */
    public get gameObject(): GameObject {
        return this._gameObject;
    }

    /**
     * global engine object
     */
    public get engine(): IEngine {
        return this._gameObject.engine;
    }

    /**
     * if this true, this component can't be added multiple times to the same game object
     */
    public get disallowMultipleComponent(): boolean {
        return this._disallowMultipleComponent;
    }

    /**
     * if this array is not empty, this component can be added only if all of the components in this array are already added to the game object
     */
    public get requiredComponents(): ComponentConstructor[] {
        return this._requiredComponents;
    }

    /**
     * script execution order of this component
     */
    public get executionOrder(): number {
        return this._executionOrder;
    }
}
