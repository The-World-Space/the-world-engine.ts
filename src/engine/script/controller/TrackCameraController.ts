import { MathUtils, Vector2, Vector3 } from "three/src/Three";

import { Component } from "../../hierarchy_object/Component";
import { ComponentConstructor } from "../../hierarchy_object/ComponentConstructor";
import { GameObject } from "../../hierarchy_object/GameObject";
import { ReadonlyVector2 } from "../../math/ReadonlyVector2";
import { WritableVector2 } from "../../math/WritableVector2";
import { Camera } from "../render/Camera";

/**
 * controller for 2D track camera
 * 
 * it requires a camera component to control
 * 
 * it supports pixel perfect and smooth damping
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
    private _smoothTrack = false;
    private _smoothLambda = 6;

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
        if (this._smoothTrack) {
            const deltaTime = this.engine.time.deltaTime;
            const smoothLambda = this._smoothLambda;
            const x = MathUtils.damp(transform.position.x, targetPosition.x, smoothLambda, deltaTime);
            const y = MathUtils.damp(transform.position.y, targetPosition.y, smoothLambda, deltaTime);
            const z = MathUtils.damp(transform.position.z, targetPosition.z, smoothLambda, deltaTime);
            transform.position.set(x, y, z);
            // transform.position.set(x, y, targetPosition.z);
            // transform.position.lerp(targetPosition, 0.1);
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
    public get targetOffset(): ReadonlyVector2 {
        return this._targetOffset;
    }

    /**
     * target position offset (default: (0, 0))
     */
    public set targetOffset(value: ReadonlyVector2) {
        (this._targetOffset as WritableVector2).copy(value);
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
     * use smooth damp to track (default: false)
     */
    public get smoothTrack(): boolean {
        return this._smoothTrack;
    }

    /**
     * use smooth damp to track (default: false)
     */
    public set smoothTrack(value: boolean) {
        this._smoothTrack = value;
    }

    /**
     * smooth damp lambda (default: 6)
     * 
     * higher value make camera movement more faster
     */
    public get smoothLambda(): number {
        return this._smoothLambda;
    }

    /**
     * smooth damp lambda (default: 6)
     * 
     * higher value make camera movement more faster
     */
    public set smoothLambda(value: number) {
        this._smoothLambda = value;
    }
}
