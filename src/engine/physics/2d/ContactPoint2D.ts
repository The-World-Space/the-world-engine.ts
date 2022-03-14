import { Vector2 } from "three";
import * as b2 from "../../../box2d.ts/build/index";
import { ReadonlyVector2 } from "../../math/ReadonlyVector2";
import { Collider2D } from "../../script/physics2d/collider/Collider2D";
import { RigidBody2D } from "../../script/physics2d/RigidBody2D";
import { IPhysicsObject2D } from "./PhysicsObject2D";

export class ContactPoint2D {
    private _contact: b2.Contact|null = null;

    private _collider: Collider2D|null = null;
    private _rigidbody: RigidBody2D|null = null;

    private _otherCollider: Collider2D|null = null;
    private _otherRigidbody: RigidBody2D|null = null;

    private _relativeVelocity: Vector2 = new Vector2();
    private _point: Vector2 = new Vector2();
    private _normal: Vector2 = new Vector2();
    private _normalImpulse = 0;
    private _tangentImpulse = 0;
    private _separation = 0;

    /** @internal */
    public setData(
        contact: b2.Contact,
        manifoldPoint: b2.ManifoldPoint,
        worldNormal: b2.Vec2,
        worldPoint: b2.Vec2,
        separation: number
    ): void {
        this._contact = contact;
        const fixtureA = contact.GetFixtureA();
        const fixtureB = contact.GetFixtureB();
        this._collider = fixtureA.GetUserData() as Collider2D;
        this._rigidbody = (fixtureA.GetBody().GetUserData() as IPhysicsObject2D).rigidbody;
        this._otherCollider = fixtureB.GetUserData() as Collider2D;
        this._otherRigidbody = (fixtureB.GetBody().GetUserData() as IPhysicsObject2D).rigidbody;

        this._relativeVelocity.set(NaN, NaN);
        
        this._point.set(worldPoint.x, worldPoint.y);
        this._normal.set(worldNormal.x, worldNormal.y);
        this._normalImpulse = manifoldPoint.normalImpulse;
        this._tangentImpulse = manifoldPoint.tangentImpulse;
        this._separation = separation;
    }

    public get enabled(): boolean {
        return this._contact?.IsEnabled() ?? false;
    }

    public get collider(): Collider2D {
        return this._collider!;
    }

    public get rigidbody(): RigidBody2D|null {
        return this._rigidbody;
    }

    public get otherCollider(): Collider2D {
        return this._otherCollider!;
    }

    public get otherRigidbody(): RigidBody2D|null {
        return this._otherRigidbody;
    }
    
    private static tempVec = new b2.Vec2();

    public get relativeVelocity(): ReadonlyVector2 {
        if (this._contact) {
            if (isNaN(this._relativeVelocity.x)) {
                const bodyA = this._contact.GetFixtureA().GetBody();
                const bodyB = this._contact.GetFixtureB().GetBody();
                const aVelocity = ContactPoint2D.tempVec.Copy(bodyA.GetLinearVelocity());
                const relativeVelocity = aVelocity.SelfSub(bodyB.GetLinearVelocity());
                this._relativeVelocity.set(relativeVelocity.x, relativeVelocity.y);
            }
        }
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
