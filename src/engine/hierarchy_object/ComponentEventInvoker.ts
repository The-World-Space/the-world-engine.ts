import { Component } from './Component';

/**
 * awake is called when the script instance is being loaded.
 * The order that Unity calls each GameObject"s Awake is not deterministic.
 * Because of this, you should not rely on one GameObject"s Awake being called before or after another
 * (for example, you should not assume that a reference set up by one GameObject"s Awake will be usable in another GameObject"s Awake).
 * Instead, you should use Awake to set up references between scripts, and use Start, which is called after all Awake calls are finished, to pass any information back and forth.
 * https://docs.unity3d.com/ScriptReference/MonoBehaviour.Awake.html
 */
type AwakeableComponent = Component & { awake(): void; };

function isAwakeableComponent(component: Component): component is AwakeableComponent {
    return (component as AwakeableComponent).awake !== undefined;
}

/**
 * start is called on the frame when a script is enabled just before any of the Update methods are called the first time.
 * https://docs.unity3d.com/ScriptReference/MonoBehaviour.Start.html
 */
type StartableComponent = Component & { start(): void; };

function isStartableComponent(component: Component): component is StartableComponent {
    return (component as StartableComponent).start !== undefined;
}

/**
 * onDestroy occurs when a component is destroyed
 */
type OnDestroyableComponent = Component & { onDestroy(): void; };

function isOnDestroyableComponent(component: Component): component is OnDestroyableComponent {
    return (component as OnDestroyableComponent).onDestroy !== undefined;
}

/**
 * this function is called when the object becomes enabled and active
 */
type OnEnableableComponent = Component & { onEnable(): void; };

function isOnEnableableComponent(component: Component): component is OnEnableableComponent {
    return (component as OnEnableableComponent).onEnable !== undefined;
}

/**
 * this function is called when the component becomes disabled
 */
type OnDisableableComponent = Component & { onDisable(): void; };

function isOnDisableableComponent(component: Component): component is OnDisableableComponent {
    return (component as OnDisableableComponent).onDisable !== undefined;
}

/**
 * event function that calls after world matrix is updated
 */
type OnWorldMatrixUpdatedableComponent = Component & { onWorldMatrixUpdated(): void; };

function isOnWorldMatrixUpdatedableComponent(component: Component): component is OnWorldMatrixUpdatedableComponent {
    return (component as OnWorldMatrixUpdatedableComponent).onWorldMatrixUpdated !== undefined;
}

/** @internal */
export class ComponentEventInvoker {
    private readonly _awake: (() => void)|null = null;
    private _awakened = false;

    private readonly _start: (() => void)|null = null;
    private _started = false;

    private readonly _onDestroy: (() => void)|null = null;
    private readonly _onEnable: (() => void)|null = null;
    private readonly _onDisable: (() => void)|null = null;
    private readonly _onWorldMatrixUpdated: (() => void)|null = null;

    public constructor(component: Component) {
        if (isAwakeableComponent(component)) this._awake = component.awake;
        if (isStartableComponent(component)) this._start = component.start;
        if (isOnDestroyableComponent(component)) this._onDestroy = component.onDestroy;
        if (isOnEnableableComponent(component)) this._onEnable = component.onEnable;
        if (isOnDisableableComponent(component)) this._onDisable = component.onDisable;
        if (isOnWorldMatrixUpdatedableComponent(component)) this._onWorldMatrixUpdated = component.onWorldMatrixUpdated;
    }

    public tryCallAwake(): void {
        if (this._awakened) return;
        this._awake?.();
        this._awakened = true;
    }

    public tryCallStart(): void {
        if (this._started) return;
        this._start?.();
        this._started = true;
    }

    public get started(): boolean {
        return this._started;
    }

    public tryCallOnDestroy(): void {
        this._onDestroy?.();
    }

    public tryCallOnEnable(): void {
        this._onEnable?.();
    }

    public tryCallOnDisable(): void {
        this._onDisable?.();
    }

    public tryCallOnWorldMatrixUpdated(): void {
        this._onWorldMatrixUpdated?.();
    }
}
