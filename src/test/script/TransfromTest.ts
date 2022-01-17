import { Component } from "../../engine/hierarchy_object/Component";

/** @internal */
export class TransformTest extends Component {
    public start(): void {
        console.log(this.transform.getUp(), this.transform.getRight(), this.transform.getForward());
    }
}