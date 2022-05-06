import { Component } from "@src/engine/hierarchy_object/Component";

/** @internal */
export class TimeTest extends Component {
    private _accumulator = 0;

    public update(): void {
        this._accumulator += this.engine.time.deltaTime;
        console.log(this._accumulator);
    }
}
