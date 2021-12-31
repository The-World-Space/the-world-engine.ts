export declare class GameScreen {
    private _width;
    private _height;
    private _onResizeDelegates;
    constructor(width: number, height: number);
    get width(): number;
    get height(): number;
    resize(width: number, height: number): void;
    addOnResizeEventListener(delegate: (width: number, height: number) => void): void;
    removeOnResizeEventListener(delegate: (width: number, height: number) => void): void;
}
