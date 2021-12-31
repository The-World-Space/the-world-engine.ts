import { Vector3 } from "three";
import { ZaxisSortable } from "./ZaxisSortable";
export class ZaxisSorter extends ZaxisSortable {
    constructor() {
        super(...arguments);
        this._disallowMultipleComponent = true;
        this._offset = 0;
        this._runOnce = true;
        this._tempVector = new Vector3();
    }
    start() {
        this.update();
        if (!this._runOnce)
            return;
        this.gameObject.removeComponent(this);
    }
    update() {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector);
        worldPosition.z = -worldPosition.y + this._offset;
        if (this.gameObject.transform.parentTransform) {
            this.gameObject.transform.position.copy(this.gameObject.transform.parentTransform.worldToLocal(worldPosition));
        }
        else { // if no parent transform, world position is same as local position
            this.gameObject.transform.position.copy(worldPosition);
        }
        this.gameObject.getComponentsInChildren().forEach(component => {
            const cAny = component;
            if (cAny.onSortByZaxis) {
                if (typeof cAny.onSortByZaxis === "function") {
                    cAny.onSortByZaxis(worldPosition.z);
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
    get runOnce() {
        return this._runOnce;
    }
    set runOnce(value) {
        this._runOnce = value;
    }
}
