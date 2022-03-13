import { Vector2 } from "three";
import { Component } from "../../../engine/hierarchy_object/Component";
import { RigidBody2D } from "../../../engine/script/physics2d/RigidBody2D";

export class PhysicsController extends Component {
    public override readonly requiredComponents = [RigidBody2D];
    public force = 100;
    private _rigidbody: RigidBody2D|null = null;

    public awake(): void {
        this.engine.input.addOnKeyDownEventListener(this.onKeyDown);
        this._rigidbody = this.gameObject.getComponent(RigidBody2D);
    }

    public onDestroy(): void {
        this.engine.input.removeOnKeyDownEventListener(this.onKeyDown);
    }

    private _tempVector2 = new Vector2();

    private onKeyDown = (event: KeyboardEvent): void => {
        if (!this._rigidbody) return;
        if (event.key === "ArrowUp") {
            this._rigidbody.addForce(this._tempVector2.set(0, this.force));
        } else if (event.key === "ArrowDown") {
            this._rigidbody.addForce(this._tempVector2.set(0, -this.force));
        } else if (event.key === "ArrowLeft") {
            this._rigidbody.addForce(this._tempVector2.set(-this.force, 0));
        } else if (event.key === "ArrowRight") {
            this._rigidbody.addForce(this._tempVector2.set(this.force, 0));
        }
    };
}