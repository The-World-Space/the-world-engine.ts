import { Vector2, Vector3 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../hierarchy_object/Component";
import { ZaxisInitializer } from "./ZaxisInitializer";
export class TileAtlasItem {
    constructor(htmlImageElement, columnCount, rowCount) {
        this._htmlImageElement = htmlImageElement;
        this._rowCount = rowCount || 1;
        this._columnCount = columnCount || 1;
    }
    get htmlImageElement() {
        return this._htmlImageElement;
    }
    get columnCount() {
        return this._columnCount;
    }
    get rowCount() {
        return this._rowCount;
    }
}
export class CssTilemapRenderer extends Component {
    constructor() {
        super(...arguments);
        this._disallowMultipleComponent = true;
        this._columnCount = 10;
        this._rowCount = 10;
        this._tileWidth = 16;
        this._tileHeight = 16;
        this._css3DObject = null;
        this._htmlCanvasElement = null;
        this._imageSources = null;
        this._pointerEvents = true;
        this._zindex = 0;
        this._initializeFunctions = [];
        this._tempVector3 = new Vector3();
    }
    start() {
        this.drawTileMap();
        this._initializeFunctions.forEach(func => func());
        this._initializeFunctions = [];
        ZaxisInitializer.checkAncestorZaxisInitializer(this.gameObject, this.onSortByZaxis.bind(this));
    }
    onDestroy() {
        if (!this.started)
            return;
        if (this._css3DObject)
            this.gameObject.unsafeGetTransform().remove(this._css3DObject); //it"s safe because _css3DObject is not GameObject and remove is from onDestroy
    }
    onEnable() {
        if (this._css3DObject)
            this._css3DObject.visible = true;
    }
    onDisable() {
        if (this._css3DObject)
            this._css3DObject.visible = false;
    }
    onSortByZaxis(zaxis) {
        this._zindex = zaxis;
        if (this._css3DObject) {
            this._css3DObject.element.style.zIndex = Math.floor(this._zindex).toString();
        }
    }
    drawTileMap() {
        const tileMapWidth = this._columnCount * this._tileWidth;
        const tileMapHeight = this._rowCount * this._tileHeight;
        this._htmlCanvasElement = document.createElement("canvas");
        this._css3DObject = new CSS3DObject(this._htmlCanvasElement);
        this.gameObject.unsafeGetTransform().add(this._css3DObject); //it"s safe because _css3DObject is not GameObject and remove is from onDestroy
        this._htmlCanvasElement.style.imageRendering = "pixelated";
        this._htmlCanvasElement.style.zIndex = Math.floor(this._zindex).toString();
        this._htmlCanvasElement.width = tileMapWidth;
        this._htmlCanvasElement.height = tileMapHeight;
        this._htmlCanvasElement.style.pointerEvents = this._pointerEvents ? "auto" : "none";
        if (this.enabled && this.gameObject.activeInHierarchy)
            this._css3DObject.visible = true;
        else
            this._css3DObject.visible = false;
    }
    drawTile(column, row, imageIndex, atlasIndex) {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.drawTile(column, row, imageIndex, atlasIndex);
            });
            return;
        }
        const context = this._htmlCanvasElement.getContext("2d");
        const imageSource = this._imageSources[imageIndex];
        if (imageSource.rowCount === 1 && imageSource.columnCount === 1) {
            context.drawImage(imageSource.htmlImageElement, 0, 0, this._tileWidth, this._tileHeight, column * this._tileWidth, row * this._tileHeight, this._tileWidth, this._tileHeight);
        }
        else if (atlasIndex !== undefined) {
            const rowIndex = Math.floor(atlasIndex / imageSource.columnCount);
            const columnIndex = atlasIndex % imageSource.columnCount;
            const imageWidth = imageSource.htmlImageElement.width / imageSource.columnCount;
            const imageHeight = imageSource.htmlImageElement.height / imageSource.rowCount;
            context.drawImage(imageSource.htmlImageElement, columnIndex * imageWidth, rowIndex * imageHeight, imageWidth, imageHeight, column * this._tileWidth, row * this._tileHeight, this._tileWidth, this._tileHeight);
        }
        else {
            throw new Error("Atlas index is required.");
        }
    }
    //i is imageIndex and a is atlasIndex
    drawTileFromTwoDimensionalArray(array, columnOffset, rowOffset) {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.drawTileFromTwoDimensionalArray(array, columnOffset, rowOffset);
            });
            return;
        }
        const context = this._htmlCanvasElement.getContext("2d");
        for (let rowIndex = 0; rowIndex < array.length; rowIndex++) {
            const row = array[rowIndex];
            for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
                const tile = row[columnIndex];
                if (tile === null)
                    continue;
                const imageSource = this._imageSources[tile.i];
                if (imageSource.rowCount === 1 && imageSource.columnCount === 1) {
                    context.drawImage(imageSource.htmlImageElement, 0, 0, this._tileWidth, this._tileHeight, columnIndex * this._tileWidth + columnOffset * this._tileWidth, rowIndex * this._tileHeight + rowOffset * this._tileHeight, this._tileWidth, this._tileHeight);
                }
                else if (tile.a !== undefined) {
                    const atlasColumnIndex = tile.a % imageSource.columnCount;
                    const atlasRowIndex = Math.floor(tile.a / imageSource.columnCount);
                    const imageWidth = imageSource.htmlImageElement.width / imageSource.columnCount;
                    const imageHeight = imageSource.htmlImageElement.height / imageSource.rowCount;
                    context.drawImage(imageSource.htmlImageElement, atlasColumnIndex * imageWidth, atlasRowIndex * imageHeight, imageWidth, imageHeight, columnIndex * this._tileWidth + columnOffset * this._tileWidth, rowIndex * this._tileHeight + rowOffset * this._tileHeight, this._tileWidth, this._tileHeight);
                }
                else {
                    throw new Error("Atlas index is required.");
                }
            }
        }
    }
    clearTile(column, row) {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.clearTile(column, row);
            });
            return;
        }
        const context = this._htmlCanvasElement.getContext("2d");
        context.clearRect(column * this._tileWidth, row * this._tileHeight, this._tileWidth, this._tileHeight);
    }
    set imageSources(value) {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.imageSources = value;
            });
            return;
        }
        this._imageSources = value;
    }
    get pointerEvents() {
        return this._pointerEvents;
    }
    set pointerEvents(value) {
        this._pointerEvents = value;
        if (this._htmlCanvasElement) {
            this._htmlCanvasElement.style.pointerEvents = this._pointerEvents ? "auto" : "none";
        }
    }
    get columnCount() {
        return this._columnCount;
    }
    set columnCount(value) {
        this._columnCount = value;
        if (this._htmlCanvasElement) {
            this._htmlCanvasElement.width = this._columnCount * this._tileWidth;
        }
    }
    get rowCount() {
        return this._rowCount;
    }
    set rowCount(value) {
        this._rowCount = value;
        if (this._htmlCanvasElement) {
            this._htmlCanvasElement.height = this._rowCount * this._tileHeight;
        }
    }
    get gridCellWidth() {
        return this._tileWidth;
    }
    set gridCellWidth(value) {
        this._tileWidth = value;
        if (this._htmlCanvasElement) {
            this._htmlCanvasElement.width = this._columnCount * this._tileWidth;
        }
    }
    get gridCellHeight() {
        return this._tileHeight;
    }
    set gridCellHeight(value) {
        this._tileHeight = value;
        if (this._htmlCanvasElement) {
            this._htmlCanvasElement.height = this._rowCount * this._tileHeight;
        }
    }
    get gridCenter() {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
        const offsetX = this.columnCount % 2 === 1 ? 0 : this._tileWidth / 2;
        const offsetY = this.rowCount % 2 === 1 ? 0 : this._tileHeight / 2;
        return new Vector2(worldPosition.x + offsetX, worldPosition.y + offsetY);
    }
    get gridCenterX() {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
        return worldPosition.x + (this.columnCount % 2 === 1 ? 0 : this._tileWidth / 2);
    }
    get gridCenterY() {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
        return worldPosition.y + (this.rowCount % 2 === 1 ? 0 : this._tileHeight / 2);
    }
}
