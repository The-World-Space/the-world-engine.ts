import { Vector2 } from "three/src/Three";

import { Transform } from "../../hierarchy_object/Transform";
import { CssRenderer } from "./CssRenderer";

/**
 * represents a sprite atlas that is used by tilemap
 */
export class TileAtlasItem {
    private readonly _htmlImageElement: HTMLImageElement;
    private readonly _columnCount: number;
    private readonly _rowCount: number;

    /**
     * 
     * @param htmlImageElement image source, this image must be loaded before this class is created
     * @param columnCount sprite atlas column count (default: 1)
     * @param rowCount sprite atlas row count (default: 1)
     */
    public constructor(htmlImageElement: HTMLImageElement, columnCount = 1, rowCount = 1) {
        if (!htmlImageElement.complete) {
            throw new Error(`Image {${htmlImageElement.src}} is not loaded.`);
        }

        this._htmlImageElement = htmlImageElement;
        this._rowCount = rowCount;
        this._columnCount = columnCount;
    }

    /**
     * image source, guaranteed to be loaded before this class is created
     */
    public get htmlImageElement(): HTMLImageElement {
        return this._htmlImageElement;
    }

    /**
     * sprite atlas column count
     */
    public get columnCount(): number {
        return this._columnCount;
    }

    /**
     * sprite atlas row count
     */
    public get rowCount(): number {
        return this._rowCount;
    }
}

/**
 * tilemap for grid system
 * there is limitation of tilemap size
 * 
 * coordinate system is row column (positive x is right, positive y is down)
 */
export class CssTilemapRenderer extends CssRenderer<HTMLCanvasElement> {
    private _columnCount = 10;
    private _rowCount = 10;
    private _tileWidth = 1;
    private _tileHeight = 1;
    private _tileResolutionX = 16;
    private _tileResolutionY = 16;
    private _imageSources: TileAtlasItem[]|null = null;
    
    private _initializeFunctions: ((() => void))[] = [];

    protected override renderInitialize(): void {
        this.drawTileMap();

        this._initializeFunctions.forEach(func => func());
        this._initializeFunctions = [];
    }

    protected override updateCenterOffset(updateTransform: boolean): void {
        if (!this.css3DObject) return;
        
        const tileMapWidth: number = this._columnCount * this._tileWidth;
        const tileMapHeight: number = this._rowCount * this._tileHeight;

        this.css3DObject.position.set(
            tileMapWidth * this.centerOffset.x,
            tileMapHeight * this.centerOffset.y, 0
        );

        if (updateTransform) {
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    protected override updateViewScale(updateTransform: boolean): void {
        if (!this.css3DObject) return;

        const value = this.viewScale;
        const image = this.htmlElement!;
        
        const tileMapWidth: number = this._columnCount * this._tileWidth;
        const tileMapHeight: number = this._rowCount * this._tileHeight;

        image.style.width = (tileMapWidth / value) + "px";
        image.style.height = (tileMapHeight / value) + "px";
        this.css3DObject.scale.set(value, value, value);

        if (updateTransform) {
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    private drawTileMap(): void {
        const tileMapWidth: number = this._columnCount * this._tileWidth;
        const tileMapHeight: number = this._rowCount * this._tileHeight;
        const tileMapResolutionX: number = this._columnCount * this._tileResolutionX;
        const tileMapResolutionY: number = this._rowCount * this._tileResolutionY;

        this.htmlElement = document.createElement("canvas") as HTMLCanvasElement;
        this.htmlElement.width = tileMapResolutionX;
        this.htmlElement.height = tileMapResolutionY;
        this.htmlElement.style.imageRendering = "pixelated";
        this.htmlElement.style.width = (tileMapWidth / this.viewScale) + "px";
        this.htmlElement.style.height = (tileMapHeight / this.viewScale) + "px";

        const css3DObject = this.initializeBaseComponents(false);
        Transform.updateRawObject3DWorldMatrixRecursively(css3DObject);
        this.transform.enqueueRenderAttachedObject3D(css3DObject);
    }

    /**
     * draw tile at position.
     * @param column column in tilemap
     * @param row row in tilemap
     * @param imageIndex index of image in imageSources
     * @param atlasIndex index of atlas in imageSources
     * @returns 
     */
    public drawTile(column: number, row: number, imageIndex: number, atlasIndex?: number): void {
        if (!this.readyToDraw) {
            this._initializeFunctions.push(() => this.drawTile(column, row, imageIndex, atlasIndex));
            return;
        }

        const context: CanvasRenderingContext2D = this.htmlElement!.getContext("2d")!;
        const imageSource: TileAtlasItem = this._imageSources![imageIndex];
        if (imageSource.rowCount === 1 && imageSource.columnCount === 1) {
            context.drawImage(
                imageSource.htmlImageElement, 
                0, 0, this._tileResolutionX, this._tileResolutionY, 
                column * this._tileResolutionX, row * this._tileResolutionY,
                this._tileResolutionX, this._tileResolutionY);
        } else if (atlasIndex !== undefined) {   
            const rowIndex: number = Math.floor(atlasIndex / imageSource.columnCount);
            const columnIndex: number = atlasIndex % imageSource.columnCount;
            const imageWidth: number = imageSource.htmlImageElement.width / imageSource.columnCount;
            const imageHeight: number = imageSource.htmlImageElement.height / imageSource.rowCount;
            context.drawImage(
                imageSource.htmlImageElement, 
                columnIndex * imageWidth, rowIndex * imageHeight, 
                imageWidth, imageHeight, 
                column * this._tileResolutionX, row * this._tileResolutionY,
                this._tileResolutionX, this._tileResolutionY);
        } else {
            throw new Error("Atlas index is required.");
        }
    }

    /**
     * draw tile from two dimensional array.
     * 
     * array left upper corner is (0, 0) in tilemap
     * @param array array of image index. { i: 0, a: 1 } means imageSources[0] in atlas[1]
     * @param xOffset array x offset, if you want to add tile from array[1][3] to (2, 3) you should set xOffset = 1
     * @param yOffset array y offset, if you want to add tile from array[3][1] to (3, 2) you should set yOffset = 1
     * @returns 
     */
    public drawTileFromTwoDimensionalArray(array: ({i: number, a: number}|null)[][], columnOffset: number, rowOffset: number): void {
        if (!this.readyToDraw) {
            this._initializeFunctions.push(() => this.drawTileFromTwoDimensionalArray(array, columnOffset, rowOffset));
            return;
        }

        const context: CanvasRenderingContext2D = this.htmlElement!.getContext("2d")!;
        for (let rowIndex = 0; rowIndex < array.length; rowIndex++) {
            const row: ({i: number, a: number}|null)[] = array[rowIndex];
            for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
                const tile: ({i: number, a: number}|null) = row[columnIndex];
                if (tile === null) continue;
                const imageSource: TileAtlasItem = this._imageSources![tile.i];
                if (imageSource.rowCount === 1 && imageSource.columnCount === 1) {
                    context.drawImage(
                        imageSource.htmlImageElement, 
                        0, 0, this._tileResolutionX, this._tileResolutionY, 
                        columnIndex * this._tileResolutionX + columnOffset * this._tileResolutionX, rowIndex * this._tileResolutionY + rowOffset * this._tileResolutionY,
                        this._tileResolutionX, this._tileResolutionY);
                } else if (tile.a !== undefined) {
                    const atlasColumnIndex: number = tile.a % imageSource.columnCount;
                    const atlasRowIndex: number = Math.floor(tile.a / imageSource.columnCount);
                    const imageWidth: number = imageSource.htmlImageElement.width / imageSource.columnCount;
                    const imageHeight: number = imageSource.htmlImageElement.height / imageSource.rowCount;
                    context.drawImage(
                        imageSource.htmlImageElement,
                        atlasColumnIndex * imageWidth, atlasRowIndex * imageHeight,
                        imageWidth, imageHeight,
                        columnIndex * this._tileResolutionX + columnOffset * this._tileResolutionX, rowIndex * this._tileResolutionY + rowOffset * this._tileResolutionY,
                        this._tileResolutionX, this._tileResolutionY);
                } else {
                    throw new Error("Atlas index is required.");
                }
            }
        }
    }

    /**
     * clear tile at position.
     * @param column column in tilemap
     * @param row row in tilemap
     * @returns 
     */
    public clearTile(column: number, row: number): void {
        if (!this.readyToDraw) {
            this._initializeFunctions.push(() => this.clearTile(column, row));
            return;
        }

        const context: CanvasRenderingContext2D = this.htmlElement!.getContext("2d")!;
        context.clearRect(column * this._tileResolutionX, row * this._tileResolutionY, this._tileResolutionX, this._tileResolutionY);
    }

    /**
     * image sources for drawing.
     */
    public set imageSources(value: TileAtlasItem[]) {
        if (!this.readyToDraw) {
            this._initializeFunctions.push(() => this.imageSources = value);
            return;
        }

        this._imageSources = value;
        for (let i = 0; i < value.length; i++) {
            if (!value[i].htmlImageElement.complete) throw new Error(`Image ${value[i].htmlImageElement.src} is not loaded.`);
        }
    }

    /**
     * column count of the tilemap (default: 10)
     */
    public get columnCount(): number {
        return this._columnCount;
    }

    /**
     * column count of the tilemap (default: 10)
     */
    public set columnCount(value: number) {
        this._columnCount = value;

        if (this.htmlElement) {
            const tileMapWidth: number = this._columnCount * this._tileWidth;
            const tileMapResolutionX: number = this._columnCount * this._tileResolutionX;
            this.htmlElement.width = tileMapResolutionX;
            this.htmlElement.style.width = (tileMapWidth / this.viewScale) + "px";
            this.updateCenterOffset(true);
        }
    }

    /**
     * row count of the tilemap (default: 10)
     */
    public get rowCount(): number {
        return this._rowCount;
    }

    /**
     * row count of the tilemap (default: 10)
     */
    public set rowCount(value: number) {
        this._rowCount = value;

        if (this.htmlElement) {
            const tileMapHeight: number = this._rowCount * this._tileHeight;
            const tileMapResolutionY: number = this._rowCount * this._tileResolutionY;
            this.htmlElement.height = tileMapResolutionY;
            this.htmlElement.style.height = (tileMapHeight / this.viewScale) + "px";
            this.updateCenterOffset(true);
        }
    }

    /**
     * tile width (default: 1)
     */
    public get gridCellWidth(): number {
        return this._tileWidth;
    }

    /**
     * tile width (default: 1)
     */
    public set gridCellWidth(value: number) {
        this._tileWidth = value;

        if (this.htmlElement) {
            const tileMapWidth: number = this._columnCount * this._tileWidth;
            this.htmlElement.style.width = (tileMapWidth / this.viewScale) + "px";
            this.updateCenterOffset(true);
        }
    }

    /**
     * tile height (default: 1)
     */
    public get gridCellHeight(): number {
        return this._tileHeight;
    }

    /**
     * tile height (default: 1)
     */
    public set gridCellHeight(value: number) {
        this._tileHeight = value;

        if (this.htmlElement) {
            const tileMapHeight: number = this._rowCount * this._tileHeight;
            this.htmlElement.style.height = (tileMapHeight / this.viewScale) + "px";
            this.updateCenterOffset(true);
        }
    }

    /**
     * tile resolution x (default: 16)
     * 
     * if your assets are high resolution, you should set this value to higher value.
     */
    public get tileResolutionX(): number {
        return this._tileResolutionX;
    }

    /**
     * tile resolution x (default: 16)
     * 
     * if your assets are high resolution, you should set this value to higher value.
     */
    public set tileResolutionX(value: number) {
        this._tileResolutionX = value;

        if (this.htmlElement) {
            const tileMapResolutionX: number = this._columnCount * this._tileResolutionX;
            this.htmlElement.width = tileMapResolutionX;
        }
    }

    /**
     * tile resolution y (default: 16)
     * 
     * if your assets are high resolution, you should set this value to higher value.
     */
    public get tileResolutionY(): number {
        return this._tileResolutionY;
    }

    /**
     * tile resolution y (default: 16)
     * 
     * if your assets are high resolution, you should set this value to higher value.
     */
    public set tileResolutionY(value: number) {
        this._tileResolutionY = value;

        if (this.htmlElement) {
            const tileMapResolutionY: number = this._rowCount * this._tileResolutionY;
            this.htmlElement.height = tileMapResolutionY;
        }
    }
    
    /**
     * grid coordinate center position
     * 
     * 
     * if columnCount is even, The center position will be skewed by half the tile width.
     * 
     * if rowCount is even, The center position will be skewed by half the tile height.
     */
    public get gridCenter(): Vector2 {
        const offsetX = this.columnCount % 2 === 1 ? 0 : this._tileWidth / 2;
        const offsetY = this.rowCount % 2 === 1 ? 0 : this._tileHeight / 2;
        return new Vector2(this.transform.position.x + offsetX, this.transform.position.y + offsetY);
    }

    /**
     * grid coordinate center position x
     * 
     * if columnCount is even, The center position will be skewed by half the tile width.
     */
    public get gridCenterX(): number {
        return this.transform.position.x + (this.columnCount % 2 === 1 ? 0 : this._tileWidth / 2);
    }

    /**
     * grid coordinate center position y
     * 
     * if rowCount is even, The center position will be skewed by half the tile height.
     */
    public get gridCenterY(): number {
        return this.transform.position.y + (this.rowCount % 2 === 1 ? 0 : this._tileHeight / 2);
    }
}
