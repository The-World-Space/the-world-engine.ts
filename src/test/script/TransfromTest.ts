import { Component } from "../../engine/hierarchy_object/Component";

export class TransformTest extends Component {
    protected override start(): void {
        console.log(this.gameObject.transform.getUp(), this.gameObject.transform.getRight(), this.gameObject.transform.getForward());
    }
}