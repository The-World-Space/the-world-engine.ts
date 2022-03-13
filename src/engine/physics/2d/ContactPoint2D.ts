import { Vector2 } from "three";
import * as b2 from "../../../box2d.ts/build/index";
import { Collider2D } from "../../script/physics2d/collider/Collider2D";
import { RigidBody2D } from "../../script/physics2d/RigidBody2D";
import { IPhysicsObject2D } from "./PhysicsObject2D";

export class ContactPoint2D {
    private _contact: b2.Contact|null = null;

    public collider: Collider2D|null = null;
    public rigidbody: RigidBody2D|null = null;

    public otherCollider: Collider2D|null = null;
    public otherRigidbody: RigidBody2D|null = null;

    public relativeVelocity: Vector2 = new Vector2();
    public point: Vector2 = new Vector2();
    public normal: Vector2 = new Vector2();
    public normalImpulse = 0;
    public tangentImpulse = 0;
    public separation = 0;

    /** @internal */
    public setData(body: b2.Body, contact: b2.Contact, manifoldPoint: b2.ManifoldPoint): void {
        this._contact = contact;
        const fixtureA = contact.GetFixtureA();
        const fixtureB = contact.GetFixtureB();
        if (fixtureA.GetBody() === body) {
            this.collider = fixtureA.GetUserData() as Collider2D;
            this.rigidbody = (fixtureA.GetBody().GetUserData() as IPhysicsObject2D).rigidbody;
            this.otherCollider = fixtureB.GetUserData() as Collider2D;
            this.otherRigidbody = (fixtureB.GetBody().GetUserData() as IPhysicsObject2D).rigidbody;
        } else {
            this.collider = fixtureB.GetUserData() as Collider2D;
            this.rigidbody = (fixtureB.GetBody().GetUserData() as IPhysicsObject2D).rigidbody;
            this.otherCollider = fixtureA.GetUserData() as Collider2D;
            this.otherRigidbody = (fixtureA.GetBody().GetUserData() as IPhysicsObject2D).rigidbody;
        }

        // this.relativeVelocity = this.rigidbody?.getLinearVelocityFromWorldPoint(this.point) ?? new Vector2();
        // this.relativeVelocity.sub(this.otherRigidbody?.getLinearVelocityFromWorldPoint(this.point) ?? new Vector2());
        
        const manifold = contact.GetManifold();
        this.point.set(manifoldPoint.localPoint.x, manifoldPoint.localPoint.y);
        const localNormal = manifold.localNormal;
        this.normal.set(localNormal.x, localNormal.y);
        this.normalImpulse = manifoldPoint.normalImpulse;
        this.tangentImpulse = manifoldPoint.tangentImpulse;
        //this.separation = contact
        // this.separation = this._contact.GetManifold().m_points[0].m_separation;
    }

    public get enabled(): boolean {
        return this._contact?.IsEnabled() ?? false;
    }

    public set enabled(value: boolean) {
        this._contact?.SetEnabled(value);
    }
}
