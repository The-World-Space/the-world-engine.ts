import { Instantiater } from "../Instantiater";
import { Collision2D } from "../physics/2d/Collision2D";
import { Collider2D } from "../script/physics2d/collider/Collider2D";

const enum EventPriority { // lower number means higher priority
    start = 2, // called once
    update = 3, // called every frame

    awake = 0, // called once
    onEnable = 1,
    onDisable = 1,
    onDestroy = 4, // called once

    onCollisionEnter2D = 1,
    onCollisionStay2D = 1,
    onCollisionExit2D = 1,
    onTriggerEnter2D = 1,
    onTriggerStay2D = 1,
    onTriggerExit2D = 1
}

/** @internal */
export class ComponentEvent<T extends (...params: any[]) => void = () => void> {
    public isRemoved = false;
    private readonly _priority: EventPriority;
    private readonly _eventId: number;
    private readonly _componentExecutionOrder: number;
    private readonly _eventFunc: T;

    private constructor(
        instantiater: Instantiater,
        eventFunc: T,
        priority: EventPriority,
        componentExecutionOrder: number
    ) {
        this._priority = priority;
        this._eventId = instantiater.generateEventId();
        this._componentExecutionOrder = componentExecutionOrder;
        this._eventFunc = eventFunc;
    }

    public static createAwakeEvent(
        instantiater: Instantiater,
        eventFunc: () => void
    ): ComponentEvent {
        return new ComponentEvent(instantiater, eventFunc, EventPriority.awake, 0);
    }

    public static createStartEvent(
        instantiater: Instantiater,
        eventFunc: () => void,
        componentExecutionOrder: number
    ): ComponentEvent {
        return new ComponentEvent(instantiater, eventFunc, EventPriority.start, componentExecutionOrder);
    }

    public static createUpdateEvent(
        instantiater: Instantiater,
        eventFunc: () => void,
        componentExecutionOrder: number
    ): ComponentEvent {
        return new ComponentEvent(instantiater, eventFunc, EventPriority.update, componentExecutionOrder);
    }

    public static createOnEnableEvent(
        instantiater: Instantiater,
        eventFunc: () => void,
        componentExecutionOrder: number
    ): ComponentEvent {
        return new ComponentEvent(instantiater, eventFunc, EventPriority.onEnable, componentExecutionOrder);
    }

    public static createOnDisableEvent(
        instantiater: Instantiater,
        eventFunc: () => void,
        componentExecutionOrder: number
    ): ComponentEvent {
        return new ComponentEvent(instantiater, eventFunc, EventPriority.onDisable, componentExecutionOrder);
    }

    public static createOnDestroyEvent(
        instantiater: Instantiater,
        eventFunc: () => void,
        componentExecutionOrder: number
    ): ComponentEvent {
        return new ComponentEvent(instantiater, eventFunc, EventPriority.onDestroy, componentExecutionOrder);
    }

    public static createOnCollisionEnter2DEvent(
        instantiater: Instantiater,
        eventFunc: (collision: Collision2D) => void,
        componentExecutionOrder: number
    ): ComponentEvent<(collision: Collision2D) => void> {
        return new ComponentEvent(instantiater, eventFunc, EventPriority.onCollisionEnter2D, componentExecutionOrder);
    }

    public static createOnCollisionStay2DEvent(
        instantiater: Instantiater,
        eventFunc: (collision: Collision2D) => void,
        componentExecutionOrder: number
    ): ComponentEvent<(collision: Collision2D) => void> {
        return new ComponentEvent(instantiater, eventFunc, EventPriority.onCollisionStay2D, componentExecutionOrder);
    }

    public static createOnCollisionExit2DEvent(
        instantiater: Instantiater,
        eventFunc: (collision: Collision2D) => void,
        componentExecutionOrder: number
    ): ComponentEvent<(collision: Collision2D) => void> {
        return new ComponentEvent(instantiater, eventFunc, EventPriority.onCollisionExit2D, componentExecutionOrder);
    }

    public static createOnTriggerEnter2DEvent(
        instantiater: Instantiater,
        eventFunc: (other: Collider2D) => void,
        componentExecutionOrder: number
    ): ComponentEvent<(other: Collider2D) => void> {
        return new ComponentEvent(instantiater, eventFunc, EventPriority.onTriggerEnter2D, componentExecutionOrder);
    }

    public static createOnTriggerStay2DEvent(
        instantiater: Instantiater,
        eventFunc: (other: Collider2D) => void,
        componentExecutionOrder: number
    ): ComponentEvent<(other: Collider2D) => void> {
        return new ComponentEvent(instantiater, eventFunc, EventPriority.onTriggerStay2D, componentExecutionOrder);
    }

    public static createOnTriggerExit2DEvent(
        instantiater: Instantiater,
        eventFunc: (other: Collider2D) => void,
        componentExecutionOrder: number
    ): ComponentEvent<(other: Collider2D) => void> {
        return new ComponentEvent(instantiater, eventFunc, EventPriority.onTriggerExit2D, componentExecutionOrder);
    }

    // public invoke(...params: any[]): void {
    //     this._eventFunc(...params);
    // }

    public get invoke(): T {
        return this._eventFunc;
    }

    public static comparator<T extends (...params: any[]) => void, U extends (...params: any[]) => void>(
        a: ComponentEvent<T>, b: ComponentEvent<U>
    ): number {
        if (a._priority === b._priority) {
            if (a._componentExecutionOrder === b._componentExecutionOrder) {
                return a._eventId - b._eventId;
            } else {
                return a._componentExecutionOrder - b._componentExecutionOrder;
            }
        }
        return a._priority - b._priority;
    }
}
