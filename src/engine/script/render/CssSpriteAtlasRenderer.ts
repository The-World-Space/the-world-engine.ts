import { Vector2 } from "three";
import { CSS3DObject } from  "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../hierarchy_object/Component";
import { ZaxisInitializer } from "./ZaxisInitializer";
import { GlobalConfig } from "../../../GlobalConfig";
import { Transform } from "../../hierarchy_object/Transform";

export class CssSpriteAtlasRenderer extends Component {
    public override readonly disallowMultipleComponent: boolean = true;

    private _sprite: CSS3DObject|null = null;
    private _htmlImageElement: HTMLImageElement|null = null;
    private _rowCount = 1;
    private _columnCount = 1;
    private _imageWidth = 0;
    private _imageHeight = 0;
    private _imageFlipX = false;
    private _imageFlipY = false;
    private _opacity = 1;
    private _pointerEvents = true;
    private _croppedImageWidth = 0;
    private _croppedImageHeight = 0;
    private _currentImageIndex = 0;
    private readonly _imageCenterOffset: Vector2 = new Vector2(0, 0);
    private _zindex = 0;
    private _started = false;
    
    private _initializeFunction: (() => void)|null = null;

    private static readonly _defaultImagePath: string = GlobalConfig.defaultSpriteSrc;

    public start(): void {
        this._initializeFunction?.call(this);
        if (!this._htmlImageElement) {
            this.asyncSetImage(CssSpriteAtlasRenderer._defaultImagePath, 1, 1);
        }
        
        ZaxisInitializer.checkAncestorZaxisInitializer(this.gameObject, this.onSortByZaxis.bind(this));
        this._started = true;
    }

    public onDestroy(): void {
        if (!this._started) return;
        if (this._sprite) {
            this.transform.unsafeGetObject3D().remove(this._sprite); //it's safe because _css3DObject is not GameObject and remove is from onDestroy
            this._sprite.element.parentElement?.removeChild(this._sprite.element);
            this._sprite.element.remove();
            this._sprite = null;
        }
    }

    public onEnable(): void {
        if (this._sprite) {
            this._sprite.visible = true;
            this.transform.enqueueRenderAttachedObject3D(this._sprite);
        }
    }

    public onDisable(): void {
        if (this._sprite) {
            this._sprite.visible = false;
            this.transform.enqueueRenderAttachedObject3D(this._sprite);
        }
    }

    public onSortByZaxis(zaxis: number): void {
        this._zindex = zaxis;
        if (this._sprite) {
            this._sprite.element.style.zIndex = Math.floor(this._zindex).toString();
        }
    }
    
    public onWorldMatrixUpdated(): void {
        if (this._sprite) {
            Transform.updateRawObject3DWorldMatrixRecursively(this._sprite);
            this.transform.enqueueRenderAttachedObject3D(this._sprite);
        }
    }

    public get imagePath(): string|null {
        return this._htmlImageElement?.src || null;
    }

    public asyncSetImage(path: string, rowCount: number, columnCount: number, onComplete?: () => void): void {
        if (!this.initialized) {
            this._initializeFunction = () => {
                this.asyncSetImage(path, rowCount, columnCount, onComplete);
            };
            return;
        }

        this._rowCount = rowCount;
        this._columnCount = columnCount;

        if (!this._htmlImageElement) {
            this._htmlImageElement = new Image();
        }

        this._htmlImageElement.src = path;
        const onLoad = (e: Event) => {
            const image = e.target as HTMLImageElement;
            image.removeEventListener("load", onLoad);
            this._croppedImageWidth = image.naturalWidth / this._columnCount;
            this._croppedImageHeight = image.naturalHeight / this._rowCount;
            if (this._imageWidth === 0) this._imageWidth = this._croppedImageWidth;
            if (this._imageHeight === 0) this._imageHeight = this._croppedImageHeight;
            image.alt = this.gameObject.name + "_sprite_atlas";
            if (!this._sprite) {
                this._sprite = new CSS3DObject(this._htmlImageElement as HTMLImageElement);
                this.updateCenterOffset();
                this._sprite.scale.set(
                    this._imageWidth / this._croppedImageWidth,
                    this._imageHeight / this._croppedImageHeight,
                    1
                );
                this._sprite.scale.x *= this._imageFlipX ? -1 : 1;
                this._sprite.scale.y *= this._imageFlipY ? -1 : 1;
                this.transform.unsafeGetObject3D().add(this._sprite); //it's safe because _css3DObject is not GameObject and remove is from onDestroy
                
                Transform.updateRawObject3DWorldMatrixRecursively(this._sprite);
                this.transform.enqueueRenderAttachedObject3D(this._sprite);
            }
            image.style.width = this._croppedImageWidth +"px";
            image.style.height = this._croppedImageHeight + "px";
            image.style.objectFit = "none";
            image.style.imageRendering = "pixelated";
            image.style.opacity = this._opacity.toString();
            image.style.pointerEvents = this._pointerEvents ? "auto" : "none";
            image.style.zIndex = this._zindex.toString();
            this.updateImageByIndex();

            if (this.enabled && this.gameObject.activeInHierarchy) this._sprite.visible = true;
            else this._sprite.visible = false;

            onComplete?.();
        };
        this._htmlImageElement.addEventListener("load", onLoad);
    }

    private updateImageByIndex(): void {
        if (this._sprite) {
            const width = -(this._currentImageIndex % this._columnCount * this._croppedImageWidth);
            const height = -Math.floor(this._currentImageIndex / this._columnCount) * this._croppedImageHeight;
            this._sprite.element.style.objectPosition = width + "px " + height + "px";
        }
    }

    private updateCenterOffset(): void {
        if (this._sprite) {
            this._sprite.position.set(
                this._imageWidth * this._imageCenterOffset.x,
                this._imageHeight * this._imageCenterOffset.y, 0
            );
            
            Transform.updateRawObject3DWorldMatrixRecursively(this._sprite);
            this.transform.enqueueRenderAttachedObject3D(this._sprite);
        }
    }

    public set imageIndex(value: number) {
        this._currentImageIndex = value;
        this.updateImageByIndex();
    }

    public get rowCount(): number {
        return this._rowCount;
    }

    public get columnCount(): number {
        return this._columnCount;
    }

    public get imageCenterOffset(): Vector2 {
        return this._imageCenterOffset.clone();
    }

    public set imageCenterOffset(value: Vector2) {
        this._imageCenterOffset.copy(value);
        this.updateCenterOffset();
    }

    public get imageWidth(): number {
        return this._imageWidth;
    }

    public set imageWidth(value: number) {
        this._imageWidth = value;
        if (this._sprite) {
            this._sprite.scale.x = this._imageWidth / this._croppedImageWidth;
            this._sprite.scale.x *= this._imageFlipX ? -1 : 1;
        }
        this.updateCenterOffset();
    }

    public get imageHeight(): number {
        return this._imageHeight;
    }

    public set imageHeight(value: number) {
        this._imageHeight = value;
        if (this._sprite) {
            this._sprite.scale.y = this._imageHeight / this._croppedImageHeight;
            this._sprite.scale.y *= this._imageFlipY ? -1 : 1;
        }
        this.updateCenterOffset();
    }

    public get imageFlipX(): boolean {
        return this._imageFlipX;
    }

    public set imageFlipX(value: boolean) {
        this._imageFlipX = value;
        if (this._sprite) {
            this._sprite.scale.x *= this._imageFlipX ? -1 : 1;
            Transform.updateRawObject3DWorldMatrixRecursively(this._sprite);
            this.transform.enqueueRenderAttachedObject3D(this._sprite);
        }
    }

    public get imageFlipY(): boolean {
        return this._imageFlipY;
    }

    public set imageFlipY(value: boolean) {
        this._imageFlipY = value;
        if (this._sprite) {
            this._sprite.scale.y *= this._imageFlipY ? -1 : 1;
            Transform.updateRawObject3DWorldMatrixRecursively(this._sprite);
            this.transform.enqueueRenderAttachedObject3D(this._sprite);
        }
    }

    public get opacity(): number {
        return this._opacity;
    }

    public set opacity(value: number) {
        this._opacity = value;
        if (this._htmlImageElement) {
            this._htmlImageElement.style.opacity = this._opacity.toString();
        }
    }

    public get pointerEvents(): boolean {
        return this._pointerEvents;
    }

    public set pointerEvents(value: boolean) {
        this._pointerEvents = value;
        if (this._htmlImageElement) {
            this._htmlImageElement.style.pointerEvents = this._pointerEvents ? "auto" : "none";
        }
    }
}
