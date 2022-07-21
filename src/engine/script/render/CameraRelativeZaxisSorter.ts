import { ZaxisSortable } from "./ZaxisSortable";

/**
 * Determine the z-value of the object based on the z-position of the camera
 * 
 * This component is mainly used to create top-down 2D games.
 * 
 * You can use this component on objects like tilemaps that must always be a certain distance away from the camera
 * 
 * 
 * This component also matches the z-index value of the css renderer to the z value.
 * This feature is simply for fixing bugs in a Chromium-based browser, and the bug has been fixed in the latest patch so this feature will soon be removed.
 */
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

    /**
     * The offset to be added to the z-position of the camera (default: -100)
     */
    public get offset(): number {
        return this._offset;
    }

    /**
     * The offset to be added to the z-position of the camera (default: -100)
     */
    public set offset(value: number) {
        this._offset = value;
    }
}
