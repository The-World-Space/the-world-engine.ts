import { SceneProcessor } from "../SceneProcessor";
import { Component } from "./Component";
import { ComponentEvent } from "./ComponentEvent";
import { ComponentEventState } from "./ComponentEventState";

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
 * onDestroy occurs when a component is destroyed
 */
type OnDestroyableComponent = Component & { onDestroy(): void; };

function isOnDestroyableComponent(component: Component): component is OnDestroyableComponent {
    return (component as OnDestroyableComponent).onDestroy !== undefined;
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
 * update is called every frame, if the script is enabled.
 * https://docs.unity3d.com/ScriptReference/MonoBehaviour.Update.html
 */
type UpdatableComponent = Component & { update(): void; };

function isUpdatableComponent(component: Component): component is UpdatableComponent {
    return (component as UpdatableComponent).update !== undefined;
}

export class ComponentEventContainer {
    private readonly _sceneProcessor: SceneProcessor;
    private readonly _eventState: ComponentEventState;

    private readonly _awake: ComponentEvent|null = null;
    private readonly _onEnable: ComponentEvent|null = null;
    private readonly _onDisable: ComponentEvent|null = null;
    private readonly _onDestroy: ComponentEvent|null = null;

    private readonly _start: ComponentEvent|null = null;
    private readonly _update: ComponentEvent|null = null;

    public constructor(component: Component) {
        this._sceneProcessor = component.engine.sceneProcessor;
        this._eventState = new ComponentEventState();
        
        if (isAwakeableComponent(component)) {
            this._awake = ComponentEvent.createAwakeEvent(component.awake);
        }
        if (isOnEnableableComponent(component)) {
            this._onEnable = ComponentEvent.createOnEnableEvent(component.onEnable);
        }
        if (isOnDisableableComponent(component)) {
            this._onDisable = ComponentEvent.createOnDisableEvent(component.onDisable);
        }
        

        if (isStartableComponent(component)) {
            this._start = ComponentEvent.createStartEvent(() => { //lambda for run once
                component.start();
                this._eventState.startCalled = true;
                this._sceneProcessor.removeEventFromNonSyncedCollection(this._start!);
            });
        }
        if (isUpdatableComponent(component)) {
            this._update = ComponentEvent.createUpdateEvent(component.update);
        }
    }

    public tryCallAwake(): void {
        if (this._eventState.awakeCalled) return;
        this._awake?.invoke();
        this._eventState.awakeCalled = true;
    }

    public tryCallStart(): void {
        if (!this._start) return; //if start is not defined, do nothing
        if (this._eventState.startRegistered) return;
        this._eventState.startRegistered = true;
        this._sceneProcessor.addEventToNonSyncedCollection(this._start);
    }

    public tryCancelStart(): void {
        if (!this._start) return; //if start is not defined, do nothing
        if (!this._eventState.startRegistered) return;
        this._eventState.startRegistered = false;
        this._sceneProcessor.removeEventFromNonSyncedCollection(this._start);
    }

    public tryRegisterUpdate(): void {
        if (!this._update) return; //if update is not defined, do nothing
        if (this._eventState.updateRegistered) return;
        this._eventState.updateRegistered = true;
        this._sceneProcessor.addEventToNonSyncedCollection(this._update);
    }

    public tryUnregisterUpdate(): void {
        if (!this._update) return; //if update is not defined, do nothing
        if (!this._eventState.updateRegistered) return;
        this._eventState.updateRegistered = false;
        this._sceneProcessor.removeEventFromNonSyncedCollection(this._update);
    }
}
