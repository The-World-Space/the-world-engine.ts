/**
 * engine global input event handler
 */
export class InputHandler {
    constructor(renderTargetDom) {
        this._onKeyDownDelegates = [];
        this._onKeyUpDelegates = [];
        this._onWheelDelegates = [];
        this._onPointerDownDelegates = [];
        this._onPointerUpDelegates = [];
        this._onPointerEnterDelegates = [];
        this._onPointerLeaveDelegates = [];
        this._onPointerMoveDelegates = [];
        this._touchMoveOccured = false;
        this._onTouchStartFunc = null;
        this._lastMouseDownEvent = null;
        this._lastMouseEnterEvent = null;
        this._handleKeyDownBind = this.handleKeyDown.bind(this);
        this._handleKeyUpBind = this.handleKeyUp.bind(this);
        this._handleWheelBind = this.handleWheel.bind(this);
        this._handleMouseDownBind = this.handleMouseDown.bind(this);
        this._handleMouseUpBind = this.handleMouseUp.bind(this);
        this._handleMouseEnterBind = this.handleMouseEnter.bind(this);
        this._handleMouseLeaveBind = this.handleMouseLeave.bind(this);
        this._handleMouseMoveBind = this.handleMouseMove.bind(this);
        this._handleTouchStartBind = this.handleTouchStart.bind(this);
        this._handleTouchEndBind = this.handleTouchEnd.bind(this);
        this._handleTouchMoveBind = this.handleTouchMove.bind(this);
        this._handleTouchCancelBind = this.handleTouchCancel.bind(this);
        this._map = new Map();
        this._isDisposed = false;
        this._renderTargetDom = renderTargetDom;
    }
    /**
     * keyboard input map. key is key name, value is pressed or not
     */
    get map() {
        return this._map;
    }
    /**
     * stop event handle and dispose this object
     */
    dispose() {
        this.stopHandleEvents();
        this._isDisposed = true;
    }
    /**
     * start engine global input event handling. you can use this when you want focus the game view
     */
    startHandleEvents() {
        if (this._isDisposed) {
            throw new Error("InputHandler is disposed.");
        }
        window.addEventListener("keydown", this._handleKeyDownBind);
        window.addEventListener("keyup", this._handleKeyUpBind);
        window.addEventListener("wheel", this._handleWheelBind);
        this._renderTargetDom.addEventListener("mousedown", this._handleMouseDownBind);
        this._renderTargetDom.addEventListener("mouseup", this._handleMouseUpBind);
        this._renderTargetDom.addEventListener("mouseenter", this._handleMouseEnterBind);
        this._renderTargetDom.addEventListener("mouseleave", this._handleMouseLeaveBind);
        this._renderTargetDom.addEventListener("mousemove", this._handleMouseMoveBind);
        this._renderTargetDom.addEventListener("touchstart", this._handleTouchStartBind);
        this._renderTargetDom.addEventListener("touchend", this._handleTouchEndBind);
        this._renderTargetDom.addEventListener("touchmove", this._handleTouchMoveBind);
        this._renderTargetDom.addEventListener("touchcancel", this._handleTouchCancelBind);
    }
    /**
     * stop engine global input event handling. you can use this when you want blur the game view
     */
    stopHandleEvents() {
        if (this._lastMouseDownEvent)
            this.handleMouseUp(this._lastMouseDownEvent);
        if (this._lastMouseEnterEvent)
            this.handleMouseLeave(this._lastMouseEnterEvent);
        this._map.clear();
        window.removeEventListener("keydown", this._handleKeyDownBind);
        window.removeEventListener("keyup", this._handleKeyUpBind);
        window.removeEventListener("wheel", this._handleWheelBind);
        this._renderTargetDom.removeEventListener("mousedown", this._handleMouseDownBind);
        this._renderTargetDom.removeEventListener("mouseup", this._handleMouseUpBind);
        this._renderTargetDom.removeEventListener("mouseenter", this._handleMouseEnterBind);
        this._renderTargetDom.removeEventListener("mouseleave", this._handleMouseLeaveBind);
        this._renderTargetDom.removeEventListener("mousemove", this._handleMouseMoveBind);
        this._renderTargetDom.removeEventListener("touchstart", this._handleTouchStartBind);
        this._renderTargetDom.removeEventListener("touchend", this._handleTouchEndBind);
        this._renderTargetDom.removeEventListener("touchmove", this._handleTouchMoveBind);
        this._renderTargetDom.removeEventListener("touchcancel", this._handleTouchCancelBind);
    }
    simulateMouseEvent(eventName, touch) {
        const simulatedEvent = new MouseEvent(eventName, {
            bubbles: true, cancelable: true, view: window, detail: 1,
            screenX: touch.screenX, screenY: touch.screenY, clientX: touch.clientX, clientY: touch.clientY,
            ctrlKey: false, altKey: false, shiftKey: false, metaKey: false, button: 0, relatedTarget: null
        });
        touch.target.dispatchEvent(simulatedEvent);
    }
    handleKeyDown(event) {
        this._map.set(event.key, true);
        this._onKeyDownDelegates.forEach(delegate => delegate(event));
    }
    handleKeyUp(event) {
        this._map.set(event.key, false);
        this._onKeyUpDelegates.forEach(delegate => delegate(event));
    }
    handleWheel(event) {
        this._onWheelDelegates.forEach(delegate => delegate(event));
    }
    handleMouseDown(event) {
        this._lastMouseDownEvent = event;
        this._onPointerDownDelegates.forEach(delegate => delegate(event));
    }
    handleMouseUp(event) {
        this._lastMouseDownEvent = null;
        this._onPointerUpDelegates.forEach(delegate => delegate(event));
    }
    handleMouseEnter(event) {
        this._lastMouseEnterEvent = event;
        this._onPointerEnterDelegates.forEach(delegate => delegate(event));
    }
    handleMouseLeave(event) {
        this._lastMouseEnterEvent = null;
        this._onPointerLeaveDelegates.forEach(delegate => delegate(event));
    }
    handleMouseMove(event) {
        this._lastMouseDownEvent = event;
        this._onPointerMoveDelegates.forEach(delegate => delegate(event));
    }
    handleTouchStart(event) {
        this._onTouchStartFunc = () => {
            this.simulateMouseEvent("mouseenter", event.touches[0]);
            this.simulateMouseEvent("mousedown", event.touches[0]);
        };
    }
    handleTouchEnd(event) {
        if (!this._touchMoveOccured)
            return;
        this._touchMoveOccured = false;
        this.simulateMouseEvent("mouseup", event.changedTouches[0]);
        this.simulateMouseEvent("mouseleave", event.changedTouches[0]);
    }
    handleTouchMove(event) {
        if (this._onTouchStartFunc) {
            this._onTouchStartFunc();
            this._onTouchStartFunc = null;
        }
        this.simulateMouseEvent("mousemove", event.touches[0]);
        this._touchMoveOccured = true;
    }
    handleTouchCancel(event) {
        if (!this._touchMoveOccured)
            return;
        this._touchMoveOccured = false;
        this.simulateMouseEvent("mouseleave", event.changedTouches[0]);
    }
    /**
     * add onKeyDown event listener
     * @param delegate this function will be called when key down event occured
     */
    addOnKeyDownEventListener(delegate) {
        this._onKeyDownDelegates.push(delegate);
    }
    /**
     * add onKeyUp event listener
     * @param delegate this function will be called when key up event occured
     */
    addOnKeyUpEventListener(delegate) {
        this._onKeyUpDelegates.push(delegate);
    }
    /**
     * add onWheel event listener
     * @param delegate this function will be called when wheel event occured
     */
    addOnWheelEventListener(delegate) {
        this._onWheelDelegates.push(delegate);
    }
    /**
     * add onPointerDown event listener
     * @param delegate this function will be called when pointer down event occured
     */
    addOnPointerDownEventListener(delegate) {
        this._onPointerDownDelegates.push(delegate);
    }
    /**
     * add onPointerUp event listener
     * @param delegate this function will be called when pointer up event occured
     */
    addOnPointerUpEventListener(delegate) {
        this._onPointerUpDelegates.push(delegate);
    }
    /**
     * add onPointerEnter event listener
     * @param delegate this function will be called when pointer enter event occured
     */
    addOnPointerEnterEventListener(delegate) {
        this._onPointerEnterDelegates.push(delegate);
    }
    /**
     * add onPointerLeave event listener
     * @param delegate this function will be called when pointer leave event occured
     */
    addOnPointerLeaveEventListener(delegate) {
        this._onPointerLeaveDelegates.push(delegate);
    }
    /**
     * add onPointerMove event listener
     * @param delegate this function will be called when pointer move event occured
     */
    addOnPointerMoveEventListener(delegate) {
        this._onPointerMoveDelegates.push(delegate);
    }
    /**
     * remove onKeyDown event listener
     * @param delegate remove delegate from the list of event listeners
     */
    removeOnKeyDownEventListener(delegate) {
        const index = this._onKeyDownDelegates.indexOf(delegate);
        if (index !== -1)
            this._onKeyDownDelegates.splice(index, 1);
    }
    /**
     * remove onKeyUp event listener
     * @param delegate remove delegate from the list of event listeners
     */
    removeOnKeyUpEventListener(delegate) {
        const index = this._onKeyUpDelegates.indexOf(delegate);
        if (index !== -1)
            this._onKeyUpDelegates.splice(index, 1);
    }
    /**
     * remove onWheel event listener
     * @param delegate remove delegate from the list of event listeners
     */
    removeOnWheelEventListener(delegate) {
        const index = this._onWheelDelegates.indexOf(delegate);
        if (index !== -1)
            this._onWheelDelegates.splice(index, 1);
    }
    /**
     * remove onPointerDown event listener
     * @param delegate remove delegate from the list of event listeners
     */
    removeOnPointerDownEventListener(delegate) {
        const index = this._onPointerDownDelegates.indexOf(delegate);
        if (index !== -1)
            this._onPointerDownDelegates.splice(index, 1);
    }
    /**
     * remove onPointerUp event listener
     * @param delegate remove delegate from the list of event listeners
     */
    removeOnPointerUpEventListener(delegate) {
        const index = this._onPointerUpDelegates.indexOf(delegate);
        if (index !== -1)
            this._onPointerUpDelegates.splice(index, 1);
    }
    /**
     * remove onPointerEnter event listener
     * @param delegate remove delegate from the list of event listeners
     */
    removeOnPointerEnterEventListener(delegate) {
        const index = this._onPointerEnterDelegates.indexOf(delegate);
        if (index !== -1)
            this._onPointerEnterDelegates.splice(index, 1);
    }
    /**
     * remove onPointerLeave event listener
     * @param delegate remove delegate from the list of event listeners
     */
    removeOnPointerLeaveEventListener(delegate) {
        const index = this._onPointerLeaveDelegates.indexOf(delegate);
        if (index !== -1)
            this._onPointerLeaveDelegates.splice(index, 1);
    }
    /**
     * remove onPointerMove event listener
     * @param delegate remove delegate from the list of event listeners
     */
    removeOnPointerMoveEventListener(delegate) {
        const index = this._onPointerMoveDelegates.indexOf(delegate);
        if (index !== -1)
            this._onPointerMoveDelegates.splice(index, 1);
    }
}
