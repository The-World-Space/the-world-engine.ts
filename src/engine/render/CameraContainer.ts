import OrderedSet from "js-sdsl/dist/esm/container/TreeContainer/OrderedSet";

import { EventContainer, IEventContainer } from "../collection/EventContainer";
import { Camera } from "../script/render/Camera";
import { CameraInfo } from "./CameraInfo";
import { ReadonlyColor } from "./ReadonlyColor";

/**
 * The container that has the camera currently in use for rendering.
 * 
 * you can use Unsafe API by casting this to `CameraContainer`
 */
export interface IReadonlyCameraContainer {
    /**
     * get current render camera
     */
    get camera(): Camera|null;
}

/**
 * schedule camera by priority to be rendered
 * do not drive this class
 */
export class CameraContainer {
    private _currentCameraInfo: {camera: Camera, info: CameraInfo}|null = null; 
    private readonly _cameraInfoMap: Map<Camera, CameraInfo>;
    private readonly _cameraQueue: OrderedSet<{camera: Camera, info: CameraInfo}>;
    private readonly _onChangeBackgroundColor: (color: ReadonlyColor) => void;
    private readonly _onCameraChangedEvent: EventContainer<(camera: Camera) => void>;

    /** @internal */
    public constructor(onChangeBackgroundColor: (color: ReadonlyColor) => void) {
        this._cameraInfoMap = new Map();
        this._cameraQueue = new OrderedSet(undefined, (a, b) => {
            if (a.info.priority === b.info.priority) {
                return a.camera.instanceId - b.camera.instanceId;
            }
            return b.info.priority - a.info.priority;
        });
        this._onChangeBackgroundColor = onChangeBackgroundColor;
        this._onCameraChangedEvent = new EventContainer();
    }

    /**
     * get current render camera
     */
    public get camera(): Camera|null {
        return this._currentCameraInfo?.camera ?? null;
    }

    /**
     * get current camera priority
     * 
     * This is the API used to make wrapper of three.js Camera
     * There is no use unless you use raw three.js objects that are not managed by the engine
     */
    public get currentCameraPriority(): number {
        return this._currentCameraInfo?.info.priority ?? Number.MIN_SAFE_INTEGER;
    }

    /**
     * add new camera to camera container
     * @param camera 
     * @param info 
     * 
     * This is the API used to make wrapper of three.js Camera
     * There is no use unless you use raw three.js objects that are not managed by the engine
     */
    public addCamera(camera: Camera, info: CameraInfo): void {
        this._cameraInfoMap.set(camera, info);
        this._cameraQueue.insert({camera, info});
        this.setCamera();
    }

    /**
     * remove camera from camera container
     * @param camera 
     * 
     * This is the API used to make wrapper of three.js Camera
     * There is no use unless you use raw three.js objects that are not managed by the engine
     */
    public removeCamera(camera: Camera): void {
        const info = this._cameraInfoMap.get(camera);
        if (!info) return;
        this._cameraQueue.eraseElementByKey({camera, info});
        this._cameraInfoMap.delete(camera);
        this.setCamera();
    }

    /**
     * change camera priority
     * @param camera 
     * @param priority 
     * 
     * This is the API used to make wrapper of three.js Camera
     * There is no use unless you use raw three.js objects that are not managed by the engine
     */
    public changeCameraPriority(camera: Camera, priority: number): void {
        const info = this._cameraInfoMap.get(camera);
        if (!info) return;
        this._cameraQueue.eraseElementByKey({camera, info});
        info.priority = priority;
        this._cameraQueue.insert({camera, info});
        this.setCamera();
    }

    /**
     * change camera background color
     * @param camera 
     * @param color 
     * 
     * This is the API used to make wrapper of three.js Camera
     * There is no use unless you use raw three.js objects that are not managed by the engine
     */
    public changeCameraBackgroundColor(camera: Camera, color: ReadonlyColor): void {
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
        if (this._currentCameraInfo?.camera === cameraPair.camera) return;
        this._currentCameraInfo = cameraPair;
        this._onChangeBackgroundColor(this._currentCameraInfo.info.backgroundColor);
        this._onCameraChangedEvent.invoke(this._currentCameraInfo.camera);
    }

    public get onCameraChanged(): IEventContainer<(camera: Camera) => void> {
        return this._onCameraChangedEvent;
    }
}
