import { Vector2, Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
export declare class TileAtlasItem {
    private _htmlImageElement;
    private _columnCount;
    private _rowCount;
    constructor(htmlImageElement: HTMLImageElement);
    constructor(htmlImageElement: HTMLImageElement, columnCount: number, rowCount: number);
    get htmlImageElement(): HTMLImageElement;
    get columnCount(): number;
    get rowCount(): number;
}
export declare class CssTilemapRenderer extends Component {
    protected readonly _disallowMultipleComponent: boolean;
    private _columnCount;
    private _rowCount;
    private _tileWidth;
    private _tileHeight;
    private _css3DObject;
    private _htmlCanvasElement;
    private _imageSources;
    private _pointerEvents;
    private _zindex;
    private _initializeFunctions;
    protected start(): void;
    onDestroy(): void;
    onEnable(): void;
    onDisable(): void;
    onSortByZaxis(zaxis: number): void;
    private drawTileMap;
    drawTile(column: number, row: number, imageIndex: number, atlasIndex?: number): void;
    drawTileFromTwoDimensionalArray(array: ({
        i: number;
        a: number;
    } | null)[][], columnOffset: number, rowOffset: number): void;
    clearTile(column: number, row: number): void;
    set imageSources(value: TileAtlasItem[]);
    get pointerEvents(): boolean;
    set pointerEvents(value: boolean);
    get columnCount(): number;
    set columnCount(value: number);
    get rowCount(): number;
    set rowCount(value: number);
    get gridCellWidth(): number;
    set gridCellWidth(value: number);
    get gridCellHeight(): number;
    set gridCellHeight(value: number);
    protected readonly _tempVector3: Vector3;
    get gridCenter(): Vector2;
    get gridCenterX(): number;
    get gridCenterY(): number;
}
