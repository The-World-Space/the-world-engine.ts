import { Component } from "../../hierarchy_object/Component";
import { CssCollideTilemapChunkRenderer } from "../physics/CssCollideTilemapChunkRenderer";
import { GridPointer } from "./GridPointer";
export declare class TestTileBrush extends Component {
    protected readonly _disallowMultipleComponent: boolean;
    private _gridPointer;
    private _colideTilemapChunk;
    private _pointerDown;
    private readonly _onPointerDownBind;
    private readonly _onPointerUpBind;
    private readonly _onPointerMoveBind;
    protected start(): void;
    onEnable(): void;
    onDisable(): void;
    private onPointerDown;
    private onPointerUp;
    private onPointerMove;
    get gridPointer(): GridPointer | null;
    set gridPointer(value: GridPointer | null);
    get colideTilemapChunk(): CssCollideTilemapChunkRenderer | null;
    set colideTilemapChunk(value: CssCollideTilemapChunkRenderer | null);
}
