import { Instantiater } from "../Instantiater";

const enum EventPriority { // lower number means higher priority
    awake = 0, // called once
    start = 2, // called once
    update = 3, // called every frame
    onEnable = 1,
    onDisable = 1,
    onDestroy = 4, // called once
}

/** @internal */
export class ComponentEvent {
    public isRemoved = false;
    private readonly _priority: EventPriority;
    private readonly _eventId: number;
    private readonly _componentExecutionOrder: number;
    private readonly _eventFunc: () => void;

    private constructor(
        instantiater: Instantiater,
        eventFunc: () => void,
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

    public invoke(): void {
        this._eventFunc();
    }

    public static comparator(a: ComponentEvent, b: ComponentEvent): number {
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
