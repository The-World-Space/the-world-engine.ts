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
    private readonly _eventFunc: () => void;

    private static _eventIdCounter: number = 0;

    private constructor(eventFunc: () => void, priority: EventPriority) {
        this._priority = priority;
        this._eventId = ComponentEvent._eventIdCounter;
        ComponentEvent._eventIdCounter += 1;
        this._eventFunc = eventFunc;
    }

    public static createAwakeEvent(eventFunc: () => void): ComponentEvent {
        return new ComponentEvent(eventFunc, EventPriority.awake);
    }

    public static createStartEvent(eventFunc: () => void): ComponentEvent {
        return new ComponentEvent(eventFunc, EventPriority.start);
    }

    public static createUpdateEvent(eventFunc: () => void): ComponentEvent {
        return new ComponentEvent(eventFunc, EventPriority.update);
    }

    public static createOnEnableEvent(eventFunc: () => void): ComponentEvent {
        return new ComponentEvent(eventFunc, EventPriority.onEnable);
    }

    public static createOnDisableEvent(eventFunc: () => void): ComponentEvent {
        return new ComponentEvent(eventFunc, EventPriority.onDisable);
    }

    public static createOnDestroyEvent(eventFunc: () => void): ComponentEvent {
        return new ComponentEvent(eventFunc, EventPriority.onDestroy);
    }

    public invoke(): void {
        this._eventFunc();
    }

    public static lessOp(a: ComponentEvent, b: ComponentEvent): boolean {
        if (a._priority === b._priority) {
            return a._eventId < b._eventId;
        }
        return a._priority < b._priority;
    }
}
