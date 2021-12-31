import { IInputEventHandleable } from "./IInputEventHandleable";
/**
 * engine global input event handler
 */
export declare class InputHandler implements IInputEventHandleable {
    private _map;
    private _isDisposed;
    private _renderTargetDom;
    private _onKeyDownDelegates;
    private _onKeyUpDelegates;
    private _onWheelDelegates;
    private _onPointerDownDelegates;
    private _onPointerUpDelegates;
    private _onPointerEnterDelegates;
    private _onPointerLeaveDelegates;
    private _onPointerMoveDelegates;
    private _touchMoveOccured;
    private _onTouchStartFunc;
    private _lastMouseDownEvent;
    private _lastMouseEnterEvent;
    private readonly _handleKeyDownBind;
    private readonly _handleKeyUpBind;
    private readonly _handleWheelBind;
    private readonly _handleMouseDownBind;
    private readonly _handleMouseUpBind;
    private readonly _handleMouseEnterBind;
    private readonly _handleMouseLeaveBind;
    private readonly _handleMouseMoveBind;
    private readonly _handleTouchStartBind;
    private readonly _handleTouchEndBind;
    private readonly _handleTouchMoveBind;
    private readonly _handleTouchCancelBind;
    constructor(renderTargetDom: HTMLElement);
    /**
     * keyboard input map. key is key name, value is pressed or not
     */
    get map(): ReadonlyMap<string, boolean>;
    /**
     * stop event handle and dispose this object
     */
    dispose(): void;
    /**
     * start engine global input event handling. you can use this when you want focus the game view
     */
    startHandleEvents(): void;
    /**
     * stop engine global input event handling. you can use this when you want blur the game view
     */
    stopHandleEvents(): void;
    private simulateMouseEvent;
    private handleKeyDown;
    private handleKeyUp;
    private handleWheel;
    private handleMouseDown;
    private handleMouseUp;
    private handleMouseEnter;
    private handleMouseLeave;
    private handleMouseMove;
    private handleTouchStart;
    private handleTouchEnd;
    private handleTouchMove;
    private handleTouchCancel;
    /**
     * add onKeyDown event listener
     * @param delegate this function will be called when key down event occured
     */
    addOnKeyDownEventListener(delegate: (event: KeyboardEvent) => void): void;
    /**
     * add onKeyUp event listener
     * @param delegate this function will be called when key up event occured
     */
    addOnKeyUpEventListener(delegate: (event: KeyboardEvent) => void): void;
    /**
     * add onWheel event listener
     * @param delegate this function will be called when wheel event occured
     */
    addOnWheelEventListener(delegate: (event: WheelEvent) => void): void;
    /**
     * add onPointerDown event listener
     * @param delegate this function will be called when pointer down event occured
     */
    addOnPointerDownEventListener(delegate: (event: MouseEvent) => void): void;
    /**
     * add onPointerUp event listener
     * @param delegate this function will be called when pointer up event occured
     */
    addOnPointerUpEventListener(delegate: (event: MouseEvent) => void): void;
    /**
     * add onPointerEnter event listener
     * @param delegate this function will be called when pointer enter event occured
     */
    addOnPointerEnterEventListener(delegate: (event: MouseEvent) => void): void;
    /**
     * add onPointerLeave event listener
     * @param delegate this function will be called when pointer leave event occured
     */
    addOnPointerLeaveEventListener(delegate: (event: MouseEvent) => void): void;
    /**
     * add onPointerMove event listener
     * @param delegate this function will be called when pointer move event occured
     */
    addOnPointerMoveEventListener(delegate: (event: MouseEvent) => void): void;
    /**
     * remove onKeyDown event listener
     * @param delegate remove delegate from the list of event listeners
     */
    removeOnKeyDownEventListener(delegate: (event: KeyboardEvent) => void): void;
    /**
     * remove onKeyUp event listener
     * @param delegate remove delegate from the list of event listeners
     */
    removeOnKeyUpEventListener(delegate: (event: KeyboardEvent) => void): void;
    /**
     * remove onWheel event listener
     * @param delegate remove delegate from the list of event listeners
     */
    removeOnWheelEventListener(delegate: (event: WheelEvent) => void): void;
    /**
     * remove onPointerDown event listener
     * @param delegate remove delegate from the list of event listeners
     */
    removeOnPointerDownEventListener(delegate: (event: MouseEvent) => void): void;
    /**
     * remove onPointerUp event listener
     * @param delegate remove delegate from the list of event listeners
     */
    removeOnPointerUpEventListener(delegate: (event: MouseEvent) => void): void;
    /**
     * remove onPointerEnter event listener
     * @param delegate remove delegate from the list of event listeners
     */
    removeOnPointerEnterEventListener(delegate: (event: MouseEvent) => void): void;
    /**
     * remove onPointerLeave event listener
     * @param delegate remove delegate from the list of event listeners
     */
    removeOnPointerLeaveEventListener(delegate: (event: MouseEvent) => void): void;
    /**
     * remove onPointerMove event listener
     * @param delegate remove delegate from the list of event listeners
     */
    removeOnPointerMoveEventListener(delegate: (event: MouseEvent) => void): void;
}
