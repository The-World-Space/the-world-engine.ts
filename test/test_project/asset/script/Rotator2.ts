import { Component } from "@src/engine/hierarchy_object/Component";

/** @internal */
export class Rotator2 extends Component {

    public update(): void {
        this.transform.rotateZ(this.engine.time.deltaTime * 0.5);
    }
}
