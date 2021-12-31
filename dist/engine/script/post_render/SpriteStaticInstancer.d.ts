import { Quaternion, Vector2, Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
export declare class SpriteInstance {
    private _width;
    private _height;
    private _position;
    private _rotation?;
    private _scale?;
    private _centerOffset?;
    constructor(width: number, height: number, position: Vector3, rotation?: Quaternion, scale?: Vector3, centerOffset?: Vector2);
    get width(): number;
    get height(): number;
    get position(): Vector3;
    get rotation(): Quaternion | undefined;
    get scale(): Vector3 | undefined;
    get centerOffset(): Vector2 | undefined;
}
export declare class SpriteStaticInstancer extends Component {
    private _imageSource;
    private _useZaxisSorter;
    private _zaxisSortOffset;
    private _pointerEvents;
    private _initializeFunction;
    protected start(): void;
    setInstances(instances: SpriteInstance[]): void;
    get imageSource(): string;
    set imageSource(value: string);
    get useZindexSorter(): boolean;
    set useZindexSorter(value: boolean);
    get zindexSortOffset(): number;
    set zindexSortOffset(value: number);
    get pointerEvents(): boolean;
    set pointerEvents(value: boolean);
}
