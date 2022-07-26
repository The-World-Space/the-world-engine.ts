import { GlobalConfig } from "../../../GlobalConfig";
import { Transform } from "../../hierarchy_object/Transform";
import { CssRenderer, CssRendererConst } from "./CssRenderer";

/**
 * Option for the css object that renders the image
 */
export interface ICssImageRenderOption {
    /**
     * image rendering mode (default: ImageRenderingMode.Pixelated)
     * 
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/image-rendering
     */
    imageRenderingMode: ImageRenderingMode;
}

/**
 * css image-rendering property enum
 */
export enum ImageRenderingMode {
    /**
     * The scaling algorithm is UA dependent. Since version 1.9 (Firefox 3.0), Gecko uses bilinear resampling (high quality).
     */
    Auto = "auto",
    /**
     * The image is scaled with the nearest-neighbor algorithm.
     */
    CrispEdges = "crisp-edges",
    /**
     * Using the nearest-neighbor algorithm,
     * the image is scaled up to the next integer multiple that is greater than or equal to its original size,
     * then scaled down to the target size, as for smooth. When scaling up to integer multiples of the original size,
     * this will have the same effect as crisp-edges.
     */
    Pixelated = "pixelated",
}

/**
 * css sprite renderer
 */
export class CssSpriteRenderer extends CssRenderer<HTMLImageElement> implements ICssImageRenderOption {
    private _imageWidth = 0;
    private _imageHeight = 0;
    private _imageFlipX = false;
    private _imageFlipY = false;
    private _opacity = 1;
    private _imageRenderingMode = ImageRenderingMode.Pixelated;

    private _initializeFunction: (() => void)|null = null;

    protected override renderInitialize(): void {
        if (this._initializeFunction) {
            this._initializeFunction();
        } else {
            this.asyncSetImageFromPath(GlobalConfig.defaultSpriteSrc);
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
        const image = this.htmlElement!;

        image.style.width = (this._imageWidth / this.viewScale) + "px";
        image.style.height = (this._imageHeight / this.viewScale) + "px";
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

    /**
     * image (default: null)
     */
    public get image(): HTMLImageElement|null {
        return this.htmlElement;
    }

    /**
     * set image from path asynchronously
     * @param path image path
     * @param onComplete on complete callback
     * @returns 
     */
    public asyncSetImageFromPath(path: string, onComplete?: () => void): void {
        if (!this.readyToDraw) {
            this._initializeFunction = (): void => this.asyncSetImageFromPath(path, onComplete);
            return;
        }

        const image = this.htmlElement ?? new Image();
        image.src = path;

        const onLoad = (_e: Event): void => {
            if (!this.exists) return;
            image.removeEventListener("load", onLoad);
            this.setImage(image);
            onComplete?.();
        };
        image.addEventListener("load", onLoad);
    }

    /**
     * set image from `HTMLImageElement`
     * @param image image must be loaded
     * @returns 
     */
    public setImage(image: HTMLImageElement): void {
        if (!image.complete) throw new Error(`Image {${image.src}} is not loaded.`);

        this.htmlElement = image;

        if (!this.readyToDraw) {
            this._initializeFunction = (): void => this.setImage(image);
            return;
        }

        image.alt = this.gameObject.name + "_sprite";
        image.style.imageRendering = this._imageRenderingMode;
        if (this._imageWidth === 0) this._imageWidth = image.naturalWidth * CssRendererConst.LengthUnitScalar;
        if (this._imageHeight === 0) this._imageHeight = image.naturalHeight * CssRendererConst.LengthUnitScalar;
        image.style.width = (this._imageWidth / this.viewScale) + "px";
        image.style.height = (this._imageHeight / this.viewScale) + "px";
        image.style.opacity = this._opacity.toString();
        const css3DObject = this.initializeBaseComponents(false);
        Transform.updateRawObject3DWorldMatrixRecursively(css3DObject);
        this.transform.enqueueRenderAttachedObject3D(css3DObject);
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
        if (this.htmlElement) {
            this.htmlElement.style.width = value / this.viewScale + "px";
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
        if (this.htmlElement) {
            this.htmlElement.style.height = value / this.viewScale + "px";
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
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
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
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
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
