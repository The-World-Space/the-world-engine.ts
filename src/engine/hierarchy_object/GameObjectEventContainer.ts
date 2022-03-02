import { Component } from "./Component";
import { ComponentEvent } from "./ComponentEvent";
import { Collision2D } from "../physics/2d/Collision2D";
import { Instantiater } from "../Instantiater";
import { Collider2D } from "../script/physics2d/collider/Collider2D";

/**
 * called when world matrix is changed
 * @internal
 */
type OnWorldMatrixUpdatedableComponent = Component & { onWorldMatrixUpdated(): void; };

/** @intenral */
function isOnWorldMatrixUpdatedableComponent(component: Component): component is OnWorldMatrixUpdatedableComponent {
    return (component as OnWorldMatrixUpdatedableComponent).onWorldMatrixUpdated !== undefined;
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

export class GameObjectEventContainer {
    private readonly _instantiater: Instantiater;

    private readonly _matrixUpdateComponents: Set<OnWorldMatrixUpdatedableComponent> = new Set();

    private readonly _collisionEnter2DComponentEvents: Map<OnCollisionEnter2DableComponent, ComponentEvent<(collision: Collision2D) => void>> = new Map();
    private readonly _collisionStay2DComponentEvents: Map<OnCollisionStay2DableComponent, ComponentEvent<(collision: Collision2D) => void>> = new Map();
    private readonly _collisionExit2DComponentEvents: Map<OnCollisionExit2DableComponent, ComponentEvent<(collision: Collision2D) => void>> = new Map();
    private readonly _triggerEnter2DComponentEvents: Map<OnTriggerEnter2DableComponent, ComponentEvent<(other: Collider2D) => void>> = new Map();
    private readonly _triggerStay2DComponentEvents: Map<OnTriggerStay2DableComponent, ComponentEvent<(other: Collider2D) => void>> = new Map();
    private readonly _triggerExit2DComponentEvents: Map<OnTriggerExit2DableComponent, ComponentEvent<(other: Collider2D) => void>> = new Map();

    public constructor(instantiater: Instantiater) {
        this._instantiater = instantiater;
    }

    public registerComponent(component: Component): void {
        if (isOnWorldMatrixUpdatedableComponent(component)) {
            this._matrixUpdateComponents.add(component);
        }

        if (isOnCollisionEnter2DableComponent(component)) {
            this._collisionEnter2DComponentEvents.set(
                component,
                ComponentEvent.createOnCollisionEnter2DEvent(
                    this._instantiater,
                    component.onCollisionEnter2D.bind(component),
                    component.executionOrder
                )
            );      
        }

        if (isOnCollisionStay2DableComponent(component)) {
            this._collisionStay2DComponentEvents.set(
                component,
                ComponentEvent.createOnCollisionStay2DEvent(
                    this._instantiater,
                    component.onCollisionStay2D.bind(component),
                    component.executionOrder
                )
            );
        }

        if (isOnCollisionExit2DableComponent(component)) {
            this._collisionExit2DComponentEvents.set(
                component,
                ComponentEvent.createOnCollisionExit2DEvent(
                    this._instantiater,
                    component.onCollisionExit2D.bind(component),
                    component.executionOrder
                )
            );
        }

        if (isOnTriggerEnter2DableComponent(component)) {
            this._triggerEnter2DComponentEvents.set(
                component,
                ComponentEvent.createOnTriggerEnter2DEvent(
                    this._instantiater,
                    component.onTriggerEnter2D.bind(component),
                    component.executionOrder
                )
            );
        }

        if (isOnTriggerStay2DableComponent(component)) {
            this._triggerStay2DComponentEvents.set(
                component,
                ComponentEvent.createOnTriggerStay2DEvent(
                    this._instantiater,
                    component.onTriggerStay2D.bind(component),
                    component.executionOrder
                )
            );
        }

        if (isOnTriggerExit2DableComponent(component)) {
            this._triggerExit2DComponentEvents.set(
                component,
                ComponentEvent.createOnTriggerExit2DEvent(
                    this._instantiater,
                    component.onTriggerExit2D.bind(component),
                    component.executionOrder
                )
            );
        }
    }

    public unregisterComponent(component: Component): void {
        if (isOnWorldMatrixUpdatedableComponent(component)) {
            this._matrixUpdateComponents.delete(component);
        }

        if (isOnCollisionEnter2DableComponent(component)) {
            this._collisionEnter2DComponentEvents.delete(component);
        }

        if (isOnCollisionStay2DableComponent(component)) {
            this._collisionStay2DComponentEvents.delete(component);
        }

        if (isOnCollisionExit2DableComponent(component)) {
            this._collisionExit2DComponentEvents.delete(component);
        }

        if (isOnTriggerEnter2DableComponent(component)) {
            this._triggerEnter2DComponentEvents.delete(component);
        }

        if (isOnTriggerStay2DableComponent(component)) {
            this._triggerStay2DComponentEvents.delete(component);
        }

        if (isOnTriggerExit2DableComponent(component)) {
            this._triggerExit2DComponentEvents.delete(component);
        }
    }

    public invokeOnWorldMatrixUpdated(): void {
        for (const component of this._matrixUpdateComponents) {
            component.onWorldMatrixUpdated();
        }
    }
}
