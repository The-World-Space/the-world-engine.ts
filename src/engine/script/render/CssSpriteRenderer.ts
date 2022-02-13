import { Vector2 } from "three";
import { CSS3DObject } from  "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../hierarchy_object/Component";
import { ZaxisInitializer } from "./ZaxisInitializer";
import { GlobalConfig } from "../../../GlobalConfig";
import { Transform } from "../../hierarchy_object/Transform";

export class CssSpriteRenderer extends Component {
    public override readonly disallowMultipleComponent: boolean = true;

    private _sprite: CSS3DObject|null = null;
    private _htmlImageElement: HTMLImageElement|null = null;
    private readonly _imageCenterOffset: Vector2 = new Vector2(0, 0);
    private _zindex = 0;
    private _imageWidth = 0;
    private _imageHeight = 0;
    private _imageFlipX = false;
    private _imageFlipY = false;
    private _opacity = 1;
    private _pointerEvents = true;
    private _started = false;

    private _initializeFunction: (() => void)|null = null;

    public start(): void {
        this._started = true;
        this._initializeFunction?.call(this);
        if (!this._htmlImageElement) {
            this.asyncSetImagePath(GlobalConfig.defaultSpriteSrc);
        }
        
        ZaxisInitializer.checkAncestorZaxisInitializer(this.gameObject, this.onSortByZaxis.bind(this));
    }

    public onDestroy(): void {
        if (!this._started) return;
        if (this._sprite) this.transform.unsafeGetObject3D().remove(this._sprite); //it's safe because _sprite is not GameObject and remove is from onDestroy
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

    public asyncSetImagePath(path: string|null, onComplete?: () => void): void {
        if (!this._started) {
            this._initializeFunction = () => {
                this.asyncSetImagePath(path, onComplete);
            };
            return;
        }

        if (!path) path = CssSpriteRenderer._defaultImagePath;

        if (!this._htmlImageElement) {
            this._htmlImageElement = new Image();
        }

        this._htmlImageElement.src = path;

        const onLoad = (e: Event) => {
            const image = e.target as HTMLImageElement;
            image.removeEventListener("load", onLoad);
            if (!this._sprite) {
                this._sprite = new CSS3DObject(image);
                image.alt = this.gameObject.name + "_sprite_atlas";
                image.style.imageRendering = "pixelated";

                if (this._imageWidth === 0) this._imageWidth = image.width;
                if (this._imageHeight === 0) this._imageHeight = image.height;
                image.style.width = this._imageWidth + "px";
                image.style.height = this._imageHeight + "px";
                image.style.opacity = this._opacity.toString();
                image.style.pointerEvents = this._pointerEvents ? "auto" : "none";
                image.style.zIndex = Math.floor(this._zindex).toString();
                this.updateCenterOffset();
                this._sprite.scale.x = this._imageFlipX ? -1 : 1;
                this._sprite.scale.y = this._imageFlipY ? -1 : 1;
                this.transform.unsafeGetObject3D().add(this._sprite); //it's safe because _sprite is not GameObject and remove is from onDestroy
                
                if (this.enabled && this.gameObject.activeInHierarchy) this._sprite.visible = true;
                else this._sprite.visible = false;
                
                Transform.updateRawObject3DWorldMatrixRecursively(this._sprite);
                this.transform.enqueueRenderAttachedObject3D(this._sprite);
            }

            onComplete?.();
        };
        this._htmlImageElement.addEventListener("load", onLoad);
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
        if (this._htmlImageElement) {
            this._htmlImageElement.style.width = value + "px";
        }
        this.updateCenterOffset();
    }

    public get imageHeight(): number {
        return this._imageHeight;
    }

    public set imageHeight(value: number) {
        this._imageHeight = value;
        if (this._htmlImageElement) {
            this._htmlImageElement.style.height = value + "px";
        }
        this.updateCenterOffset();
    }

    public get imageFlipX(): boolean {
        return this._imageFlipX;
    }

    public set imageFlipX(value: boolean) {
        this._imageFlipX = value;
        if (this._sprite) {
            this._sprite.scale.x = this._imageFlipX ? -1 : 1;
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
            this._sprite.scale.y = this._imageFlipY ? -1 : 1;
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
