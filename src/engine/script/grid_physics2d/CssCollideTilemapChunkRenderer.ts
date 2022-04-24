import { Vector2, Vector3 } from "three/src/Three";
import { Component } from "../../hierarchy_object/Component";
import { CssCollideTilemapRenderer } from "./CssCollideTilemapRenderer";
import { TileAtlasItem } from "../render/CssTilemapRenderer";
import { IGridCollidable } from "./IGridCollidable";

/**
 * collision map with tilemap for grid system
 * 
 * this component will auto generate collision map from tilemap
 * 
 * coordinate system is same as world coordinate system (positive x is right, positive y is up)
 * 
 * important: grid position data is stored as string ("x_y" format)
 * so this component might not work properly if this component's gameObject.position is not integer
 */
export class CssCollideTilemapChunkRenderer extends Component implements IGridCollidable {
    private readonly _cssTilemapRendererMap: Map<`${number}_${number}`, CssCollideTilemapRenderer> = new Map();
    //key is chunk position in string format "x_y"
    private _chunkSize = 16;
    private _tileWidth = 1;
    private _tileHeight = 1;
    private _tileResolutionX = 16;
    private _tileResolutionY = 16;
    private _imageSources: TileAtlasItem[]|null = null;
    private _pointerEvents = true;
    private _collideEnabled = false;
    
    private _initializeFunctions: (() => void)[] = [];
    private _started = false;

    public start(): void {
        this._started = true;
        this._initializeFunctions.forEach(func => func());
        this._initializeFunctions = [];
    }

    public onEnable(): void {
        this._collideEnabled = true;
    }

    public onDisable(): void {
        this._collideEnabled = false;
    }

    private updateTilemapPosition(): void {
        this._cssTilemapRendererMap.forEach((renderer, key) => {
            const chunkIndexX = this.getIndexXFromKey(key) * this._chunkSize * this._tileWidth;
            const chunkIndexY = this.getIndexYFromKey(key) * this._chunkSize * this._tileHeight;
            renderer.gameObject.transform.localPosition.set(chunkIndexX, chunkIndexY, 0);
        });
    }

    private getIndexXFromKey(key: string): number {
        return parseInt(key.substring(0, key.indexOf("_")));
    }

    private getIndexYFromKey(key: string): number {
        return parseInt(key.substring(key.indexOf("_") + 1));
    }

    private getKeyFromIndex(x: number, y: number): `${number}_${number}` {
        return `${x}_${y}`;
    }

    private computeDrawPosition(chunkIndexX: number, chunkIndexY: number, x: number, y: number): Vector2 {
        //get relative position in chunk
        //note: 0,0 is center of chunk
        const relativeX = (x - chunkIndexX * this._chunkSize) + this._chunkSize / 2;
        const relativeY = (y - chunkIndexY * this._chunkSize) + this._chunkSize / 2;

        return new Vector2(relativeX, relativeY);
    }

    private getTilemapRenedererOrCreate(chunkIndexX: number, chunkIndexY: number): CssCollideTilemapRenderer {
        const chunkIndex = this.getKeyFromIndex(chunkIndexX, chunkIndexY);
        let cssTilemapRenderer = this._cssTilemapRendererMap.get(chunkIndex);
        if (cssTilemapRenderer === undefined) {
            this.gameObject.addChildFromBuilder(
                this.engine.instantiater.buildGameObject(
                    `css_tilemap_renderer_${chunkIndexX}_${chunkIndexY}`, 
                    new Vector3(chunkIndexX * this._chunkSize * this._tileWidth, chunkIndexY * this._chunkSize * this._tileHeight, 0))
                    .withComponent(CssCollideTilemapRenderer, c => {
                        cssTilemapRenderer = c;
                        if (this._imageSources) c.imageSources = this._imageSources;
                        c.gridCellWidth = this._tileWidth;
                        c.gridCellHeight = this._tileHeight;
                        c.tileResolutionX = this._tileResolutionX;
                        c.tileResolutionY = this._tileResolutionY;
                        c.rowCount = this._chunkSize;
                        c.columnCount = this._chunkSize;
                        c.pointerEvents = this._pointerEvents;
                    })
            );
            this._cssTilemapRendererMap.set(chunkIndex, cssTilemapRenderer!);
        }
        return cssTilemapRenderer!;
    }

    private getTilemapRenedererOrNull(chunkIndexX: number, chunkIndexY: number): CssCollideTilemapRenderer|null {
        const chunkIndex = this.getKeyFromIndex(chunkIndexX, chunkIndexY);
        const cssTilemapRenderer = this._cssTilemapRendererMap.get(chunkIndex);
        if (cssTilemapRenderer === undefined) {
            return null;
        }
        return cssTilemapRenderer;
    }

    /**
     * draw tile at position. collide info will be automatically added
     * @param x x position in grid
     * @param y y position in grid
     * @param imageIndex index of image in imageSources
     * @param atlasIndex index of atlas in imageSources
     * @returns 
     */
    public drawTile(x: number, y: number, imageIndex: number, atlasIndex?: number): void {
        if (!this._started) {
            this._initializeFunctions.push(() => {
                this.drawTile(x, y, imageIndex, atlasIndex);
            });
            return;
        }

        const chunkIndexX = Math.floor((x + this._chunkSize / 2) / this._chunkSize);
        const chunkIndexY = Math.floor((y + this._chunkSize / 2) / this._chunkSize);
        const cssTilemapRenderer = this.getTilemapRenedererOrCreate(chunkIndexX, chunkIndexY);
        const drawPosition = this.computeDrawPosition(chunkIndexX, chunkIndexY, x, y);
        const drawOffsetX = this.chunkSize % 2 === 0 ? 0 : -0.5;
        const drawOffsetY = this.chunkSize % 2 === 0 ? 0 : 0.5;
        
        cssTilemapRenderer!.drawTile(drawPosition.x + drawOffsetX, this._chunkSize - drawPosition.y - 1 + drawOffsetY, imageIndex, atlasIndex);
    }

    /**
     * draw tile from two dimensional array. array left bottom is (0, 0) in grid coordinate system
     * @param array array of image index. { i: 0, a: 1 } means imageSources[0] in atlas[1]
     * @param xOffset array x offset, if you want to add event from array[1][3] to (2, 3) you should set xOffset = 1
     * @param yOffset array y offset, if you want to add event from array[3][1] to (3, 2) you should set yOffset = 1
     * @returns 
     */
    public drawTileFromTwoDimensionalArray(array: ({i: number, a: number}|null)[][], xOffset: number, yOffset: number): void {
        if (!this._started) {
            this._initializeFunctions.push(() => {
                this.drawTileFromTwoDimensionalArray(array, xOffset, yOffset);
            });
            return;
        }
        
        for (let y = 0; y < array.length; y++) {
            for (let x = 0; x < array[y].length; x++) {
                if (array[y][x] === null) continue;
                this.drawTile(x + xOffset, array.length - y + yOffset - 1, array[y][x]!.i, array[y][x]!.a);
            }
        }
    }

    /**
     * clear tile at position
     * @param x x position in grid
     * @param y y position in grid
     * @returns 
     */
    public clearTile(x: number, y: number): void {
        if (!this._started) {
            this._initializeFunctions.push(() => {
                this.clearTile(x, y);
            });
            return;
        }
        const chunkIndexX = Math.floor((x + this._chunkSize / 2) / this._chunkSize);
        const chunkIndexY = Math.floor((y + this._chunkSize / 2) / this._chunkSize);
        const cssTilemapRenderer = this.getTilemapRenedererOrNull(chunkIndexX, chunkIndexY);
        if (cssTilemapRenderer === null) return;
        const drawPosition = this.computeDrawPosition(chunkIndexX, chunkIndexY, x, y);
        const drawOffsetX = this.chunkSize % 2 === 0 ? 0 : -0.5;
        const drawOffsetY = this.chunkSize % 2 === 0 ? 0 : 0.5;
        cssTilemapRenderer!.clearTile(drawPosition.x + drawOffsetX, this._chunkSize - drawPosition.y - 1 + drawOffsetY);   
    }

    /**
     * add collider at position
     * @param x x position in grid
     * @param y y position in grid
     * @returns 
     */
    public addCollider(x: number, y: number): void {
        if (!this._started) {
            this._initializeFunctions.push(() => {
                this.addCollider(x, y);
            });
            return;
        }
        const chunkIndexX = Math.floor((x + this._chunkSize / 2) / this._chunkSize);
        const chunkIndexY = Math.floor((y + this._chunkSize / 2) / this._chunkSize);
        const cssTilemapRenderer = this.getTilemapRenedererOrCreate(chunkIndexX, chunkIndexY);
        const drawPosition = this.computeDrawPosition(chunkIndexX, chunkIndexY, x, y);
        const drawOffsetX = this.chunkSize % 2 === 0 ? 0 : -0.5;
        const drawOffsetY = this.chunkSize % 2 === 0 ? 0 : 0.5;
        cssTilemapRenderer!.addCollider(drawPosition.x + drawOffsetX, this._chunkSize - drawPosition.y - 1 + drawOffsetY);
    }

    /**
     * query that collides at position
     * @param x x position in grid
     * @param y y position in grid
     * @param width collison width
     * @param height collision height
     * @returns if collides, return true. otherwise, return false
     */
    public checkCollision(x: number, y: number, width: number, height: number): boolean {
        if (!this._collideEnabled) return false;
        const worldPosition = this.transform.position;
        const chunkIndexX = Math.floor(((x - worldPosition.x) / this._tileWidth + this._chunkSize / 2) / this._chunkSize);
        const chunkIndexY = Math.floor(((y - worldPosition.y) / this._tileHeight + this._chunkSize / 2) / this._chunkSize);
        const chunkIndex = this.getKeyFromIndex(chunkIndexX, chunkIndexY);
        const cssTilemapRenderer = this._cssTilemapRendererMap.get(chunkIndex);
        if (cssTilemapRenderer === undefined) {
            return false;
        }
        return cssTilemapRenderer!.checkCollision(x, y, width, height);
    }

    /**
     * chunk size. default is 16
     */
    public get chunkSize(): number {
        return this._chunkSize;
    }

    /**
     * chunk size. default is 16
     */
    public set chunkSize(value: number) {
        this._chunkSize = value;
        this.updateTilemapPosition();
        this._cssTilemapRendererMap.forEach((renderer, _key) => {
            renderer.rowCount = this._chunkSize;
            renderer.columnCount = this._chunkSize;
        });
    }

    /**
     * image sources for drawing
     */
    public set imageSources(value: TileAtlasItem[]) {
        if (!this._started) {
            this._initializeFunctions.push(() => {
                this.imageSources = value;
            });
            return;
        }

        this._imageSources = value;
    }

    /**
     * if this value is true, this object will be rendered with css style pointer-events: "auto" it means that this object can be clicked.
     */
    public get pointerEvents(): boolean {
        return this._pointerEvents;
    }

    /**
     * if this value is true, this object will be rendered with css style pointer-events: "auto" it means that this object can be clicked.
     */
    public set pointerEvents(value: boolean) {
        this._pointerEvents = value;
        this._cssTilemapRendererMap.forEach((renderer, _key) => {
            renderer.pointerEvents = value;
        });
    }

    /**
     * grid cell width. default is 1
     */
    public get gridCellWidth(): number {
        return this._tileWidth;
    }

    /**
     * grid cell width. default is 1
     */
    public set gridCellWidth(value: number) {
        if (this._tileWidth === value) return;
        this._tileWidth = value;
        this.updateTilemapPosition();
        this._cssTilemapRendererMap.forEach((renderer, _key) => {
            renderer.gridCellWidth = this._tileWidth;
        });
    }

    /**
     * grid cell height. default is 1
     */
    public get gridCellHeight(): number {
        return this._tileHeight;
    }

    /**
     * grid cell height. default is 1
     */
    public set gridCellHeight(value: number) {
        if (this._tileHeight === value) return;
        this._tileHeight = value;
        this.updateTilemapPosition();
        this._cssTilemapRendererMap.forEach((renderer, _key) => {
            renderer.gridCellHeight = this._tileHeight;
        });
    }

    /**
     * tile resolution x. default is 16.
     * higher value means higher quality of rendering.
     */
    public get tileResolutionX(): number {
        return this._tileResolutionX;
    }

    /**
     * tile resolution x. default is 16.
     * higher value means higher quality of rendering.
     */
    public set tileResolutionX(value: number) {
        if (this._tileResolutionX === value) return;
        this._tileResolutionX = value;
        this._cssTilemapRendererMap.forEach((renderer, _key) => {
            renderer.tileResolutionX = this._tileResolutionX;
        });
    }

    /**
     * tile resolution y. default is 16.
     * higher value means higher quality of rendering.
     */
    public get tileResolutionY(): number {
        return this._tileResolutionY;
    }

    /**
     * tile resolution y. default is 16.
     * higher value means higher quality of rendering.
     */
    public set tileResolutionY(value: number) {
        if (this._tileResolutionY === value) return;
        this._tileResolutionY = value;
        this._cssTilemapRendererMap.forEach((renderer, _key) => {
            renderer.tileResolutionY = this._tileResolutionY;
        });
    }

    /**
     * grid coordinate center position
     */
    public get gridCenter(): Vector2 {
        const worldPosition = this.transform.position;
        const offsetX = this._chunkSize % 2 === 1 ? 0 : this._tileWidth / 2;
        const offsetY = this._chunkSize % 2 === 1 ? 0 : this._tileHeight / 2;
        return new Vector2(worldPosition.x + offsetX, worldPosition.y + offsetY);
    }

    /**
     * grid coordinate center position x
     */
    public get gridCenterX(): number {
        const worldPosition = this.transform.position;
        const offsetX = this._chunkSize % 2 === 1 ? 0 : this._tileWidth / 2;
        return worldPosition.x + offsetX;
    }

    /**
     * grid coordinate center position y
     */
    public get gridCenterY(): number {
        const worldPosition = this.transform.position;
        const offsetY = this._chunkSize % 2 === 1 ? 0 : this._tileHeight / 2;
        return worldPosition.y + offsetY;
    }
}
