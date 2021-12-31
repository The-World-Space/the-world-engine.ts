import { Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { CssHtmlElementRenderer } from "../render/CssHtmlElementRenderer";
import { PointerGridInputListener } from "./PointerGridInputListener";
import { PrefabRef } from "../../hierarchy_object/PrefabRef";
export class GridPointer extends Component {
    constructor() {
        super(...arguments);
        this._disallowMultipleComponent = true;
        this._requiredComponents = [PointerGridInputListener];
        this._pointerGridInputListener = null;
        this._pointerZoffset = 0;
        this._pointerObject = null;
        this._pointerRenderer = null;
        this._onPointerDownDelegates = [];
        this._onPointerUpDelegates = [];
        this._onPointerMoveDelegates = [];
        this._isMouseDown = false;
        this._onPointerEnterBind = this.onPointerEnter.bind(this);
        this._onPointerLeaveBind = this.onPointerLeave.bind(this);
        this._onPointerDownBind = this.onPointerDown.bind(this);
        this._onPointerUpBind = this.onPointerUp.bind(this);
        this._onPointerMoveBind = this.onPointerMove.bind(this);
    }
    start() {
        this._pointerGridInputListener = this.gameObject.getComponent(PointerGridInputListener);
        this._pointerGridInputListener.addOnPointerEnterEventListener(this._onPointerEnterBind);
        this._pointerGridInputListener.addOnPointerLeaveEventListener(this._onPointerLeaveBind);
        this._pointerGridInputListener.addOnPointerDownEventListener(this._onPointerDownBind);
        this._pointerGridInputListener.addOnPointerUpEventListener(this._onPointerUpBind);
        this._pointerGridInputListener.addOnPointerMoveEventListener(this._onPointerMoveBind);
        const pointerObject = new PrefabRef();
        const pointerRenderer = new PrefabRef();
        this.gameObject.addChildFromBuilder(this.engine.instantlater.buildGameObject("pointer", new Vector3(0, 0, this._pointerZoffset))
            .active(false)
            .withComponent(CssHtmlElementRenderer, c => {
            c.pointerEvents = false;
            const cursorElement = document.createElement("div");
            cursorElement.style.backgroundColor = "white";
            cursorElement.style.opacity = "0.3";
            c.setElement(cursorElement);
        })
            .getComponent(CssHtmlElementRenderer, pointerRenderer)
            .getGameObject(pointerObject));
        this._pointerObject = pointerObject.ref;
        this._pointerRenderer = pointerRenderer.ref;
    }
    onDestroy() {
        if (!this.started)
            return;
        if (this._pointerGridInputListener) {
            this._pointerGridInputListener.removeOnPointerEnterEventListener(this._onPointerEnterBind);
            this._pointerGridInputListener.removeOnPointerLeaveEventListener(this._onPointerLeaveBind);
            this._pointerGridInputListener.removeOnPointerDownEventListener(this._onPointerDownBind);
            this._pointerGridInputListener.removeOnPointerUpEventListener(this._onPointerUpBind);
            this._pointerGridInputListener.removeOnPointerMoveEventListener(this._onPointerMoveBind);
        }
    }
    onPointerEnter(event) {
        this._pointerObject.activeSelf = true;
        this.onPointerMove(event);
    }
    onPointerLeave(event) {
        if (this._isMouseDown)
            this.onPointerUp(event);
        this._pointerObject.activeSelf = false;
    }
    onPointerDown(event) {
        var _a;
        this._isMouseDown = true;
        this.updatePointerPosition(event);
        const container = (_a = this._pointerRenderer) === null || _a === void 0 ? void 0 : _a.getElementContainer();
        if (container)
            container.style.backgroundColor = "#DDDDDD";
        this._onPointerDownDelegates.forEach(delegate => delegate(event));
    }
    onPointerUp(event) {
        var _a;
        this._isMouseDown = false;
        this.updatePointerPosition(event);
        const container = (_a = this._pointerRenderer) === null || _a === void 0 ? void 0 : _a.getElementContainer();
        if (container)
            container.style.backgroundColor = "white";
        this._onPointerUpDelegates.forEach(delegate => delegate(event));
    }
    onPointerMove(event) {
        this.updatePointerPosition(event);
        this._onPointerMoveDelegates.forEach(delegate => delegate(event));
    }
    updatePointerPosition(event) {
        const gridCellWidth = this._pointerGridInputListener.gridCellWidth;
        const gridCellHeight = this._pointerGridInputListener.gridCellHeight;
        const gridCenter = this._pointerGridInputListener.gridCenter;
        const positionX = event.gridPosition.x * gridCellWidth + gridCenter.x;
        const positionY = event.gridPosition.y * gridCellHeight + gridCenter.y;
        this._pointerObject.transform.position.set(positionX, positionY, this._pointerZoffset);
    }
    addOnPointerDownEventListener(delegate) {
        this._onPointerDownDelegates.push(delegate);
    }
    removeOnPointerDownEventListener(delegate) {
        const index = this._onPointerDownDelegates.indexOf(delegate);
        if (index !== -1)
            this._onPointerDownDelegates.splice(index, 1);
    }
    addOnPointerUpEventListener(delegate) {
        this._onPointerUpDelegates.push(delegate);
    }
    removeOnPointerUpEventListener(delegate) {
        const index = this._onPointerUpDelegates.indexOf(delegate);
        if (index !== -1)
            this._onPointerUpDelegates.splice(index, 1);
    }
    addOnPointerMoveEventListener(delegate) {
        this._onPointerMoveDelegates.push(delegate);
    }
    removeOnPointerMoveEventListener(delegate) {
        const index = this._onPointerMoveDelegates.indexOf(delegate);
        if (index !== -1)
            this._onPointerMoveDelegates.splice(index, 1);
    }
    get pointerZoffset() {
        return this._pointerZoffset;
    }
    set pointerZoffset(value) {
        this._pointerZoffset = value;
    }
}
