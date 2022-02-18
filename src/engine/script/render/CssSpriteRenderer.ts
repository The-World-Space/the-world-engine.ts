import { GlobalConfig } from "../../../GlobalConfig";
import { Transform } from "../../hierarchy_object/Transform";
import { CssRenderer } from "./CssRenderer";

export class CssSpriteRenderer extends CssRenderer<HTMLImageElement> {
    public override readonly disallowMultipleComponent: boolean = true;

    private _imageWidth = 0;
    private _imageHeight = 0;
    private _imageFlipX = false;
    private _imageFlipY = false;
    private _opacity = 1;

    private _initializeFunction: (() => void)|null = null;

    protected override renderInitialize(): void {
        this._initializeFunction?.call(this);
        if (!this.htmlElement) {
            this.asyncSetImagePath(GlobalConfig.defaultSpriteSrc);
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

        this.css3DObject.element.style.width = (this._imageWidth / this.viewScale) + "px";
        this.css3DObject.element.style.height = (this._imageHeight / this.viewScale) + "px";
        const x_scalar = this._imageFlipX ? -1 : 1;
        const y_scalar = this._imageFlipY ? -1 : 1;
        this.css3DObject.scale.set(value * x_scalar, value * y_scalar, value);

        if (updateTransform) {
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    public get imagePath(): string|null {
        return this.htmlElement?.src || null;
    }

    public asyncSetImagePath(path: string|null, onComplete?: () => void): void {
        if (!this.readyToDraw) {
            this._initializeFunction = () => {
                this.asyncSetImagePath(path, onComplete);
            };
            return;
        }

        if (!this.htmlElement) this.htmlElement = new Image();
        this.htmlElement.src = path ?? GlobalConfig.defaultSpriteSrc;

        const onLoad = (e: Event) => {
            const image = e.target as HTMLImageElement;
            image.removeEventListener("load", onLoad);
            image.alt = this.gameObject.name + "_sprite_atlas";
            image.style.imageRendering = "pixelated";
            if (this._imageWidth === 0) this._imageWidth = image.width;
            if (this._imageHeight === 0) this._imageHeight = image.height;
            image.style.width = this._imageWidth / this.viewScale + "px";
            image.style.height = this._imageHeight / this.viewScale + "px";
            image.style.opacity = this._opacity.toString();
            const css3DObject = this.initializeBaseComponents(false);
            Transform.updateRawObject3DWorldMatrixRecursively(css3DObject);
            this.transform.enqueueRenderAttachedObject3D(css3DObject);

            onComplete?.();
        };
        this.htmlElement.addEventListener("load", onLoad);
    }

    public get imageWidth(): number {
        return this._imageWidth;
    }

    public set imageWidth(value: number) {
        this._imageWidth = value;
        if (this.htmlElement) {
            this.htmlElement.style.width = value / this.viewScale + "px";
        }
        this.updateCenterOffset(true);
    }

    public get imageHeight(): number {
        return this._imageHeight;
    }

    public set imageHeight(value: number) {
        this._imageHeight = value;
        if (this.htmlElement) {
            this.htmlElement.style.height = value / this.viewScale + "px";
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
