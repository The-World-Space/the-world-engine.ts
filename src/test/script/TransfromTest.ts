import { Component } from "../../engine/hierarchy_object/Component";

export class TransformTest extends Component {
    protected override start(): void {
        console.log(this.transform.getUp(), this.transform.getRight(), this.transform.getForward());
    }
}