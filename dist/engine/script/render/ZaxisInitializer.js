import { Vector3 } from "three";
import { ZaxisSortable } from "./ZaxisSortable";
export class ZaxisInitializer extends ZaxisSortable {
    constructor() {
        super(...arguments);
        this._disallowMultipleComponent = true;
        this._runOnce = true;
        this._tempVector3 = new Vector3();
    }
    start() {
        this.process();
        if (this.runOnce)
            this.enabled = false;
    }
    update() {
        this.process();
    }
    process() {
        this.gameObject.getComponentsInChildren().forEach(component => {
            const cAny = component;
            if (cAny.onSortByZaxis) {
                if (typeof cAny.onSortByZaxis === "function") {
                    const worldPosition = component.gameObject.transform.getWorldPosition(this._tempVector3);
                    cAny.onSortByZaxis(worldPosition.z);
                }
            }
        });
    }
    static checkAncestorZaxisInitializer(gameObject, onSortByZaxis) {
        if (!gameObject.transform.parentTransform)
            return;
        let currentAncestor = gameObject.transform.parentTransform;
        while (currentAncestor) {
            const zaxisInitializer = currentAncestor.gameObject.getComponent(ZaxisInitializer);
            if (zaxisInitializer) {
                const worldPosition = currentAncestor.gameObject.transform.getWorldPosition(new Vector3());
                onSortByZaxis(worldPosition.z);
                return;
            }
            if (currentAncestor.parentTransform === null)
                break;
            currentAncestor = currentAncestor.parentTransform;
        }
    }
    get runOnce() {
        return this._runOnce;
    }
    set runOnce(value) {
        this._runOnce = value;
    }
}
