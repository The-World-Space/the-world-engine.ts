import { Vector2 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../hierarchy_object/Component";
import { ZaxisInitializer } from "./ZaxisInitializer";
export class CssIframeRenderer extends Component {
    constructor() {
        super(...arguments);
        this._disallowMultipleComponent = true;
        this._width = 128;
        this._height = 128;
        this._viewScale = 1;
        this._css3DObject = null;
        this._htmlIframeElement = null;
        this._iframeCenterOffset = new Vector2(0, 0);
        this._iframeSource = "";
        this._pointerEvents = true;
        this._zindex = 0;
    }
    start() {
        this.drawIframe();
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
    drawIframe() {
        const iframeWidth = this._width;
        const iframeHeight = this._height;
        this._htmlIframeElement = document.createElement("iframe");
        this._htmlIframeElement.title = `${this.gameObject.name}_iframe`;
        this._htmlIframeElement.width = (iframeWidth / this.viewScale).toString();
        this._htmlIframeElement.height = (iframeHeight / this.viewScale).toString();
        this._htmlIframeElement.src = this._iframeSource;
        this._css3DObject = new CSS3DObject(this._htmlIframeElement);
        this.updateCenterOffset();
        this._css3DObject.scale.set(this.viewScale, this.viewScale, this.viewScale);
        this.gameObject.unsafeGetTransform().add(this._css3DObject); //it"s safe because _css3DObject is not GameObject and remove is from onDestroy
        this._htmlIframeElement.style.border = "none";
        this._htmlIframeElement.style.zIndex = Math.floor(this._zindex).toString();
        this._htmlIframeElement.style.pointerEvents = this._pointerEvents ? "auto" : "none";
    }
    updateCenterOffset() {
        if (this._css3DObject) {
            this._css3DObject.position.set(this._width * this._iframeCenterOffset.x, this._height * this._iframeCenterOffset.y, 0);
        }
    }
    get width() {
        return this._width;
    }
    set width(value) {
        this._width = value;
        if (this._htmlIframeElement) {
            this._htmlIframeElement.width = value.toString();
        }
        this.updateCenterOffset();
    }
    get height() {
        return this._height;
    }
    set height(value) {
        this._height = value;
        if (this._htmlIframeElement) {
            this._htmlIframeElement.height = value.toString();
        }
        this.updateCenterOffset();
    }
    get viewScale() {
        return this._viewScale;
    }
    set viewScale(value) {
        this._viewScale = value;
        if (this._css3DObject) {
            this._htmlIframeElement.width = (this._width / this.viewScale).toString();
            this._htmlIframeElement.height = (this._height / this.viewScale).toString();
            this._css3DObject.scale.set(value, value, value);
        }
    }
    get iframeSource() {
        return this._iframeSource;
    }
    set iframeSource(value) {
        this._iframeSource = value;
        if (this._htmlIframeElement) {
            this._htmlIframeElement.src = value;
        }
    }
    get pointerEvents() {
        return this._pointerEvents;
    }
    set pointerEvents(value) {
        this._pointerEvents = value;
        if (this._htmlIframeElement) {
            this._htmlIframeElement.style.pointerEvents = value ? "auto" : "none";
        }
    }
    get iframeCenterOffset() {
        return this._iframeCenterOffset.clone();
    }
    set iframeCenterOffset(value) {
        this._iframeCenterOffset.copy(value);
        this.updateCenterOffset();
    }
    get htmlIframeElement() {
        return this._htmlIframeElement;
    }
}
