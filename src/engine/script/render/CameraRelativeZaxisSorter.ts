import { Vector3 } from "three";
import { ZaxisSortable } from "./ZaxisSortable";

export class CameraRelativeZaxisSorter extends ZaxisSortable {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _offset: number = -1000;
    private readonly _tempVector3: Vector3 = new Vector3();

    public update(): void { 
        this.gameObject.transform.position.z = this.engine.cameraContainer.camera!.getWorldPosition(this._tempVector3).z + this._offset;
        this.gameObject.getComponentsInChildren().forEach(component => {
            const cAny = component as any;
            if (cAny.onSortByZaxis) {
                if (typeof cAny.onSortByZaxis === "function") {
                    cAny.onSortByZaxis(this.gameObject.transform.position.z);
                }
            }
        });
    }

    get offset(): number {
        return this._offset;
    }

    set offset(value: number) {
        this._offset = value;
    }
}
