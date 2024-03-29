import { Component } from "@src/engine/hierarchy_object/Component";
import type { Collision2D } from "@src/engine/physics/2d/Collision2D";
import type { ContactPoint2D } from "@src/engine/physics/2d/ContactPoint2D";

/** @internal */
export class CollisionEventTest extends Component {
    private readonly _contactBuffer: ContactPoint2D[] = [];

    public onCollisionEnter2D(collision: Collision2D): void {
        let str =
            "CollisionEventTest.onCollisionEnter2D\n" +
            `a: ${collision.collider.gameObject.name}\n` +
            `b: ${collision.otherCollider.gameObject.name}\n` +
            `a.velocity: ${collision.rigidbody?.velocity.x}, ${collision.rigidbody?.velocity.y}\n` +
            `b.velocity: ${collision.otherRigidbody?.velocity.x}, ${collision.otherRigidbody?.velocity.y}\n` +
            `relativeVelocity: ${collision.relativeVelocity.x}, ${collision.relativeVelocity.y}\n\n`;

        const contacts = this._contactBuffer;
        const contactCount = collision.getContacts(contacts);

        for (let i = 0; i < contactCount; ++i) {
            str +=
                `    contact ${i}\n` +
                `    normal: ${contacts[i].normal.x}, ${contacts[i].normal.y}\n` +
                `    point: ${contacts[i].point.x}, ${contacts[i].point.y}\n` +
                `    separation: ${contacts[i].separation}\n` +
                `    normalImpulse: ${contacts[i].normalImpulse}\n` +
                `    tangentImpulse: ${contacts[i].tangentImpulse}\n` +
                `    relativeVelocity: ${contacts[i].relativeVelocity.x}, ${contacts[i].relativeVelocity.y}\n` +
                "\n";
        }

        console.log(str);
    }

    public onCollisionStay2D(_collision: Collision2D): void {
        console.log(`CollisionEventTest.onCollisionStay2D gameObject: ${this.gameObject.name}`);
    }

    public onCollisionExit2D(_collision: Collision2D): void {
        console.log(`CollisionEventTest.onCollisionExit2D gameObject: ${this.gameObject.name}`);
    }
}
