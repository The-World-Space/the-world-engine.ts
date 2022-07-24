import { ZaxisSortable } from "./ZaxisSortable";

/**
 * Determine the z-value of the object based on the y-position of the gameObject
 * 
 * This component is mainly used in top-down 2D games to control the rendering order of objects
 * 
 * It applies to all renderers with child objects in the game object with this component
 */
export class ZaxisSorter extends ZaxisSortable {
    public override readonly disallowMultipleComponent: boolean = true;

    private _offset = 0;
    private _runOnce = true;

    public start(): void { 
        this.update();
        if (!this._runOnce) return;
        this.destroy();
    }

    public update(): void {
        const worldPosition = this.transform.position;
        worldPosition.z = -worldPosition.y + this._offset;
    }

    /**
     * The offset to be added to the z-position of the gameObject (default: 0)
     */
    public get offset(): number {
        return this._offset;
    }

    /**
     * The offset to be added to the z-position of the gameObject (default: 0)
     */
    public set offset(value: number) {
        this._offset = value;
    }

    /**
     * Whether to run this component only once at start (default: true)
     * 
     * if gameObject is moveable, you should set this to false for update the z-axis
     */
    public get runOnce(): boolean {
        return this._runOnce;
    }

    /**
     * Whether to run this component only once at start (default: true)
     * 
     * if gameObject is moveable, you should set this to false for update the z-axis
     */
    public set runOnce(value: boolean) {
        this._runOnce = value;
    }
}
