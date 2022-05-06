import { Component } from "@src/engine/hierarchy_object/Component";
import { ContactPoint2D } from "@src/engine/physics/2d/ContactPoint2D";
import { RigidBody2D } from "@src/engine/script/physics2d/RigidBody2D";

/** @internal */
export class ContactTest extends Component {
    public override readonly requiredComponents = [RigidBody2D];
    private _rigidbody: RigidBody2D|null = null;

    public awake(): void {
        this.engine.input.onKeyDown.addListener(this.onKeyDown);
        this._rigidbody = this.gameObject.getComponent(RigidBody2D);
    }

    public onDestroy(): void {
        this.engine.input.onKeyDown.removeListener(this.onKeyDown);
    }

    private readonly _contactBuffer: ContactPoint2D[] = [];

    private readonly onKeyDown = (event: KeyboardEvent): void => {
        if (event.key === "a") {
            if (!this._rigidbody) return;
            const len = this._rigidbody.getContacts(this._contactBuffer);
            for (let i = 0; i < len; i++) {
                const contact = this._contactBuffer[i];
                console.log(`${contact.rigidbody?.gameObject.name} - ${contact.otherRigidbody?.gameObject.name}`, contact.normal.x, contact.normal.y);
            }
        }
    };
}
