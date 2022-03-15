import { Quaternion, Vector2, Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { CssSpriteAtlasRenderer } from "../render/CssSpriteAtlasRenderer";
import { ZaxisInitializer } from "../render/ZaxisInitializer";
import { ZaxisSorter } from "../render/ZaxisSorter";
import { GlobalConfig } from "../../../GlobalConfig";
import { ReadonlyVector3 } from "../../math/ReadonlyVector3";
import { ReadonlyQuaternion } from "../../math/ReadonlyQuaternion";
import { ReadonlyVector2 } from "../../math/ReadonlyVector2";

export class SpriteAtlasInstance {
    private _width: number;
    private _height: number;
    private _atlasIndex: number;
    private _position: Vector3;
    private _rotation?: Quaternion;
    private _scale?: Vector3;
    private _centerOffset?: Vector2;

    public constructor(
        width: number,
        height: number,
        atlasIndex: number,
        position: Vector3, 
        rotation?: Quaternion,
        scale?: Vector3,
        centerOffset?: Vector2
    ) {
        this._width = width;
        this._height = height;
        this._atlasIndex = atlasIndex;
        this._position = position;
        this._rotation = rotation;
        this._scale = scale;
        this._centerOffset = centerOffset;
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }
    
    public get atlasIndex(): number {
        return this._atlasIndex;
    }

    public get position(): ReadonlyVector3 {
        return this._position;
    }

    public get rotation(): ReadonlyQuaternion|undefined {
        return this._rotation;
    }

    public get scale(): ReadonlyVector3|undefined {
        return this._scale;
    }

    public get centerOffset(): ReadonlyVector2|undefined {
        return this._centerOffset;
    }
}

export class SpriteAtlasStaticInstancer extends Component {
    private _imageSource: string = GlobalConfig.defaultSpriteSrc;
    private _useZaxisSorter = false;
    private _zaxisSortOffset = 0;
    private _rowCount = 1;
    private _columnCount = 1;
    private _pointerEvents = true;

    private _initializeFunction: (() => void)|null = null;
    private _started = false;

    public start(): void {
        this._started = true;
        this._initializeFunction?.call(this);
    }

    public setInstances(instances: SpriteAtlasInstance[]) {
        if (!this._started) {
            this._initializeFunction = () => this.setInstances(instances);
            return;
        }

        const instantlater = this.engine.instantiater;
        for (let i = 0; i < instances.length; i++) {
            const instance = instances[i];

            const spriteBuilder = instantlater.buildGameObject(
                this.gameObject.name + "_instance_" + i,
                instance.position,
                instance.rotation,
                instance.scale)
                .withComponent(CssSpriteAtlasRenderer, c => {
                    c.imageWidth = instance.width;
                    c.imageHeight = instance.height;
                    c.imageIndex = instance.atlasIndex;
                    c.asyncSetImage(this._imageSource, this._rowCount, this._columnCount);
                    c.pointerEvents = this._pointerEvents;
                    if (instance.centerOffset) c.centerOffset = instance.centerOffset;
                });
            
            if (this._useZaxisSorter) {
                spriteBuilder.withComponent(ZaxisSorter, c => c.offset = this._zaxisSortOffset);
            } else {
                spriteBuilder.withComponent(ZaxisInitializer);
            }

            this.gameObject.addChildFromBuilder(spriteBuilder);
        }
        this.destroy();
    }

    public setSliceCount(rowCount: number, columnCount: number) {
        this._rowCount = rowCount;
        this._columnCount = columnCount;
    }

    public get imageSource(): string {
        return this._imageSource;
    }

    public set imageSource(value: string) {
        this._imageSource = value;
    }

    public get rowCount(): number {
        return this._rowCount;
    }

    public get columnCount(): number {
        return this._columnCount;
    }

    public get useZindexSorter(): boolean {
        return this._useZaxisSorter;
    }

    public set useZindexSorter(value: boolean) {
        this._useZaxisSorter = value;
    }

    public get zindexSortOffset(): number {
        return this._zaxisSortOffset;
    }

    public set zindexSortOffset(value: number) {
        this._zaxisSortOffset = value;
    }

    public get pointerEvents(): boolean {
        return this._pointerEvents;
    }

    public set pointerEvents(value: boolean) {
        this._pointerEvents = value;
    }
}
