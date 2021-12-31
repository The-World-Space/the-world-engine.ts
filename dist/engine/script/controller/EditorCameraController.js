import { Vector2, Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { Camera } from "../render/Camera";
export class EditorCameraController extends Component {
    constructor() {
        super(...arguments);
        this._disallowMultipleComponent = true;
        this._requiredComponents = [Camera];
        this._camera = null;
        this._mouseMiddleDown = false;
        this._lastOffset = new Vector2();
        this._minViewSize = 30;
        this._maxViewSize = 100;
        this._defaultViewSize = 200;
        this._currentViewSize = 200;
        this._defaultPosition = new Vector3();
        this._onKeyDownBind = this.onKeyDown.bind(this);
        this._onWheelBind = this.onWheel.bind(this);
        this._onPointerDownBind = this.onPointerDown.bind(this);
        this._onPointerUpBind = this.onPointerUp.bind(this);
        this._onPointerMoveBind = this.onPointerMove.bind(this);
        this._onPointerLeaveBind = this.onPointerLeave.bind(this);
        this._onResizeBind = this.onResize.bind(this);
    }
    awake() {
        this._camera = this.gameObject.getComponent(Camera);
        const aspect = this.engine.screen.width / this.engine.screen.height;
        this._defaultViewSize = this._camera.viewSize;
        this._defaultPosition.copy(this.gameObject.transform.position);
        this._currentViewSize = this._defaultViewSize;
        this._camera.viewSize = this._currentViewSize / aspect;
    }
    onEnable() {
        const input = this.engine.input;
        input.addOnKeyDownEventListener(this._onKeyDownBind);
        input.addOnWheelEventListener(this._onWheelBind);
        input.addOnPointerDownEventListener(this._onPointerDownBind);
        input.addOnPointerUpEventListener(this._onPointerUpBind);
        input.addOnPointerMoveEventListener(this._onPointerMoveBind);
        input.addOnPointerLeaveEventListener(this._onPointerLeaveBind);
        this.engine.screen.addOnResizeEventListener(this._onResizeBind);
    }
    onDisable() {
        const input = this.engine.input;
        input.removeOnKeyDownEventListener(this._onKeyDownBind);
        input.removeOnWheelEventListener(this._onWheelBind);
        input.removeOnPointerDownEventListener(this._onPointerDownBind);
        input.removeOnPointerUpEventListener(this._onPointerUpBind);
        input.removeOnPointerMoveEventListener(this._onPointerMoveBind);
        input.removeOnPointerLeaveEventListener(this._onPointerLeaveBind);
        this.engine.screen.removeOnResizeEventListener(this._onResizeBind);
    }
    onKeyDown(event) {
        if (event.key === " ") {
            this._currentViewSize = this._defaultViewSize;
            this.onResize();
            this.gameObject.transform.position.copy(this._defaultPosition);
        }
    }
    onWheel(event) {
        this._currentViewSize += event.deltaY * 0.1;
        if (this._currentViewSize < this._minViewSize) {
            this._currentViewSize = this._minViewSize;
        }
        else if (this._currentViewSize > this._maxViewSize) {
            this._currentViewSize = this._maxViewSize;
        }
        this.onResize();
    }
    onPointerDown(event) {
        this._lastOffset.set(event.clientX / this.engine.screen.width, event.clientY / this.engine.screen.height);
        if (event.button === 1) {
            this._mouseMiddleDown = true;
        }
    }
    onPointerUp(event) {
        if (event.button === 1) {
            this._mouseMiddleDown = false;
        }
    }
    onPointerLeave(_event) {
        this._mouseMiddleDown = false;
    }
    onPointerMove(event) {
        if (!this._mouseMiddleDown)
            return;
        const clientOffsetX = event.clientX / this.engine.screen.width;
        const clientOffsetY = event.clientY / this.engine.screen.height;
        const clientXdiff = clientOffsetX - this._lastOffset.x;
        const clientYdiff = clientOffsetY - this._lastOffset.y;
        const aspect = this.engine.screen.width / this.engine.screen.height;
        this.gameObject.transform.position.x -= clientXdiff * this._camera.viewSize * aspect;
        this.gameObject.transform.position.y += clientYdiff * this._camera.viewSize;
        this._lastOffset.set(clientOffsetX, clientOffsetY);
    }
    onResize() {
        const aspect = this.engine.screen.width / this.engine.screen.height;
        this._camera.viewSize = this._currentViewSize / aspect;
    }
    get minViewSize() {
        return this._minViewSize;
    }
    set minViewSize(value) {
        this._minViewSize = value;
        if (this._currentViewSize < this._minViewSize) {
            this._currentViewSize = this._minViewSize;
            this.onResize();
        }
    }
    get maxViewSize() {
        return this._maxViewSize;
    }
    set maxViewSize(value) {
        this._maxViewSize = value;
        if (this._currentViewSize > this._maxViewSize) {
            this._currentViewSize = this._maxViewSize;
            this.onResize();
        }
    }
}
