import * as b2 from "../../../box2d.ts/build/index";
import { Vector2 } from "three";
import { Collider2D } from "../../script/physics2d/collider/Collider2D";
import { RigidBody2D } from "../../script/physics2d/RigidBody2D";
import { ContactPoint2D } from "./ContactPoint2D";
import { IPhysicsObject2D } from "./PhysicsObject2D";
import { ReadonlyVector2 } from "../../math/ReadonlyVector2";

export class Collision2D {
    public contact: b2.Contact|null = null;

    private _collider: Collider2D|null = null;
    public rigidbody: RigidBody2D|null = null;

    private _otherCollider: Collider2D|null = null;
    public otherRigidbody: RigidBody2D|null = null;

    public contactCount = 0;
    private _relativeVelocity: Vector2 = new Vector2();

    public setData(contact: b2.Contact) {
        this.contact = contact;
        
        const fixtureA = contact.GetFixtureA();
        const fixtureB = contact.GetFixtureB();
        const collider2dA = fixtureA.GetUserData() as Collider2D;
        const collider2dB = fixtureB.GetUserData() as Collider2D;
        const bodyA = fixtureA.GetBody();
        const bodyB = fixtureB.GetBody();
        
        this._collider = collider2dA;
        this.rigidbody = (bodyA.GetUserData() as IPhysicsObject2D).rigidbody;
        this._otherCollider = collider2dB;
        this.otherRigidbody = (bodyB.GetUserData() as IPhysicsObject2D).rigidbody;

        this.contactCount = contact.GetManifold().pointCount;
        this._relativeVelocity.set(NaN, NaN);
    }

    public get collider(): Collider2D {
        return this._collider!;
    }

    public get otherCollider(): Collider2D {
        return this._otherCollider!;
    }

    public getContacts(_out: ContactPoint2D[]): number {
        throw new Error("Method not implemented.");
    }

    public get enabled(): boolean {
        return this.contact?.IsEnabled() ?? false;
    }

    public set enabled(value: boolean) {
        this.contact?.SetEnabled(value);
    }

    private static tempVec = new b2.Vec2();

    public get relativeVelocity(): ReadonlyVector2 {
        if (this.contact) {
            if (isNaN(this._relativeVelocity.x)) {
                const bodyA = this.contact.GetFixtureA().GetBody();
                const bodyB = this.contact.GetFixtureB().GetBody();
                const aVelocity = Collision2D.tempVec.Copy(bodyA.GetLinearVelocity());
                const relativeVelocity = aVelocity.SelfSub(bodyB.GetLinearVelocity());
                this._relativeVelocity.set(relativeVelocity.x, relativeVelocity.y);
            }
        }
        return this._relativeVelocity;
    }
}
