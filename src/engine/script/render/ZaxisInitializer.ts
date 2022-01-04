import { Vector3 } from "three";
import { GameObject } from "../../hierarchy_object/GameObject";
import { ZaxisSortable } from "./ZaxisSortable";

export class ZaxisInitializer extends ZaxisSortable {
    protected override readonly _disallowMultipleComponent: boolean = true;

    private _runOnce = true;

    protected override start(): void { 
        this.process();
        if (this.runOnce) this.enabled = false;
    }

    public update(): void {
        this.process();
    }

    private readonly _tempVector3 = new Vector3();

    private process(): void {
        this.gameObject.getComponentsInChildren().forEach(component => {
            const cAny = component as any;
            if (cAny.onSortByZaxis) {
                if (typeof cAny.onSortByZaxis === "function") {
                    const worldPosition = component.gameObject.transform.getWorldPosition(this._tempVector3);
                    cAny.onSortByZaxis(worldPosition.z);
                }
            }
        });
    }

    public static checkAncestorZaxisInitializer(gameObject: GameObject, onSortByZaxis: (z: number) => void): void {
        if (!gameObject.transform.parentTransform) return;
        let currentAncestor = gameObject.transform.parentTransform;
        while (currentAncestor) {
            const zaxisInitializer = currentAncestor.gameObject.getComponent(ZaxisInitializer);
            if (zaxisInitializer) {
                const worldPosition = currentAncestor.gameObject.transform.getWorldPosition(new Vector3());
                onSortByZaxis(worldPosition.z);
                return;
            }
            if (currentAncestor.parentTransform === null) break;
            currentAncestor = currentAncestor.parentTransform;
        }
    }   

    public get runOnce(): boolean {
        return this._runOnce;
    }

    public set runOnce(value: boolean) {
        this._runOnce = value;
    }
}
