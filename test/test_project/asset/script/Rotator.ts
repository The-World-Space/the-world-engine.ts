import { Component } from "@src/engine/hierarchy_object/Component";
import { Quaternion, Vector3 } from "three/src/Three";

/** @internal */
export class Rotator extends Component {
    private _accumulator = 0;
    private readonly _quternion = new Quaternion();

    public update(): void {
        this._accumulator += this.engine.time.deltaTime;
        this._quternion.setFromAxisAngle(new Vector3(0, 0, 1), this.engine.time.deltaTime * 0.5);
        this.transform.localRotation.multiply(this._quternion);
        this.transform.localPosition.x = Math.sin(this._accumulator) * 50;
        this.transform.localPosition.y = Math.cos(this._accumulator) * 50;
    }
}
