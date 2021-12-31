/**
 * readonly game screen interface
 */
export interface IReadonlyGameScreen {
    /**
     * get the width of the screen
     */
    get width(): number;
    
    /**
     * get the height of the screen
     */
    get height(): number;

    /**
     * add onResize event listener
     * @param delegate this function will be called when the screen is resized
     */
    addOnResizeEventListener(delegate: (width: number, height: number) => void): void;

    /**
     * remove onResize event listener
     * @param delegate remove delegate from the list of event listeners
     */
    removeOnResizeEventListener(delegate: (width: number, height: number) => void): void;
}
