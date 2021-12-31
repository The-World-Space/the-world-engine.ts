import { Vector2 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { TileAtlasItem } from "../render/CssTilemapRenderer";
import { IGridCoordinatable } from "../helper/IGridCoordinatable";
export declare class CssTilemapChunkRenderer extends Component implements IGridCoordinatable {
    private readonly _cssTilemapRendererMap;
    private _chunkSize;
    private _tileWidth;
    private _tileHeight;
    private _imageSources;
    private _pointerEvents;
    private _initializeFunctions;
    protected start(): void;
    private updateTilemapPosition;
    private getIndexXFromKey;
    private getIndexYFromKey;
    private getKeyFromIndex;
    private computeDrawPosition;
    private getTilemapRenedererOrCreate;
    private getTilemapRenedererOrNull;
    drawTile(x: number, y: number, imageIndex: number, atlasIndex?: number): void;
    drawTileFromTwoDimensionalArray(array: ({
        i: number;
        a: number;
    } | null)[][], xOffset: number, yOffset: number): void;
    clearTile(x: number, y: number): void;
    get chunkSize(): number;
    set chunkSize(value: number);
    set imageSources(value: TileAtlasItem[]);
    get pointerEvents(): boolean;
    set pointerEvents(value: boolean);
    get gridCellWidth(): number;
    set gridCellWidth(value: number);
    get gridCellHeight(): number;
    set gridCellHeight(value: number);
    get gridCenter(): Vector2;
    get gridCenterX(): number;
    get gridCenterY(): number;
}
