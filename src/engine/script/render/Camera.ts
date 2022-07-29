import { Camera as ThreeCamera, OrthographicCamera as ThreeOrthographicCamera, PerspectiveCamera as ThreePerspectiveCamera } from "three/src/Three";

import { Transform } from "../../../engine/hierarchy_object/Transform";
import { Component } from "../../hierarchy_object/Component";
import { CameraContainer } from "../../render/CameraContainer";
import { CameraInfo } from "../../render/CameraInfo";
import { Color } from "../../render/Color";
import { ReadonlyColor } from "../../render/ReadonlyColor";

type PerspectiveOrOrthographicCamera = ThreePerspectiveCamera|ThreeOrthographicCamera;

type OverridedCamera = PerspectiveCameraOverrided|OrthographicCameraOverrided;

class PerspectiveCameraOverrided extends ThreePerspectiveCamera {
    public override updateProjectionMatrix(): void {
        Transform.updateRawObject3DWorldMatrixRecursively(this);
        this.matrixWorldInverse.copy(this.matrixWorld).invert();
        super.updateProjectionMatrix();
    }

    public originalUpdateProjectionMatrix(): void {
        super.updateProjectionMatrix();
    }
}

class OrthographicCameraOverrided extends ThreeOrthographicCamera {
    public override updateProjectionMatrix(): void {
        Transform.updateRawObject3DWorldMatrixRecursively(this);
        this.matrixWorldInverse.copy(this.matrixWorld).invert();
        super.updateProjectionMatrix();
    }

    public originalUpdateProjectionMatrix(): void {
        super.updateProjectionMatrix();
    }
}

/**
 * caamera projection type
 */
export enum CameraType {
    Perspective,
    Orthographic
}

/**
 * camera component
 * 
 * it's a wrapper for `THREE.Camera`
 * 
 * At least one camera component must exist in the scene
 */
export class Camera extends Component {
    private _camera: ThreeCamera|null = null;
    private _cameraType: CameraType = CameraType.Orthographic;
    private _fov = 75;
    private _viewSize = 5;
    private _zoom = 1;
    private _near = 0.1;
    private _far = 1000;
    private _priority = 0;
    private readonly _backgroudColor: Color = new Color(1, 1, 1, 0);
    private _cameraContainer: CameraContainer|null = null;

    private readonly onScreenResize = (width: number, height: number): void => {
        const aspectRatio = width / height;
        if (this._camera instanceof ThreePerspectiveCamera) {
            this._camera.aspect = aspectRatio;
            (this._camera as OverridedCamera).originalUpdateProjectionMatrix();
        } else if (this._camera instanceof ThreeOrthographicCamera) {
            const viewSizeScalar = this._viewSize;
            this._camera.left = -viewSizeScalar * aspectRatio;
            this._camera.right = viewSizeScalar * aspectRatio;
            this._camera.top = viewSizeScalar;
            this._camera.bottom = -viewSizeScalar;
            (this._camera as OverridedCamera).originalUpdateProjectionMatrix();
        }
    };

    public awake(): void {
        this._cameraContainer = this.engine.cameraContainer as CameraContainer;
    }

    public onEnable(): void {
        this.engine.screen.onResize.addListener(this.onScreenResize);
        this.createOrUpdateCamera();
    }

    public onWorldMatrixUpdated(): void {
        if (this._camera) {
            Transform.updateRawObject3DWorldMatrixRecursively(this._camera);
            this._camera.matrixWorldInverse.copy(this._camera.matrixWorld).invert();
        }
    }

    private createOrUpdateCamera(): void {
        const aspectRatio = this.engine.screen.width / this.engine.screen.height;

        if (this._cameraType === CameraType.Perspective) {
            if (!this._camera) {
                this._camera = this.createNewPerspectiveCamera();
                this.transform.unsafeGetObject3D().add(this._camera); //it's safe because this._camera is not GameObject
            } else {
                if (this._camera instanceof ThreePerspectiveCamera) {
                    this._camera.aspect = aspectRatio;
                    this._camera.fov = this._fov;
                    this._camera.near = this._near;
                    this._camera.far = this._far;
                    (this._camera as OverridedCamera).originalUpdateProjectionMatrix();
                } else {
                    this._camera.removeFromParent();
                    Camera.removeCameraFromDuckPool(this._camera);
                    this._camera = this.createNewPerspectiveCamera();
                    this.transform.unsafeGetObject3D().add(this._camera); //it's safe because this._camera is not GameObject
                }
            }
        } else if (this._cameraType === CameraType.Orthographic) {
            if (!this._camera) {
                this._camera = this.createNewOrthographicCamera();
                this.transform.unsafeGetObject3D().add(this._camera); //it's safe because this._camera is not GameObject
            } else {
                if (this._camera instanceof ThreeOrthographicCamera) {
                    const viewSizeScalar = this._viewSize;
                    this._camera.left = -viewSizeScalar * aspectRatio;
                    this._camera.right = viewSizeScalar * aspectRatio;
                    this._camera.top = viewSizeScalar;
                    this._camera.bottom = -viewSizeScalar;
                    this._camera.near = this._near;
                    this._camera.far = this._far;
                    (this._camera as OverridedCamera).originalUpdateProjectionMatrix();
                } else {
                    this._camera.removeFromParent();
                    Camera.removeCameraFromDuckPool(this._camera);
                    this._camera = this.createNewOrthographicCamera();
                    this.transform.unsafeGetObject3D().add(this._camera); //it's safe because this._camera is not GameObject
                }
            }
        } else {
            throw new Error("Camera type not supported");
        }
        
        Transform.updateRawObject3DWorldMatrixRecursively(this._camera);
        this._cameraContainer!.addCamera(this, new CameraInfo(this._priority, this._backgroudColor));
    }

    private createNewPerspectiveCamera(): ThreePerspectiveCamera {
        const aspectRatio = this.engine.screen.width / this.engine.screen.height;
        const camera = new PerspectiveCameraOverrided(
            this._fov,
            aspectRatio,
            this._near,
            this._far
        );
        if (this._zoom !== 1) {
            camera.zoom = this._zoom;
            (this._camera as OverridedCamera).originalUpdateProjectionMatrix();
        }
        return camera;
    }

    private createNewOrthographicCamera(): ThreeOrthographicCamera {
        const aspectRatio = this.engine.screen.width / this.engine.screen.height;
        const viewSizeScalar = this._viewSize;
        const camera = new OrthographicCameraOverrided(
            -viewSizeScalar * aspectRatio,
            viewSizeScalar * aspectRatio,
            viewSizeScalar,
            -viewSizeScalar,
            this._near,
            this._far
        );
        if (this._zoom !== 1) {
            camera.zoom = this._zoom;
            (this._camera as OverridedCamera).originalUpdateProjectionMatrix();
        }
        return camera;
    }

    public onDisable(): void {
        this.engine.screen.onResize.removeListener(this.onScreenResize);
        if (this._camera) {
            this._cameraContainer!.removeCamera(this);
        }
    }

    public onDestroy(): void {
        if (this._camera) {
            this._camera.removeFromParent();
            Camera.removeCameraFromDuckPool(this._camera);
        }
    }

    /**
     * camera projection type (default: `CameraType.Orthographic`)
     * 
     * perspective: Camera will render objects with perspective intact
     * 
     * orthographic: Camera will render objects uniformly, with no sense of perspective
     */
    public get cameraType(): CameraType {
        return this._cameraType;
    }

    /**
     * camera projection type (default: `CameraType.Orthographic`)
     * 
     * perspective: Camera will render objects with perspective intact
     * 
     * orthographic: Camera will render objects uniformly, with no sense of perspective
     */
    public set cameraType(value: CameraType) {
        if (this._cameraType === value) return;
        this._cameraType = value;
        if (this._camera) {
            this.createOrUpdateCamera();
        }
    }

    /**
     * field of view (default: 75)
     * 
     * only available when cameraType is Perspective
     */
    public get fov(): number {
        if (this._camera instanceof ThreePerspectiveCamera) {
            return this._fov = this._camera.fov;
        }
        return this._fov;
    }

    /**
     * field of view (default: 75)
     * 
     * only available when cameraType is Perspective
     */
    public set fov(value: number) {
        if (this._camera instanceof ThreePerspectiveCamera) {
            if (this._camera.fov === value) return;

            this._fov = this._camera.fov = value;
            (this._camera as OverridedCamera).originalUpdateProjectionMatrix();
        } else {
            this._fov = value;
        }
    }

    /**
     * view size (default: 5)
     * 
     * only available when cameraType is Orthographic
     */
    public get viewSize(): number {
        if (this._camera instanceof ThreeOrthographicCamera) {
            return this._viewSize = this._camera.top;
        }
        return this._viewSize;
    }

    /**
     * view size (default: 5)
     * 
     * only available when cameraType is Orthographic
     */
    public set viewSize(value: number) {
        if (this._camera instanceof ThreeOrthographicCamera) {
            if (this._camera.top === value) return;

            this._viewSize = value;
            const aspectRatio = this.engine.screen.width / this.engine.screen.height;
            const viewSizeScalar = this._viewSize;
            this._camera.left = -viewSizeScalar * aspectRatio;
            this._camera.right = viewSizeScalar * aspectRatio;
            this._camera.top = viewSizeScalar;
            this._camera.bottom = -viewSizeScalar;
            (this._camera as OverridedCamera).originalUpdateProjectionMatrix();
        } else {
            this._viewSize = value;
        }
    }

    /**
     * zoom (default: 1)
     */
    public get zoom(): number {
        if (this._camera) {
            return this._zoom = (this._camera as PerspectiveOrOrthographicCamera).zoom;
        }

        return this._zoom;
    }

    /**
     * zoom (default: 1)
     */
    public set zoom(value: number) {
        const camera = this._camera as PerspectiveOrOrthographicCamera;
        if (camera) {
            if (camera.zoom === value) return;

            this._zoom = camera.zoom = value;
            (this._camera as OverridedCamera).originalUpdateProjectionMatrix();
        } else {
            this._zoom = value;
        }
    }

    /**
     * near clipping plane (default: 0.1)
     * 
     * this property is not available when using CssRenderer because css does not support frustum culling
     */
    public get near(): number {
        if (this._camera) {
            return this._near = (this._camera as PerspectiveOrOrthographicCamera).near;
        }

        return this._near;
    }
    
    /**
     * near clipping plane (default: 0.1)
     * 
     * this property is not available when using CssRenderer because css does not support frustum culling
     */
    public set near(value: number) {
        const camera = this._camera as PerspectiveOrOrthographicCamera;
        if (camera) {
            if (camera.near === value) return;

            this._near = camera.near = value;
            (this._camera as OverridedCamera).originalUpdateProjectionMatrix();
        } else {
            this._near = value;
        }
    }

    /**
     * far clipping plane (default: 1000)
     * 
     * this property is not available when using CssRenderer because css does not support frustum culling
     */
    public get far(): number {
        if (this._camera) {
            return this._far = (this._camera as PerspectiveOrOrthographicCamera).far;
        }

        return this._far;
    }

    /**
     * far clipping plane (default: 1000)
     * 
     * this property is not available when using CssRenderer because css does not support frustum culling
     */
    public set far(value: number) {
        const camera = this._camera as PerspectiveOrOrthographicCamera;
        if (camera) {
            if (camera.far === value) return;

            this._far = camera.far = value;
            (this._camera as OverridedCamera).originalUpdateProjectionMatrix();
        } else {
            this._far = value;
        }
    }

    /**
     * priority of the camera (default: 0)
     * 
     * If there are multiple cameras in the scene, higher priority cameras will be rendered
     */
    public get priority(): number {
        return this._priority;
    }

    /**
     * priority of the camera (default: 0)
     * 
     * If there are multiple cameras in the scene, higher priority cameras will be rendered
     */
    public set priority(value: number) {
        this._priority = value;
        if (this._camera) {
            this._cameraContainer!.changeCameraPriority(this, value);
        }
    }

    /**
     * background color of the camera (default: white)
     * 
     * This color will fill the empty space of the scene
     */
    public get backgroundColor(): ReadonlyColor {
        return this._backgroudColor;
    }

    /**
     * background color of the camera (default: white)
     * 
     * This color will fill the empty space of the scene
     */
    public set backgroundColor(value: ReadonlyColor) {
        this._backgroudColor.copy(value);
        if (this._camera) {
            this._cameraContainer!.changeCameraBackgroundColor(this, value);
        }
    }

    /** @internal */
    public get threeCamera(): ThreeCamera|null {
        return this._camera;
    }

    /** @internal */
    public static removeCameraFromDuckPool(_camera: ThreeCamera): void {
        // this method will be injected by DuckThreeCamera
    }
}
