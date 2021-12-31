import { Vector2 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../hierarchy_object/Component";
import { ZaxisInitializer } from "./ZaxisInitializer";
export class CssHtmlElementRenderer extends Component {
    constructor() {
        super(...arguments);
        this._disallowMultipleComponent = true;
        this._css3DObject = null;
        this._htmlDivElement = null;
        this._centerOffset = new Vector2(0, 0);
        this._zindex = 0;
        this._elementWidth = 16;
        this._elementHeight = 16;
        this._autoSize = false;
        this._pointerEvents = true;
        this._initializeFunction = null;
    }
    awake() {
        var _a;
        (_a = this._initializeFunction) === null || _a === void 0 ? void 0 : _a.call(this);
        if (!this._htmlDivElement) {
            this.setElement(CssHtmlElementRenderer._defaultElement);
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
    onDestroy() {
        if (!this.started)
            return;
        if (this._css3DObject)
            this.gameObject.unsafeGetTransform().remove(this._css3DObject); //it"s safe because _css3DObject is not GameObject and remove is from onDestroy
    }
    onEnable() {
        if (this._css3DObject)
            this._css3DObject.visible = true;
    }
    onDisable() {
        if (this._css3DObject)
            this._css3DObject.visible = false;
    }
    onSortByZaxis(zaxis) {
        this._zindex = zaxis;
        if (this._css3DObject) {
            this._css3DObject.element.style.zIndex = Math.floor(this._zindex).toString();
        }
    }
    getElementContainer() {
        return this._htmlDivElement;
    }
    setElement(value) {
        if (!this.awakened && !this.awakening) {
            this._initializeFunction = () => {
                this.setElement(value);
            };
            return;
        }
        if (!value)
            value = CssHtmlElementRenderer._defaultElement;
        if (!this._htmlDivElement) {
            this._htmlDivElement = document.createElement("div");
        }
        this._htmlDivElement = value;
        if (!this._css3DObject) {
            this._css3DObject = new CSS3DObject(this._htmlDivElement);
            if (this._elementWidth === 0)
                this._elementWidth = this._htmlDivElement.offsetWidth;
            if (this._elementHeight === 0)
                this._elementHeight = this._htmlDivElement.offsetHeight;
            if (this._autoSize) {
                this._htmlDivElement.style.width = "auto";
                this._htmlDivElement.style.height = "auto";
            }
            else {
                this._htmlDivElement.style.width = `${this._elementWidth}px`;
                this._htmlDivElement.style.height = `${this._elementHeight}px`;
            }
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
            this._css3DObject.position.set(this._htmlDivElement.offsetWidth * this._centerOffset.x, this._htmlDivElement.offsetHeight * this._centerOffset.y, 0);
        }
    }
    get centerOffset() {
        return this._centerOffset.clone();
    }
    set centerOffset(value) {
        this._centerOffset.copy(value);
        this.updateCenterOffset();
    }
    get elementWidth() {
        return this._elementWidth;
    }
    set elementWidth(value) {
        this._elementWidth = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.width = `${value}px`;
        }
        this.updateCenterOffset();
    }
    get elementHeight() {
        return this._elementHeight;
    }
    set elementHeight(value) {
        this._elementHeight = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.height = `${value}px`;
        }
        this.updateCenterOffset();
    }
    get autoSize() {
        return this._autoSize;
    }
    set autoSize(value) {
        this._autoSize = value;
        if (this._htmlDivElement) {
            if (value) {
                this._htmlDivElement.style.width = "auto";
                this._htmlDivElement.style.height = "auto";
            }
            else {
                this._htmlDivElement.style.width = `${this._elementWidth}px`;
                this._htmlDivElement.style.height = `${this._elementHeight}px`;
            }
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
CssHtmlElementRenderer._defaultElement = document.createElement("div");
