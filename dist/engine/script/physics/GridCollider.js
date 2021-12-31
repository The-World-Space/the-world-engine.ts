import { Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { CssSpriteRenderer } from "../render/CssSpriteRenderer";
import { ZaxisInitializer } from "../render/ZaxisInitializer";
export class GridCollider extends Component {
    constructor() {
        super(...arguments);
        this._collideMap = new Map();
        this._showCollideSpot = false;
        this._collideSpotIsShowing = false;
        this._colliderImages = new Map();
        this._gridObjectCollideMap = null;
        this._collideInfoAddedToMap = false;
        this._initializeFunctions = [];
        this._tempVector = new Vector3();
    }
    start() {
        this._initializeFunctions.forEach(func => func());
        this._initializeFunctions = [];
        if (!this._gridObjectCollideMap) {
            throw new Error("GridCollider: gridObjectCollideMap must be set");
        }
    }
    onEnable() {
        if (this._showCollideSpot && !this._collideSpotIsShowing) {
            this.addColliderImages();
            this._collideSpotIsShowing = true;
        }
        this.addAllCollideInfoToMap();
    }
    onDisable() {
        if (this._showCollideSpot) {
            this.removeColliderImages();
            this._collideSpotIsShowing = false;
        }
        if (this._collideInfoAddedToMap) {
            this.removeAllCollideInfoFromMap();
        }
    }
    onDestroy() {
        this.removeColliderImages();
        this.removeAllCollideInfoFromMap();
    }
    /**
     * add collider, relative to object space center
     * @param x grid unit x
     * @param y grid unit y
     * @returns
     */
    addCollider(x, y) {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.addCollider(x, y);
            });
            return;
        }
        if (this._collideMap.has(`${x}_${y}`)) {
            return;
        }
        this._collideMap.set(`${x}_${y}`, true);
        if (this._showCollideSpot) {
            this.addDebugImage(x, y);
        }
        if (this.gridObjectCollideMap) {
            this.addCollideInfoToMap(x, y);
        }
    }
    addColliderFromTwoDimensionalArray(array, xOffset, yOffset) {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.addColliderFromTwoDimensionalArray(array, xOffset, yOffset);
            });
            return;
        }
        for (let y = 0; y < array.length; y++) {
            for (let x = 0; x < array[y].length; x++) {
                if (array[y][x] === 1) {
                    this.addCollider(x + xOffset, array.length - (y + yOffset));
                }
            }
        }
    }
    removeCollider(x, y) {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.removeCollider(x, y);
            });
            return;
        }
        this._collideMap.delete(`${x}_${y}`);
        if (this._showCollideSpot) {
            this.removeDebugImage(x, y);
        }
        if (this.gridObjectCollideMap) {
            this.removeCollideInfoFromMap(x, y);
        }
    }
    addColliderImages() {
        this._collideMap.forEach((_value, key) => {
            const [x, y] = key.split("_").map(Number);
            this.addDebugImage(x, y);
        });
    }
    removeColliderImages() {
        this._colliderImages.forEach(image => {
            image.destroy();
        });
        this._colliderImages.clear();
    }
    addDebugImage(x, y) {
        if (!this._gridObjectCollideMap)
            return;
        const gridCellWidth = this._gridObjectCollideMap.gridCellWidth;
        const gridCellHeight = this._gridObjectCollideMap.gridCellHeight;
        const localX = x * gridCellWidth;
        const localY = y * gridCellHeight;
        const gameObjectRef = { ref: null };
        this.gameObject.addChildFromBuilder(this.engine.instantlater.buildGameObject("debugImage", new Vector3(localX, localY, 410000))
            .withComponent(ZaxisInitializer)
            .withComponent(CssSpriteRenderer, c => c.opacity = 0.5)
            .getGameObject(gameObjectRef));
        this._colliderImages.set(`${x}_${y}`, gameObjectRef.ref);
    }
    removeDebugImage(x, y) {
        const image = this._colliderImages.get(`${x}_${y}`);
        if (image) {
            image.destroy();
            this._colliderImages.delete(`${x}_${y}`);
        }
    }
    addCollideInfoToMap(x, y) {
        if (!this._gridObjectCollideMap)
            return;
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector);
        const gridCellWidth = this._gridObjectCollideMap.gridCellWidth;
        const gridCellHeight = this._gridObjectCollideMap.gridCellHeight;
        const gridCenter = this._gridObjectCollideMap.gridCenter;
        const GridObjectCollideMapX = Math.floor(x + (worldPosition.x + gridCenter.x) / gridCellWidth);
        const GridObjectCollideMapY = Math.floor(y + (worldPosition.y + gridCenter.y) / gridCellHeight);
        this._gridObjectCollideMap.addCollider(GridObjectCollideMapX, GridObjectCollideMapY);
    }
    addAllCollideInfoToMap() {
        if (!this._gridObjectCollideMap)
            return;
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector);
        const gridCellWidth = this._gridObjectCollideMap.gridCellWidth;
        const gridCellHeight = this._gridObjectCollideMap.gridCellHeight;
        const gridCenter = this._gridObjectCollideMap.gridCenter;
        this._collideMap.forEach((_value, key) => {
            const [x, y] = key.split("_").map(Number);
            const GridObjectCollideMapX = Math.floor(x + worldPosition.x / gridCellWidth + gridCenter.x);
            const GridObjectCollideMapY = Math.floor(y + worldPosition.y / gridCellHeight + gridCenter.y);
            this._gridObjectCollideMap.addCollider(GridObjectCollideMapX, GridObjectCollideMapY);
        });
    }
    removeCollideInfoFromMap(x, y) {
        if (!this._gridObjectCollideMap)
            return;
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector);
        const gridCellWidth = this._gridObjectCollideMap.gridCellWidth;
        const gridCellHeight = this._gridObjectCollideMap.gridCellHeight;
        const gridCenter = this._gridObjectCollideMap.gridCenter;
        const GridObjectCollideMapX = Math.floor(x + (worldPosition.x + gridCenter.x) / gridCellWidth);
        const GridObjectCollideMapY = Math.floor(y + (worldPosition.y + gridCenter.y) / gridCellHeight);
        this._gridObjectCollideMap.removeCollider(GridObjectCollideMapX, GridObjectCollideMapY);
    }
    removeAllCollideInfoFromMap() {
        if (!this._gridObjectCollideMap)
            return;
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector);
        const gridCellWidth = this._gridObjectCollideMap.gridCellWidth;
        const gridCellHeight = this._gridObjectCollideMap.gridCellHeight;
        const gridCenter = this._gridObjectCollideMap.gridCenter;
        this._collideMap.forEach((_value, key) => {
            const [x, y] = key.split("_").map(Number);
            const GridObjectCollideMapX = Math.floor(x + (worldPosition.x + gridCenter.x) / gridCellWidth);
            const GridObjectCollideMapY = Math.floor(y + (worldPosition.y + gridCenter.y) / gridCellHeight);
            this._gridObjectCollideMap.removeCollider(GridObjectCollideMapX, GridObjectCollideMapY);
        });
    }
    get gridObjectCollideMap() {
        return this._gridObjectCollideMap;
    }
    set gridObjectCollideMap(value) {
        if (this._collideInfoAddedToMap) {
            this.removeAllCollideInfoFromMap();
        }
        this._gridObjectCollideMap = value;
        this.addAllCollideInfoToMap();
        this._collideInfoAddedToMap = true;
        if (this._gridObjectCollideMap && this._showCollideSpot) {
            this.removeColliderImages();
            this.addColliderImages();
        }
    }
    get showCollideSpot() {
        return this._showCollideSpot;
    }
    set showCollideSpot(value) {
        if (this._showCollideSpot === value)
            return;
        this._showCollideSpot = value;
        if (this._showCollideSpot && !this._collideSpotIsShowing) {
            this.addColliderImages();
            this._collideSpotIsShowing = true;
        }
        else {
            this.removeColliderImages();
            this._collideSpotIsShowing = false;
        }
    }
}
