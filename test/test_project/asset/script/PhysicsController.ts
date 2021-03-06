import { Component } from "@src/engine/hierarchy_object/Component";
import { RigidBody2D } from "@src/engine/script/physics2d/RigidBody2D";
import { Vector2 } from "three/src/Three";

/** @internal */
export class PhysicsController extends Component {
    public override readonly requiredComponents = [RigidBody2D];
    public force = 100;
    private _rigidbody: RigidBody2D|null = null;

    public awake(): void {
        this._rigidbody = this.gameObject.getComponent(RigidBody2D);
    }

    private readonly _tempVector2 = new Vector2();

    public update(): void {
        const inputMap = this.engine.input.map;
        if (inputMap.get("ArrowUp")) {
            this._rigidbody!.addForce(this._tempVector2.set(0, this.force));
        }
        if (inputMap.get("ArrowDown")) {
            this._rigidbody!.addForce(this._tempVector2.set(0, -this.force));
        }
        if (inputMap.get("ArrowLeft")) {
            this._rigidbody!.addForce(this._tempVector2.set(-this.force, 0));
        }
        if (inputMap.get("ArrowRight")) {
            this._rigidbody!.addForce(this._tempVector2.set(this.force, 0));
        }
    }
}
