import { Component } from "../../hierarchy_object/Component";
import { Color } from "../../render/Color";
export declare enum CameraType {
    Perspective = 0,
    Orthographic = 1
}
export declare class Camera extends Component {
    private _camera;
    private _cameraType;
    private _fov;
    private _viewSize;
    private _near;
    private _far;
    private _priority;
    private _backgroudColor;
    private readonly _onScreenResizeBind;
    onEnable(): void;
    private createOrUpdateCamera;
    private createNewPerspectiveCamera;
    private createNewOrthographicCamera;
    onDisable(): void;
    onDestroy(): void;
    private onScreenResize;
    get cameraType(): CameraType;
    set cameraType(value: CameraType);
    get fov(): number;
    set fov(value: number);
    get viewSize(): number;
    set viewSize(value: number);
    get near(): number;
    set near(value: number);
    get far(): number;
    set far(value: number);
    get priority(): number;
    set priority(value: number);
    get backgroundColor(): Color;
    set backgroundColor(value: Color);
}
