import * as THREE from "three";
import { CameraInfo } from "./CameraInfo";
import { Color } from "./Color";

/**
 * schedule camera by priority to be rendered
 */
export class CameraContainer {
    private _camera: THREE.Camera|null = null;
    private _currentCameraPriority: number = Number.MIN_SAFE_INTEGER;
    private _cameraList: {camera: THREE.Camera, info: CameraInfo}[] = [];
    private _onChangeBackgroundColor: (color: Color) => void;

    public constructor(onChangeBackgroundColor: (color: Color) => void) {
        this._onChangeBackgroundColor = onChangeBackgroundColor;
    }

    /**
     * get current render camera
     */
    public get camera(): THREE.Camera|null {
        return this._camera;
    }

    /**
     * get current camera priority
     */
    public get currentCameraPriority(): number {
        return this._currentCameraPriority;
    }

    /**
     * add new camera to camera container
     * @param camera 
     * @param info 
     */
    public addCamera(camera: THREE.Camera, info: CameraInfo): void {
        this._cameraList.push({camera, info});
        this._cameraList.sort((a, b) => a.info.priority - b.info.priority);
        this.setCamera();
    }

    /**
     * remove camera from camera container
     * @param camera 
     */
    public removeCamera(camera: THREE.Camera): void {
        this._cameraList = this._cameraList.filter(c => c.camera !== camera);
        this.setCamera();
    }

    /**
     * change camera priority
     * @param camera 
     * @param priority 
     */
    public changeCameraPriority(camera: THREE.Camera, priority: number): void {
        const index = this._cameraList.findIndex(c => c.camera === camera);
        if (index !== -1) {
            this._cameraList[index].info.priority = priority;
            this._cameraList.sort((a, b) => a.info.priority - b.info.priority);
            this.setCamera();
        }
    }

    /**
     * change camera background color
     * @param camera 
     * @param color 
     */
    public changeCameraBackgroundColor(camera: THREE.Camera, color: Color): void {
        const index = this._cameraList.findIndex(c => c.camera === camera);
        if (index !== -1) {
            this._cameraList[index].info.backgroundColor = color;
        }
        if (this._camera === camera) {
            this._onChangeBackgroundColor(color);
        }
    }
    
    private setCamera(): void {
        if (this._cameraList.length === 0) {
            this._camera = null;
            return;
        }

        const camera = this._cameraList[0].camera;
        this._camera = camera;
        this._currentCameraPriority = this._cameraList[0].info.priority;
        this._onChangeBackgroundColor(this._cameraList[0].info.backgroundColor);
    }
}
