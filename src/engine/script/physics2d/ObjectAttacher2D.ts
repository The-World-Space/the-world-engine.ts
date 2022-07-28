import { Component } from "../../hierarchy_object/Component";
import { GameObject } from "../../hierarchy_object/GameObject";

/** @internal */
export class ObjectAttacher2D extends Component {
    private _target: GameObject|null = null;

    public set target(value: GameObject) {
        this._target = value;
        value.transform.localPosition.x = this.transform.position.x; //use local value for performance reason
        value.transform.localPosition.y = this.transform.position.y;
        value.transform.localEulerAngles.z = this.transform.eulerAngles.z;
    }

    public onWorldMatrixUpdated(): void {
        const targetTransform = this._target!.transform;
        targetTransform.localPosition.x = this.transform.position.x; //use local value for performance reason
        targetTransform.localPosition.y = this.transform.position.y;
        targetTransform.localEulerAngles.z = this.transform.eulerAngles.z;
    }
}
