import { Vector2, Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { ComponentConstructor } from "../../hierarchy_object/ComponentConstructor";
import { GameObject } from "../../hierarchy_object/GameObject";
import { Camera } from "../render/Camera";

/**
 * controller for 2D track camera
 * it requires a camera component to control
 * it supports pixel perfect and lerp movement
 */
export class TrackCameraController extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    protected readonly _requiredComponents: ComponentConstructor[] = [Camera];

    private _trackTarget: GameObject|null = null;
    private readonly _targetOffset: Vector2 = new Vector2();
    private _cameraDistanceOffset = 200;
    private _pixelPerfectUnit = 1;
    private _pixelPerfect = false;
    private _lerpTrack = false;
    private _lerpAlpha = 0.1;

    protected start(): void {
        if (this._trackTarget) {
            const targetPosition = this._trackTarget.transform.getWorldPosition(this._tempVector);
            targetPosition.z += this._cameraDistanceOffset;
            if (this.gameObject.transform.parentTransform) {
                this.gameObject.transform.parentTransform.worldToLocal(targetPosition);
            }
            this.gameObject.transform.position.copy(targetPosition);
        }
    }

    private readonly _tempVector: Vector3 = new Vector3();

    public update(): void {
        const targetPosition = this._trackTarget!.transform.getWorldPosition(this._tempVector);
        targetPosition.z += this._cameraDistanceOffset;
        targetPosition.x += this._targetOffset.x;
        targetPosition.y += this._targetOffset.y;
        const transform = this.gameObject.transform;
        if (transform.parentTransform) {
            transform.parentTransform.worldToLocal(targetPosition);
        }
        if (this._lerpTrack) {
            transform.position.lerp(targetPosition, 0.1);
        } else {
            transform.position.copy(targetPosition);
        }

        if (this._pixelPerfect) {
            transform.position.x = Math.round(transform.position.x / this._pixelPerfectUnit) * this._pixelPerfectUnit;
            transform.position.y = Math.round(transform.position.y / this._pixelPerfectUnit) * this._pixelPerfectUnit;
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
     * target position offset
     */
    public get targetOffset(): Vector2 {
        return this._targetOffset;
    }

    /**
     * target position offset
     */
    public set targetOffset(value: Vector2) {
        this._targetOffset.copy(value);
    }

    /**
     * z distance from camera to target
     */
    public get cameraDistanceOffset(): number {
        return this._cameraDistanceOffset;
    }

    /**
     * z distance from camera to target
     */
    public set cameraDistanceOffset(value: number) {
        this._cameraDistanceOffset = value;
    }

    /**
     * pixel perfect unit
     */
    public get pixelPerfectUnit(): number {
        return this._pixelPerfectUnit;
    }

    /**
     * pixel perfect unit
     */
    public set pixelPerfectUnit(value: number) {
        this._pixelPerfectUnit = value;
    }

    /**
     * use pixel perfect
     */
    public get pixelPerfect(): boolean {
        return this._pixelPerfect;
    }

    /**
     * use pixel perfect
     */
    public set pixelPerfect(value: boolean) {
        this._pixelPerfect = value;
    }

    /**
     * use lerp to track
     */
    public get lerpTrack(): boolean {
        return this._lerpTrack;
    }

    /**
     * use lerp to track
     */
    public set lerpTrack(value: boolean) {
        this._lerpTrack = value;
    }

    /**
     * lerp alpha
     */
    public get lerpAlpha(): number {
        return this._lerpAlpha;
    }

    /**
     * lerp alpha
     */
    public set lerpAlpha(value: number) {
        this._lerpAlpha = value;
    }
}
