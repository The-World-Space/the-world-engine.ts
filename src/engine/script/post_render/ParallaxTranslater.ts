import { Vector2, Vector3 } from "three/src/Three";

import { ReadonlyVector2 } from "../../math/ReadonlyVector2";
import { WritableVector2 } from "../../math/WritableVector2";
import { Component } from "../../hierarchy_object/Component";

/**
 * this component will translate gameObject's position to parallax effect relative to camera
 * 
 * This effect allows 2D objects to move as if they were 3D.
 * 
 * important: This component is only available for static objects. (Moving game objects does not guarantee normal operation)
 * 
 * 
 * disallow multiple component
 */
export class ParallaxTranslater extends Component {
    public override readonly disallowMultipleComponent: boolean = true;

    private _offsetX = 1.5;
    private _offsetY = 1.5;
    private _initializeCenterFromPosition = true;
    private readonly _center: Vector2 = new Vector2();

    public start(): void {
        if (this._initializeCenterFromPosition) {
            this._center.set(this.transform.localPosition.x, this.transform.localPosition.y);
        }
    }

    private readonly _tempVector3 = new Vector3();
    private readonly _tempVector2 = new Vector2();

    public update(): void {
        const cameraWorldPosition = this._tempVector3.copy(this.engine.cameraContainer.camera!.transform.position);
        const parent = this.transform.parent;
        const cameraLocalPosition = parent ? parent.inverseTransformPoint(cameraWorldPosition) : cameraWorldPosition;
        const cameraPosition = this._tempVector2.set(cameraLocalPosition.x, cameraLocalPosition.y);
        const cameraDistanceX = cameraPosition.x - this._center.x;
        const cameraDistanceY = cameraPosition.y - this._center.y;

        const offsetX = this._offsetX * cameraDistanceX;
        const offsetY = this._offsetY * cameraDistanceY;

        this.transform.localPosition.x = this._center.x + offsetX;
        this.transform.localPosition.y = this._center.y + offsetY;
    }

    /**
     * translate center offset x (default: 1.5)
     */
    public get offsetX(): number {
        return this._offsetX;
    }

    /**
     * translate center offset x (default: 1.5)
     */
    public set offsetX(value: number) {
        this._offsetX = value;
    }

    /**
     * translate center offset y (default: 1.5)
     */
    public get offsetY(): number {
        return this._offsetY;
    }

    /**
     * translate center offset y (default: 1.5)
     */
    public set offsetY(value: number) {
        this._offsetY = value;
    }

    /**
     * if this value is true, the center will be initialized from transform.localPosition (default: true)
     */
    public get initializeCenterFromPosition(): boolean {
        return this._initializeCenterFromPosition;
    }

    /**
     * if this value is true, the center will be initialized from transform.localPosition (default: true)
     */
    public set initializeCenterFromPosition(value: boolean) {
        this._initializeCenterFromPosition = value;
    }

    /**
     * center of parallax effect
     */
    public get center(): ReadonlyVector2 {
        return this._center;
    }

    /**
     * center of parallax effect
     */
    public set center(value: ReadonlyVector2) {
        (this._center as WritableVector2).copy(value);
    }
}
