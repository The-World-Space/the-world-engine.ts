import { EventContainer, IEventContainer } from "../../collection/EventContainer";

export class PhysicsMaterial2D {
    private readonly _onChangedEvent = new EventContainer<() => void>();

    private _friction: number;
    private _bounciness: number;

    public constructor(friction = 0.4, bounciness = 0) {
        this._friction = friction;
        this._bounciness = bounciness;
    }

    public get friction(): number {
        return this._friction;
    }

    public set friction(value: number) {
        this._friction = value;
        this._onChangedEvent.invoke();
    }

    public get bounciness(): number {
        return this._bounciness;
    }

    public set bounciness(value: number) {
        this._bounciness = value;
        this._onChangedEvent.invoke();
    }

    public get onChanged(): IEventContainer<() => void> {
        return this._onChangedEvent;
    }

    public copy(other: PhysicsMaterial2D): void {
        this.friction = other.friction;
        this.bounciness = other.bounciness;
        this._onChangedEvent.invoke();
    }

    public clone(): PhysicsMaterial2D {
        return new PhysicsMaterial2D(this.friction, this.bounciness);
    }
}
