import { Component } from "@src/engine/hierarchy_object/Component";
import { RigidBody2D } from "@src/engine/script/physics2d/RigidBody2D";

/** @internal */
export class RigidBodyAttacher extends Component {
    public awake(): void {
        setTimeout(() => {
            this.gameObject.addComponent(RigidBody2D);
        }, 1000);
    }
}
