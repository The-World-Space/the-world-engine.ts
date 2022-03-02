export class PhysicsMaterial2D {
    private _onChangedDelegates: (() => void)[] = [];

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
        this.notifyOnChangedEventListeners();
    }

    public get bounciness(): number {
        return this._bounciness;
    }

    public set bounciness(value: number) {
        this._bounciness = value;
        this.notifyOnChangedEventListeners();
    }

    private notifyOnChangedEventListeners(): void {
        for (let i = 0; i < this._onChangedDelegates.length; i++) {
            this._onChangedDelegates[i]();
        }
    }

    /** @internal */
    public addOnChangedEventListener(delegate: () => void): void {
        this._onChangedDelegates.push(delegate);
    }

    /** @internal */
    public removeOnChangedEventListener(delegate: () => void): void {
        const index = this._onChangedDelegates.indexOf(delegate);
        if (index >= 0) this._onChangedDelegates.splice(index, 1);
    }
}
