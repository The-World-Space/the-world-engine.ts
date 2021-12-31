import { Vector2, Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { CssCollideTilemapRenderer } from "./CssCollideTilemapRenderer";
import { TileAtlasItem } from "../render/CssTilemapRenderer";
import { IGridCollidable } from "./IGridCollidable";

export class CssCollideTilemapChunkRenderer extends Component implements IGridCollidable {
    private readonly _cssTilemapRendererMap: Map<`${number}_${number}`, CssCollideTilemapRenderer> = new Map();
    //key is chunk position in string format "x_y"
    private _chunkSize: number = 16;
    private _tileWidth: number = 16;
    private _tileHeight: number = 16;
    private _imageSources: TileAtlasItem[]|null = null;
    private _pointerEvents: boolean = true;
    private _collideEnabled: boolean = false;
    
    private _initializeFunctions: (() => void)[] = [];

    protected start(): void {
        this._initializeFunctions.forEach(func => func());
        this._initializeFunctions = [];
    }

    public onEnable(): void {
        this._collideEnabled = true;
    }

    public onDisable(): void {
        this._collideEnabled = false;
    }

    private updateTilemapPosition() {
        this._cssTilemapRendererMap.forEach((renderer, key) => {
            const chunkIndexX = this.getIndexXFromKey(key) * this._chunkSize * this._tileWidth;
            const chunkIndexY = this.getIndexYFromKey(key) * this._chunkSize * this._tileHeight;
            renderer.gameObject.transform.position.set(chunkIndexX, chunkIndexY, 0);
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
                this.engine.instantlater.buildGameObject(
                    `css_tilemap_renderer_${chunkIndexX}_${chunkIndexY}`, 
                    new Vector3(chunkIndexX * this._chunkSize * this._tileWidth, chunkIndexY * this._chunkSize * this._tileHeight, 0))
                    .withComponent(CssCollideTilemapRenderer, c => {
                        cssTilemapRenderer = c;
                        if (this._imageSources) c.imageSources = this._imageSources;
                        c.gridCellWidth = this._tileWidth;
                        c.gridCellHeight = this._tileHeight;
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

    public drawTile(x: number, y: number, imageIndex: number, atlasIndex?: number): void {
        if (!this.started && !this.starting) {
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

    public drawTileFromTwoDimensionalArray(array: ({i: number, a: number}|null)[][], xOffset: number, yOffset: number): void {
        if (!this.started && !this.starting) {
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

    public clearTile(x: number, y: number): void {
        if (!this.started && !this.starting) {
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

    public addCollider(x: number, y: number): void {
        if (!this.started && !this.starting) {
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

    public checkCollision(x: number, y: number, width: number, height: number): boolean {
        if (!this._collideEnabled) return false;
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
        const chunkIndexX = Math.floor(((x - worldPosition.x) / this._tileWidth + this._chunkSize / 2) / this._chunkSize);
        const chunkIndexY = Math.floor(((y - worldPosition.y) / this._tileHeight + this._chunkSize / 2) / this._chunkSize);
        const chunkIndex = this.getKeyFromIndex(chunkIndexX, chunkIndexY);
        const cssTilemapRenderer = this._cssTilemapRendererMap.get(chunkIndex);
        if (cssTilemapRenderer === undefined) {
            return false;
        }
        return cssTilemapRenderer!.checkCollision(x, y, width, height);
    }

    public get chunkSize(): number {
        return this._chunkSize;
    }

    public set chunkSize(value: number) {
        this._chunkSize = value;
        this.updateTilemapPosition();
        this._cssTilemapRendererMap.forEach((renderer, _) => {
            renderer.rowCount = this._chunkSize;
            renderer.columnCount = this._chunkSize;
        });
    }

    public set imageSources(value: TileAtlasItem[]) {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.imageSources = value;
            });
            return;
        }

        this._imageSources = value;
    }

    public get pointerEvents(): boolean {
        return this._pointerEvents;
    }

    public set pointerEvents(value: boolean) {
        this._pointerEvents = value;
        this._cssTilemapRendererMap.forEach((renderer, _) => {
            renderer.pointerEvents = value;
        });
    }

    public get gridCellWidth(): number {
        return this._tileWidth;
    }

    public set gridCellWidth(value: number) {
        if (this._tileWidth === value) return;
        this._tileWidth = value;
        this.updateTilemapPosition();
        this._cssTilemapRendererMap.forEach((renderer, _) => {
            renderer.gridCellWidth = this._tileWidth;
        });
    }

    public get gridCellHeight(): number {
        return this._tileHeight;
    }

    public set gridCellHeight(value: number) {
        if (this._tileHeight === value) return;
        this._tileHeight = value;
        this.updateTilemapPosition();
        this._cssTilemapRendererMap.forEach((renderer, _) => {
            renderer.gridCellHeight = this._tileHeight;
        });
    }

    private readonly _tempVector3: Vector3 = new Vector3();

    public get gridCenter(): Vector2 {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
        const offsetX = this._chunkSize % 2 === 1 ? 0 : this._tileWidth / 2;
        const offsetY = this._chunkSize % 2 === 1 ? 0 : this._tileHeight / 2;
        return new Vector2(worldPosition.x + offsetX, worldPosition.y + offsetY);
    }

    public get gridCenterX(): number {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
        const offsetX = this._chunkSize % 2 === 1 ? 0 : this._tileWidth / 2;
        return worldPosition.x + offsetX;
    }

    public get gridCenterY(): number {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
        const offsetY = this._chunkSize % 2 === 1 ? 0 : this._tileHeight / 2;
        return worldPosition.y + offsetY;
    }
}
