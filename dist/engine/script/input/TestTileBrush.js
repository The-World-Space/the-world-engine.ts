import { Component } from "../../hierarchy_object/Component";
export class TestTileBrush extends Component {
    constructor() {
        super(...arguments);
        this._disallowMultipleComponent = true;
        this._gridPointer = null;
        this._colideTilemapChunk = null;
        this._pointerDown = false;
        this._onPointerDownBind = this.onPointerDown.bind(this);
        this._onPointerUpBind = this.onPointerUp.bind(this);
        this._onPointerMoveBind = this.onPointerMove.bind(this);
    }
    start() {
        if (!this._colideTilemapChunk) {
            throw new Error("TestTileBrush: colideTilemapChunk is not set");
        }
    }
    onEnable() {
        if (!this._gridPointer) {
            throw new Error("TestTileBrush: gridPointer is not set");
        }
        this._gridPointer.addOnPointerDownEventListener(this._onPointerDownBind);
        this._gridPointer.addOnPointerUpEventListener(this._onPointerUpBind);
        this._gridPointer.addOnPointerMoveEventListener(this._onPointerMoveBind);
    }
    onDisable() {
        if (this._gridPointer) {
            this._gridPointer.removeOnPointerDownEventListener(this._onPointerDownBind);
            this._gridPointer.removeOnPointerUpEventListener(this._onPointerUpBind);
            this._gridPointer.removeOnPointerMoveEventListener(this._onPointerMoveBind);
        }
    }
    onPointerDown(event) {
        this._pointerDown = true;
        this._colideTilemapChunk.drawTile(event.gridPosition.x, event.gridPosition.y, 0, 10);
    }
    onPointerUp(_) {
        this._pointerDown = false;
    }
    onPointerMove(event) {
        if (this._pointerDown) {
            this._colideTilemapChunk.drawTile(event.gridPosition.x, event.gridPosition.y, 0, 10);
        }
    }
    get gridPointer() {
        return this._gridPointer;
    }
    set gridPointer(value) {
        this._gridPointer = value;
    }
    get colideTilemapChunk() {
        return this._colideTilemapChunk;
    }
    set colideTilemapChunk(value) {
        this._colideTilemapChunk = value;
    }
}
