import { GameObject } from "../../hierarchy_object/GameObject";
import { ZaxisSortable } from "./ZaxisSortable";

export class ZaxisInitializer extends ZaxisSortable {
    public override readonly disallowMultipleComponent: boolean = true;

    private _runOnce = true;

    public start(): void { 
        this.process();
        if (this.runOnce) this.enabled = false;
    }

    public update(): void {
        this.process();
    }

    private process(): void {
        this.gameObject.getComponentsInChildren().forEach(component => {
            const cAny = component as any;
            if (cAny.onSortByZaxis) {
                if (typeof cAny.onSortByZaxis === "function") {
                    cAny.onSortByZaxis(component.transform.position.z);
                }
            }
        });
    }

    public static checkAncestorZaxisInitializer(gameObject: GameObject, onSortByZaxis: (z: number) => void): void {
        if (!gameObject.transform.parent) return;
        let currentAncestor = gameObject.transform.parent;
        while (currentAncestor) {
            const zaxisInitializer = currentAncestor.gameObject.getComponent(ZaxisInitializer);
            if (zaxisInitializer) {
                onSortByZaxis(currentAncestor.position.z);
                return;
            }
            if (currentAncestor.parent === null) break;
            currentAncestor = currentAncestor.parent;
        }
    }   

    public get runOnce(): boolean {
        return this._runOnce;
    }

    public set runOnce(value: boolean) {
        this._runOnce = value;
    }
}
