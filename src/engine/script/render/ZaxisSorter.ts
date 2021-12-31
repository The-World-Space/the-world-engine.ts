import { Vector3 } from "three";
import { ZaxisSortable } from "./ZaxisSortable";

export class ZaxisSorter extends ZaxisSortable {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _offset: number = 0;
    private _runOnce: boolean = true;

    protected start(): void { 
        this.update();
        if (!this._runOnce) return;
        this.gameObject.removeComponent(this);
    }

    private readonly _tempVector: Vector3 = new Vector3();

    public update(): void {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector);
        worldPosition.z = -worldPosition.y + this._offset;
        if (this.gameObject.transform.parentTransform) {
            this.gameObject.transform.position.copy(this.gameObject.transform.parentTransform!.worldToLocal(worldPosition));
        } else { // if no parent transform, world position is same as local position
            this.gameObject.transform.position.copy(worldPosition);
        }

        this.gameObject.getComponentsInChildren().forEach(component => {
            const cAny = component as any;
            if (cAny.onSortByZaxis) {
                if (typeof cAny.onSortByZaxis === "function") {
                    cAny.onSortByZaxis(worldPosition.z);
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

    get runOnce(): boolean {
        return this._runOnce;
    }

    set runOnce(value: boolean) {
        this._runOnce = value;
    }
}
