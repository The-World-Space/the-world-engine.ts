import { Set } from "js-sdsl";
import { SetType } from "js-sdsl/dist/esm/Set/Set";
import * as THREE from "three";
import { CameraInfo } from "./CameraInfo";
import { Color } from "./Color";

/**
 * schedule camera by priority to be rendered
 * do not drive this class
 */
export class CameraContainer {
    private _currentCameraInfo: {camera: THREE.Camera, info: CameraInfo}|null = null; 
    private _cameraInfoMap: Map<THREE.Camera, CameraInfo>;
    private _cameraQueue: SetType<{camera: THREE.Camera, info: CameraInfo}>;
    private _onChangeBackgroundColor: (color: Color) => void;

    /** @internal */
    public constructor(onChangeBackgroundColor: (color: Color) => void) {
        this._cameraInfoMap = new Map();
        this._cameraQueue = new Set(undefined, (a, b) => {
            if (a.info.priority === b.info.priority) {
                return a.camera.id - b.camera.id;
            }
            return a.info.priority - b.info.priority;
        });
        this._onChangeBackgroundColor = onChangeBackgroundColor;
    }

    /**
     * get current render camera
     */
    public get camera(): THREE.Camera|null {
        return this._currentCameraInfo?.camera ?? null;
    }

    /**
     * get current camera priority
     * @internal
     */
    public get currentCameraPriority(): number {
        return this._currentCameraInfo?.info.priority ?? Number.MIN_SAFE_INTEGER;
    }

    /**
     * add new camera to camera container
     * @param camera 
     * @param info 
     * 
     * @internal
     */
    public addCamera(camera: THREE.Camera, info: CameraInfo): void {
        this._cameraInfoMap.set(camera, info);
        this._cameraQueue.insert({camera, info});
        this.setCamera();
    }

    /**
     * remove camera from camera container
     * @param camera 
     * 
     * @internal
     */
    public removeCamera(camera: THREE.Camera): void {
        const info = this._cameraInfoMap.get(camera);
        if (!info) return;
        this._cameraQueue.eraseElementByValue({camera, info});
        this._cameraInfoMap.delete(camera);
        this.setCamera();
    }

    /**
     * change camera priority
     * @param camera 
     * @param priority 
     * 
     * @internal
     */
    public changeCameraPriority(camera: THREE.Camera, priority: number): void {
        const info = this._cameraInfoMap.get(camera);
        if (!info) return;
        this._cameraQueue.eraseElementByValue({camera, info});
        info.priority = priority;
        this._cameraQueue.insert({camera, info});
        this.setCamera();
    }

    /**
     * change camera background color
     * @param camera 
     * @param color 
     * 
     * @internal
     */
    public changeCameraBackgroundColor(camera: THREE.Camera, color: Color): void {
        const info = this._cameraInfoMap.get(camera);
        if (!info) return;
        info.backgroundColor = color;
        if (this._currentCameraInfo?.camera === camera) {
            this._onChangeBackgroundColor(color);
        }
    }
    
    private setCamera(): void {
        if (this._cameraQueue.size() === 0) {
            this._currentCameraInfo = null;
            return;
        }

        const cameraPair = this._cameraQueue.front();
        if (!cameraPair) {
            this._currentCameraInfo = null;
            return;
        }
        this._currentCameraInfo = cameraPair;
        this._onChangeBackgroundColor(this._currentCameraInfo.info.backgroundColor);
    }
}
