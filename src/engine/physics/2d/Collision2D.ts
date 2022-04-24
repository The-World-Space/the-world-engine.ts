import type { Contact } from "../../../box2d.ts/build/index";
import { WorldManifold, Vec2 } from "../../../box2d.ts/build/index";
import { Vector2 } from "three/src/Three";
import { ContactPoint2D } from "./ContactPoint2D";
import type { Collider2D } from "../../script/physics2d/collider/Collider2D";
import type { RigidBody2D } from "../../script/physics2d/RigidBody2D";
import type { IPhysicsObject2D } from "./PhysicsObject2D";
import type { ReadonlyVector2 } from "../../math/ReadonlyVector2";

export class Collision2D {
    private _contact: Contact|null = null;
    private readonly _worldManifold: WorldManifold = new WorldManifold();

    private _collider: Collider2D|null = null;
    private _rigidbody: RigidBody2D|null = null;

    private _otherCollider: Collider2D|null = null;
    private _otherRigidbody: RigidBody2D|null = null;

    private _contactCount = 0;
    private readonly _relativeVelocity: Vector2 = new Vector2();

    /** @internal */
    public setData(contact: Contact): void {
        this._contact = contact;
        
        const fixtureA = contact.GetFixtureA();
        const fixtureB = contact.GetFixtureB();
        const collider2dA = fixtureA.GetUserData() as Collider2D;
        const collider2dB = fixtureB.GetUserData() as Collider2D;
        const bodyA = fixtureA.GetBody();
        const bodyB = fixtureB.GetBody();
        
        this._collider = collider2dA;
        this._rigidbody = (bodyA.GetUserData() as IPhysicsObject2D).rigidbody;
        this._otherCollider = collider2dB;
        this._otherRigidbody = (bodyB.GetUserData() as IPhysicsObject2D).rigidbody;

        this._contactCount = contact.GetManifold().pointCount;

        const aVelocity = Collision2D._tempVec.Copy(bodyA.GetLinearVelocity());
        const relativeVelocity = aVelocity.SelfSub(bodyB.GetLinearVelocity());
        this._relativeVelocity.set(relativeVelocity.x, relativeVelocity.y);
    }
    
    private static readonly _tempVec = new Vec2();

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

    public get contactCount(): number {
        return this._contactCount;
    }

    public getContacts(out: ContactPoint2D[]): number {
        if (!this._contact) return 0;
        let insertPos = 0;
        const manifold = this._contact.GetManifold();
        for (let i = 0; i < manifold.pointCount; i++) {
            if (!out[insertPos]) out[insertPos] = new ContactPoint2D();
            this._contact.GetWorldManifold(this._worldManifold);
            out[insertPos].setData(
                this._contact,
                manifold.points[i],
                this._worldManifold.normal,
                this._worldManifold.points[i],
                this._worldManifold.separations[i],
                this._relativeVelocity
            );
            insertPos += 1;
        }
        return insertPos;
    }

    public getContact(index: number, out?: ContactPoint2D): ContactPoint2D|null {
        if (!this._contact) return null;
        const manifold = this._contact.GetManifold();
        if (index < 0 || manifold.pointCount <= index) return null;
        if (!out) out = new ContactPoint2D();
        this._contact.GetWorldManifold(this._worldManifold);
        out.setData(
            this._contact,
            manifold.points[index],
            this._worldManifold.normal,
            this._worldManifold.points[index],
            this._worldManifold.separations[index],
            this._relativeVelocity
        );
        return out;
    }

    public get enabled(): boolean {
        return this._contact?.IsEnabled() ?? false;
    }

    public set enabled(value: boolean) {
        this._contact?.SetEnabled(value);
    }

    public get relativeVelocity(): ReadonlyVector2 {
        return this._relativeVelocity;
    }
}
