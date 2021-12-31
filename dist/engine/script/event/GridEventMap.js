import { Vector2, Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { CssSpriteRenderer } from "../render/CssSpriteRenderer";
import { ZaxisInitializer } from "../render/ZaxisInitializer";
export class GridEventMap extends Component {
    constructor() {
        super(...arguments);
        this._eventMap = new Map();
        this._gridCellWidth = 16;
        this._gridCellHeight = 16;
        this._showCollider = false;
        this._eventVisualizeImages = [];
        this._initializeFunctions = [];
        this._tempVector3 = new Vector3();
    }
    start() {
        this._initializeFunctions.forEach(func => func());
        this._initializeFunctions = [];
    }
    addEvent(x, y, callback) {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.addEvent(x, y, callback);
            });
            return;
        }
        this._eventMap.set(`${x}_${y}`, callback);
        if (this._showCollider) {
            this.addDebugImage(x * this.gridCellWidth, y * this.gridCellHeight);
        }
    }
    addEventsFromTwoDimensionalArray(array, xOffset, yOffset) {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.addEventsFromTwoDimensionalArray(array, xOffset, yOffset);
            });
            return;
        }
        for (let y = 0; y < array.length; y++) {
            for (let x = 0; x < array[y].length; x++) {
                if (array[y][x] === null)
                    continue;
                this.addEvent(x + xOffset, array.length - (y + yOffset), array[y][x]);
            }
        }
    }
    addVisualizeImages() {
        this._eventMap.forEach((_value, key) => {
            const [x, y] = key.split("_").map(Number);
            this.addDebugImage(x * this.gridCellWidth, y * this.gridCellHeight);
        });
    }
    removeVisualizeImages() {
        this._eventVisualizeImages.forEach(image => {
            image.destroy();
        });
        this._eventVisualizeImages = [];
    }
    addDebugImage(x, y) {
        const gameObjectRef = { ref: null };
        this.gameObject.addChildFromBuilder(this.engine.instantlater.buildGameObject("debugImage", new Vector3(x, y, 10000))
            .withComponent(ZaxisInitializer)
            .withComponent(CssSpriteRenderer, c => c.opacity = 0.5)
            .getGameObject(gameObjectRef));
        this._eventVisualizeImages.push(gameObjectRef.ref);
    }
    tryInvokeEvent(x, y, width, height, target) {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
        x -= worldPosition.x;
        y -= worldPosition.y;
        const left = Math.floor(x / this.gridCellWidth);
        const right = Math.floor((x + width) / this.gridCellWidth);
        const top = Math.floor(y / this.gridCellHeight);
        const bottom = Math.floor((y + height) / this.gridCellHeight);
        for (let y = top; y <= bottom; y++) {
            for (let x = left; x <= right; x++) {
                if (this._eventMap.has(`${x}_${y}`)) {
                    this._eventMap.get(`${x}_${y}`)(x, y, target);
                }
            }
        }
        return false;
    }
    get gridCellWidth() {
        return this._gridCellWidth;
    }
    set gridCellWidth(value) {
        this._gridCellWidth = value;
    }
    get gridCellHeight() {
        return this._gridCellHeight;
    }
    set gridCellHeight(value) {
        this._gridCellHeight = value;
    }
    get showEvents() {
        return this._showCollider;
    }
    set showEvents(value) {
        this._showCollider = value;
        if (this._showCollider) {
            this.addVisualizeImages();
        }
        else {
            this.removeVisualizeImages();
        }
    }
    get gridCenter() {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
        return new Vector2(worldPosition.x, worldPosition.y);
    }
    get gridCenterX() {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
        return worldPosition.x;
    }
    get gridCenterY() {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
        return worldPosition.y;
    }
}
