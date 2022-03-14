import { Component } from "../../../engine/hierarchy_object/Component";
import { Collider2D } from "../../../engine/script/physics2d/collider/Collider2D";

/** @internal */
export class BodyDisposer extends Component {
    public override readonly requiredComponents = [Collider2D];

    public onTriggerEnter2D(other: Collider2D): void {
        other.gameObject.destroy();
    }
}
