import { Camera as ThreeCamera, OrthographicCamera as ThreeOrthographicCamera, PerspectiveCamera as ThreePerspectiveCamera } from "three/src/Three";

import { Transform } from "../../../engine/hierarchy_object/Transform";
import { Component } from "../../hierarchy_object/Component";
import { CameraContainer } from "../../render/CameraContainer";
import { CameraInfo } from "../../render/CameraInfo";
import { Color } from "../../render/Color";
import { ReadonlyColor } from "../../render/ReadonlyColor";

type PerspectiveOrOrthographicCamera = ThreePerspectiveCamera|ThreeOrthographicCamera;

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
    private _backgroundColor: null|Color|THREE.Texture = null;
    private _cameraContainer: CameraContainer|null = null;

    private readonly onScreenResize = (width: number, height: number): void => {
        const aspectRatio = width / height;
        if (this._camera instanceof ThreePerspectiveCamera) {
            this._camera.aspect = aspectRatio;
            this._camera.updateProjectionMatrix();
        } else if (this._camera instanceof ThreeOrthographicCamera) {
            const viewSizeScalar = this._viewSize;
            this._camera.left = -viewSizeScalar * aspectRatio;
            this._camera.right = viewSizeScalar * aspectRatio;
            this._camera.top = viewSizeScalar;
            this._camera.bottom = -viewSizeScalar;
            this._camera.updateProjectionMatrix();
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
                    this._camera.updateProjectionMatrix();
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
                    this._camera.updateProjectionMatrix();
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
        this._cameraContainer!.addCamera(this, new CameraInfo(this._priority, this._backgroundColor));
    }

    private createNewPerspectiveCamera(): ThreePerspectiveCamera {
        const aspectRatio = this.engine.screen.width / this.engine.screen.height;
        const camera = new ThreePerspectiveCamera(
            this._fov,
            aspectRatio,
            this._near,
            this._far
        );
        if (this._zoom !== 1) {
            camera.zoom = this._zoom;
            camera.updateProjectionMatrix();
        }
        return camera;
    }

    private createNewOrthographicCamera(): ThreeOrthographicCamera {
        const aspectRatio = this.engine.screen.width / this.engine.screen.height;
        const viewSizeScalar = this._viewSize;
        const camera = new ThreeOrthographicCamera(
            -viewSizeScalar * aspectRatio,
            viewSizeScalar * aspectRatio,
            viewSizeScalar,
            -viewSizeScalar,
            this._near,
            this._far
        );
        if (this._zoom !== 1) {
            camera.zoom = this._zoom;
            camera.updateProjectionMatrix();
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
            this._camera.updateProjectionMatrix();
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
            this._camera.updateProjectionMatrix();
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
            camera.updateProjectionMatrix();
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
            camera.updateProjectionMatrix();
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
            camera.updateProjectionMatrix();
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
     * background color of the camera (default: null)
     *
     * This color will fill the empty space of the scene
     *
     * When used with WebGLRenderer, you can specify a texture background. And in the case of color, the alpha channel is ignored
     */
    public get backgroundColor(): null|ReadonlyColor|THREE.Texture {
        return this._backgroundColor;
    }

    /**
     * background color of the camera (default: null)
     *
     * This color will fill the empty space of the scene
     *
     * When used with WebGLRenderer, you can specify a texture background. And in the case of color, the alpha channel is ignored
     */
    public set backgroundColor(value: null|ReadonlyColor|THREE.Texture) {
        if (value === null) {
            this._backgroundColor = null;
        } else if (value instanceof Color) {
            if (this._backgroundColor instanceof Color) {
                this._backgroundColor.copy(value);
            } else {
                this._backgroundColor = value.clone();
            }
        } else {
            this._backgroundColor = value as THREE.Texture;
        }

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
