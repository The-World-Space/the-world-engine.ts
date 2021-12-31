import { ComponentConstructor } from "./ComponentConstructor";
import { GameObject } from "./GameObject";
import { IEngine } from "../IEngine";
import { CoroutineIterator } from "../coroutine/CoroutineIterator";
import { ICoroutine } from "../coroutine/ICoroutine";
/**
 * component is the base class from which every engine script derives
 */
export declare abstract class Component {
    protected readonly _disallowMultipleComponent: boolean;
    protected readonly _requiredComponents: ComponentConstructor[];
    protected readonly _executionOrder: number;
    private _enabled;
    private _awakened;
    private _awakening;
    private _startEnqueued;
    private _started;
    private _starting;
    private _updateEnqueued;
    private _gameObject;
    private _runningCoroutines;
    constructor(gameObject: GameObject);
    /**
     * awake is called when the script instance is being loaded.
     * The order that Unity calls each GameObject"s Awake is not deterministic.
     * Because of this, you should not rely on one GameObject"s Awake being called before or after another
     * (for example, you should not assume that a reference set up by one GameObject"s Awake will be usable in another GameObject"s Awake).
     * Instead, you should use Awake to set up references between scripts, and use Start, which is called after all Awake calls are finished, to pass any information back and forth.
     * https://docs.unity3d.com/ScriptReference/MonoBehaviour.Awake.html
     */
    protected awake(): void;
    /**
     * start is called on the frame when a script is enabled just before any of the Update methods are called the first time.
     * https://docs.unity3d.com/ScriptReference/MonoBehaviour.Start.html
     */
    protected start(): void;
    /**
     * onDestroy occurs when a component is destroyed
     */
    onDestroy(): void;
    /**
     * this function is called when the object becomes enabled and active
     */
    onEnable(): void;
    /**
     * this function is called when the component becomes disabled
     */
    onDisable(): void;
    /**
     * starts a coroutine
     * @param coroutineIterator coroutine iterator
     * @returns corutine instance. you can stop coroutine by calling stopCoroutine(coroutine: ICoroutine) with this variable
     */
    startCorutine(coroutineIterator: CoroutineIterator): ICoroutine;
    /**
     * stop all coroutines executed by this component
     */
    stopAllCoroutines(): void;
    /**
     * stop coroutine that is executed by this component
     * @param coroutine coroutine instance
     */
    stopCoroutine(coroutine: ICoroutine): void;
    /**
     * this method is called by the engine, do not call it manually
     */
    unsafeTryCallAwake(): void;
    /**
     * this method is called by the engine, do not call it manually
     */
    unsafeTryCallStart(): void;
    /**
     * this method is called by the engine, do not call it manually
     */
    unsafeSetStartEnqueueState(state: boolean): void;
    /**
     * this method is called by the engine, do not call it manually
     */
    unsafeSetUpdateEnqueueState(state: boolean): void;
    /**
     * this method is called by the engine, do not call it manually
     */
    unsafeTryEnqueueStart(): void;
    /**
     * this method is called by the engine, do not call it manually
     */
    unsafeTryEnqueueUpdate(): void;
    /**
     * this method is called by the engine, do not call it manually
     */
    unsafeTryDequeueUpdate(): void;
    /**
     * enabled components are updated, disabled components are not
     */
    get enabled(): boolean;
    /**
     * enabled components are updated, disabled components are not
     */
    set enabled(value: boolean);
    /**
     * when component is executing awake, this is true
     */
    get awakening(): boolean;
    /**
     * when component is executed awake, this is true
     */
    get awakened(): boolean;
    /**
     * when component is executing start, this is true
     */
    get starting(): boolean;
    /**
     * when component is executed start, this is true
     */
    get started(): boolean;
    /**
     * game object this component belongs to
     */
    get gameObject(): GameObject;
    /**
     * global engine object
     */
    get engine(): IEngine;
    /**
     * if this true, this component can't be added multiple times to the same game object
     */
    get disallowMultipleComponent(): boolean;
    /**
     * if this array is not empty, this component can be added only if all of the components in this array are already added to the game object
     */
    get requiredComponents(): ComponentConstructor[];
    /**
     * script execution order of this component
     */
    get executionOrder(): number;
}
