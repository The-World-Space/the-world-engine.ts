import * as THREE from "three";
import { CameraInfo } from "./CameraInfo";
import { Color } from "./Color";
/**
 * schedule camera by priority to be rendered
 */
export declare class CameraContainer {
    private _camera;
    private _currentCameraPriority;
    private _cameraList;
    private _onChangeBackgroundColor;
    constructor(onChangeBackgroundColor: (color: Color) => void);
    /**
     * get current render camera
     */
    get camera(): THREE.Camera | null;
    /**
     * get current camera priority
     */
    get currentCameraPriority(): number;
    /**
     * add new camera to camera container
     * @param camera
     * @param info
     */
    addCamera(camera: THREE.Camera, info: CameraInfo): void;
    /**
     * remove camera from camera container
     * @param camera
     */
    removeCamera(camera: THREE.Camera): void;
    /**
     * change camera priority
     * @param camera
     * @param priority
     */
    changeCameraPriority(camera: THREE.Camera, priority: number): void;
    /**
     * change camera background color
     * @param camera
     * @param color
     */
    changeCameraBackgroundColor(camera: THREE.Camera, color: Color): void;
    private setCamera;
}
