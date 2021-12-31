import { Vector2 } from "three";
import { CSS3DSprite } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../hierarchy_object/Component";
import { ZaxisInitializer } from "./ZaxisInitializer";
import { GlobalConfig } from "../../../GlobalConfig";
export class CssSpriteRenderer extends Component {
    constructor() {
        super(...arguments);
        this._disallowMultipleComponent = true;
        this._sprite = null;
        this._htmlImageElement = null;
        this._imageCenterOffset = new Vector2(0, 0);
        this._zindex = 0;
        this._imageWidth = 0;
        this._imageHeight = 0;
        this._imageFlipX = false;
        this._imageFlipY = false;
        this._opacity = 1;
        this._pointerEvents = true;
        this._initializeFunction = null;
    }
    start() {
        var _a;
        (_a = this._initializeFunction) === null || _a === void 0 ? void 0 : _a.call(this);
        if (!this._htmlImageElement) {
            this.asyncSetImagePath(CssSpriteRenderer._defaultImagePath);
        }
        ZaxisInitializer.checkAncestorZaxisInitializer(this.gameObject, this.onSortByZaxis.bind(this));
    }
    onDestroy() {
        if (!this.started)
            return;
        if (this._sprite)
            this.gameObject.unsafeGetTransform().remove(this._sprite); //it"s safe because _sprite is not GameObject and remove is from onDestroy
    }
    onEnable() {
        if (this._sprite)
            this._sprite.visible = true;
    }
    onDisable() {
        if (this._sprite)
            this._sprite.visible = false;
    }
    onSortByZaxis(zaxis) {
        this._zindex = zaxis;
        if (this._sprite) {
            this._sprite.element.style.zIndex = Math.floor(this._zindex).toString();
        }
    }
    get imagePath() {
        var _a;
        return ((_a = this._htmlImageElement) === null || _a === void 0 ? void 0 : _a.src) || null;
    }
    asyncSetImagePath(path, onComplete) {
        if (!this.started && !this.starting) {
            this._initializeFunction = () => {
                this.asyncSetImagePath(path, onComplete);
            };
            return;
        }
        if (!path)
            path = CssSpriteRenderer._defaultImagePath;
        if (!this._htmlImageElement) {
            this._htmlImageElement = new Image();
        }
        this._htmlImageElement.src = path;
        const onLoad = (e) => {
            const image = e.target;
            image.removeEventListener("load", onLoad);
            if (!this._sprite) {
                this._sprite = new CSS3DSprite(image);
                image.alt = `${this.gameObject.name}_sprite_atlas`;
                image.style.imageRendering = "pixelated";
                if (this._imageWidth === 0)
                    this._imageWidth = image.width;
                if (this._imageHeight === 0)
                    this._imageHeight = image.height;
                image.style.width = `${this._imageWidth}px`;
                image.style.height = `${this._imageHeight}px`;
                image.style.opacity = this._opacity.toString();
                image.style.pointerEvents = this._pointerEvents ? "auto" : "none";
                image.style.zIndex = Math.floor(this._zindex).toString();
                this.updateCenterOffset();
                this._sprite.scale.x = this._imageFlipX ? -1 : 1;
                this._sprite.scale.y = this._imageFlipY ? -1 : 1;
                this.gameObject.unsafeGetTransform().add(this._sprite); //it"s safe because _sprite is not GameObject and remove is from onDestroy
                if (this.enabled && this.gameObject.activeInHierarchy)
                    this._sprite.visible = true;
                else
                    this._sprite.visible = false;
            }
            onComplete === null || onComplete === void 0 ? void 0 : onComplete();
        };
        this._htmlImageElement.addEventListener("load", onLoad);
    }
    updateCenterOffset() {
        if (this._sprite) {
            this._sprite.position.set(this._imageWidth * this._imageCenterOffset.x, this._imageHeight * this._imageCenterOffset.y, 0);
        }
    }
    get imageCenterOffset() {
        return this._imageCenterOffset.clone();
    }
    set imageCenterOffset(value) {
        this._imageCenterOffset.copy(value);
        this.updateCenterOffset();
    }
    get imageWidth() {
        return this._imageWidth;
    }
    set imageWidth(value) {
        this._imageWidth = value;
        if (this._htmlImageElement) {
            this._htmlImageElement.style.width = `${value}px`;
        }
        this.updateCenterOffset();
    }
    get imageHeight() {
        return this._imageHeight;
    }
    set imageHeight(value) {
        this._imageHeight = value;
        if (this._htmlImageElement) {
            this._htmlImageElement.style.height = `${value}px`;
        }
        this.updateCenterOffset();
    }
    get imageFlipX() {
        return this._imageFlipX;
    }
    set imageFlipX(value) {
        this._imageFlipX = value;
        if (this._sprite) {
            this._sprite.scale.x = this._imageFlipX ? -1 : 1;
        }
    }
    get imageFlipY() {
        return this._imageFlipY;
    }
    set imageFlipY(value) {
        this._imageFlipY = value;
        if (this._sprite) {
            this._sprite.scale.y = this._imageFlipY ? -1 : 1;
        }
    }
    get opacity() {
        return this._opacity;
    }
    set opacity(value) {
        this._opacity = value;
        if (this._htmlImageElement) {
            this._htmlImageElement.style.opacity = this._opacity.toString();
        }
    }
    get pointerEvents() {
        return this._pointerEvents;
    }
    set pointerEvents(value) {
        this._pointerEvents = value;
        if (this._htmlImageElement) {
            this._htmlImageElement.style.pointerEvents = this._pointerEvents ? "auto" : "none";
        }
    }
}
CssSpriteRenderer._defaultImagePath = GlobalConfig.defaultSpriteSrc;
