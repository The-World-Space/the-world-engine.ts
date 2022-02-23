export class PhysicsMaterial2D {
    private _friction: number;
    private _bounciness: number;

    public constructor(friction: number = 0.4, bounciness: number = 0) {
        this._friction = friction;
        this._bounciness = bounciness;
    }

    public get friction(): number {
        return this._friction;
    }

    public set friction(value: number) {
        this._friction = value;
    }

    public get bounciness(): number {
        return this._bounciness;
    }

    public set bounciness(value: number) {
        this._bounciness = value;
    }
}
