import { Quaternion, Vector2, Vector3 } from "three/src/Three";

import { GlobalConfig } from "../../../GlobalConfig";
import { Component } from "../../hierarchy_object/Component";
import { CssRendererConst, IUnknownSizeCssRenderOption } from "../render/CssRenderer";
import { CssSpriteRenderer, ICssImageRenderOption, ImageRenderingMode } from "../render/CssSpriteRenderer";
import { CssFilter } from "../render/filter/CssFilter";
import { ZaxisSorter } from "../render/ZaxisSorter";

/**
 * represents a sprite instance
 * 
 * this class is used from the SpriteStaticInstancer
 */
export class SpriteInstance {
    private readonly _width: number;
    private readonly _height: number;
    private readonly _position: Vector3;
    private readonly _rotation?: Quaternion;
    private readonly _scale?: Vector3;
    private readonly _centerOffset?: Vector2;
    
    public constructor(
        width: number,
        height: number,
        position: Vector3, 
        rotation?: Quaternion,
        scale?: Vector3,
        centerOffset?: Vector2
    ) {
        this._width = width;
        this._height = height;
        this._position = position;
        this._rotation = rotation;
        this._scale = scale;
        this._centerOffset = centerOffset;
    }

    /**
     * sprite instance width
     */
    public get width(): number {
        return this._width;
    }

    /**
     * sprite instance height
     */
    public get height(): number {
        return this._height;
    }

    /**
     * sprite instance position
     */
    public get position(): Vector3 {
        return this._position.clone();
    }

    /**
     * sprite instance rotation
     */
    public get rotation(): Quaternion|undefined {
        return this._rotation?.clone();
    }

    /**
     * sprite instance scale
     */
    public get scale(): Vector3|undefined {
        return this._scale?.clone();
    }

    /**
     * sprite instance center offset
     */
    public get centerOffset(): Vector2|undefined {
        return this._centerOffset?.clone();
    }
}

/**
 * this component draws multiple sprite instances
 * 
 * drawcall optimization is not yet available
 */
export class SpriteStaticInstancer extends Component implements IUnknownSizeCssRenderOption, ICssImageRenderOption {
    private _imageSource: string = GlobalConfig.defaultSpriteSrc;
    private _useZaxisSorter = false;
    private _zaxisSortOffset = 0;
    private _pointerEvents = true;
    private _viewScale = CssRendererConst.LengthUnitScalar;
    private _imageRenderingMode = ImageRenderingMode.Pixelated;
    
    private readonly _filter: CssFilter = new CssFilter();

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
    public setInstances(instances: SpriteInstance[]): void {
        if (!this._started) {
            this._initializeFunction = (): void => this.setInstances(instances);
            return;
        }

        const instantlater = this.engine.instantiater;
        for (let i = 0; i < instances.length; ++i) {
            const instance = instances[i];

            const spriteBuilder = instantlater.buildGameObject(
                this.gameObject.name + "_instance_" + i,
                instance.position,
                instance.rotation,
                instance.scale)
                .withComponent(CssSpriteRenderer, c => {
                    c.asyncSetImageFromPath(this._imageSource);
                    c.imageWidth = instance.width;
                    c.imageHeight = instance.height;
                    if (instance.centerOffset) c.centerOffset = instance.centerOffset;
                    c.pointerEvents = this._pointerEvents;
                    c.viewScale = this._viewScale;
                    c.imageRenderingMode = this._imageRenderingMode;
                    c.filter.copy(this._filter);
                });
            
            if (this._useZaxisSorter) {
                spriteBuilder.withComponent(ZaxisSorter, c => c.offset = this._zaxisSortOffset);
            }

            this.gameObject.addChildFromBuilder(spriteBuilder);
        }
        this.destroy();
    }

    /**
     * image source of the sprite
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     */
    public get imageSource(): string {
        return this._imageSource;
    }

    /**
     * image source of the sprite
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     */
    public set imageSource(value: string) {
        this._imageSource = value;
    }

    /**
     * if this is true, the zaxis sorter will be attached to the sprite atlas instances
     * otherwise the zaxis initializer will be attached
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     */
    public get useZindexSorter(): boolean {
        return this._useZaxisSorter;
    }

    /**
     * if this is true, the zaxis sorter will be attached to the sprite atlas instances
     * otherwise the zaxis initializer will be attached
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     */
    public set useZindexSorter(value: boolean) {
        this._useZaxisSorter = value;
    }

    /**
     * offset of the zaxis sorter
     * 
     * this is only used if useZindexSorter is true
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     */
    public get zindexSortOffset(): number {
        return this._zaxisSortOffset;
    }

    /**
     * offset of the zaxis sorter
     * 
     * this is only used if useZindexSorter is true
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     */
    public set zindexSortOffset(value: number) {
        this._zaxisSortOffset = value;
    }

    /**
     * if this is true, the sprite atlas instances can be clicked
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     */
    public get pointerEvents(): boolean {
        return this._pointerEvents;
    }

    /**
     * if this is true, the sprite atlas instances can be clicked
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     */
    public set pointerEvents(value: boolean) {
        this._pointerEvents = value;
    }

    /**
     * element viewScale
     * 
     * value to scaling html element. the smaller value, the higher resolution of element.
     * 
     * note: if the viewScale is greater than 1, render will have different behaviour depending on the browser. In the case of firefox, normal operation is guaranteed.
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     * @param value
     */
    public get viewScale(): number {
        return this._viewScale;
    }

    /**
     * element viewScale
     * 
     * value to scaling html element. the smaller value, the higher resolution of element.
     * 
     * note: if the viewScale is greater than 1, render will have different behaviour depending on the browser. In the case of firefox, normal operation is guaranteed.
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     * @param value
     */
    public set viewScale(value: number) {
        this._viewScale = value;
    }

    /**
     * css filter
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     */
    public get filter(): CssFilter {
        return this._filter;
    }
    
    /**
     * image rendering mode (default: ImageRenderingMode.Pixelated)
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     */
    public get imageRenderingMode(): ImageRenderingMode {
        return this._imageRenderingMode;
    }

    /**
     * image rendering mode (default: ImageRenderingMode.Pixelated)
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering
     * 
     * Even if you change this value after the instance is created. Objects that have already been created will not be changed
     */
    public set imageRenderingMode(value: ImageRenderingMode) {
        this._imageRenderingMode = value;
    }
}
