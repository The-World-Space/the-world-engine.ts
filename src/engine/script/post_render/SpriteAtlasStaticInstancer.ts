import { Quaternion, Vector2, Vector3 } from "three/src/Three";

import { GlobalConfig } from "../../../GlobalConfig";
import { Component } from "../../hierarchy_object/Component";
import { ReadonlyQuaternion } from "../../math/ReadonlyQuaternion";
import { ReadonlyVector2 } from "../../math/ReadonlyVector2";
import { ReadonlyVector3 } from "../../math/ReadonlyVector3";
import { CssSpriteAtlasRenderer } from "../render/CssSpriteAtlasRenderer";
import { ZaxisInitializer } from "../render/ZaxisInitializer";
import { ZaxisSorter } from "../render/ZaxisSorter";

/**
 * represents a sprite atlas instance
 * 
 * this class is used from the SpriteAtlasStaticInstancer
 */
export class SpriteAtlasInstance {
    private readonly _width: number;
    private readonly _height: number;
    private readonly _atlasIndex: number;
    private readonly _position: Vector3;
    private readonly _rotation?: Quaternion;
    private readonly _scale?: Vector3;
    private readonly _centerOffset?: Vector2;

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

    /**
     * sprite atlas instance width
     */
    public get width(): number {
        return this._width;
    }

    /**
     * sprite atlas instance height
     */
    public get height(): number {
        return this._height;
    }
    
    /**
     * sprite atlas instance atlas index
     */
    public get atlasIndex(): number {
        return this._atlasIndex;
    }

    /**
     * sprite atlas instance position
     */
    public get position(): ReadonlyVector3 {
        return this._position;
    }

    /**
     * sprite atlas instance rotation
     */
    public get rotation(): ReadonlyQuaternion|undefined {
        return this._rotation;
    }

    /**
     * sprite atlas instance scale
     */
    public get scale(): ReadonlyVector3|undefined {
        return this._scale;
    }

    /**
     * sprite atlas instance center offset
     */
    public get centerOffset(): ReadonlyVector2|undefined {
        return this._centerOffset;
    }
}

/**
 * this component draws multiple sprite atlas instances
 * 
 * drawcall optimization is not yet available
 */
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

    /**
     * set instances to be drawn
     * @param instances instances to be drawn
     * @returns 
     */
    public setInstances(instances: SpriteAtlasInstance[]): void {
        if (!this._started) {
            this._initializeFunction = (): void => this.setInstances(instances);
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
                    c.asyncSetImageFromPath(this._imageSource, this._rowCount, this._columnCount);
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

    /**
     * set the number of rows and columns of the sprite atlas
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     * @param rowCount number of rows
     * @param columnCount number of columns
     */
    public setSliceCount(rowCount: number, columnCount: number): void {
        this._rowCount = rowCount;
        this._columnCount = columnCount;
    }

    /**
     * image source of the sprite atlas (default: `GlobalConfig.defaultSpriteSrc`)
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     */
    public get imageSource(): string {
        return this._imageSource;
    }

    /**
     * image source of the sprite atlas (default: `GlobalConfig.defaultSpriteSrc`)
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     */
    public set imageSource(value: string) {
        this._imageSource = value;
    }

    /**
     * row count of the sprite atlas (default: 1)
     */
    public get rowCount(): number {
        return this._rowCount;
    }

    /**
     * column count of the sprite atlas (default: 1)
     */
    public get columnCount(): number {
        return this._columnCount;
    }

    /**
     * if this is true, the zaxis sorter will be attached to the sprite atlas instances
     * otherwise the zaxis initializer will be attached (default: false)
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     */
    public get useZindexSorter(): boolean {
        return this._useZaxisSorter;
    }

    /**
     * if this is true, the zaxis sorter will be attached to the sprite atlas instances
     * otherwise the zaxis initializer will be attached (default: false)
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     */
    public set useZindexSorter(value: boolean) {
        this._useZaxisSorter = value;
    }

    /**
     * offset of the zaxis sorter (default: 0)
     * 
     * this is only used if useZindexSorter is true
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     */
    public get zindexSortOffset(): number {
        return this._zaxisSortOffset;
    }

    /**
     * offset of the zaxis sorter (default: 0)
     * 
     * this is only used if useZindexSorter is true
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     */
    public set zindexSortOffset(value: number) {
        this._zaxisSortOffset = value;
    }

    /**
     * if this is true, the sprite atlas instances can be clicked (default: true)
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     */
    public get pointerEvents(): boolean {
        return this._pointerEvents;
    }

    /**
     * if this is true, the sprite atlas instances can be clicked (default: true)
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     */
    public set pointerEvents(value: boolean) {
        this._pointerEvents = value;
    }
}
