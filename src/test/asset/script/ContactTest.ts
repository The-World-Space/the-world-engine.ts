import { Component } from "../../../engine/hierarchy_object/Component";
import { ContactPoint2D } from "../../../engine/physics/2d/ContactPoint2D";
import { RigidBody2D } from "../../../engine/script/physics2d/RigidBody2D";

/** @internal */
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

    private contactBuffer: ContactPoint2D[] = [];

    private onKeyDown = (event: KeyboardEvent): void => {
        if (event.key === "a") {
            if (!this._rigidbody) return;
            const len = this._rigidbody.getContacts(this.contactBuffer);
            for (let i = 0; i < len; i++) {
                const contact = this.contactBuffer[i];
                console.log(`${contact.rigidbody?.gameObject.name} - ${contact.otherRigidbody?.gameObject.name}`, contact.normal.x, contact.normal.y);
            }
        }
    };
}
