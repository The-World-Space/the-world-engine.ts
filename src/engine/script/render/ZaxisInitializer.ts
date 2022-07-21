import { GameObject } from "../../hierarchy_object/GameObject";
import { ZaxisSortable } from "./ZaxisSortable";

/**
 * Components that synchronize the z-index with the z-axis value of the object
 * 
 * It applies to all renderers with child objects in the game object with this component
 * 
 * If any object in the game uses either ZaxisSorter or CameraRelativeZaxisSorter,
 * ZaxisInitializer must be applied to renderers which do not use both to render.
 * 
 * This component exists to resolve a bug in a chromium-based browser,
 * which has recently been fixed so this component will soon be removed.
 */
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

    /**
     * Whether to run this component only once at start (default: true)
     * 
     * if gameObject is moveable, you should set this to false for update the z-index
     */
    public get runOnce(): boolean {
        return this._runOnce;
    }

    /**
     * Whether to run this component only once at start (default: true)
     * 
     * if gameObject is moveable, you should set this to false for update the z-index
     */
    public set runOnce(value: boolean) {
        this._runOnce = value;
    }
}
