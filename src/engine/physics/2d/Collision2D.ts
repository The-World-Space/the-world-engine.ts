//import * as b2 from "../../../box2d.ts/build/index";
import { Vector2 } from "three";
import { Collider2D } from "../../script/physics2d/collider/Collider2D";
import { RigidBody2D } from "../../script/physics2d/RigidBody2D";

export class Collision2D {
    //this
    public collider: Collider2D;
    public rigidbody: RigidBody2D|null;

    //other
    public otherCollider: Collider2D;
    public otherRigidbody: RigidBody2D|null;

    public contactCount: number;
    public contacts: unknown;
    public enabled: boolean;
    public relativeVelocity: Vector2;

    public constructor(
        collider: Collider2D,
        rigidbody: RigidBody2D|null,
        otherCollider: Collider2D,
        otherRigidbody: RigidBody2D|null,
    ) {
        this.collider = collider;
        this.rigidbody = rigidbody;
        this.otherCollider = otherCollider;
        this.otherRigidbody = otherRigidbody;

        this.contactCount = 0;
        this.contacts = null;
        this.enabled = true;
        this.relativeVelocity = new Vector2();
    }
}
