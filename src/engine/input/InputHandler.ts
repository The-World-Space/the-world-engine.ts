import { IInputEventHandleable } from "./IInputEventHandleable";

/**
 * engine global input event handler
 */
export class InputHandler implements IInputEventHandleable {
    private _map: Map<string, boolean>;
    private _isDisposed: boolean;
    private _renderTargetDom: HTMLElement;
    private _onKeyDownDelegates: ((event: KeyboardEvent) => void)[] = [];
    private _onKeyUpDelegates: ((event: KeyboardEvent) => void)[] = [];
    private _onWheelDelegates: ((event: WheelEvent) => void)[] = [];
    private _onPointerDownDelegates: ((event: MouseEvent) => void)[] = [];
    private _onPointerUpDelegates: ((event: MouseEvent) => void)[] = [];
    private _onPointerEnterDelegates: ((event: MouseEvent) => void)[] = [];
    private _onPointerLeaveDelegates: ((event: MouseEvent) => void)[] = [];
    private _onPointerMoveDelegates: ((event: MouseEvent) => void)[] = [];
    private _touchMoveOccured = false;
    private _onTouchStartFunc: (() => void)|null = null;
    private _lastMouseDownEvent: MouseEvent|null = null;
    private _lastMouseEnterEvent: MouseEvent|null = null;

    private readonly _handleKeyDownBind = this.handleKeyDown.bind(this);
    private readonly _handleKeyUpBind = this.handleKeyUp.bind(this);
    private readonly _handleWheelBind = this.handleWheel.bind(this);
    private readonly _handleMouseDownBind = this.handleMouseDown.bind(this);
    private readonly _handleMouseUpBind = this.handleMouseUp.bind(this);
    private readonly _handleMouseEnterBind = this.handleMouseEnter.bind(this);
    private readonly _handleMouseLeaveBind = this.handleMouseLeave.bind(this);
    private readonly _handleMouseMoveBind = this.handleMouseMove.bind(this);
    private readonly _handleTouchStartBind = this.handleTouchStart.bind(this);
    private readonly _handleTouchEndBind = this.handleTouchEnd.bind(this);
    private readonly _handleTouchMoveBind = this.handleTouchMove.bind(this);
    private readonly _handleTouchCancelBind = this.handleTouchCancel.bind(this);

    public constructor(renderTargetDom: HTMLElement) {
        this._map = new Map<string, boolean>();
        this._isDisposed = false;
        this._renderTargetDom = renderTargetDom;
    }

    /**
     * keyboard input map. key is key name, value is pressed or not
     */
    public get map(): ReadonlyMap<string, boolean> {
        return this._map;
    }

    /**
     * stop event handle and dispose this object
     */
    public dispose(): void {
        this.stopHandleEvents();
        this._isDisposed = true;
    }

    /**
     * start engine global input event handling. you can use this when you want focus the game view
     */
    public startHandleEvents(): void {
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
    public stopHandleEvents(): void {
        if (this._lastMouseDownEvent) this.handleMouseUp(this._lastMouseDownEvent);
        if (this._lastMouseEnterEvent) this.handleMouseLeave(this._lastMouseEnterEvent);

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

    private simulateMouseEvent(eventName: string, touch: Touch): void {
        const simulatedEvent = new MouseEvent(
            eventName, {
                bubbles: true, cancelable: true, view: window, detail: 1,
                screenX: touch.screenX, screenY: touch.screenY, clientX: touch.clientX, clientY: touch.clientY,
                ctrlKey: false, altKey: false, shiftKey: false, metaKey: false, button: 0, relatedTarget: null
            });
        touch.target.dispatchEvent(simulatedEvent);
    }

    private handleKeyDown(event: KeyboardEvent) {
        this._map.set(event.key, true);
        this._onKeyDownDelegates.forEach(delegate => delegate(event));
    }
    
    private handleKeyUp(event: KeyboardEvent) {
        this._map.set(event.key, false);
        this._onKeyUpDelegates.forEach(delegate => delegate(event));
    }

    private handleWheel(event: WheelEvent): void {
        this._onWheelDelegates.forEach(delegate => delegate(event));
    }

    private handleMouseDown(event: MouseEvent): void {
        this._lastMouseDownEvent = event;
        this._onPointerDownDelegates.forEach(delegate => delegate(event));
    }

    private handleMouseUp(event: MouseEvent): void {
        this._lastMouseDownEvent = null;
        this._onPointerUpDelegates.forEach(delegate => delegate(event));
    }

    private handleMouseEnter(event: MouseEvent): void {
        this._lastMouseEnterEvent = event;
        this._onPointerEnterDelegates.forEach(delegate => delegate(event));
    }

    private handleMouseLeave(event: MouseEvent): void {
        this._lastMouseEnterEvent = null;
        this._onPointerLeaveDelegates.forEach(delegate => delegate(event));
    }

    private handleMouseMove(event: MouseEvent): void {
        this._lastMouseDownEvent = event;
        this._onPointerMoveDelegates.forEach(delegate => delegate(event));
    }

    private handleTouchStart(event: TouchEvent): void {
        this._onTouchStartFunc = () => {
            this.simulateMouseEvent("mouseenter", event.touches[0]);
            this.simulateMouseEvent("mousedown", event.touches[0]);
        };
    }

    private handleTouchEnd(event: TouchEvent): void {
        if (!this._touchMoveOccured) return;
        this._touchMoveOccured = false;
        this.simulateMouseEvent("mouseup", event.changedTouches[0]);
        this.simulateMouseEvent("mouseleave", event.changedTouches[0]);
    }

    private handleTouchMove(event: TouchEvent): void {
        if (this._onTouchStartFunc) {
            this._onTouchStartFunc();
            this._onTouchStartFunc = null;
        }
        this.simulateMouseEvent("mousemove", event.touches[0]);
        this._touchMoveOccured = true;
    }

    private handleTouchCancel(event: TouchEvent): void {
        if (!this._touchMoveOccured) return;
        this._touchMoveOccured = false;
        this.simulateMouseEvent("mouseleave", event.changedTouches[0]);
    }

    /**
     * add onKeyDown event listener
     * @param delegate this function will be called when key down event occured
     */
    public addOnKeyDownEventListener(delegate: (event: KeyboardEvent) => void): void {
        this._onKeyDownDelegates.push(delegate);
    }

    /**
     * add onKeyUp event listener
     * @param delegate this function will be called when key up event occured
     */
    public addOnKeyUpEventListener(delegate: (event: KeyboardEvent) => void): void {
        this._onKeyUpDelegates.push(delegate);
    }

    /**
     * add onWheel event listener
     * @param delegate this function will be called when wheel event occured
     */
    public addOnWheelEventListener(delegate: (event: WheelEvent) => void): void {
        this._onWheelDelegates.push(delegate);
    }

    /**
     * add onPointerDown event listener
     * @param delegate this function will be called when pointer down event occured
     */
    public addOnPointerDownEventListener(delegate: (event: MouseEvent) => void): void {
        this._onPointerDownDelegates.push(delegate);
    }

    /**
     * add onPointerUp event listener
     * @param delegate this function will be called when pointer up event occured
     */
    public addOnPointerUpEventListener(delegate: (event: MouseEvent) => void): void {
        this._onPointerUpDelegates.push(delegate);
    }

    /**
     * add onPointerEnter event listener
     * @param delegate this function will be called when pointer enter event occured
     */
    public addOnPointerEnterEventListener(delegate: (event: MouseEvent) => void): void {
        this._onPointerEnterDelegates.push(delegate);
    }

    /**
     * add onPointerLeave event listener
     * @param delegate this function will be called when pointer leave event occured
     */
    public addOnPointerLeaveEventListener(delegate: (event: MouseEvent) => void): void {
        this._onPointerLeaveDelegates.push(delegate);
    }

    /**
     * add onPointerMove event listener
     * @param delegate this function will be called when pointer move event occured
     */
    public addOnPointerMoveEventListener(delegate: (event: MouseEvent) => void): void {
        this._onPointerMoveDelegates.push(delegate);
    }

    /**
     * remove onKeyDown event listener
     * @param delegate remove delegate from the list of event listeners
     */
    public removeOnKeyDownEventListener(delegate: (event: KeyboardEvent) => void): void {
        const index = this._onKeyDownDelegates.indexOf(delegate);
        if (index !== -1) this._onKeyDownDelegates.splice(index, 1);
    }

    /**
     * remove onKeyUp event listener
     * @param delegate remove delegate from the list of event listeners
     */
    public removeOnKeyUpEventListener(delegate: (event: KeyboardEvent) => void): void {
        const index = this._onKeyUpDelegates.indexOf(delegate);
        if (index !== -1) this._onKeyUpDelegates.splice(index, 1);
    }

    /**
     * remove onWheel event listener
     * @param delegate remove delegate from the list of event listeners
     */
    public removeOnWheelEventListener(delegate: (event: WheelEvent) => void): void {
        const index = this._onWheelDelegates.indexOf(delegate);
        if (index !== -1) this._onWheelDelegates.splice(index, 1);
    }

    /**
     * remove onPointerDown event listener
     * @param delegate remove delegate from the list of event listeners
     */
    public removeOnPointerDownEventListener(delegate: (event: MouseEvent) => void): void {
        const index = this._onPointerDownDelegates.indexOf(delegate);
        if (index !== -1) this._onPointerDownDelegates.splice(index, 1);
    }

    /**
     * remove onPointerUp event listener
     * @param delegate remove delegate from the list of event listeners
     */
    public removeOnPointerUpEventListener(delegate: (event: MouseEvent) => void): void {
        const index = this._onPointerUpDelegates.indexOf(delegate);
        if (index !== -1) this._onPointerUpDelegates.splice(index, 1);
    }

    /**
     * remove onPointerEnter event listener
     * @param delegate remove delegate from the list of event listeners
     */
    public removeOnPointerEnterEventListener(delegate: (event: MouseEvent) => void): void {
        const index = this._onPointerEnterDelegates.indexOf(delegate);
        if (index !== -1) this._onPointerEnterDelegates.splice(index, 1);
    }

    /**
     * remove onPointerLeave event listener
     * @param delegate remove delegate from the list of event listeners
     */
    public removeOnPointerLeaveEventListener(delegate: (event: MouseEvent) => void): void {
        const index = this._onPointerLeaveDelegates.indexOf(delegate);
        if (index !== -1) this._onPointerLeaveDelegates.splice(index, 1);
    }

    /**
     * remove onPointerMove event listener
     * @param delegate remove delegate from the list of event listeners
     */
    public removeOnPointerMoveEventListener(delegate: (event: MouseEvent) => void): void {
        const index = this._onPointerMoveDelegates.indexOf(delegate);
        if (index !== -1) this._onPointerMoveDelegates.splice(index, 1);
    }
}
