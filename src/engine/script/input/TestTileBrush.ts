import { Component } from "../../hierarchy_object/Component";
import { CssCollideTilemapChunkRenderer } from "../physics/CssCollideTilemapChunkRenderer";
import { GridPointer } from "./GridPointer";
import { PointerGridEvent } from "./PointerGridInputListener";

export class TestTileBrush extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    
    private _gridPointer: GridPointer|null = null;
    private _colideTilemapChunk: CssCollideTilemapChunkRenderer|null = null;
    private _pointerDown: boolean = false;

    private readonly _onPointerDownBind = this.onPointerDown.bind(this);
    private readonly _onPointerUpBind = this.onPointerUp.bind(this);
    private readonly _onPointerMoveBind = this.onPointerMove.bind(this);

    protected start(): void {
        if (!this._colideTilemapChunk) {
            throw new Error("TestTileBrush: colideTilemapChunk is not set");
        }
    }

    public onEnable(): void {
        if (!this._gridPointer) {
            throw new Error("TestTileBrush: gridPointer is not set");
        }
        this._gridPointer.addOnPointerDownEventListener(this._onPointerDownBind);
        this._gridPointer.addOnPointerUpEventListener(this._onPointerUpBind);
        this._gridPointer.addOnPointerMoveEventListener(this._onPointerMoveBind);
    }

    public onDisable(): void {
        if (this._gridPointer) {
            this._gridPointer.removeOnPointerDownEventListener(this._onPointerDownBind);
            this._gridPointer.removeOnPointerUpEventListener(this._onPointerUpBind);
            this._gridPointer.removeOnPointerMoveEventListener(this._onPointerMoveBind);
        }
    }

    private onPointerDown(event: PointerGridEvent) {
        this._pointerDown = true;
        this._colideTilemapChunk!.drawTile(event.gridPosition.x, event.gridPosition.y, 0, 10);
    }

    private onPointerUp(_: PointerGridEvent) {
        this._pointerDown = false;
    }

    private onPointerMove(event: PointerGridEvent) {
        if (this._pointerDown) {
            this._colideTilemapChunk!.drawTile(event.gridPosition.x, event.gridPosition.y, 0, 10);
        }
    }

    public get gridPointer(): GridPointer|null {
        return this._gridPointer;
    }

    public set gridPointer(value: GridPointer|null) {
        this._gridPointer = value;
    }

    public get colideTilemapChunk(): CssCollideTilemapChunkRenderer|null {
        return this._colideTilemapChunk;
    }

    public set colideTilemapChunk(value: CssCollideTilemapChunkRenderer|null) {
        this._colideTilemapChunk = value;
    }
}
