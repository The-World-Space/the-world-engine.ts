import { Component } from "../../hierarchy_object/Component";
import type { CssCollideTilemapChunkRenderer } from "../grid_physics2d/CssCollideTilemapChunkRenderer";
import type { GridPointer } from "./GridPointer";
import type { PointerGridEvent } from "./PointerGridInputListener";

/**
 * tile brush for test purpose
 */
export class TestTileBrush extends Component {
    public override readonly disallowMultipleComponent: boolean = true;

    private _gridPointer: GridPointer | null = null;
    private _colideTilemapChunk: CssCollideTilemapChunkRenderer | null = null;
    private _pointerDown = false;

    public start(): void {
        if (!this._colideTilemapChunk) {
            throw new Error("TestTileBrush: colideTilemapChunk is not set");
        }
    }

    public onEnable(): void {
        if (!this._gridPointer) {
            throw new Error("TestTileBrush: gridPointer is not set");
        }
        this._gridPointer.onPointerDown.addListener(this.onPointerDown);
        this._gridPointer.onPointerUp.addListener(this.onPointerUp);
        this._gridPointer.onPointerMove.addListener(this.onPointerMove);
    }

    public onDisable(): void {
        if (this._gridPointer) {
            this._gridPointer.onPointerDown.removeListener(this.onPointerDown);
            this._gridPointer.onPointerUp.removeListener(this.onPointerUp);
            this._gridPointer.onPointerMove.removeListener(this.onPointerMove);
        }
    }

    private readonly onPointerDown = (event: PointerGridEvent): void => {
        this._pointerDown = true;
        this._colideTilemapChunk!.drawTile(event.gridPosition.x, event.gridPosition.y, 0, 10);
    };

    private readonly onPointerUp = (_: PointerGridEvent): void => {
        this._pointerDown = false;
    };

    private readonly onPointerMove = (event: PointerGridEvent): void => {
        if (this._pointerDown) {
            this._colideTilemapChunk!.drawTile(event.gridPosition.x, event.gridPosition.y, 0, 10);
        }
    };

    /**
     * grid pointer (default: null)
     */
    public get gridPointer(): GridPointer | null {
        return this._gridPointer;
    }

    /**
     * grid pointer (default: null)
     */
    public set gridPointer(value: GridPointer | null) {
        this._gridPointer = value;
    }

    /**
     * colide tilemap chunk renderer for drawing tiles (default: null)
     */
    public get colideTilemapChunk(): CssCollideTilemapChunkRenderer | null {
        return this._colideTilemapChunk;
    }

    /**
     * colide tilemap chunk renderer for drawing tiles (default: null)
     */
    public set colideTilemapChunk(value: CssCollideTilemapChunkRenderer | null) {
        this._colideTilemapChunk = value;
    }
}
