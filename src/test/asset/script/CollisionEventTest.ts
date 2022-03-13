import { Component } from "../../../engine/hierarchy_object/Component";
import { Collision2D } from "../../../engine/physics/2d/Collision2D";

export class CollisionEventTest extends Component {
    public onCollisionEnter2D(collision: Collision2D) {
        console.log(`CollisionEventTest.onCollisionEnter2D gameObject: ${this.gameObject.name}`, collision);
    }

    public onCollisionStay2D(collision: Collision2D) {
        console.log(`CollisionEventTest.onCollisionStay2D gameObject: ${this.gameObject.name}`, collision);
    }

    public onCollisionExit2D(collision: Collision2D) {
        console.log(`CollisionEventTest.onCollisionExit2D gameObject: ${this.gameObject.name}`, collision);
    }
}
