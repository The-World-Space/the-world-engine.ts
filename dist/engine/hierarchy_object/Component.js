import { GameStateKind } from "../GameState";
import { isUpdateableComponent } from "../SceneProcessor";
import { Coroutine } from "../coroutine/Coroutine";
/**
 * component is the base class from which every engine script derives
 */
export class Component {
    constructor(gameObject) {
        this._disallowMultipleComponent = false;
        this._requiredComponents = [];
        this._executionOrder = 0;
        this._runningCoroutines = [];
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
    awake() { }
    /**
     * start is called on the frame when a script is enabled just before any of the Update methods are called the first time.
     * https://docs.unity3d.com/ScriptReference/MonoBehaviour.Start.html
     */
    //eslint-disable-next-line @typescript-eslint/no-empty-function
    start() { }
    /**
     * onDestroy occurs when a component is destroyed
     */
    //eslint-disable-next-line @typescript-eslint/no-empty-function
    onDestroy() { }
    /**
     * this function is called when the object becomes enabled and active
     */
    //eslint-disable-next-line @typescript-eslint/no-empty-function
    onEnable() { }
    /**
     * this function is called when the component becomes disabled
     */
    //eslint-disable-next-line @typescript-eslint/no-empty-function
    onDisable() { }
    /**
     * starts a coroutine
     * @param coroutineIterator coroutine iterator
     * @returns corutine instance. you can stop coroutine by calling stopCoroutine(coroutine: ICoroutine) with this variable
     */
    startCorutine(coroutineIterator) {
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
    stopAllCoroutines() {
        this._runningCoroutines.forEach(coroutine => {
            this.stopCoroutine(coroutine);
        });
        this._runningCoroutines = [];
    }
    /**
     * stop coroutine that is executed by this component
     * @param coroutine coroutine instance
     */
    stopCoroutine(coroutine) {
        if (coroutine.component !== this) {
            throw new Error("Coroutine is not owned by this component");
        }
        this.engine.coroutineProcessor.removeCoroutine(coroutine);
        const index = this._runningCoroutines.indexOf(coroutine);
        if (index >= 0) {
            this._runningCoroutines.splice(index, 1);
        }
    }
    /**
     * this method is called by the engine, do not call it manually
     */
    unsafeTryCallAwake() {
        if (this._awakened)
            return;
        this._awakening = true;
        this.awake();
        this._awakening = false;
        this._awakened = true;
    }
    /**
     * this method is called by the engine, do not call it manually
     */
    unsafeTryCallStart() {
        if (this._started)
            return;
        this._starting = true;
        this.start();
        this._starting = false;
        this._started = true;
    }
    /**
     * this method is called by the engine, do not call it manually
     */
    unsafeSetStartEnqueueState(state) {
        this._startEnqueued = state;
    }
    /**
     * this method is called by the engine, do not call it manually
     */
    unsafeSetUpdateEnqueueState(state) {
        this._updateEnqueued = state;
    }
    /**
     * this method is called by the engine, do not call it manually
     */
    unsafeTryEnqueueStart() {
        if (this._startEnqueued)
            return;
        this.engine.sceneProcessor.addStartComponent(this);
        this._startEnqueued = true;
    }
    /**
     * this method is called by the engine, do not call it manually
     */
    unsafeTryEnqueueUpdate() {
        if (this._updateEnqueued)
            return;
        if (isUpdateableComponent(this)) {
            this.engine.sceneProcessor.addUpdateComponent(this);
            this._updateEnqueued = true;
        }
    }
    /**
     * this method is called by the engine, do not call it manually
     */
    unsafeTryDequeueUpdate() {
        if (!this._updateEnqueued)
            return;
        if (isUpdateableComponent(this)) {
            this.engine.sceneProcessor.removeUpdateComponent(this);
            this._updateEnqueued = false;
        }
    }
    /**
     * enabled components are updated, disabled components are not
     */
    get enabled() {
        return this._enabled;
    }
    /**
     * enabled components are updated, disabled components are not
     */
    set enabled(value) {
        if (this._enabled === value)
            return;
        this._enabled = value;
        if (this.engine.gameState.kind === GameStateKind.Initializing) {
            return;
        }
        if (this._gameObject.activeInHierarchy) {
            const sceneProcessor = this.engine.sceneProcessor;
            if (this._enabled) {
                this.onEnable();
                if (!this._startEnqueued) {
                    sceneProcessor.addStartComponent(this);
                    this._startEnqueued = true;
                }
                this.unsafeTryEnqueueUpdate();
            }
            else {
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
    get awakening() {
        return this._awakening;
    }
    /**
     * when component is executed awake, this is true
     */
    get awakened() {
        return this._awakened;
    }
    /**
     * when component is executing start, this is true
     */
    get starting() {
        return this._starting;
    }
    /**
     * when component is executed start, this is true
     */
    get started() {
        return this._started;
    }
    /**
     * game object this component belongs to
     */
    get gameObject() {
        return this._gameObject;
    }
    /**
     * global engine object
     */
    get engine() {
        return this._gameObject.engine;
    }
    /**
     * if this true, this component can't be added multiple times to the same game object
     */
    get disallowMultipleComponent() {
        return this._disallowMultipleComponent;
    }
    /**
     * if this array is not empty, this component can be added only if all of the components in this array are already added to the game object
     */
    get requiredComponents() {
        return this._requiredComponents;
    }
    /**
     * script execution order of this component
     */
    get executionOrder() {
        return this._executionOrder;
    }
}
