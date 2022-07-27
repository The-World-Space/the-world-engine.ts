import { GlobalConfig } from "../../../GlobalConfig";
import { Transform } from "../../hierarchy_object/Transform";
import { CssRenderer, CssRendererConst } from "./CssRenderer";
import { ICssImageRenderOption, ImageRenderingMode } from "./CssSpriteRenderer";

/**
 * css sprite atlas render mode
 */
export enum CssSpriteAtlasRenderMode {
    /**
     * This option clips images using object-fit css property.
     * 
     * The object-fit uses less resources than the clip-path.
     * However, in object-fit mode, the viewScale value must be fixed to 1.
     * 
     * If you don't have any problems, you'd better use this method
     */
    ObjectFit,
    /**
     * This option clips images using clip-path css property.
     * 
     * The object-fit uses less resources than the clip-path.
     * However, in object-fit mode, the viewScale value must be fixed to 1.
     */
    ClipPath
}

/**
 * css sprite atlas renderer
 * 
 * this compoenent slices the image into column and rows, it's memory efficient and fast to animate.
 */
export class CssSpriteAtlasRenderer extends CssRenderer<HTMLImageElement> implements ICssImageRenderOption {
    private _renderMode: CssSpriteAtlasRenderMode = CssSpriteAtlasRenderMode.ObjectFit;
    private _imageWidth = 0;
    private _imageHeight = 0;
    private _imageFlipX = false;
    private _imageFlipY = false;
    private _opacity = 1;
    private _imageRenderingMode = ImageRenderingMode.Pixelated;

    private _columnCount = 1;
    private _rowCount = 1;
    private _currentImageIndex = 0;
    
    // used for object-fit
    private _croppedImageWidth = 0;
    private _croppedImageHeight = 0;
    
    private _initializeFunction: (() => void)|null = null;

    protected override renderInitialize(): void {
        if (this._initializeFunction) {
            this._initializeFunction();
        } else {
            this.asyncSetImageFromPath(GlobalConfig.defaultSpriteSrc, 1, 1);
        }
    }

    protected override updateCenterOffset(updateTransform: boolean): void {
        if (!this.css3DObject) return;

        if (this._renderMode === CssSpriteAtlasRenderMode.ObjectFit) {
            this.css3DObject.position.set(
                this._imageWidth * this.centerOffset.x,
                this._imageHeight * this.centerOffset.y, 0
            );
                
            if (updateTransform) {
                Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
                this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
            }
        } else /* if (this._renderMode === CssSpriteAtlasRenderMode.ClipPath) */ {
            const columnIndex = this._currentImageIndex % this._columnCount;
            const rowIndex = Math.floor(this._currentImageIndex / this._columnCount);

            const columnScalar = this._imageFlipX 
                ? -(this._imageWidth * this._columnCount / 2 - this._imageWidth / 2) + columnIndex * this._imageWidth
                : (this._imageWidth * this._columnCount / 2 - this._imageWidth / 2) - columnIndex * this._imageWidth;

            const rowScalar = this._imageFlipY
                ? (this._imageHeight * this._rowCount / 2 - this._imageHeight / 2) - rowIndex * this._imageHeight
                : -(this._imageHeight * this._rowCount / 2 - this._imageHeight / 2) + rowIndex * this._imageHeight;

            this.css3DObject.position.set(
                this._imageWidth * this.centerOffset.x + columnScalar,
                this._imageHeight * this.centerOffset.y + rowScalar,
                0
            );
                
            if (updateTransform) {
                Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
                this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
            }
        }
    }

    protected override updateViewScale(updateTransform: boolean): void {
        if (!this.css3DObject) return;
        
        if (this._renderMode === CssSpriteAtlasRenderMode.ObjectFit) {
            const value = this.viewScale;
            //const image = this.htmlElement!;
            
            //image.style.width = (this._croppedImageWidth / value) + "px";
            //image.style.height = (this._croppedImageHeight / value) + "px";
            const xScalar = this._imageFlipX ? -1 : 1;
            const yScalar = this._imageFlipY ? -1 : 1;
            this.css3DObject.scale.set(
                this._imageWidth / this._croppedImageWidth * value * xScalar,
                this._imageHeight / this._croppedImageHeight * value * yScalar,
                1
            );

            if (updateTransform) {
                Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
                this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
            }
        } else /* if (this._renderMode === CssSpriteAtlasRenderMode.ClipPath) */ {   
            const value = this.viewScale;
            const image = this.htmlElement!;
            
            image.style.width = (this._imageWidth * this._columnCount / value) + "px";
            image.style.height = (this._imageHeight * this._rowCount / value) + "px";
            const xScalar = this._imageFlipX ? -1 : 1;
            const yScalar = this._imageFlipY ? -1 : 1;
            this.css3DObject.scale.set(
                value * xScalar,
                value * yScalar,
                value
            );

            if (updateTransform) {
                Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
                this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
            }
        }
    }

    private updateImageIndex(): void {
        if (!this.htmlElement) return;

        if (this._renderMode === CssSpriteAtlasRenderMode.ObjectFit) {
            const width = -(this._currentImageIndex % this._columnCount * this._croppedImageWidth);
            const height = -Math.floor(this._currentImageIndex / this._columnCount) * this._croppedImageHeight;
            this.htmlElement.style.objectPosition = width + "px " + height + "px";
        } else /* if (this._renderMode === CssSpriteAtlasRenderMode.ClipPath) */ {
            const rowIndex = Math.floor(this._currentImageIndex / this._columnCount);
            const columnIndex = this._columnCount - this._currentImageIndex % this._columnCount - 1;
            this.htmlElement.style.clipPath = 
                "inset(" + 
                (100 / this._rowCount * rowIndex) + "% " +
                (100 / this._columnCount * columnIndex) + "% " +
                (100 - ((100 / this._rowCount * rowIndex) + (100 / this._rowCount))) + "% " +
                (100 - ((100 / this._columnCount * columnIndex) + (100 / this._columnCount))) + "%)";
        }
    }

    /**
     * image (default: null)
     */
    public get image(): HTMLImageElement|null {
        return this.htmlElement;
    }

    /**
     * set image from path asynchronously
     * @param path image path
     * @param columnCount sprite atlas column count
     * @param rowCount sprite atlas row count
     * @param onComplete on complete callback
     * @returns 
     */
    public asyncSetImageFromPath(path: string, columnCount: number, rowCount: number, onComplete?: () => void): void {
        if (!this.readyToDraw) {
            this._initializeFunction = (): void => this.asyncSetImageFromPath(path, columnCount, rowCount, onComplete);
            return;
        }

        const image = this.htmlElement ?? new Image();
        image.src = path;

        const onLoad = (_e: Event): void => {
            if (!this.exists) return;
            image.removeEventListener("load", onLoad);
            this.setImage(image, columnCount, rowCount);
            onComplete?.();
        };
        image.addEventListener("load", onLoad);
    }

    /**
     * set image from `HTMLImageElement`
     * @param image image must be loaded
     * @param columnCount sprite atlas column count
     * @param rowCount sprite atlas row count
     */
    public setImage(image: HTMLImageElement, columnCount: number, rowCount: number): void {
        if (!image.complete) throw new Error(`Image {${image.src}} is not loaded.`);

        this._columnCount = columnCount;
        this._rowCount = rowCount;
        this.htmlElement = image;

        image.alt = this.gameObject.name + "_sprite_atlas";
        image.style.imageRendering = this._imageRenderingMode;
        image.style.opacity = this._opacity.toString();
        if (this._renderMode === CssSpriteAtlasRenderMode.ObjectFit) {
            if (this.viewScale !== 1) {
                console.warn("CssSpriteAtlas.viewScale is not supported in CssSpriteAtlasRenderMode.ObjectFit, for supressing this warning set viewScale to 1.");
            }
            this._croppedImageWidth = image.naturalWidth / this._columnCount;
            this._croppedImageHeight = image.naturalHeight / this._rowCount;
            if (this._imageWidth === 0) this._imageWidth = this._croppedImageWidth * CssRendererConst.LengthUnitScalar;
            if (this._imageHeight === 0) this._imageHeight = this._croppedImageHeight * CssRendererConst.LengthUnitScalar;
            image.style.width = (this._croppedImageWidth/* / this.viewScale*/) + "px";
            image.style.height = (this._croppedImageHeight/* / this.viewScale*/) + "px";
            image.style.objectFit = "none";
        } else /* if (this._renderMode === CssSpriteAtlasRenderMode.ClipPath) */ {
            if (this._imageWidth === 0) this._imageWidth = image.naturalWidth / this._columnCount * CssRendererConst.LengthUnitScalar;
            if (this._imageHeight === 0) this._imageHeight = image.naturalHeight / this._rowCount * CssRendererConst.LengthUnitScalar;
            image.style.width = (this._imageWidth * this._columnCount / this.viewScale) + "px";
            image.style.height = (this._imageHeight * this._rowCount / this.viewScale) + "px";
        }
        const css3DObject = this.initializeBaseComponents(false);
        this.updateImageIndex();
        Transform.updateRawObject3DWorldMatrixRecursively(css3DObject);
        this.transform.enqueueRenderAttachedObject3D(css3DObject);
    }

    /**
     * render mode (default: CssSpriteAtlasRenderMode.ObjectFit)
     * 
     * Decide which css method to clip the image
     * 
     * Change this option if you have a render problem.
     */
    public get renderMode(): CssSpriteAtlasRenderMode {
        return this._renderMode;
    }

    /**
     * render mode (default: CssSpriteAtlasRenderMode.ObjectFit)
     * 
     * Decide which css method to clip the image
     * 
     * Change this option if you have a render problem.
     */
    public set renderMode(value: CssSpriteAtlasRenderMode) {
        if (this._renderMode === value) return;
        this._renderMode = value;

        if (this.htmlElement) {
            const image = this.htmlElement;
            if (this._renderMode === CssSpriteAtlasRenderMode.ObjectFit) {
                if (this.viewScale !== 1) {
                    console.warn("CssSpriteAtlas.viewScale is not supported in CssSpriteAtlasRenderMode.ObjectFit");
                }
                image.style.clipPath = "";

                this._croppedImageWidth = image.naturalWidth / this._columnCount;
                this._croppedImageHeight = image.naturalHeight / this._rowCount;
                if (this._imageWidth === 0) this._imageWidth = this._croppedImageWidth;
                if (this._imageHeight === 0) this._imageHeight = this._croppedImageHeight;
                image.style.width = (this._croppedImageWidth/* / this.viewScale*/) + "px";
                image.style.height = (this._croppedImageHeight/* / this.viewScale*/) + "px";
                image.style.objectFit = "none";
            } else /* if (this._renderMode === CssSpriteAtlasRenderMode.ClipPath) */ {
                image.style.objectFit = "";
                image.style.objectPosition = "";

                if (this._imageWidth === 0) this._imageWidth = image.naturalWidth / this._columnCount;
                if (this._imageHeight === 0) this._imageHeight = image.naturalHeight / this._rowCount;
                image.style.width = (this._imageWidth * this._columnCount / this.viewScale) + "px";
                image.style.height = (this._imageHeight * this._rowCount / this.viewScale) + "px";
            }
            this.updateViewScale(false);
            this.updateCenterOffset(false);
            this.updateImageIndex();
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject!);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject!);
        }
    }

    /**
     * image index (default: 0)
     * 
     * Decide which image to display
     * 
     * Index increases from left to right from top to bottom
     */
    public get imageIndex(): number {
        return this._currentImageIndex;
    }

    /**
     * image index (default: 0)
     * 
     * Decide which image to display
     * 
     * Index increases from left to right from top to bottom
     */
    public set imageIndex(value: number) {
        this._currentImageIndex = value;
        this.updateImageIndex();
        if (this._renderMode === CssSpriteAtlasRenderMode.ClipPath) {
            this.updateCenterOffset(true);
        }
    }

    /**
     * sprite atlas column count (default: 1)
     */
    public get columnCount(): number {
        return this._columnCount;
    }

    /**
     * sprite atlas row count (default: 1)
     */
    public get rowCount(): number {
        return this._rowCount;
    }

    /**
     * image width (default: 0)
     * 
     * if this value is 0, it will automatically update when image is set
     */
    public get imageWidth(): number {
        return this._imageWidth;
    }

    /**
     * image width (default: 0)
     * 
     * if this value is 0, it will automatically update when image is set
     */
    public set imageWidth(value: number) {
        this._imageWidth = value;
        if (this._renderMode === CssSpriteAtlasRenderMode.ObjectFit) {
            if (this.css3DObject) {
                //this.htmlElement!.style.width = (this._croppedImageWidth / this.viewScale) + "px";
                this.css3DObject.scale.x = this._imageWidth / this._croppedImageWidth * this.viewScale;
                this.css3DObject.scale.x *= this._imageFlipX ? -1 : 1;
            }
        } else /* if (this._renderMode === CssSpriteAtlasRenderMode.ClipPath) */ {
            if (this.htmlElement) {
                this.htmlElement.style.width = value * this._columnCount / this.viewScale + "px";
            }
        }
        this.updateCenterOffset(true);
    }

    /**
     * image height (default: 0)
     * 
     * if this value is 0, it will automatically update when image is set
     */
    public get imageHeight(): number {
        return this._imageHeight;
    }

    /**
     * image height (default: 0)
     * 
     * if this value is 0, it will automatically update when image is set
     */
    public set imageHeight(value: number) {
        this._imageHeight = value;
        if (this._renderMode === CssSpriteAtlasRenderMode.ObjectFit) {
            if (this.css3DObject) {
                //this.htmlElement!.style.height = (this._croppedImageHeight / this.viewScale) + "px";
                this.css3DObject.scale.y = this._imageHeight / this._croppedImageHeight * this.viewScale;
                this.css3DObject.scale.y *= this._imageFlipY ? -1 : 1;
            }
        } else /* if (this._renderMode === CssSpriteAtlasRenderMode.ClipPath) */ {
            if (this.htmlElement) {
                this.htmlElement.style.height = value * this._rowCount / this.viewScale + "px";
            }
        }
        this.updateCenterOffset(true);
    }

    /**
     * image flip x (default: false)
     */
    public get imageFlipX(): boolean {
        return this._imageFlipX;
    }

    /**
     * image flip x (default: false)
     */
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
            if (this._renderMode === CssSpriteAtlasRenderMode.ObjectFit) {
                Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
                this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
            } else /* if (this._renderMode === CssSpriteAtlasRenderMode.ClipPath) */ {
                this.updateImageIndex();
                this.updateCenterOffset(true);
            }
        }
    }

    /**
     * image flip y (default: false)
     */
    public get imageFlipY(): boolean {
        return this._imageFlipY;
    }

    /**
     * image flip y (default: false)
     */
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
            if (this._renderMode === CssSpriteAtlasRenderMode.ObjectFit) {
                Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
                this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
            } else /* if (this._renderMode === CssSpriteAtlasRenderMode.ClipPath) */ {
                this.updateImageIndex();
                this.updateCenterOffset(true);
            }
        }
    }

    /**
     * image opacity (default: 1)
     */
    public get opacity(): number {
        return this._opacity;
    }

    /**
     * image opacity (default: 1)
     */
    public set opacity(value: number) {
        this._opacity = value;
        if (this.htmlElement) {
            this.htmlElement.style.opacity = this._opacity.toString();
        }
    }

    /**
     * image rendering mode (default: ImageRenderingMode.Pixelated)
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering
     */
    public get imageRenderingMode(): ImageRenderingMode {
        return this._imageRenderingMode;
    }

    /**
     * image rendering mode (default: ImageRenderingMode.Pixelated)
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering
     */
    public set imageRenderingMode(value: ImageRenderingMode) {
        this._imageRenderingMode = value;
        if (this.htmlElement) {
            this.htmlElement.style.imageRendering = this._imageRenderingMode;
        }
    }
}
