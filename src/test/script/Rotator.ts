import { Quaternion, Vector3 } from "three";
import { Component } from "../../engine/hierarchy_object/Component";

export class Rotator extends Component {
    private _accumulator = 0;
    private readonly _quternion = new Quaternion();

    public update() {
        this._accumulator += this.engine.time.deltaTime;
        this._quternion.setFromAxisAngle(new Vector3(0, 0, 1), this.engine.time.deltaTime * 0.5);
        this.gameObject.transform.localRotation.multiply(this._quternion);
        this.gameObject.transform.localPosition.x = Math.sin(this._accumulator) * 50;
        this.gameObject.transform.localPosition.y = Math.cos(this._accumulator) * 50;
    }
}