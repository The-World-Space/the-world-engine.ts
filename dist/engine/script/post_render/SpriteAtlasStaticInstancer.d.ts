import { Quaternion, Vector2, Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
export declare class SpriteAtlasInstance {
    private _width;
    private _height;
    private _atlasIndex;
    private _position;
    private _rotation?;
    private _scale?;
    private _centerOffset?;
    constructor(width: number, height: number, atlasIndex: number, position: Vector3, rotation?: Quaternion, scale?: Vector3, centerOffset?: Vector2);
    get width(): number;
    get height(): number;
    get atlasIndex(): number;
    get position(): Vector3;
    get rotation(): Quaternion | undefined;
    get scale(): Vector3 | undefined;
    get centerOffset(): Vector2 | undefined;
}
export declare class SpriteAtlasStaticInstancer extends Component {
    private _imageSource;
    private _useZaxisSorter;
    private _zaxisSortOffset;
    private _rowCount;
    private _columnCount;
    private _pointerEvents;
    private _initializeFunction;
    protected start(): void;
    setInstances(instances: SpriteAtlasInstance[]): void;
    setSliceCount(rowCount: number, columnCount: number): void;
    get imageSource(): string;
    set imageSource(value: string);
    get rowCount(): number;
    get columnCount(): number;
    get useZindexSorter(): boolean;
    set useZindexSorter(value: boolean);
    get zindexSortOffset(): number;
    set zindexSortOffset(value: number);
    get pointerEvents(): boolean;
    set pointerEvents(value: boolean);
}
