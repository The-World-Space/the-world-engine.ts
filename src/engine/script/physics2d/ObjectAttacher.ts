import { Component } from "../../hierarchy_object/Component";
import { GameObject } from "../../hierarchy_object/GameObject";

/** @internal */
export class ObjectAttacher extends Component {
    private _target: GameObject|null = null;

    public set target(value: GameObject) {
        this._target = value;
        value.transform.localPosition.copy(this.transform.position); //use local value for performance reason
        value.transform.localRotation.copy(this.transform.rotation);
    }

    public onWorldMatrixUpdated(): void {
        const targetTransform = this._target!.transform;
        targetTransform.localPosition.copy(this.transform.position);
        targetTransform.localRotation.copy(this.transform.rotation);
    }
}
