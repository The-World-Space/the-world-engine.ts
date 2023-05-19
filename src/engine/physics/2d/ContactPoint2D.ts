import { Vector2 } from "three/src/Three";

import type { Contact, ManifoldPoint } from "../../../box2d.ts/build/index";
import { Vec2 } from "../../../box2d.ts/build/index";
import type { ReadonlyVector2 } from "../../math/ReadonlyVector2";
import type { WritableVector2 } from "../../math/WritableVector2";
import type { Collider2D } from "../../script/physics2d/collider/Collider2D";
import type { RigidBody2D } from "../../script/physics2d/RigidBody2D";
import type { IPhysicsObject2D } from "./PhysicsObject2D";

export class ContactPoint2D {
    private _contact: Contact | null = null;

    private _collider: Collider2D | null = null;
    private _rigidbody: RigidBody2D | null = null;

    private _otherCollider: Collider2D | null = null;
    private _otherRigidbody: RigidBody2D | null = null;

    private readonly _relativeVelocity: Vector2 = new Vector2();
    private readonly _point: Vector2 = new Vector2();
    private readonly _normal: Vector2 = new Vector2();
    private _normalImpulse = 0;
    private _tangentImpulse = 0;
    private _separation = 0;

    /** @internal */
    public setData(
        contact: Contact,
        manifoldPoint: ManifoldPoint,
        worldNormal: Vec2,
        worldPoint: Vec2,
        separation: number,
        relativeVelocity?: ReadonlyVector2
    ): void {
        this._contact = contact;
        const fixtureA = contact.GetFixtureA();
        const fixtureB = contact.GetFixtureB();
        this._collider = fixtureA.GetUserData() as Collider2D;
        this._rigidbody = (fixtureA.GetBody().GetUserData() as IPhysicsObject2D).rigidbody;
        this._otherCollider = fixtureB.GetUserData() as Collider2D;
        this._otherRigidbody = (fixtureB.GetBody().GetUserData() as IPhysicsObject2D).rigidbody;

        if (relativeVelocity) {
            (this._relativeVelocity as WritableVector2).copy(relativeVelocity);
        } else {
            const aVelocity = ContactPoint2D._tempVec.Copy(fixtureA.GetBody().GetLinearVelocity());
            const relativeVelocity = aVelocity.SelfSub(fixtureB.GetBody().GetLinearVelocity());
            this._relativeVelocity.set(relativeVelocity.x, relativeVelocity.y);
        }

        this._point.set(worldPoint.x, worldPoint.y);
        this._normal.set(worldNormal.x, worldNormal.y);
        this._normalImpulse = manifoldPoint.normalImpulse;
        this._tangentImpulse = manifoldPoint.tangentImpulse;
        this._separation = separation;
    }

    private static readonly _tempVec = new Vec2();

    public get enabled(): boolean {
        return this._contact?.IsEnabled() ?? false;
    }

    public get collider(): Collider2D | null {
        return this._collider;
    }

    public get rigidbody(): RigidBody2D | null {
        return this._rigidbody;
    }

    public get otherCollider(): Collider2D | null {
        return this._otherCollider;
    }

    public get otherRigidbody(): RigidBody2D | null {
        return this._otherRigidbody;
    }

    public get relativeVelocity(): ReadonlyVector2 {
        return this._relativeVelocity;
    }

    public get point(): ReadonlyVector2 {
        return this._point;
    }

    public get normal(): ReadonlyVector2 {
        return this._normal;
    }

    public get normalImpulse(): number {
        return this._normalImpulse;
    }

    public get tangentImpulse(): number {
        return this._tangentImpulse;
    }

    public get separation(): number {
        return this._separation;
    }
}
