/**
 * controls the input events toggling
 */
export interface IInputEventHandleable {
    /**
     * start engine global input event handling. you can use this when you want focus the game view
     */
    startHandleEvents(): void;

    /**
     * stop engine global input event handling. you can use this when you want blur the game view
     */
    stopHandleEvents(): void;
}
