import { Component } from "../../../engine/hierarchy_object/Component";
import { Collision2D } from "../../../engine/physics/2d/Collision2D";

export class CollisionEventTest extends Component {
    public onCollisionEnter2D(_other: Collision2D) {
        console.log(`CollisionEventTest.onCollisionEnter2D gameObject: ${this.gameObject.name}`);
    }

    public onCollisionStay2D(_other: Collision2D) {
        console.log(`CollisionEventTest.onCollisionStay2D gameObject: ${this.gameObject.name}`);
    }

    public onCollisionExit2D(_other: Collision2D) {
        console.log(`CollisionEventTest.onCollisionExit2D gameObject: ${this.gameObject.name}`);
    }
}
