import { ComponentConstructor } from "./ComponentConstructor";
import { GameObject } from "./GameObject";
import { EngineGlobalObject } from "../EngineGlobalObject";
import { isUpdateableComponent } from "../SceneProcessor";
import { Coroutine } from "../coroutine/Coroutine";
import { CoroutineIterator } from "../coroutine/CoroutineIterator";
import { Transform } from "./Transform";
import { ComponentEventContainer } from "./ComponentEventContainer";

/**
 * component is the base class from which every engine script derives
 * 
 * do not override constructor it's break the engine
 */
export abstract class Component {
    /**
     * if this true, this component can't be added multiple times to the same game object
     */
    public readonly disallowMultipleComponent: boolean = false;
    
    /**
     * if this array is not empty, this component can be added only if all of the components in this array are already added to the game object
     */
    public readonly requiredComponents: ComponentConstructor[] = [];
    
    /**
     * script execution order of this component
     */
    public readonly executionOrder: number = 0;

    private _enabled: boolean;
    private _startEnqueued: boolean;
    private _updateEnqueued: boolean;

    private readonly _gameObject: GameObject;
    private readonly _instanceId: number;
    private readonly _runningCoroutines: Coroutine[] = [];
    
    /** @internal */
    public readonly _componentEventContainer: ComponentEventContainer;
    /** @internal */
    public _destroyed = false;

    /** @internal */
    public constructor(gameObject: GameObject) {
        this._enabled = true;
        this._startEnqueued = false;
        this._updateEnqueued = false;
        this._gameObject = gameObject;
        this._instanceId = gameObject.engine.instantlater.generateId();
        this._componentEventContainer = new ComponentEventContainer(this);
    }

    /**
     * starts a coroutine
     * @param coroutineIterator coroutine iterator
     * @returns corutine instance. you can stop coroutine by calling stopCoroutine(coroutine: ICoroutine) with this variable
     */
    public startCorutine(coroutineIterator: CoroutineIterator): Coroutine {
        const coroutine = new Coroutine(this, coroutineIterator, () => {
            const index = this._runningCoroutines.indexOf(coroutine);
            if (index >= 0) {
                this._runningCoroutines.splice(index, 1);
            }
        });
        this._runningCoroutines.push(coroutine);
        this.engine.coroutineProcessor.addCoroutine(coroutine);
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
    public stopCoroutine(coroutine: Coroutine): void {
        if ((coroutine as Coroutine).component !== this) {
            throw new Error("Coroutine is not owned by this component");
        }
        this.engine.coroutineProcessor.removeCoroutine(coroutine as Coroutine);
        const index = this._runningCoroutines.indexOf(coroutine as Coroutine);
        if (index >= 0) {
            this._runningCoroutines.splice(index, 1);
        }
    }

    /** @internal */
    public internalSetStartEnqueueState(state: boolean): void {
        this._startEnqueued = state;
    }

    /** @internal */
    public internalSetUpdateEnqueueState(state: boolean): void {
        this._updateEnqueued = state;
    }

    /** @internal */
    public internalTryEnqueueStart(): void {
        if (this._startEnqueued) return;
        this.engine.sceneProcessor.addStartComponent(this);
        this._startEnqueued = true;
    }

    /** @internal */
    public internalTryEnqueueUpdate(): void {
        if (this._updateEnqueued) return;
        if (isUpdateableComponent(this)) {
            this.engine.sceneProcessor.addUpdateComponent(this);
            this._updateEnqueued = true;
        }
    }

    /** @internal */
    public internalTryDequeueUpdate(): void {
        if (!this._updateEnqueued) return;
        if (isUpdateableComponent(this)) {
            this.engine.sceneProcessor.removeUpdateComponent(this);
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

        if (!this._gameObject.initialized) return;
        
        if (this._gameObject.activeInHierarchy) {
            const sceneProcessor = this.engine.sceneProcessor;

            if (this._enabled) {
                this._componentEventInvoker.tryCallOnEnable();
                if (!this._startEnqueued) {
                    sceneProcessor.addStartComponent(this);
                    this._startEnqueued = true;
                }
                this.internalTryEnqueueUpdate();
            } else {
                this._componentEventInvoker.tryCallOnDisable();
                if (this._startEnqueued && !this._componentEventInvoker.started) {
                    sceneProcessor.removeStartComponent(this);
                    this._startEnqueued = false;
                }
                this.internalTryDequeueUpdate();
            }
        }
    }

    /**
     * game object this component belongs to
     */
    public get gameObject(): GameObject {
        return this._gameObject;
    }

    /**
     * transform attached to this component game object
     */
    public get transform(): Transform {
        return this._gameObject.transform;
    }

    /**
     * global engine object
     */
    public get engine(): EngineGlobalObject {
        return this._gameObject.engine;
    }

    /**
     * get instance id of this component
     */
    public get instanceId(): number {
        return this._instanceId;
    }

    /**
     * if instantiate process is finished, this will be true
     */
    public get initialized(): boolean {
        return this._gameObject.initialized;
    }

    /** @internal */
    public static lessOperation(a: Component, b: Component): boolean {
        if (a.executionOrder === b.executionOrder) {
            return a.instanceId < b.instanceId;
        }
        return a.executionOrder < b.executionOrder;
    }
}
