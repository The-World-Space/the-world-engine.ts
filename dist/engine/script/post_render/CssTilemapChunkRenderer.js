import { Vector2, Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { CssTilemapRenderer } from "../render/CssTilemapRenderer";
export class CssTilemapChunkRenderer extends Component {
    constructor() {
        super(...arguments);
        this._cssTilemapRendererMap = new Map();
        //key is chunk position in string format "x_y"
        this._chunkSize = 16;
        this._tileWidth = 16;
        this._tileHeight = 16;
        this._imageSources = null;
        this._pointerEvents = true;
        this._initializeFunctions = [];
    }
    start() {
        this._initializeFunctions.forEach(func => func());
        this._initializeFunctions = [];
    }
    updateTilemapPosition() {
        this._cssTilemapRendererMap.forEach((renderer, key) => {
            const chunkIndexX = this.getIndexXFromKey(key) * this._chunkSize * this._tileWidth;
            const chunkIndexY = this.getIndexYFromKey(key) * this._chunkSize * this._tileHeight;
            renderer.gameObject.transform.position.set(chunkIndexX, chunkIndexY, 0);
        });
    }
    getIndexXFromKey(key) {
        return parseInt(key.substring(0, key.indexOf("_")));
    }
    getIndexYFromKey(key) {
        return parseInt(key.substring(key.indexOf("_") + 1));
    }
    getKeyFromIndex(x, y) {
        return `${x}_${y}`;
    }
    computeDrawPosition(chunkIndexX, chunkIndexY, x, y) {
        //get relative position in chunk
        //note: 0,0 is center of chunk
        const relativeX = (x - chunkIndexX * this._chunkSize) + this._chunkSize / 2;
        const relativeY = (y - chunkIndexY * this._chunkSize) + this._chunkSize / 2;
        return new Vector2(relativeX, relativeY);
    }
    getTilemapRenedererOrCreate(chunkIndexX, chunkIndexY) {
        const chunkIndex = this.getKeyFromIndex(chunkIndexX, chunkIndexY);
        let cssTilemapRenderer = this._cssTilemapRendererMap.get(chunkIndex);
        if (cssTilemapRenderer === undefined) {
            this.gameObject.addChildFromBuilder(this.engine.instantlater.buildGameObject(`css_tilemap_renderer_${chunkIndexX}_${chunkIndexY}`, new Vector3(chunkIndexX * this._chunkSize * this._tileWidth, chunkIndexY * this._chunkSize * this._tileHeight, 0))
                .withComponent(CssTilemapRenderer, c => {
                cssTilemapRenderer = c;
                if (this._imageSources)
                    c.imageSources = this._imageSources;
                c.gridCellWidth = this._tileWidth;
                c.gridCellHeight = this._tileHeight;
                c.rowCount = this._chunkSize;
                c.columnCount = this._chunkSize;
                c.pointerEvents = this._pointerEvents;
            }));
            this._cssTilemapRendererMap.set(chunkIndex, cssTilemapRenderer);
        }
        return cssTilemapRenderer;
    }
    getTilemapRenedererOrNull(chunkIndexX, chunkIndexY) {
        const chunkIndex = this.getKeyFromIndex(chunkIndexX, chunkIndexY);
        const cssTilemapRenderer = this._cssTilemapRendererMap.get(chunkIndex);
        if (cssTilemapRenderer === undefined) {
            return null;
        }
        return cssTilemapRenderer;
    }
    drawTile(x, y, imageIndex, atlasIndex) {
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
        cssTilemapRenderer.drawTile(drawPosition.x + drawOffsetX, this._chunkSize - drawPosition.y - 1 + drawOffsetY, imageIndex, atlasIndex);
    }
    drawTileFromTwoDimensionalArray(array, xOffset, yOffset) {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.drawTileFromTwoDimensionalArray(array, xOffset, yOffset);
            });
            return;
        }
        for (let y = 0; y < array.length; y++) {
            for (let x = 0; x < array[y].length; x++) {
                if (array[y][x] === null)
                    continue;
                this.drawTile(x + xOffset, array.length - y + yOffset - 1, array[y][x].i, array[y][x].a);
            }
        }
    }
    clearTile(x, y) {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.clearTile(x, y);
            });
            return;
        }
        const chunkIndexX = Math.floor((x + this._chunkSize / 2) / this._chunkSize);
        const chunkIndexY = Math.floor((y + this._chunkSize / 2) / this._chunkSize);
        const cssTilemapRenderer = this.getTilemapRenedererOrNull(chunkIndexX, chunkIndexY);
        if (cssTilemapRenderer === null)
            return;
        const drawPosition = this.computeDrawPosition(chunkIndexX, chunkIndexY, x, y);
        const drawOffsetX = this.chunkSize % 2 === 0 ? 0 : -0.5;
        const drawOffsetY = this.chunkSize % 2 === 0 ? 0 : 0.5;
        cssTilemapRenderer.clearTile(drawPosition.x + drawOffsetX, this._chunkSize - drawPosition.y - 1 + drawOffsetY);
    }
    get chunkSize() {
        return this._chunkSize;
    }
    set chunkSize(value) {
        this._chunkSize = value;
        this.updateTilemapPosition();
        this._cssTilemapRendererMap.forEach((renderer, _) => {
            renderer.rowCount = this._chunkSize;
            renderer.columnCount = this._chunkSize;
        });
    }
    set imageSources(value) {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.imageSources = value;
            });
            return;
        }
        this._imageSources = value;
        this._cssTilemapRendererMap.forEach((renderer, _) => {
            renderer.imageSources = value;
        });
    }
    get pointerEvents() {
        return this._pointerEvents;
    }
    set pointerEvents(value) {
        this._pointerEvents = value;
        this._cssTilemapRendererMap.forEach((renderer, _) => {
            renderer.pointerEvents = value;
        });
    }
    get gridCellWidth() {
        return this._tileWidth;
    }
    set gridCellWidth(value) {
        if (this._tileWidth === value)
            return;
        this._tileWidth = value;
        this.updateTilemapPosition();
        this._cssTilemapRendererMap.forEach((renderer, _) => {
            renderer.gridCellWidth = this._tileWidth;
        });
    }
    get gridCellHeight() {
        return this._tileHeight;
    }
    set gridCellHeight(value) {
        if (this._tileHeight === value)
            return;
        this._tileHeight = value;
        this.updateTilemapPosition();
        this._cssTilemapRendererMap.forEach((renderer, _) => {
            renderer.gridCellHeight = this._tileHeight;
        });
    }
    get gridCenter() {
        const offsetX = this._chunkSize % 2 === 1 ? 0 : this._tileWidth / 2;
        const offsetY = this._chunkSize % 2 === 1 ? 0 : this._tileHeight / 2;
        return new Vector2(this.gameObject.transform.position.x + offsetX, this.gameObject.transform.position.y + offsetY);
    }
    get gridCenterX() {
        const offsetX = this._chunkSize % 2 === 1 ? 0 : this._tileWidth / 2;
        return this.gameObject.transform.position.x + offsetX;
    }
    get gridCenterY() {
        const offsetY = this._chunkSize % 2 === 1 ? 0 : this._tileHeight / 2;
        return this.gameObject.transform.position.y + offsetY;
    }
}
