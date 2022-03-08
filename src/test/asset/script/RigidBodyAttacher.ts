import { Component } from "../../../engine/hierarchy_object/Component";
import { RigidBody2D } from "../../../engine/script/physics2d/RigidBody2D";

export class RigidBodyAttacher extends Component {
    public awake(): void {
        setTimeout(() => {
            this.gameObject.addComponent(RigidBody2D);
        }, 1000);
    }
}
