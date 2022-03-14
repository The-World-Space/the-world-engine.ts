import { Vector2 } from "three";
import * as b2 from "../../../box2d.ts/build/index";
import { ReadonlyVector2 } from "../../math/ReadonlyVector2";
import { Collider2D } from "../../script/physics2d/collider/Collider2D";
import { RigidBody2D } from "../../script/physics2d/RigidBody2D";
import { IPhysicsObject2D } from "./PhysicsObject2D";

export class ContactPoint2D {
    private _contact: b2.Contact|null = null;

    public collider: Collider2D|null = null;
    public rigidbody: RigidBody2D|null = null;

    public otherCollider: Collider2D|null = null;
    public otherRigidbody: RigidBody2D|null = null;

    private _relativeVelocity: Vector2 = new Vector2();
    public point: Vector2 = new Vector2();
    public normal: Vector2 = new Vector2();
    public normalImpulse = 0;
    public tangentImpulse = 0;
    public separation = 0;

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
        this.collider = fixtureA.GetUserData() as Collider2D;
        this.rigidbody = (fixtureA.GetBody().GetUserData() as IPhysicsObject2D).rigidbody;
        this.otherCollider = fixtureB.GetUserData() as Collider2D;
        this.otherRigidbody = (fixtureB.GetBody().GetUserData() as IPhysicsObject2D).rigidbody;

        this._relativeVelocity.set(NaN, NaN);
        
        this.point.set(worldPoint.x, worldPoint.y);
        this.normal.set(worldNormal.x, worldNormal.y);
        this.normalImpulse = manifoldPoint.normalImpulse;
        this.tangentImpulse = manifoldPoint.tangentImpulse;
        this.separation = separation;
    }

    public get enabled(): boolean {
        return this._contact?.IsEnabled() ?? false;
    }

    public set enabled(value: boolean) {
        this._contact?.SetEnabled(value);
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
}
