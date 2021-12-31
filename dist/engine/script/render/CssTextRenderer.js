import { Vector2 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../hierarchy_object/Component";
import { ZaxisInitializer } from "./ZaxisInitializer";
export var TextAlign;
(function (TextAlign) {
    TextAlign["Left"] = "left";
    TextAlign["Center"] = "center";
    TextAlign["Right"] = "right";
})(TextAlign || (TextAlign = {}));
export var FontWeight;
(function (FontWeight) {
    FontWeight["Normal"] = "normal";
    FontWeight["Bold"] = "bold";
})(FontWeight || (FontWeight = {}));
export class CssTextRenderer extends Component {
    constructor() {
        super(...arguments);
        this._disallowMultipleComponent = true;
        this._css3DObject = null;
        this._htmlDivElement = null;
        this._textCenterOffset = new Vector2(0, 0);
        this._zindex = 0;
        this._textWidth = 32;
        this._textHeight = 16;
        this._fontSize = 8;
        this._fontWeight = FontWeight.Normal;
        this._fontFamily = "Arial";
        this._textalign = TextAlign.Left;
        this._opacity = 1;
        this._pointerEvents = true;
        this._initializeFunction = null;
    }
    awake() {
        var _a;
        (_a = this._initializeFunction) === null || _a === void 0 ? void 0 : _a.call(this);
        if (!this._htmlDivElement) {
            this.text = CssTextRenderer._defaultText;
        }
    }
    start() {
        if (this._css3DObject) {
            if (this.enabled && this.gameObject.activeInHierarchy)
                this._css3DObject.visible = true;
            else
                this._css3DObject.visible = false;
        }
        ZaxisInitializer.checkAncestorZaxisInitializer(this.gameObject, this.onSortByZaxis.bind(this));
    }
    onEnable() {
        if (this._css3DObject)
            this._css3DObject.visible = true;
    }
    onDisable() {
        if (this._css3DObject)
            this._css3DObject.visible = false;
    }
    onDestroy() {
        if (!this.started)
            return;
        if (this._css3DObject)
            this.gameObject.unsafeGetTransform().remove(this._css3DObject); //it"s safe because _css3DObject is not GameObject and remove is from onDestroy
    }
    onSortByZaxis(zaxis) {
        this._zindex = zaxis;
        if (this._css3DObject) {
            this._css3DObject.element.style.zIndex = Math.floor(this._zindex).toString();
        }
    }
    get text() {
        var _a;
        return ((_a = this._htmlDivElement) === null || _a === void 0 ? void 0 : _a.textContent) || null;
    }
    set text(value) {
        if (!this.awakened && !this.awakening) {
            this._initializeFunction = () => {
                this.text = value;
            };
            return;
        }
        if (!value)
            value = CssTextRenderer._defaultText;
        if (!this._htmlDivElement) {
            this._htmlDivElement = document.createElement("div");
        }
        this._htmlDivElement.textContent = value;
        if (!this._css3DObject) {
            this._css3DObject = new CSS3DObject(this._htmlDivElement);
            if (this._textWidth === 0)
                this._textWidth = this._htmlDivElement.offsetWidth;
            if (this._textHeight === 0)
                this._textHeight = this._htmlDivElement.offsetHeight;
            this._htmlDivElement.style.width = `${this._textWidth}px`;
            this._htmlDivElement.style.height = `${this._textHeight}px`;
            this._htmlDivElement.style.fontSize = `${this._fontSize}px`;
            this._htmlDivElement.style.fontWeight = this._fontWeight;
            this._htmlDivElement.style.fontFamily = this._fontFamily;
            this._htmlDivElement.style.textAlign = this._textalign;
            this._htmlDivElement.style.opacity = this._opacity.toString();
            this._htmlDivElement.style.pointerEvents = this._pointerEvents ? "auto" : "none";
            this._htmlDivElement.style.zIndex = Math.floor(this._zindex).toString();
            this.updateCenterOffset();
            this.gameObject.unsafeGetTransform().add(this._css3DObject); //it"s safe because _css3DObject is not GameObject and remove is from onDestroy
            if (this.enabled && this.gameObject.activeInHierarchy)
                this._css3DObject.visible = true;
            else
                this._css3DObject.visible = false;
        }
    }
    updateCenterOffset() {
        if (this._css3DObject) {
            this._css3DObject.position.set(this._htmlDivElement.offsetWidth * this._textCenterOffset.x, this._htmlDivElement.offsetHeight * this._textCenterOffset.y, 0);
        }
    }
    get textCenterOffset() {
        return this._textCenterOffset.clone();
    }
    set textCenterOffset(value) {
        this._textCenterOffset.copy(value);
        this.updateCenterOffset();
    }
    get textWidth() {
        return this._textWidth;
    }
    set textWidth(value) {
        this._textWidth = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.width = `${value}px`;
        }
        this.updateCenterOffset();
    }
    get textHeight() {
        return this._textHeight;
    }
    set textHeight(value) {
        this._textHeight = value;
        if (this._css3DObject) {
            this._css3DObject.element.style.height = `${value}px`;
        }
        this.updateCenterOffset();
    }
    get fontSize() {
        return this._fontSize;
    }
    set fontSize(value) {
        this._fontSize = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.fontSize = `${value}px`;
        }
    }
    get fontWeight() {
        return this._fontWeight;
    }
    set fontWeight(value) {
        this._fontWeight = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.fontWeight = value;
        }
    }
    get fontFamily() {
        return this._fontFamily;
    }
    set fontFamily(value) {
        this._fontFamily = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.fontFamily = value;
        }
    }
    get textAlign() {
        return this._textalign;
    }
    set textAlign(value) {
        this._textalign = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.textAlign = value;
        }
    }
    get opacity() {
        return this._opacity;
    }
    set opacity(value) {
        this._opacity = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.opacity = value.toString();
        }
    }
    get pointerEvents() {
        return this._pointerEvents;
    }
    set pointerEvents(value) {
        this._pointerEvents = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.pointerEvents = value ? "auto" : "none";
        }
    }
}
CssTextRenderer._defaultText = "Text";
