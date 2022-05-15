import { MutIteratableCollection } from "../collection/MutIteratableCollection";
import { Collision2D } from "../physics/2d/Collision2D";
import { Collider2D } from "../script/physics2d/collider/Collider2D";
import { Component } from "./Component";
import { ComponentEvent } from "./ComponentEvent";

/**
 * called when world matrix is changed
 * @internal
 */
type OnWorldMatrixUpdatedableComponent = Component & { onWorldMatrixUpdated(): void; };

/** @intenral */
function isOnWorldMatrixUpdatedableComponent(component: Component): component is OnWorldMatrixUpdatedableComponent {
    return (component as OnWorldMatrixUpdatedableComponent).onWorldMatrixUpdated !== undefined;
}

export class GameObjectEventContainer {
    private readonly _matrixUpdateComponents: Set<OnWorldMatrixUpdatedableComponent> = new Set();

    private readonly _collisionEnter2DComponentEvents: MutIteratableCollection<ComponentEvent<(collision: Collision2D) => void>> = new MutIteratableCollection(ComponentEvent.comparator);
    private readonly _collisionStay2DComponentEvents: MutIteratableCollection<ComponentEvent<(collision: Collision2D) => void>> = new MutIteratableCollection(ComponentEvent.comparator);
    private readonly _collisionExit2DComponentEvents: MutIteratableCollection<ComponentEvent<(collision: Collision2D) => void>> = new MutIteratableCollection(ComponentEvent.comparator);
    private readonly _triggerEnter2DComponentEvents: MutIteratableCollection<ComponentEvent<(other: Collider2D) => void>> = new MutIteratableCollection(ComponentEvent.comparator);
    private readonly _triggerStay2DComponentEvents: MutIteratableCollection<ComponentEvent<(other: Collider2D) => void>> = new MutIteratableCollection(ComponentEvent.comparator);
    private readonly _triggerExit2DComponentEvents: MutIteratableCollection<ComponentEvent<(other: Collider2D) => void>> = new MutIteratableCollection(ComponentEvent.comparator);

    public registerComponent(component: Component): void {
        if (isOnWorldMatrixUpdatedableComponent(component)) {
            this._matrixUpdateComponents.add(component);
        }

        const componentEventContainer = component._engine_internal_componentEventContainer;

        if (componentEventContainer.onCollisionEnter2D) {
            this._collisionEnter2DComponentEvents.insert(componentEventContainer.onCollisionEnter2D);
        }

        if (componentEventContainer.onCollisionStay2D) {
            this._collisionStay2DComponentEvents.insert(componentEventContainer.onCollisionStay2D);
        }

        if (componentEventContainer.onCollisionExit2D) {
            this._collisionExit2DComponentEvents.insert(componentEventContainer.onCollisionExit2D);
        }

        if (componentEventContainer.onTriggerEnter2D) {
            this._triggerEnter2DComponentEvents.insert(componentEventContainer.onTriggerEnter2D);
        }

        if (componentEventContainer.onTriggerStay2D) {
            this._triggerStay2DComponentEvents.insert(componentEventContainer.onTriggerStay2D);
        }

        if (componentEventContainer.onTriggerExit2D) {
            this._triggerExit2DComponentEvents.insert(componentEventContainer.onTriggerExit2D);
        }
    }

    public unregisterComponent(component: Component): void {
        if (isOnWorldMatrixUpdatedableComponent(component)) {
            this._matrixUpdateComponents.delete(component);
        }

        const componentEventContainer = component._engine_internal_componentEventContainer;

        if (componentEventContainer.onCollisionEnter2D) {
            this._collisionEnter2DComponentEvents.delete(componentEventContainer.onCollisionEnter2D);
        }

        if (componentEventContainer.onCollisionStay2D) {
            this._collisionStay2DComponentEvents.delete(componentEventContainer.onCollisionStay2D);
        }

        if (componentEventContainer.onCollisionExit2D) {
            this._collisionExit2DComponentEvents.delete(componentEventContainer.onCollisionExit2D);
        }

        if (componentEventContainer.onTriggerEnter2D) {
            this._triggerEnter2DComponentEvents.delete(componentEventContainer.onTriggerEnter2D);
        }

        if (componentEventContainer.onTriggerStay2D) {
            this._triggerStay2DComponentEvents.delete(componentEventContainer.onTriggerStay2D);
        }

        if (componentEventContainer.onTriggerExit2D) {
            this._triggerExit2DComponentEvents.delete(componentEventContainer.onTriggerExit2D);
        }
    }

    public invokeOnWorldMatrixUpdated(): void {
        for (const component of this._matrixUpdateComponents) {
            component.onWorldMatrixUpdated();
        }
    }

    public invokeOnCollisionEnter2D(collision: Collision2D): void {
        if (this._collisionEnter2DComponentEvents.size === 0) return;
        this._collisionEnter2DComponentEvents.forEach(componentEvent => componentEvent.invoke(collision));
    }

    public invokeOnCollisionStay2D(collision: Collision2D): void {
        if (this._collisionStay2DComponentEvents.size === 0) return;
        this._collisionStay2DComponentEvents.forEach(componentEvent => componentEvent.invoke(collision));
    }

    public invokeOnCollisionExit2D(collision: Collision2D): void {
        if (this._collisionExit2DComponentEvents.size === 0) return;
        this._collisionExit2DComponentEvents.forEach(componentEvent => componentEvent.invoke(collision));
    }

    public invokeOnTriggerEnter2D(other: Collider2D): void {
        if (this._triggerEnter2DComponentEvents.size === 0) return;
        this._triggerEnter2DComponentEvents.forEach(componentEvent => componentEvent.invoke(other));
    }

    public invokeOnTriggerStay2D(other: Collider2D): void {
        if (this._triggerStay2DComponentEvents.size === 0) return;
        this._triggerStay2DComponentEvents.forEach(componentEvent => componentEvent.invoke(other));
    }

    public invokeOnTriggerExit2D(other: Collider2D): void {
        if (this._triggerExit2DComponentEvents.size === 0) return;
        this._triggerExit2DComponentEvents.forEach(componentEvent => componentEvent.invoke(other));
    }
}
