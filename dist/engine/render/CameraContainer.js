/**
 * schedule camera by priority to be rendered
 */
export class CameraContainer {
    constructor(onChangeBackgroundColor) {
        this._camera = null;
        this._currentCameraPriority = Number.MIN_SAFE_INTEGER;
        this._cameraList = [];
        this._onChangeBackgroundColor = onChangeBackgroundColor;
    }
    /**
     * get current render camera
     */
    get camera() {
        return this._camera;
    }
    /**
     * get current camera priority
     */
    get currentCameraPriority() {
        return this._currentCameraPriority;
    }
    /**
     * add new camera to camera container
     * @param camera
     * @param info
     */
    addCamera(camera, info) {
        this._cameraList.push({ camera, info });
        this._cameraList.sort((a, b) => a.info.priority - b.info.priority);
        this.setCamera();
    }
    /**
     * remove camera from camera container
     * @param camera
     */
    removeCamera(camera) {
        this._cameraList = this._cameraList.filter(c => c.camera !== camera);
        this.setCamera();
    }
    /**
     * change camera priority
     * @param camera
     * @param priority
     */
    changeCameraPriority(camera, priority) {
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
    changeCameraBackgroundColor(camera, color) {
        const index = this._cameraList.findIndex(c => c.camera === camera);
        if (index !== -1) {
            this._cameraList[index].info.backgroundColor = color;
        }
        if (this._camera === camera) {
            this._onChangeBackgroundColor(color);
        }
    }
    setCamera() {
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
