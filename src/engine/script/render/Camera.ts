import { Camera as ThreeCamera, PerspectiveCamera as ThreePerspectiveCamera, OrthographicCamera as ThreeOrthographicCamera } from "three";
import { Transform } from "../../../engine/hierarchy_object/Transform";
import { Component } from "../../hierarchy_object/Component";
import { CameraInfo } from "../../render/CameraInfo";
import { Color } from "../../render/Color";

export const enum CameraType {
    Perspective,
    Orthographic
}

export class Camera extends Component {
    private _camera: ThreeCamera|null = null;
    private _cameraType: CameraType = CameraType.Orthographic;
    private _fov = 75;
    private _viewSize = 5;
    private _near = 0.1;
    private _far = 1000;
    private _priority = 0;
    private _backgroudColor: Color = new Color(1, 1, 1, 0);
    private readonly _onScreenResizeBind = this.onScreenResize.bind(this);

    public onEnable(): void {
        this.engine.screen.addOnResizeEventListener(this._onScreenResizeBind);
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
                    this._camera = this.createNewOrthographicCamera();
                    this.transform.unsafeGetObject3D().add(this._camera); //it's safe because this._camera is not GameObject
                }
            }
        } else {
            throw new Error("Camera type not supported");
        }
        
        Transform.updateRawObject3DWorldMatrixRecursively(this._camera);
        this.engine.cameraContainer.addCamera(this._camera, new CameraInfo(this._priority, this._backgroudColor));
    }

    private createNewPerspectiveCamera(): ThreePerspectiveCamera {
        const aspectRatio = this.engine.screen.width / this.engine.screen.height;
        const camera = new ThreePerspectiveCamera(
            this._fov,
            aspectRatio,
            this._near,
            this._far
        );
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
        return camera;
    }

    public onDisable(): void {
        this.engine.screen.removeOnResizeEventListener(this._onScreenResizeBind);
        if (this._camera) this.engine.cameraContainer.removeCamera(this._camera);
    }

    public onDestroy(): void {
        this._camera?.removeFromParent();
    }

    private onScreenResize(width: number, height: number): void {
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
    }

    public get cameraType(): CameraType {
        return this._cameraType;
    }

    public set cameraType(value: CameraType) {
        if (this._cameraType === value) return;
        this._cameraType = value;
        if (this._camera) {
            this.createOrUpdateCamera();
        }
    }

    public get fov(): number {
        return this._fov;
    }

    public set fov(value: number) {
        if (this._fov === value) return;
        this._fov = value;
        if (this._camera instanceof ThreePerspectiveCamera) {
            this._camera.fov = value;
            this._camera.updateProjectionMatrix();
        }
    }

    public get viewSize(): number {
        return this._viewSize;
    }

    public set viewSize(value: number) {
        if (this._viewSize === value) return;
        this._viewSize = value;
        if (this._camera instanceof ThreeOrthographicCamera) {
            const aspectRatio = this.engine.screen.width / this.engine.screen.height;
            const viewSizeScalar = this._viewSize;
            this._camera.left = -viewSizeScalar * aspectRatio;
            this._camera.right = viewSizeScalar * aspectRatio;
            this._camera.top = viewSizeScalar;
            this._camera.bottom = -viewSizeScalar;
            this._camera.updateProjectionMatrix();
        }
    }

    public get near(): number {
        return this._near;
    }

    public set near(value: number) {
        if (this._near === value) return;
        this._near = value;
        if (this._camera instanceof ThreePerspectiveCamera) {
            this._camera.near = value;
            this._camera.updateProjectionMatrix();
        }
    }

    public get far(): number {
        return this._far;
    }

    public set far(value: number) {
        if (this._far === value) return;
        this._far = value;
        if (this._camera instanceof ThreePerspectiveCamera) {
            this._camera.far = value;
            this._camera.updateProjectionMatrix();
        }
    }

    public get priority(): number {
        return this._priority;
    }

    public set priority(value: number) {
        this._priority = value;
        if (this._camera) {
            this.engine.cameraContainer.changeCameraPriority(this._camera, value);
        }
    }

    public get backgroundColor(): Color {
        return this._backgroudColor;
    }

    public set backgroundColor(value: Color) {
        this._backgroudColor = value;
        if (this._camera) {
            this.engine.cameraContainer.changeCameraBackgroundColor(this._camera, value);
        }
    }
}
