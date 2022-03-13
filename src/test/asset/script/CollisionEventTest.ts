import { Component } from "../../../engine/hierarchy_object/Component";
import { Collision2D } from "../../../engine/physics/2d/Collision2D";

export class CollisionEventTest extends Component {
    public onCollisionEnter2D(collision: Collision2D) {
        console.log(
            "CollisionEventTest.onCollisionEnter2D\n" +
            `a: ${collision.collider.gameObject.name}\n` +
            `b: ${collision.otherCollider.gameObject.name}\n` +
            `a.velocity: ${collision.rigidbody?.velocity.x}, ${collision.rigidbody?.velocity.y}\n` +
            `b.velocity: ${collision.otherRigidbody?.velocity.x}, ${collision.otherRigidbody?.velocity.y}\n` +
            `relativeVelocity: ${collision.relativeVelocity.x}, ${collision.relativeVelocity.y}`
        );
    }

    public onCollisionStay2D(collision: Collision2D) {
        console.log(`CollisionEventTest.onCollisionStay2D gameObject: ${this.gameObject.name}`, collision);
    }

    public onCollisionExit2D(collision: Collision2D) {
        console.log(`CollisionEventTest.onCollisionExit2D gameObject: ${this.gameObject.name}`, collision);
    }
}
