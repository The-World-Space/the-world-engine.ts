import { Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { PrefabRef } from "../../hierarchy_object/PrefabRef";
import { Camera } from "../render/Camera";
import { CssHtmlElementRenderer } from "../render/CssHtmlElementRenderer";
export class EditorGridRenderer extends Component {
    constructor() {
        super(...arguments);
        this._disallowMultipleComponent = true;
        this._requiredComponents = [Camera];
        this._cssHtmlRenderer = null;
        this._cssHtmlRendererObject = null;
        this._gridCellWidth = 16;
        this._gridCellHeight = 16;
        this._renderWidth = 180;
        this._renderHeight = 100;
        this._lineWidth = 0.2;
        this._lastPosition = new Vector3();
    }
    awake() {
        const cssHtmlRendererRef = new PrefabRef();
        const cssHemlRendererObjectRef = new PrefabRef();
        this.gameObject.addChildFromBuilder(this.engine.instantlater.buildGameObject("grid-renderer", new Vector3(0, 0, -1), undefined, new Vector3(this._lineWidth, this._lineWidth, this._lineWidth))
            .active(false)
            .withComponent(CssHtmlElementRenderer, c => {
            const element = document.createElement("div");
            element.style.backgroundImage = `
                        repeating-linear-gradient(#999 0 1px, transparent 1px 100%),
                        repeating-linear-gradient(90deg, #999 0 1px, transparent 1px 100%)
                    `;
            element.style.backgroundSize = `${this.gridCellWidth / this._lineWidth}px ${this.gridCellHeight / this._lineWidth}px`;
            c.elementWidth = this._renderWidth / this._lineWidth;
            c.elementHeight = this._renderHeight / this._lineWidth;
            c.pointerEvents = false;
            c.setElement(element);
        })
            .getComponent(CssHtmlElementRenderer, cssHtmlRendererRef)
            .getGameObject(cssHemlRendererObjectRef));
        this._cssHtmlRenderer = cssHtmlRendererRef.ref;
        this._cssHtmlRendererObject = cssHemlRendererObjectRef.ref;
    }
    onEnable() {
        this._cssHtmlRendererObject.activeSelf = true;
    }
    onDisable() {
        this._cssHtmlRendererObject.activeSelf = false;
    }
    update() {
        const position = this.gameObject.transform.position;
        const centerX = this._renderWidth / this._lineWidth / 2;
        const centerY = this._renderHeight / this._lineWidth / 2;
        const scaledGridCellWidth = this._gridCellWidth / this._lineWidth;
        const scaledGridCellHeight = this._gridCellHeight / this._lineWidth;
        const xRemainder = centerX % scaledGridCellWidth;
        const yRemainder = centerY % scaledGridCellHeight;
        if (!position.equals(this._lastPosition)) {
            this._cssHtmlRenderer.getElementContainer().style.backgroundPosition = `
                ${-position.x / this._lineWidth + xRemainder + scaledGridCellWidth / 2 - 0.5}px 
                ${position.y / this._lineWidth + yRemainder + scaledGridCellHeight / 2 - 0.5}px
            `;
        }
    }
    onDestroy() {
        this._cssHtmlRendererObject.destroy();
    }
    get gridCellWidth() {
        return this._gridCellWidth;
    }
    set gridCellWidth(value) {
        this._gridCellWidth = value;
    }
    get gridCellHeight() {
        return this._gridCellHeight;
    }
    set gridCellHeight(value) {
        this._gridCellHeight = value;
    }
    get renderWidth() {
        return this._renderWidth;
    }
    set renderWidth(value) {
        this._renderWidth = value;
    }
    get renderHeight() {
        return this._renderHeight;
    }
    set renderHeight(value) {
        this._renderHeight = value;
    }
    get lineWidth() {
        return this._lineWidth;
    }
    set lineWidth(value) {
        this._lineWidth = value;
    }
}
