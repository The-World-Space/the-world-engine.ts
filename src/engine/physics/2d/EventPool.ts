import type { Collider2D } from "../../script/physics2d/collider/Collider2D";
import type { Collision2D } from "./Collision2D";
import type { Collision2DPool } from "./Collision2DPool";

/** @internal */
export const enum TriggerType {
    Enter,
    Stay,
    Exit
}

class TriggerEvent {
    public type: TriggerType = TriggerType.Enter;
    public colliderA: Collider2D|null = null;
    public colliderB: Collider2D|null = null;

    public invoke(): void {
        switch (this.type) {
        case TriggerType.Enter:
            this.colliderA!.gameObject.gameObjectEventContainer.invokeOnTriggerEnter2D(this.colliderB!);
            this.colliderB!.gameObject.gameObjectEventContainer.invokeOnTriggerEnter2D(this.colliderA!);
            break;

        case TriggerType.Stay:
            this.colliderA!.gameObject.gameObjectEventContainer.invokeOnTriggerStay2D(this.colliderB!);
            this.colliderB!.gameObject.gameObjectEventContainer.invokeOnTriggerStay2D(this.colliderA!);
            break;

        case TriggerType.Exit:
            this.colliderA!.gameObject.gameObjectEventContainer.invokeOnTriggerExit2D(this.colliderB!);
            this.colliderB!.gameObject.gameObjectEventContainer.invokeOnTriggerExit2D(this.colliderA!);
            break;
        }
    }
}

/** @internal */
export class TriggerEventPool {
    private readonly _triggerEvent: TriggerEvent[] = [];
    private _size = 0;

    public insert(type: TriggerType, colliderA: Collider2D, colliderB: Collider2D): void {
        if (this._triggerEvent.length <= this._size) {
            this._triggerEvent.push(new TriggerEvent());
        }

        const triggerEvent = this._triggerEvent[this._size];
        triggerEvent.type = type;
        triggerEvent.colliderA = colliderA;
        triggerEvent.colliderB = colliderB;
        this._size += 1;
    }

    public invoke(): void {
        for (let i = 0; i < this._size; i += 1) {
            this._triggerEvent[i].invoke();
        }

        this._size = 0;
    }
}

/** @internal */
export const enum CollisionType {
    Enter,
    Stay,
    Exit
}

class CollisionEvent {
    public type: CollisionType = CollisionType.Enter;
    public colliderA: Collider2D|null = null;
    public colliderB: Collider2D|null = null;
    public collision2D: Collision2D|null = null;
    public collisionPool: Collision2DPool|null = null;

    public invoke(): void {
        switch (this.type) {
        case CollisionType.Enter:
            this.colliderA!.gameObject.gameObjectEventContainer.invokeOnCollisionEnter2D(this.collision2D!);
            this.colliderB!.gameObject.gameObjectEventContainer.invokeOnCollisionEnter2D(this.collision2D!);
            break;

        case CollisionType.Stay:
            this.colliderA!.gameObject.gameObjectEventContainer.invokeOnCollisionStay2D(this.collision2D!);
            this.colliderB!.gameObject.gameObjectEventContainer.invokeOnCollisionStay2D(this.collision2D!);
            break;

        case CollisionType.Exit:
            this.colliderA!.gameObject.gameObjectEventContainer.invokeOnCollisionExit2D(this.collision2D!);
            this.colliderB!.gameObject.gameObjectEventContainer.invokeOnCollisionExit2D(this.collision2D!);
            break;
        }

        this.collisionPool?.release(this.collision2D!);
    }
}

/** @internal */
export class CollisionEventPool {
    private readonly _collisionEvent: CollisionEvent[] = [];
    private _size = 0;

    public insert(
        type: CollisionType,
        colliderA: Collider2D,
        colliderB: Collider2D,
        collision2D: Collision2D,
        collision2DPool?: Collision2DPool
    ): void {
        if (this._collisionEvent.length <= this._size) {
            this._collisionEvent.push(new CollisionEvent());
        }

        const collisionEvent = this._collisionEvent[this._size];
        collisionEvent.type = type;
        collisionEvent.colliderA = colliderA;
        collisionEvent.colliderB = colliderB;
        collisionEvent.collision2D = collision2D;
        collisionEvent.collisionPool = collision2DPool ?? null;
        this._size += 1;
    }

    public invoke(): void {
        for (let i = 0; i < this._size; i += 1) {
            this._collisionEvent[i].invoke();
        }

        this._size = 0;
    }
}
