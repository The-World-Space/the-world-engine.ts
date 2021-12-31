import { CssTilemapRenderer } from "../render/CssTilemapRenderer";
export declare class CssCollideTilemapRenderer extends CssTilemapRenderer {
    private readonly _collideMap;
    private _collideEnabled;
    onEnable(): void;
    onDisable(): void;
    drawTile(column: number, row: number, imageIndex: number, atlasIndex?: number): void;
    drawTileFromTwoDimensionalArray(array: ({
        i: number;
        a: number;
    } | null)[][], columnOffset: number, rowOffset: number): void;
    clearTile(column: number, row: number): void;
    addCollider(column: number, row: number): void;
    checkCollision(x: number, y: number, width: number, height: number): boolean;
}
