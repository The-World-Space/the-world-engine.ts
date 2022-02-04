enum EventPriority { // lower number means higher priority
    awake = 0, // called once
    start = 2, // called once
    update = 3, // called every frame
    onEnable = 1,
    onDisable = 1,
    onDestroy = 4, // called once
}

export class ComponentEvent {
    private readonly _priority: EventPriority;
    private readonly _eventId: number;
    private readonly _componentExecutionOrder: number;
    private readonly _eventFunc: () => void;

    private static _eventIdCounter = 0;

    private constructor(eventFunc: () => void, priority: EventPriority, componentExecutionOrder: number) {
        this._priority = priority;
        this._eventId = ComponentEvent._eventIdCounter;
        ComponentEvent._eventIdCounter += 1;
        this._componentExecutionOrder = componentExecutionOrder;
        this._eventFunc = eventFunc;
    }

    public static createAwakeEvent(eventFunc: () => void): ComponentEvent {
        return new ComponentEvent(eventFunc, EventPriority.awake, 0);
    }

    public static createStartEvent(eventFunc: () => void, componentExecutionOrder: number): ComponentEvent {
        return new ComponentEvent(eventFunc, EventPriority.start, componentExecutionOrder);
    }

    public static createUpdateEvent(eventFunc: () => void, componentExecutionOrder: number): ComponentEvent {
        return new ComponentEvent(eventFunc, EventPriority.update, componentExecutionOrder);
    }

    public static createOnEnableEvent(eventFunc: () => void, componentExecutionOrder: number): ComponentEvent {
        return new ComponentEvent(eventFunc, EventPriority.onEnable, componentExecutionOrder);
    }

    public static createOnDisableEvent(eventFunc: () => void, componentExecutionOrder: number): ComponentEvent {
        return new ComponentEvent(eventFunc, EventPriority.onDisable, componentExecutionOrder);
    }

    public static createOnDestroyEvent(eventFunc: () => void, componentExecutionOrder: number): ComponentEvent {
        return new ComponentEvent(eventFunc, EventPriority.onDestroy, componentExecutionOrder);
    }

    public invoke(): void {
        this._eventFunc();
    }

    public static lessOp(a: ComponentEvent, b: ComponentEvent): boolean {
        if (a._priority === b._priority) {
            if (a._componentExecutionOrder === b._componentExecutionOrder) {
                return a._eventId < b._eventId;
            } else {
                return a._componentExecutionOrder < b._componentExecutionOrder;
            }
        }
        return a._priority < b._priority;
    }
}
