import { SceneProcessor } from "../SceneProcessor";
import { Component } from "./Component";
import { ComponentEvent } from "./ComponentEvent";
import { ComponentEventState } from "./ComponentEventState";
import { Instantiater } from "../Instantiater";
import { Collision2D } from "../physics/2d/Collision2D";
import { Collider2D } from "../script/physics2d/collider/Collider2D";

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
 * called when an incoming collider makes contact with this object's collider (2D physics only)
 */
type OnCollisionEnter2DableComponent = Component & { onCollisionEnter2D(collision: Collision2D): void; };

/** @internal */
function isOnCollisionEnter2DableComponent(component: Component): component is OnCollisionEnter2DableComponent {
    return (component as OnCollisionEnter2DableComponent).onCollisionEnter2D !== undefined;
}
 
/**
 * called every frame where an incoming collider stays in contact with this object's collider (2D physics only)
 */
type OnCollisionStay2DableComponent = Component & { onCollisionStay2D(collision: Collision2D): void; };

/** @internal */
function isOnCollisionStay2DableComponent(component: Component): component is OnCollisionStay2DableComponent {
    return (component as OnCollisionStay2DableComponent).onCollisionStay2D !== undefined;
}
 
/**
 * called when a collider on another object stops touching this object's collider (2D physics only)
 */
type OnCollisionExit2DableComponent = Component & { onCollisionExit2D(collision: Collision2D): void; };

/** @internal */
function isOnCollisionExit2DableComponent(component: Component): component is OnCollisionExit2DableComponent {
    return (component as OnCollisionExit2DableComponent).onCollisionExit2D !== undefined;
}
 
/**
 * called when another object enters a trigger collider attached to this object (2D physics only)
 */
type OnTriggerEnter2DableComponent = Component & { onTriggerEnter2D(collider: Collision2D): void; };

/** @internal */
function isOnTriggerEnter2DableComponent(component: Component): component is OnTriggerEnter2DableComponent {
    return (component as OnTriggerEnter2DableComponent).onTriggerEnter2D !== undefined;
}
 
/**
 * called every frame where another object stays in a trigger collider attached to this object (2D physics only)
 */
type OnTriggerStay2DableComponent = Component & { onTriggerStay2D(collider: Collision2D): void; };

/** @internal */
function isOnTriggerStay2DableComponent(component: Component): component is OnTriggerStay2DableComponent {
    return (component as OnTriggerStay2DableComponent).onTriggerStay2D !== undefined;
}
 
/**
 * called when another object leaves a trigger collider attached to this object (2D physics only)
 */
type OnTriggerExit2DableComponent = Component & { onTriggerExit2D(collider: Collision2D): void; };

/** @internal */
function isOnTriggerExit2DableComponent(component: Component): component is OnTriggerExit2DableComponent {
    return (component as OnTriggerExit2DableComponent).onTriggerExit2D !== undefined;
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

/** @internal */
export class ComponentEventContainer {
    private readonly _component: Component;
    private readonly _sceneProcessor: SceneProcessor;
    private readonly _instantiater: Instantiater;
    private readonly _eventState: ComponentEventState;

    private readonly _awake: ComponentEvent|null = null;
    private readonly _onDestroy: ComponentEvent|null = null;

    private readonly _onCollisionEnter2D: ComponentEvent<(collision: Collision2D) => void>|null = null;
    private readonly _onCollisionStay2D: ComponentEvent<(collision: Collision2D) => void>|null = null;
    private readonly _onCollisionExit2D: ComponentEvent<(collision: Collision2D) => void>|null = null;
    private readonly _onTriggerEnter2D: ComponentEvent<(other: Collider2D) => void>|null = null;
    private readonly _onTriggerStay2D: ComponentEvent<(other: Collider2D) => void>|null = null;
    private readonly _onTriggerExit2D: ComponentEvent<(other: Collider2D) => void>|null = null;

    private readonly _start: ComponentEvent|null = null;
    private readonly _update: ComponentEvent|null = null;

    public constructor(component: Component) {
        this._component = component;
        this._sceneProcessor = component.engine.sceneProcessor; 
        this._instantiater = component.engine.instantiater;
        this._eventState = new ComponentEventState();
        
        if (isAwakeableComponent(component)) {
            this._awake = ComponentEvent.createAwakeEvent(
                this._instantiater,
                component.awake.bind(component)
            );
        }

        if (isOnDestroyableComponent(component)) {
            this._onDestroy = ComponentEvent.createOnDestroyEvent(
                this._instantiater,
                component.onDestroy.bind(component),
                component.executionOrder
            );
        }

        { // 2D physics events
            if (isOnCollisionEnter2DableComponent(component)) {
                this._onCollisionEnter2D = ComponentEvent.createOnCollisionEnter2DEvent(
                    this._instantiater,
                    collision => component.onCollisionEnter2D(collision),
                    component.executionOrder
                );      
            }

            if (isOnCollisionStay2DableComponent(component)) {
                this._onCollisionStay2D = ComponentEvent.createOnCollisionStay2DEvent(
                    this._instantiater,
                    collision => component.onCollisionStay2D(collision),
                    component.executionOrder
                );
            }

            if (isOnCollisionExit2DableComponent(component)) {
                this._onCollisionExit2D = ComponentEvent.createOnCollisionExit2DEvent(
                    this._instantiater,
                    collision => component.onCollisionExit2D(collision),
                    component.executionOrder
                );
            }

            if (isOnTriggerEnter2DableComponent(component)) {
                this._onTriggerEnter2D = ComponentEvent.createOnTriggerEnter2DEvent(
                    this._instantiater,
                    other => component.onTriggerEnter2D(other),
                    component.executionOrder
                );
            }

            if (isOnTriggerStay2DableComponent(component)) {
                this._onTriggerStay2D = ComponentEvent.createOnTriggerStay2DEvent(
                    this._instantiater,
                    other => component.onTriggerStay2D(other),
                    component.executionOrder
                );
            }

            if (isOnTriggerExit2DableComponent(component)) {
                this._onTriggerExit2D = ComponentEvent.createOnTriggerExit2DEvent(
                    this._instantiater,
                    other => component.onTriggerExit2D(other),
                    component.executionOrder
                );
            }
        }

        if (isStartableComponent(component)) {
            this._start = ComponentEvent.createStartEvent(
                this._instantiater,
                () => { //lambda for run once
                    this._eventState.startCalled = true;
                    component.start();
                    if (this._eventState.startRegistered) {
                        this._sceneProcessor.removeEventFromNonSyncedCollection(this._start!);
                    }
                },
                component.executionOrder
            );
        }

        if (isUpdatableComponent(component)) {
            this._update = ComponentEvent.createUpdateEvent(
                this._instantiater,
                component.update.bind(component), component.executionOrder
            );
        }
    }

    public tryCallAwake(): void {
        if (this._eventState.awakeCalled) return;
        this._eventState.awakeCalled = true;
        this._awake?.invoke();
    }

    public tryRegisterOnEnable(): void {
        if (!isOnEnableableComponent(this._component)) return;
        if (this._component._engine_internal_destroyed) return;
        if (this._eventState.enabled) return;
        this._eventState.enabled = true;
        const onEnableEvent = ComponentEvent.createOnEnableEvent(
            this._instantiater,
            this._component.onEnable.bind(this._component),
            this._component.executionOrder
        );
        this._sceneProcessor.addEventToSyncedCollection(onEnableEvent);
    }

    public tryRegisterOnDisable(): void {
        if (!isOnDisableableComponent(this._component)) return;
        if (this._component._engine_internal_destroyed) return;
        if (!this._eventState.enabled) return;
        this._eventState.enabled = false;
        const onDisableEvent = ComponentEvent.createOnDisableEvent(
            this._instantiater,
            this._component.onDisable.bind(this._component),
            this._component.executionOrder
        );
        this._sceneProcessor.addEventToSyncedCollection(onDisableEvent);
    }

    public tryRegisterOnDestroy(): void {
        if (!this._onDestroy) return; //if onDestroy is not defined, do nothing
        this._sceneProcessor.addEventToSyncedCollection(this._onDestroy);
    }


    public tryRegisterStart(): void {
        if (!this._start) return; //if start is not defined, do nothing
        if (this._component._engine_internal_destroyed) return;
        if (this._eventState.startCalled) return;
        if (this._eventState.startRegistered) return;
        this._eventState.startRegistered = true;
        this._sceneProcessor.addEventToNonSyncedCollection(this._start);
    }

    public tryUnregisterStart(): void {
        if (!this._start) return; //if start is not defined, do nothing
        if (!this._eventState.startRegistered || this._eventState.startCalled) return;
        this._eventState.startRegistered = false;
        this._sceneProcessor.removeEventFromNonSyncedCollection(this._start);
    }

    public tryRegisterUpdate(): void {
        if (!this._update) return; //if update is not defined, do nothing
        if (this._component._engine_internal_destroyed) return;
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

    public get onCollisionEnter2D(): ComponentEvent<(collision: Collision2D) => void>|null {
        return this._onCollisionEnter2D;
    }

    public get onCollisionStay2D(): ComponentEvent<(collision: Collision2D) => void>|null {
        return this._onCollisionStay2D;
    }

    public get onCollisionExit2D(): ComponentEvent<(collision: Collision2D) => void>|null {
        return this._onCollisionExit2D;
    }

    public get onTriggerEnter2D(): ComponentEvent<(other: Collider2D) => void>|null {
        return this._onTriggerEnter2D;
    }

    public get onTriggerStay2D(): ComponentEvent<(other: Collider2D) => void>|null {
        return this._onTriggerStay2D;
    }

    public get onTriggerExit2D(): ComponentEvent<(other: Collider2D) => void>|null {
        return this._onTriggerExit2D;
    }
}
