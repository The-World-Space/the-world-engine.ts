import { MutIteratableCollection } from "./collection/MutIteratableCollection";
import { ComponentEvent } from "./hierarchy_object/ComponentEvent";

/** @internal */
export class SceneProcessor {
    private _nonSyncedEvents : MutIteratableCollection<ComponentEvent>;
    private _syncedEvents : MutIteratableCollection<ComponentEvent>;
    private _processingSyncedEvent: boolean;
    
    public constructor() {
        this._nonSyncedEvents = new MutIteratableCollection(ComponentEvent.lessOp);
        this._syncedEvents = new MutIteratableCollection(ComponentEvent.lessOp);
        this._processingSyncedEvent = false;
    }

    public addEventToNonSyncedCollection(event: ComponentEvent): void {
        this._nonSyncedEvents.insert(event);
    }

    public addEventToSyncedCollection(event: ComponentEvent): void {
        this._syncedEvents.insert(event);
    }

    public startProcessNonSyncedEvent(): void {
        this._nonSyncedEvents.forEach(event => event.tryInvoke());
    }

    // excuted when callstack does not have forEach
    public tryStartProcessSyncedEvent(): void {
        if (this._processingSyncedEvent) return;
        this._processingSyncedEvent = true;
        this._syncedEvents.forEach(event => event.tryInvoke());
        this._syncedEvents.clear();
        this._processingSyncedEvent = false;
    }
}
