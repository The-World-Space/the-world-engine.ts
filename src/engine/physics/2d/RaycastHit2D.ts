import { Vector2 } from "three/src/Three";

import type { Vec2 } from "../../../box2d.ts/build/index";
import type { Transform } from "../../hierarchy_object/Transform";
import type { ReadonlyVector2 } from "../../math/ReadonlyVector2";
import type { Collider2D } from "../../script/physics2d/collider/Collider2D";
import type { RigidBody2D } from "../../script/physics2d/RigidBody2D";

export class RaycastHit2D {
    private readonly _centroid: Vector2 = new Vector2();
    private _collider: Collider2D | null = null;
    private _distance = 0;
    private _fraction = 0;
    private readonly _normal: Vector2 = new Vector2();
    private readonly _point: Vector2 = new Vector2();
    private _rigidbody: RigidBody2D | null = null;
    private _transform: Transform | null = null;

    /** @internal */
    public setData(
        centroid: Vec2 | Vector2,
        collider: Collider2D,
        distance: number,
        fraction: number,
        normal: Vec2 | Vector2,
        point: Vec2 | Vector2,
        rigidbody: RigidBody2D | null,
        transform: Transform
    ): void {
        this._centroid.set(centroid.x, centroid.y);
        this._collider = collider;
        this._distance = distance;
        this._fraction = fraction;
        this._normal.set(normal.x, normal.y);
        this._point.set(point.x, point.y);
        this._rigidbody = rigidbody;
        this._transform = transform;
    }

    public get centroid(): ReadonlyVector2 {
        return this._centroid;
    }

    public get collider(): Collider2D | null {
        return this._collider;
    }

    public get distance(): number {
        return this._distance;
    }

    public get fraction(): number {
        return this._fraction;
    }

    public get normal(): ReadonlyVector2 {
        return this._normal;
    }

    public get point(): ReadonlyVector2 {
        return this._point;
    }

    public get rigidbody(): RigidBody2D | null {
        return this._rigidbody;
    }

    public get transform(): Transform | null {
        return this._transform;
    }
}
