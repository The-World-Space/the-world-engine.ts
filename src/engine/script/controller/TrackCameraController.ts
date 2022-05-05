import { Vector2, Vector3 } from "three/src/Three";
import { Component } from "../../hierarchy_object/Component";
import { ComponentConstructor } from "../../hierarchy_object/ComponentConstructor";
import { GameObject } from "../../hierarchy_object/GameObject";
import { Camera } from "../render/Camera";

/**
 * controller for 2D track camera
 * 
 * it requires a camera component to control
 * 
 * it supports pixel perfect and lerp movement
 * 
 * 
 * disallow multiple component
 * 
 * require components: `Camera`
 */
export class TrackCameraController extends Component {
    public override readonly disallowMultipleComponent: boolean = true;
    public override readonly requiredComponents: ComponentConstructor[] = [Camera];

    private _trackTarget: GameObject|null = null;
    private readonly _targetOffset: Vector2 = new Vector2();
    private _cameraDistanceOffset = 20;
    private _pixelPerfectUnit = 1;
    private _pixelPerfect = false;
    private _lerpTrack = false;
    private _lerpAlpha = 0.1;

    public start(): void {
        if (this._trackTarget) {
            const targetPosition = this._tempVector.copy(this._trackTarget.transform.position);
            targetPosition.z += this._cameraDistanceOffset;
            this.transform.position.copy(targetPosition);
        }
    }

    private readonly _tempVector: Vector3 = new Vector3();

    public update(): void {
        const targetPosition = this._tempVector.copy(this._trackTarget!.transform.position);
        targetPosition.z += this._cameraDistanceOffset;
        targetPosition.x += this._targetOffset.x;
        targetPosition.y += this._targetOffset.y;
        const transform = this.transform;
        if (this._lerpTrack) {
            transform.position.lerp(targetPosition, 0.1);
        } else {
            transform.position.copy(targetPosition);
        }

        if (this._pixelPerfect) {
            transform.localPosition.x = Math.round(transform.localPosition.x / this._pixelPerfectUnit) * this._pixelPerfectUnit;
            transform.localPosition.y = Math.round(transform.localPosition.y / this._pixelPerfectUnit) * this._pixelPerfectUnit;
        }
    }

    /**
     * set the target to track
     * @param target 
     */
    public setTrackTarget(target: GameObject): void {
        this._trackTarget = target;
    }

    /**
     * target position offset (default: (0, 0))
     */
    public get targetOffset(): Vector2 {
        return this._targetOffset;
    }

    /**
     * target position offset (default: (0, 0))
     */
    public set targetOffset(value: Vector2) {
        this._targetOffset.copy(value);
    }

    /**
     * z distance from camera to target (default: 20)
     */
    public get cameraDistanceOffset(): number {
        return this._cameraDistanceOffset;
    }

    /**
     * z distance from camera to target (default: 20)
     */
    public set cameraDistanceOffset(value: number) {
        this._cameraDistanceOffset = value;
    }

    /**
     * pixel perfect unit (default: 1)
     */
    public get pixelPerfectUnit(): number {
        return this._pixelPerfectUnit;
    }

    /**
     * pixel perfect unit (default: 1)
     */
    public set pixelPerfectUnit(value: number) {
        this._pixelPerfectUnit = value;
    }

    /**
     * use pixel perfect (default: false)
     */
    public get pixelPerfect(): boolean {
        return this._pixelPerfect;
    }

    /**
     * use pixel perfect (default: false)
     */
    public set pixelPerfect(value: boolean) {
        this._pixelPerfect = value;
    }

    /**
     * use lerp to track (default: false)
     */
    public get lerpTrack(): boolean {
        return this._lerpTrack;
    }

    /**
     * use lerp to track (default: false)
     */
    public set lerpTrack(value: boolean) {
        this._lerpTrack = value;
    }

    /**
     * lerp alpha (default: 0.1)
     */
    public get lerpAlpha(): number {
        return this._lerpAlpha;
    }

    /**
     * lerp alpha (default: 0.1)
     */
    public set lerpAlpha(value: number) {
        this._lerpAlpha = value;
    }
}
