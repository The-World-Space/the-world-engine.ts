import { Vector2, Vector3 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../hierarchy_object/Component";
export class PointerGridEvent {
    constructor(gridPosition, position, button) {
        this._gridPosition = new Vector2(gridPosition.x, gridPosition.y);
        this._position = new Vector2(position.x, position.y);
        this._button = button;
    }
    get gridPosition() {
        return this._gridPosition;
    }
    get position() {
        return this._position;
    }
    get button() {
        return this._button;
    }
}
export class PointerGridInputListener extends Component {
    constructor() {
        super(...arguments);
        this._disallowMultipleComponent = true;
        this._css3DObject = null;
        this._htmlDivElement = null;
        this._gridCellWidth = 16;
        this._gridCellHeight = 16;
        this._gridCenter = new Vector2();
        this._inputWidth = 64;
        this._inputHeight = 64;
        this._zindex = 0;
        this._onPointerDownDelegates = [];
        this._onPointerUpDelegates = [];
        this._onPointerEnterDelegates = [];
        this._onPointerLeaveDelegates = [];
        this._onPointerMoveDelegates = [];
        this._onTouchStartFunc = null;
        this._touchMoveOccured = false;
        this._onMouseDownBind = this.onMouseDown.bind(this);
        this._onMouseUpBind = this.onMouseUp.bind(this);
        this._onMouseEnterBind = this.onMouseEnter.bind(this);
        this._onMouseLeaveBind = this.onMouseLeave.bind(this);
        this._onMouseMoveBind = this.onMouseMove.bind(this);
        this._onTouchStartBind = this.onTouchStart.bind(this);
        this._ononTouchEndBind = this.onTouchEnd.bind(this);
        this._onTouchMoveBind = this.onTouchMove.bind(this);
        this._onTouchCancelBind = this.onTouchCancel.bind(this);
        this._tempVector3 = new Vector3();
    }
    start() {
        this._htmlDivElement = document.createElement("div");
        this._css3DObject = new CSS3DObject(this._htmlDivElement);
        this._htmlDivElement.style.width = `${this._inputWidth}px`;
        this._htmlDivElement.style.height = `${this._inputHeight}px`;
        this._htmlDivElement.style.zIndex = Math.floor(this._zindex).toString();
        this._htmlDivElement.addEventListener("mousedown", this._onMouseDownBind);
        this._htmlDivElement.addEventListener("mouseup", this._onMouseUpBind);
        this._htmlDivElement.addEventListener("mouseenter", this._onMouseEnterBind);
        this._htmlDivElement.addEventListener("mouseleave", this._onMouseLeaveBind);
        this._htmlDivElement.addEventListener("mousemove", this._onMouseMoveBind);
        this._htmlDivElement.addEventListener("touchstart", this._onTouchStartBind);
        this._htmlDivElement.addEventListener("touchend", this._ononTouchEndBind);
        this._htmlDivElement.addEventListener("touchmove", this._onTouchMoveBind);
        this._htmlDivElement.addEventListener("touchcancel", this._onTouchCancelBind);
        this.gameObject.unsafeGetTransform().add(this._css3DObject);
        //it"s safe because _css3DObject is not a GameObject and i"m removing it from the scene in onDestroy
    }
    update() {
        let cameraLocalPosition;
        this.engine.cameraContainer.camera.getWorldPosition(this._tempVector3);
        if (this.gameObject.transform.parentTransform) {
            cameraLocalPosition = this.gameObject.transform.parentTransform.worldToLocal(this._tempVector3);
        }
        else { // if no parent transform, world position is same as local position
            cameraLocalPosition = this._tempVector3;
        }
        this._css3DObject.position.x = cameraLocalPosition.x;
        this._css3DObject.position.y = cameraLocalPosition.y;
    }
    onDestroy() {
        if (!this.started)
            return;
        if (this._htmlDivElement) { //It"s the intended useless branch
            this._htmlDivElement.removeEventListener("mousedown", this._onMouseDownBind);
            this._htmlDivElement.removeEventListener("mouseup", this._onMouseUpBind);
            this._htmlDivElement.removeEventListener("mouseenter", this._onMouseEnterBind);
            this._htmlDivElement.removeEventListener("mouseleave", this._onMouseLeaveBind);
            this._htmlDivElement.removeEventListener("mousemove", this._onMouseMoveBind);
            this._htmlDivElement.removeEventListener("touchstart", this._onTouchStartBind);
            this._htmlDivElement.removeEventListener("touchend", this._ononTouchEndBind);
            this._htmlDivElement.removeEventListener("touchmove", this._onTouchMoveBind);
            this._htmlDivElement.removeEventListener("touchcancel", this._onTouchCancelBind);
        }
        if (this._css3DObject) {
            this.gameObject.unsafeGetTransform().remove(this._css3DObject);
            //it"s safe because _css3DObject is not a GameObject and i"m removing it from the scene in onDestroy
        }
    }
    onSortByZaxis(zaxis) {
        this._zindex = zaxis;
        if (this._css3DObject) {
            this._css3DObject.element.style.zIndex = Math.floor(this._zindex).toString();
        }
    }
    createPointerGridEventFromOffset(offsetX, offsetY, button) {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
        const positionX = this._css3DObject.position.x + worldPosition.x - this._inputWidth / 2 +
            offsetX - this._gridCenter.x;
        const positionY = this._css3DObject.position.y + worldPosition.y - this._inputHeight / 2 +
            (this._inputHeight - offsetY) - this._gridCenter.y;
        const gridPositionX = Math.floor((positionX + this._gridCellWidth / 2) / this._gridCellWidth);
        const gridPositionY = Math.floor((positionY + this._gridCellHeight / 2) / this._gridCellHeight);
        return new PointerGridEvent(new Vector2(gridPositionX, gridPositionY), new Vector2(positionX, positionY), button);
    }
    onMouseDown(event) {
        const gridEvent = this.createPointerGridEventFromOffset(event.offsetX, event.offsetY, event.button);
        this._onPointerDownDelegates.forEach(delegate => delegate(gridEvent));
    }
    onMouseUp(event) {
        const gridEvent = this.createPointerGridEventFromOffset(event.offsetX, event.offsetY, event.button);
        this._onPointerUpDelegates.forEach(delegate => delegate(gridEvent));
    }
    onMouseEnter(event) {
        const gridEvent = this.createPointerGridEventFromOffset(event.offsetX, event.offsetY, event.button);
        this._onPointerEnterDelegates.forEach(delegate => delegate(gridEvent));
    }
    onMouseLeave(event) {
        const gridEvent = this.createPointerGridEventFromOffset(event.offsetX, event.offsetY, event.button);
        this._onPointerLeaveDelegates.forEach(delegate => delegate(gridEvent));
    }
    onMouseMove(event) {
        const gridEvent = this.createPointerGridEventFromOffset(event.offsetX, event.offsetY, event.button);
        this._onPointerMoveDelegates.forEach(delegate => delegate(gridEvent));
    }
    simulateMouseEvent(eventName, touch) {
        const simulatedEvent = new MouseEvent(eventName, {
            bubbles: true, cancelable: true, view: window, detail: 1,
            screenX: touch.screenX, screenY: touch.screenY, clientX: touch.clientX, clientY: touch.clientY,
            ctrlKey: false, altKey: false, shiftKey: false, metaKey: false, button: 0, relatedTarget: null
        });
        touch.target.dispatchEvent(simulatedEvent);
    }
    onTouchStart(event) {
        this._onTouchStartFunc = () => {
            this.simulateMouseEvent("mouseenter", event.touches[0]);
            this.simulateMouseEvent("mousedown", event.touches[0]);
        };
    }
    onTouchEnd(event) {
        if (!this._touchMoveOccured)
            return;
        this._touchMoveOccured = false;
        this.simulateMouseEvent("mouseup", event.changedTouches[0]);
        this.simulateMouseEvent("mouseleave", event.changedTouches[0]);
    }
    onTouchMove(event) {
        if (this._onTouchStartFunc) {
            this._onTouchStartFunc();
            this._onTouchStartFunc = null;
        }
        this.simulateMouseEvent("mousemove", event.touches[0]);
        this._touchMoveOccured = true;
    }
    onTouchCancel(event) {
        if (!this._touchMoveOccured)
            return;
        this._touchMoveOccured = false;
        this.simulateMouseEvent("mouseleave", event.changedTouches[0]);
    }
    addOnPointerDownEventListener(delegate) {
        this._onPointerDownDelegates.push(delegate);
    }
    addOnPointerUpEventListener(delegate) {
        this._onPointerUpDelegates.push(delegate);
    }
    addOnPointerEnterEventListener(delegate) {
        this._onPointerEnterDelegates.push(delegate);
    }
    addOnPointerLeaveEventListener(delegate) {
        this._onPointerLeaveDelegates.push(delegate);
    }
    addOnPointerMoveEventListener(delegate) {
        this._onPointerMoveDelegates.push(delegate);
    }
    removeOnPointerDownEventListener(delegate) {
        const index = this._onPointerDownDelegates.indexOf(delegate);
        if (index !== -1)
            this._onPointerDownDelegates.splice(index, 1);
    }
    removeOnPointerUpEventListener(delegate) {
        const index = this._onPointerUpDelegates.indexOf(delegate);
        if (index !== -1)
            this._onPointerUpDelegates.splice(index, 1);
    }
    removeOnPointerEnterEventListener(delegate) {
        const index = this._onPointerEnterDelegates.indexOf(delegate);
        if (index !== -1)
            this._onPointerEnterDelegates.splice(index, 1);
    }
    removeOnPointerLeaveEventListener(delegate) {
        const index = this._onPointerLeaveDelegates.indexOf(delegate);
        if (index !== -1)
            this._onPointerLeaveDelegates.splice(index, 1);
    }
    removeOnPointerMoveEventListener(delegate) {
        const index = this._onPointerMoveDelegates.indexOf(delegate);
        if (index !== -1)
            this._onPointerMoveDelegates.splice(index, 1);
    }
    get gridCenter() {
        return this._gridCenter.clone();
    }
    set gridCenter(value) {
        this._gridCenter.copy(value);
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
    setGridInfoFromCollideMap(collideMap) {
        this._gridCellWidth = collideMap.gridCellWidth;
        this._gridCellHeight = collideMap.gridCellHeight;
        this._gridCenter.set(collideMap.gridCenterX, collideMap.gridCenterY);
    }
    get inputWidth() {
        return this._inputWidth;
    }
    set inputWidth(value) {
        this._inputWidth = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.width = `${this._inputWidth}px`;
        }
    }
    get inputHeight() {
        return this._inputHeight;
    }
    set inputHeight(value) {
        this._inputHeight = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.height = `${this._inputHeight}px`;
        }
    }
}
