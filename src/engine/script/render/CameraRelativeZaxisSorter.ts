import { ZaxisSortable } from "./ZaxisSortable";

export class CameraRelativeZaxisSorter extends ZaxisSortable {
    public override readonly disallowMultipleComponent: boolean = true;

    private _offset = -100;

    public update(): void { 
        this.transform.localPosition.z = this.engine.cameraContainer.camera!.transform.position.z + this._offset;
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
