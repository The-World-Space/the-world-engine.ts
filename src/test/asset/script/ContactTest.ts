import { Component } from "../../../engine/hierarchy_object/Component";
import { RigidBody2D } from "../../../engine/script/physics2d/RigidBody2D";

export class ContactTest extends Component {
    public override readonly requiredComponents = [RigidBody2D];
    private _rigidbody: RigidBody2D|null = null;

    public awake(): void {
        this.engine.input.addOnKeyDownEventListener(this.onKeyDown);
        this._rigidbody = this.gameObject.getComponent(RigidBody2D);
    }

    public onDestroy(): void {
        this.engine.input.removeOnKeyDownEventListener(this.onKeyDown);
    }

    private onKeyDown = (event: KeyboardEvent): void => {
        if (event.key === "a") {
            this._rigidbody?.getContacts([]);
        }
    };
}
