import { Collision2D } from "./Collision2D";

/** @internal */
export class Collision2DPool {
    private readonly _pool: Collision2D[] = [];

    public getInstance(): Collision2D {
        if (this._pool.length > 0) {
            return this._pool.pop()!;
        }

        return new Collision2D();
    }

    public release(collision: Collision2D): void {
        this._pool.push(collision);
    }
}
