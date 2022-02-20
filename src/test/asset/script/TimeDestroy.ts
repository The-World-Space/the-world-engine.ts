import { Component } from "../../../engine/hierarchy_object/Component";

/** @internal */
export class TimeDestroy extends Component {
    public waitTime = 5;
    public accumulator = 0;

    public update(): void {
        this.accumulator += this.engine.time.deltaTime;
        if (this.accumulator >= this.waitTime) {
            this.gameObject.destroy();
        }
    }
}
