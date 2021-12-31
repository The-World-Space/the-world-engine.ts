import { Vector2, Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { Camera } from "../render/Camera";
export class TrackCameraController extends Component {
    constructor() {
        super(...arguments);
        this._disallowMultipleComponent = true;
        this._requiredComponents = [Camera];
        this._trackTarget = null;
        this._targetOffset = new Vector2();
        this._cameraDistanceOffset = 200;
        this._pixelPerfectUnit = 1;
        this._pixelPerfect = false;
        this._lerpTrack = false;
        this._lerpAlpha = 0.1;
        this._tempVector = new Vector3();
    }
    start() {
        if (this._trackTarget) {
            const targetPosition = this._trackTarget.transform.getWorldPosition(this._tempVector);
            targetPosition.z += this._cameraDistanceOffset;
            if (this.gameObject.transform.parentTransform) {
                this.gameObject.transform.parentTransform.worldToLocal(targetPosition);
            }
            this.gameObject.transform.position.copy(targetPosition);
        }
    }
    update() {
        const targetPosition = this._trackTarget.transform.getWorldPosition(this._tempVector);
        targetPosition.z += this._cameraDistanceOffset;
        targetPosition.x += this._targetOffset.x;
        targetPosition.y += this._targetOffset.y;
        const transform = this.gameObject.transform;
        if (transform.parentTransform) {
            transform.parentTransform.worldToLocal(targetPosition);
        }
        if (this._lerpTrack) {
            transform.position.lerp(targetPosition, 0.1);
        }
        else {
            transform.position.copy(targetPosition);
        }
        if (this._pixelPerfect) {
            transform.position.x = Math.round(transform.position.x / this._pixelPerfectUnit) * this._pixelPerfectUnit;
            transform.position.y = Math.round(transform.position.y / this._pixelPerfectUnit) * this._pixelPerfectUnit;
        }
    }
    setTrackTarget(target) {
        this._trackTarget = target;
    }
    get targetOffset() {
        return this._targetOffset;
    }
    set targetOffset(value) {
        this._targetOffset.copy(value);
    }
    get cameraDistanceOffset() {
        return this._cameraDistanceOffset;
    }
    set cameraDistanceOffset(value) {
        this._cameraDistanceOffset = value;
    }
    get pixelPerfectUnit() {
        return this._pixelPerfectUnit;
    }
    set pixelPerfectUnit(value) {
        this._pixelPerfectUnit = value;
    }
    get pixelPerfect() {
        return this._pixelPerfect;
    }
    set pixelPerfect(value) {
        this._pixelPerfect = value;
    }
    get lerpTrack() {
        return this._lerpTrack;
    }
    set lerpTrack(value) {
        this._lerpTrack = value;
    }
    get lerpAlpha() {
        return this._lerpAlpha;
    }
    set lerpAlpha(value) {
        this._lerpAlpha = value;
    }
}
