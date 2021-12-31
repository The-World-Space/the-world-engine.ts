import * as THREE from "three";
import { Component } from "../../hierarchy_object/Component";
import { CameraInfo } from "../../render/CameraInfo";
import { Color } from "../../render/Color";
export var CameraType;
(function (CameraType) {
    CameraType[CameraType["Perspective"] = 0] = "Perspective";
    CameraType[CameraType["Orthographic"] = 1] = "Orthographic";
})(CameraType || (CameraType = {}));
export class Camera extends Component {
    constructor() {
        super(...arguments);
        this._camera = null;
        this._cameraType = CameraType.Orthographic;
        this._fov = 75;
        this._viewSize = 300;
        this._near = 0.1;
        this._far = 1000;
        this._priority = 0;
        this._backgroudColor = new Color(1, 1, 1, 0);
        this._onScreenResizeBind = this.onScreenResize.bind(this);
    }
    onEnable() {
        this.engine.screen.addOnResizeEventListener(this._onScreenResizeBind);
        this.createOrUpdateCamera();
    }
    createOrUpdateCamera() {
        const aspectRatio = this.engine.screen.width / this.engine.screen.height;
        if (this._cameraType === CameraType.Perspective) {
            if (!this._camera) {
                this._camera = this.createNewPerspectiveCamera();
                this.gameObject.unsafeGetTransform().add(this._camera); //it"s safe because this._camera is not GameObject
            }
            else {
                if (this._camera instanceof THREE.PerspectiveCamera) {
                    this._camera.aspect = aspectRatio;
                    this._camera.fov = this._fov;
                    this._camera.near = this._near;
                    this._camera.far = this._far;
                    this._camera.updateProjectionMatrix();
                }
                else {
                    this._camera.removeFromParent();
                    this._camera = this.createNewPerspectiveCamera();
                    this.gameObject.unsafeGetTransform().add(this._camera); //it"s safe because this._camera is not GameObject
                }
            }
        }
        else if (this._cameraType === CameraType.Orthographic) {
            if (!this._camera) {
                this._camera = this.createNewOrthographicCamera();
                this.gameObject.unsafeGetTransform().add(this._camera); //it"s safe because this._camera is not GameObject
            }
            else {
                if (this._camera instanceof THREE.OrthographicCamera) {
                    const viewSizeScalar = this._viewSize * 0.5;
                    this._camera.left = -viewSizeScalar * aspectRatio;
                    this._camera.right = viewSizeScalar * aspectRatio;
                    this._camera.top = viewSizeScalar;
                    this._camera.bottom = -viewSizeScalar;
                    this._camera.near = this._near;
                    this._camera.far = this._far;
                    this._camera.updateProjectionMatrix();
                }
                else {
                    this._camera.removeFromParent();
                    this._camera = this.createNewOrthographicCamera();
                    this.gameObject.unsafeGetTransform().add(this._camera); //it"s safe because this._camera is not GameObject
                }
            }
        }
        else {
            throw new Error("Camera type not supported");
        }
        this.engine.cameraContainer.addCamera(this._camera, new CameraInfo(this._priority, this._backgroudColor));
    }
    createNewPerspectiveCamera() {
        const aspectRatio = this.engine.screen.width / this.engine.screen.height;
        const camera = new THREE.PerspectiveCamera(this._fov, aspectRatio, this._near, this._far);
        return camera;
    }
    createNewOrthographicCamera() {
        const aspectRatio = this.engine.screen.width / this.engine.screen.height;
        const viewSizeScalar = this._viewSize * 0.5;
        const camera = new THREE.OrthographicCamera(-viewSizeScalar * aspectRatio, viewSizeScalar * aspectRatio, viewSizeScalar, -viewSizeScalar, this._near, this._far);
        return camera;
    }
    onDisable() {
        this.engine.screen.removeOnResizeEventListener(this._onScreenResizeBind);
        if (this._camera)
            this.engine.cameraContainer.removeCamera(this._camera);
    }
    onDestroy() {
        var _a;
        (_a = this._camera) === null || _a === void 0 ? void 0 : _a.removeFromParent();
    }
    onScreenResize(width, height) {
        const aspectRatio = width / height;
        if (this._camera instanceof THREE.PerspectiveCamera) {
            this._camera.aspect = aspectRatio;
            this._camera.updateProjectionMatrix();
        }
        else if (this._camera instanceof THREE.OrthographicCamera) {
            const viewSizeScalar = this._viewSize * 0.5;
            this._camera.left = -viewSizeScalar * aspectRatio;
            this._camera.right = viewSizeScalar * aspectRatio;
            this._camera.top = viewSizeScalar;
            this._camera.bottom = -viewSizeScalar;
            this._camera.updateProjectionMatrix();
        }
    }
    get cameraType() {
        return this._cameraType;
    }
    set cameraType(value) {
        if (this._cameraType === value)
            return;
        this._cameraType = value;
        if (this._camera) {
            this.createOrUpdateCamera();
        }
    }
    get fov() {
        return this._fov;
    }
    set fov(value) {
        if (this._fov === value)
            return;
        this._fov = value;
        if (this._camera instanceof THREE.PerspectiveCamera) {
            this._camera.fov = value;
            this._camera.updateProjectionMatrix();
        }
    }
    get viewSize() {
        return this._viewSize;
    }
    set viewSize(value) {
        if (this._viewSize === value)
            return;
        this._viewSize = value;
        if (this._camera instanceof THREE.OrthographicCamera) {
            const aspectRatio = this.engine.screen.width / this.engine.screen.height;
            const viewSizeScalar = this._viewSize * 0.5;
            this._camera.left = -viewSizeScalar * aspectRatio;
            this._camera.right = viewSizeScalar * aspectRatio;
            this._camera.top = viewSizeScalar;
            this._camera.bottom = -viewSizeScalar;
            this._camera.updateProjectionMatrix();
        }
    }
    get near() {
        return this._near;
    }
    set near(value) {
        if (this._near === value)
            return;
        this._near = value;
        if (this._camera instanceof THREE.PerspectiveCamera) {
            this._camera.near = value;
            this._camera.updateProjectionMatrix();
        }
    }
    get far() {
        return this._far;
    }
    set far(value) {
        if (this._far === value)
            return;
        this._far = value;
        if (this._camera instanceof THREE.PerspectiveCamera) {
            this._camera.far = value;
            this._camera.updateProjectionMatrix();
        }
    }
    get priority() {
        return this._priority;
    }
    set priority(value) {
        this._priority = value;
        if (this._camera) {
            this.engine.cameraContainer.changeCameraPriority(this._camera, value);
        }
    }
    get backgroundColor() {
        return this._backgroudColor;
    }
    set backgroundColor(value) {
        this._backgroudColor = value;
        if (this._camera) {
            this.engine.cameraContainer.changeCameraBackgroundColor(this._camera, value);
        }
    }
}
