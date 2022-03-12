import { Vector2 } from "three";
import * as b2 from "../../../box2d.ts/build/index";
import { Collider2D } from "../../script/physics2d/collider/Collider2D";
import { RigidBody2D } from "../../script/physics2d/RigidBody2D";

export class ContactPoint2D {
    private _contact: b2.Contact|null = null;

    public collider: Collider2D|null = null;
    public rigidbody: RigidBody2D|null = null;

    public otherCollider: Collider2D|null = null;
    public otherRigidbody: RigidBody2D|null = null;

    public relativeVelocity: Vector2 = new Vector2();
    public point: Vector2 = new Vector2();
    public normal: Vector2 = new Vector2();
    public normalImpulse: number = 0;
    public tangentImpulse: number = 0;
    public separation: number = 0;

    public constructor() { }

    /** @internal */
    public setData(contact: b2.Contact): void {
        this._contact = contact;
        // this.collider = contact.GetFixtureA().GetUserData() as Collider2D;
        // this.rigidbody = contact.GetFixtureA().GetBody().GetUserData() as RigidBody2D;
        // this.otherCollider = contact.GetFixtureB().GetUserData() as Collider2D;
        // this.otherRigidbody = contact.GetFixtureB().GetBody().GetUserData() as RigidBody2D;
        // this.relativeVelocity = this.rigidbody?.getLinearVelocityFromWorldPoint(this.point) ?? new Vector2();
        // this.relativeVelocity.sub(this.otherRigidbody?.getLinearVelocityFromWorldPoint(this.point) ?? new Vector2());
        // this.normal = this._contact.GetManifold().m_localPlaneNormal;
        // this.normalImpulse = this._contact.GetManifold().m_points[0].m_normalImpulse;
        // this.tangentImpulse = this._contact.GetManifold().m_points[0].m_tangentImpulse;
        // this.separation = this._contact.GetManifold().m_points[0].m_separation;
    }

    public get enabled(): boolean {
        return this._contact?.IsEnabled() ?? false;
    }

    public set enabled(value: boolean) {
        this._contact?.SetEnabled(value);
    }
}
