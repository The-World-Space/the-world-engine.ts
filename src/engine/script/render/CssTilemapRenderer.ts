import { Vector2 } from "three/src/math/Vector2";
import { Transform } from "../../hierarchy_object/Transform";
import { CssRenderer } from "./CssRenderer";

export class TileAtlasItem {
    private _htmlImageElement: HTMLImageElement;
    private _columnCount: number;
    private _rowCount: number;

    public constructor(htmlImageElement: HTMLImageElement);

    public constructor(htmlImageElement: HTMLImageElement, columnCount: number, rowCount: number);

    public constructor(htmlImageElement: HTMLImageElement, columnCount?: number, rowCount?: number) {
        this._htmlImageElement = htmlImageElement;
        this._rowCount = rowCount || 1;
        this._columnCount = columnCount || 1;
    }

    public get htmlImageElement(): HTMLImageElement {
        return this._htmlImageElement;
    }

    public get columnCount(): number {
        return this._columnCount;
    }

    public get rowCount(): number {
        return this._rowCount;
    }
}

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

    //i is imageIndex and a is atlasIndex
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

    public clearTile(column: number, row: number): void {
        if (!this.readyToDraw) {
            this._initializeFunctions.push(() => this.clearTile(column, row));
            return;
        }

        const context: CanvasRenderingContext2D = this.htmlElement!.getContext("2d")!;
        context.clearRect(column * this._tileResolutionX, row * this._tileResolutionY, this._tileResolutionX, this._tileResolutionY);
    }

    public set imageSources(value: TileAtlasItem[]) {
        if (!this.readyToDraw) {
            this._initializeFunctions.push(() => this.imageSources = value);
            return;
        }

        this._imageSources = value;
    }

    public get columnCount(): number {
        return this._columnCount;
    }

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

    public get rowCount(): number {
        return this._rowCount;
    }

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

    public get gridCellWidth(): number {
        return this._tileWidth;
    }

    public set gridCellWidth(value: number) {
        this._tileWidth = value;

        if (this.htmlElement) {
            const tileMapWidth: number = this._columnCount * this._tileWidth;
            this.htmlElement.style.width = (tileMapWidth / this.viewScale) + "px";
            this.updateCenterOffset(true);
        }
    }

    public get gridCellHeight(): number {
        return this._tileHeight;
    }

    public set gridCellHeight(value: number) {
        this._tileHeight = value;

        if (this.htmlElement) {
            const tileMapHeight: number = this._rowCount * this._tileHeight;
            this.htmlElement.style.height = (tileMapHeight / this.viewScale) + "px";
            this.updateCenterOffset(true);
        }
    }

    public get tileResolutionX(): number {
        return this._tileResolutionX;
    }

    public set tileResolutionX(value: number) {
        this._tileResolutionX = value;

        if (this.htmlElement) {
            const tileMapResolutionX: number = this._columnCount * this._tileResolutionX;
            this.htmlElement.width = tileMapResolutionX;
        }
    }

    public get tileResolutionY(): number {
        return this._tileResolutionY;
    }

    public set tileResolutionY(value: number) {
        this._tileResolutionY = value;

        if (this.htmlElement) {
            const tileMapResolutionY: number = this._rowCount * this._tileResolutionY;
            this.htmlElement.height = tileMapResolutionY;
        }
    }
    
    public get gridCenter(): Vector2 {
        const offsetX = this.columnCount % 2 === 1 ? 0 : this._tileWidth / 2;
        const offsetY = this.rowCount % 2 === 1 ? 0 : this._tileHeight / 2;
        return new Vector2(this.transform.position.x + offsetX, this.transform.position.y + offsetY);
    }

    public get gridCenterX(): number {
        return this.transform.position.x + (this.columnCount % 2 === 1 ? 0 : this._tileWidth / 2);
    }

    public get gridCenterY(): number {
        return this.transform.position.y + (this.rowCount % 2 === 1 ? 0 : this._tileHeight / 2);
    }
}
