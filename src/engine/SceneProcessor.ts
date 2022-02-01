import { MutIteratableCollection } from "./collection/MutIteratableCollection";
import { Component } from "./hierarchy_object/Component";
import { ComponentEvent } from "./hierarchy_object/ComponentEvent";
import { GameObject } from "./hierarchy_object/GameObject";

/** @internal */
export class SceneProcessor {
    private readonly _nonSyncedEvents : MutIteratableCollection<ComponentEvent>;
    private readonly _syncedEvents : MutIteratableCollection<ComponentEvent>;
    private _processingSyncedEvent: boolean;

    private readonly _removeObjects: (GameObject|Component)[];
    
    public constructor() {
        this._nonSyncedEvents = new MutIteratableCollection(ComponentEvent.lessOp);
        this._syncedEvents = new MutIteratableCollection(ComponentEvent.lessOp);
        this._processingSyncedEvent = false;

        this._removeObjects = [];
    }

    public addEventToNonSyncedCollection(event: ComponentEvent): void {
        this._nonSyncedEvents.insert(event);
    }

    public removeEventFromNonSyncedCollection(event: ComponentEvent): void {
        this._nonSyncedEvents.delete(event);
    }

    public addEventToSyncedCollection(event: ComponentEvent): void {
        this._syncedEvents.insert(event);
    }

    public startProcessNonSyncedEvent(): void {
        this._nonSyncedEvents.forEach(event => event.forceInvoke());
    }

    // excuted when callstack does not have forEach
    public tryStartProcessSyncedEvent(): void {
        if (this._processingSyncedEvent) return;
        this._processingSyncedEvent = true;
        this._syncedEvents.forEach(event => event.tryInvoke());
        this._syncedEvents.clear();
        this._processingSyncedEvent = false;
    }

    public addRemoveObject(object: GameObject|Component) {
        this._removeObjects.push(object);
    }

    public processRemoveObject() {
        const removeObjects = this._removeObjects;
        for (let i = 0; i < removeObjects.length; ++i) {
            removeObjects[i].
        }
    }
}
