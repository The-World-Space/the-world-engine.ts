import { GlobalConfig } from "../../../GlobalConfig";
import { Transform } from "../../hierarchy_object/Transform";
import { CssRenderer } from "./CssRenderer";

export class CssSpriteAtlasRenderer extends CssRenderer<HTMLImageElement> {
    private _rowCount = 1;
    private _columnCount = 1;
    private _imageWidth = 0;
    private _imageHeight = 0;
    private _imageFlipX = false;
    private _imageFlipY = false;
    private _opacity = 1;
    private _croppedImageWidth = 0;
    private _croppedImageHeight = 0;
    private _currentImageIndex = 0;
    
    private _initializeFunction: (() => void)|null = null;

    protected override renderInitialize(): void {
        this._initializeFunction?.call(this);
        if (!this.htmlElement) {
            this.asyncSetImage(GlobalConfig.defaultSpriteSrc, 1, 1);
        }
    }

    protected override updateCenterOffset(updateTransform: boolean): void {
        if (!this.css3DObject) return;

        this.css3DObject.position.set(
            this._imageWidth * this.centerOffset.x,
            this._imageHeight * this.centerOffset.y, 0
        );
            
        if (updateTransform) {
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    protected override updateViewScale(updateTransform: boolean): void {
        if (!this.css3DObject) return;
        
        const value = this.viewScale;
        //const image = this.htmlElement!;
        
        //image.style.width = (this._croppedImageWidth / value) + "px";
        //image.style.height = (this._croppedImageHeight / value) + "px";
        const x_scalar = this._imageFlipX ? -1 : 1;
        const y_scalar = this._imageFlipY ? -1 : 1;
        this.css3DObject.scale.set(
            this._imageWidth / this._croppedImageWidth * value * x_scalar,
            this._imageHeight / this._croppedImageHeight * value * y_scalar,
            1
        );

        if (updateTransform) {
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    private updateImageByIndex(): void {
        if (this.htmlElement) {
            const width = -(this._currentImageIndex % this._columnCount * this._croppedImageWidth);
            const height = -Math.floor(this._currentImageIndex / this._columnCount) * this._croppedImageHeight;
            this.htmlElement.style.objectPosition = width + "px " + height + "px";
        }
    }

    public get imagePath(): string|null {
        return this.htmlElement?.src || null;
    }

    public asyncSetImage(path: string, rowCount: number, columnCount: number, onComplete?: () => void): void {
        if (!this.readyToDraw) {
            this._initializeFunction = () => this.asyncSetImage(path, rowCount, columnCount, onComplete);
            return;
        }

        this._rowCount = rowCount;
        this._columnCount = columnCount;

        if (!this.htmlElement) this.htmlElement = new Image();
        this.htmlElement.src = path;

        const onLoad = (e: Event) => {
            const image = e.target as HTMLImageElement;
            image.removeEventListener("load", onLoad);
            this._croppedImageWidth = image.naturalWidth / this._columnCount;
            this._croppedImageHeight = image.naturalHeight / this._rowCount;
            if (this._imageWidth === 0) this._imageWidth = this._croppedImageWidth;
            if (this._imageHeight === 0) this._imageHeight = this._croppedImageHeight;
            image.alt = this.gameObject.name + "_sprite_atlas";
            image.style.width = (this._croppedImageWidth/* / this.viewScale*/) + "px";
            image.style.height = (this._croppedImageHeight/* / this.viewScale*/) + "px";
            image.style.objectFit = "none";
            image.style.imageRendering = "pixelated";
            image.style.opacity = this._opacity.toString();

            const css3DObject = this.initializeBaseComponents(false);
            css3DObject.scale.set(
                this._imageWidth / this._croppedImageWidth * this.viewScale,
                this._imageHeight / this._croppedImageHeight * this.viewScale,
                1
            );
            css3DObject.scale.x *= this._imageFlipX ? -1 : 1;
            css3DObject.scale.y *= this._imageFlipY ? -1 : 1;
            this.updateImageByIndex();
            Transform.updateRawObject3DWorldMatrixRecursively(css3DObject);
            this.transform.enqueueRenderAttachedObject3D(css3DObject);

            onComplete?.();
        };
        this.htmlElement.addEventListener("load", onLoad);
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

    public get imageWidth(): number {
        return this._imageWidth;
    }

    public set imageWidth(value: number) {
        this._imageWidth = value;
        if (this.css3DObject) {
            //this.htmlElement!.style.width = (this._croppedImageWidth / this.viewScale) + "px";
            this.css3DObject.scale.x = this._imageWidth / this._croppedImageWidth * this.viewScale;
            this.css3DObject.scale.x *= this._imageFlipX ? -1 : 1;
        }
        this.updateCenterOffset(true);
    }

    public get imageHeight(): number {
        return this._imageHeight;
    }

    public set imageHeight(value: number) {
        this._imageHeight = value;
        if (this.css3DObject) {
            //this.htmlElement!.style.height = (this._croppedImageHeight / this.viewScale) + "px";
            this.css3DObject.scale.y = this._imageHeight / this._croppedImageHeight * this.viewScale;
            this.css3DObject.scale.y *= this._imageFlipY ? -1 : 1;
        }
        this.updateCenterOffset(true);
    }

    public get imageFlipX(): boolean {
        return this._imageFlipX;
    }

    public set imageFlipX(value: boolean) {
        this._imageFlipX = value;
        if (this.css3DObject) {
            if (this._imageFlipX) {
                if (0 < this.css3DObject.scale.x) {
                    this.css3DObject.scale.x *= -1;
                }
            } else {
                if (this.css3DObject.scale.x < 0) {
                    this.css3DObject.scale.x *= -1;
                }
            }
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    public get imageFlipY(): boolean {
        return this._imageFlipY;
    }

    public set imageFlipY(value: boolean) {
        this._imageFlipY = value;
        if (this.css3DObject) {
            if (this._imageFlipY) {
                if (0 < this.css3DObject.scale.y) {
                    this.css3DObject.scale.y *= -1;
                }
            } else {
                if (this.css3DObject.scale.y < 0) {
                    this.css3DObject.scale.y *= -1;
                }
            }
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    public get opacity(): number {
        return this._opacity;
    }

    public set opacity(value: number) {
        this._opacity = value;
        if (this.htmlElement) {
            this.htmlElement.style.opacity = this._opacity.toString();
        }
    }
}
