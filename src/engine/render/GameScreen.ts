export class GameScreen {
    private _width: number;
    private _height: number;
    private _onResizeDelegates: ((width: number, height: number) => void)[];

    public constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
        this._onResizeDelegates = [];
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public resize(width: number, height: number): void {
        this._width = width;
        this._height = height;
        this._onResizeDelegates.forEach(delegate => delegate(width, height));
    }
    
    public addOnResizeEventListener(delegate: (width: number, height: number) => void): void {
        this._onResizeDelegates.push(delegate);
    }

    public removeOnResizeEventListener(delegate: (width: number, height: number) => void): void {
        const index = this._onResizeDelegates.indexOf(delegate);
        if (index >= 0) {
            this._onResizeDelegates.splice(index, 1);
        }
    }
}
