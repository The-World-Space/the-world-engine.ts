import { GlobalConfig } from "../../../GlobalConfig";
import { Transform } from "../../hierarchy_object/Transform";
import { CssRenderer, CssRendererConst } from "./CssRenderer";
import { CssFilter } from "./filter/CssFilter";

/**
 * css sprite renderer
 */
export class CssSpriteRenderer extends CssRenderer<HTMLImageElement> {
    private _imageWidth = 0;
    private _imageHeight = 0;
    private _imageFlipX = false;
    private _imageFlipY = false;
    private _opacity = 1;

    private readonly onFilterUpdate = (): void => {
        if (this.htmlElement) {
            this.htmlElement.style.filter = this._filter.toString();
        }
    };

    private readonly _filter: CssFilter = new CssFilter(this.onFilterUpdate);

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
        image.style.imageRendering = "pixelated";
        if (this._imageWidth === 0) this._imageWidth = image.naturalWidth * CssRendererConst.LengthUnitScalar;
        if (this._imageHeight === 0) this._imageHeight = image.naturalHeight * CssRendererConst.LengthUnitScalar;
        image.style.width = (this._imageWidth / this.viewScale) + "px";
        image.style.height = (this._imageHeight / this.viewScale) + "px";
        image.style.opacity = this._opacity.toString();
        image.style.filter = this._filter.toString();
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
     * css filter
     */
    public get filter(): CssFilter {
        return this._filter;
    }
}
