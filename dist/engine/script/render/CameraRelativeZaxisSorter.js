import { Vector3 } from "three";
import { ZaxisSortable } from "./ZaxisSortable";
export class CameraRelativeZaxisSorter extends ZaxisSortable {
    constructor() {
        super(...arguments);
        this._disallowMultipleComponent = true;
        this._offset = -1000;
        this._tempVector3 = new Vector3();
    }
    update() {
        this.gameObject.transform.position.z = this.engine.cameraContainer.camera.getWorldPosition(this._tempVector3).z + this._offset;
        this.gameObject.getComponentsInChildren().forEach(component => {
            const cAny = component;
            if (cAny.onSortByZaxis) {
                if (typeof cAny.onSortByZaxis === "function") {
                    cAny.onSortByZaxis(this.gameObject.transform.position.z);
                }
            }
        });
    }
    get offset() {
        return this._offset;
    }
    set offset(value) {
        this._offset = value;
    }
}
