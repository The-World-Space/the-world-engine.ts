export class GameScreen {
    constructor(width, height) {
        this._width = width;
        this._height = height;
        this._onResizeDelegates = [];
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    resize(width, height) {
        this._width = width;
        this._height = height;
        this._onResizeDelegates.forEach(delegate => delegate(width, height));
    }
    addOnResizeEventListener(delegate) {
        this._onResizeDelegates.push(delegate);
    }
    removeOnResizeEventListener(delegate) {
        const index = this._onResizeDelegates.indexOf(delegate);
        if (index >= 0) {
            this._onResizeDelegates.splice(index, 1);
        }
    }
}
