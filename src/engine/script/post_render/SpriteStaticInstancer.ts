import { Quaternion, Vector2, Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { CssSpriteRenderer } from "../render/CssSpriteRenderer";
import { ZaxisInitializer } from "../render/ZaxisInitializer";
import { ZaxisSorter } from "../render/ZaxisSorter";
import { GlobalConfig } from "../../../GlobalConfig";

export class SpriteInstance {
    private _width: number;
    private _height: number;
    private _position: Vector3;
    private _rotation?: Quaternion;
    private _scale?: Vector3;
    private _centerOffset?: Vector2;
    
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

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public get position(): Vector3 {
        return this._position.clone();
    }

    public get rotation(): Quaternion|undefined {
        return this._rotation?.clone();
    }

    public get scale(): Vector3|undefined {
        return this._scale?.clone();
    }

    public get centerOffset(): Vector2|undefined {
        return this._centerOffset?.clone();
    }
}

export class SpriteStaticInstancer extends Component {
    private _imageSource: string = GlobalConfig.defaultSpriteSrc;
    private _useZaxisSorter = false;
    private _zaxisSortOffset = 0;
    private _pointerEvents = true;

    private _initializeFunction: (() => void)|null = null;
    private _started = false;

    public start(): void {
        this._started = true;
        this._initializeFunction?.call(this);
    }

    public setInstances(instances: SpriteInstance[]) {
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
                .withComponent(CssSpriteRenderer, c => {
                    c.asyncSetImagePath(this._imageSource);
                    c.imageWidth = instance.width;
                    c.imageHeight = instance.height;
                    if (instance.centerOffset) c.imageCenterOffset = instance.centerOffset;
                    c.pointerEvents = this._pointerEvents;
                });
            
            if (this._useZaxisSorter) {
                spriteBuilder.withComponent(ZaxisSorter, c => c.offset = this._zaxisSortOffset);
            } else {
                spriteBuilder.withComponent(ZaxisInitializer);
            }

            this.gameObject.addChildFromBuilder(spriteBuilder);
        }
        this.gameObject.removeComponent(this);
    }

    public get imageSource(): string {
        return this._imageSource;
    }

    public set imageSource(value: string) {
        this._imageSource = value;
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
