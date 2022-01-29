import { Component } from "./Component";

enum EventPriority { // lower number means higher priority
    awake = 0, // called once
    start = 2, // called once
    update = 3, // called every frame
    onEnable = 1,
    onDisable = 1,
    onDestroy = 4 // called once
}

export class ComponentEvent {
    private readonly _component: Component;
    private readonly _priority: EventPriority;
    private readonly _eventId: number;
    private readonly _eventFunc: () => void;
    private readonly _canInvoke: () => boolean;

    private static _eventIdCounter: number = 0;

    private constructor(component: Component, eventFunc: () => void, priority: EventPriority, canInvoke: () => boolean) {
        this._component = component;
        this._priority = priority;
        this._eventId = ComponentEvent._eventIdCounter;
        ComponentEvent._eventIdCounter += 1;
        this._eventFunc = eventFunc;
        this._canInvoke = canInvoke;
    }

    public static createAwakeEvent(component: Component, eventFunc: () => void): ComponentEvent {
        return new ComponentEvent(component, eventFunc, EventPriority.awake, () => true);
    }

    public static createStartEvent(component: Component, eventFunc: () => void, canInvoke: () => boolean): ComponentEvent {
        return new ComponentEvent(component, eventFunc, EventPriority.start, canInvoke);
    }

    public static createUpdateEvent(component: Component, eventFunc: () => void, canInvoke: () => boolean): ComponentEvent {
        return new ComponentEvent(component, eventFunc, EventPriority.update, canInvoke);
    }

    public static createOnEnableEvent(component: Component, eventFunc: () => void, canInvoke: () => boolean): ComponentEvent {
        return new ComponentEvent(component, eventFunc, EventPriority.onEnable, canInvoke);
    }

    public static createOnDisableEvent(component: Component, eventFunc: () => void, canInvoke: () => boolean): ComponentEvent {
        return new ComponentEvent(component, eventFunc, EventPriority.onDisable, canInvoke);
    }

    public static createOnDestroyEvent(component: Component, eventFunc: () => void, canInvoke: () => boolean): ComponentEvent {
        return new ComponentEvent(component, eventFunc, EventPriority.onDestroy, canInvoke);
    }

    public tryInvoke(): void {
        if (this._canInvoke()) this._eventFunc();
    }

    public static lessOp(a: ComponentEvent, b: ComponentEvent): boolean {
        if (a._priority === b._priority) {
            return a._eventId < b._eventId;
        }
        return a._priority < b._priority;
    }
}
