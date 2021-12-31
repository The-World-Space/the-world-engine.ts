import { Vector2, Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { PrefabRef } from "../../hierarchy_object/PrefabRef";
import { CssSpriteRenderer } from "../render/CssSpriteRenderer";
import { ZaxisInitializer } from "../render/ZaxisInitializer";
export class GridObjectCollideMap extends Component {
    constructor() {
        super(...arguments);
        this._collideMap = new Map();
        this._gridCellWidth = 16;
        this._gridCellHeight = 16;
        this._showCollider = false;
        this._colliderIsShowing = false;
        this._colliderImages = new Map();
        this._collideEnabled = false;
        this._initializeFunctions = [];
        this._tempVector3 = new Vector3();
    }
    start() {
        this._initializeFunctions.forEach(func => func());
        this._initializeFunctions = [];
    }
    onEnable() {
        if (this._showCollider && !this._colliderIsShowing) {
            this.addColliderImages();
            this._colliderIsShowing = true;
        }
        this._collideEnabled = true;
    }
    onDisable() {
        this.removeColliderImages();
        this._colliderIsShowing = false;
        this._collideEnabled = false;
    }
    addCollider(x, y) {
        if (!this.started && !this.starting) {
            this._initializeFunctions.push(() => {
                this.addCollider(x, y);
            });
            return;
        }
        const collideValue = this._collideMap.get(`${x}_${y}`);
        this._collideMap.set(`${x}_${y}`, collideValue === undefined ? 1 : collideValue + 1);
        if (this._showCollider) {
            this.addDebugImage(x * this.gridCellWidth, y * this.gridCellHeight);
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
        const collideValue = this._collideMap.get(`${x}_${y}`);
        if (collideValue === undefined) {
            return;
        }
        if (collideValue === 1) {
            this._collideMap.delete(`${x}_${y}`);
        }
        else {
            this._collideMap.set(`${x}_${y}`, collideValue - 1);
        }
        if (this._showCollider) {
            this.removeDebugImage(x * this.gridCellWidth, y * this.gridCellHeight);
        }
    }
    addColliderImages() {
        this._collideMap.forEach((_value, key) => {
            const [x, y] = key.split("_").map(Number);
            this.addDebugImage(x * this.gridCellWidth, y * this.gridCellHeight);
        });
    }
    removeColliderImages() {
        this._colliderImages.forEach(image => {
            image.destroy();
        });
        this._colliderImages.clear();
    }
    addDebugImage(x, y) {
        const gameObjectRef = new PrefabRef();
        this.gameObject.addChildFromBuilder(this.engine.instantlater.buildGameObject("debugImage", new Vector3(x, y, 410000))
            .withComponent(ZaxisInitializer)
            .withComponent(CssSpriteRenderer, c => {
            c.opacity = 0.5;
            c.pointerEvents = false;
        })
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
    checkCollision(x, y, width, height) {
        if (!this._collideEnabled)
            return false;
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
        x -= worldPosition.x;
        y -= worldPosition.y;
        const left = Math.floor(x / this.gridCellWidth);
        const right = Math.floor((x + width) / this.gridCellWidth);
        const top = Math.floor(y / this.gridCellHeight);
        const bottom = Math.floor((y + height) / this.gridCellHeight);
        for (let y = top; y <= bottom; y++) {
            for (let x = left; x <= right; x++) {
                const collideValue = this._collideMap.get(`${x}_${y}`);
                if (collideValue !== undefined && collideValue > 0) {
                    return true;
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
    get showCollider() {
        return this._showCollider;
    }
    set showCollider(value) {
        if (this._showCollider === value)
            return;
        this._showCollider = value;
        if (this._showCollider && !this._colliderIsShowing) {
            this.addColliderImages();
            this._colliderIsShowing = true;
        }
        else {
            this.removeColliderImages();
            this._colliderIsShowing = false;
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
