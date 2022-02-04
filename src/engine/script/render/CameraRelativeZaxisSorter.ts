import { Vector3 } from "three";
import { ZaxisSortable } from "./ZaxisSortable";

export class CameraRelativeZaxisSorter extends ZaxisSortable {
    public override readonly disallowMultipleComponent: boolean = true;

    private _offset = -1000;
    private readonly _tempVector3: Vector3 = new Vector3();

    public update(): void { 
        this.transform.localPosition.z = this.engine.cameraContainer.camera!.getWorldPosition(this._tempVector3).z + this._offset;
        this.gameObject.getComponentsInChildren().forEach(component => {
            const cAny = component as any;
            if (cAny.onSortByZaxis) {
                if (typeof cAny.onSortByZaxis === "function") {
                    cAny.onSortByZaxis(this.transform.localPosition.z);
                }
            }
        });
    }

    public get offset(): number {
        return this._offset;
    }

    public set offset(value: number) {
        this._offset = value;
    }
}
