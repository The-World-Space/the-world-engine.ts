import { Vector2, Vector3 } from "three/src/Three";
import { Component } from "../../hierarchy_object/Component";
import { GameObject } from "../../hierarchy_object/GameObject";
import { PrefabRef } from "../../hierarchy_object/PrefabRef";
import { CssSpriteRenderer } from "../render/CssSpriteRenderer";
import { ZaxisInitializer } from "../render/ZaxisInitializer";
import { IGridCollidable } from "./IGridCollidable";


/**
 * object collide map for grid system
 * 
 * this component store overlap information of collider
 * so if you add collider twice at same position, remove must be called twice
 * 
 * coordinate system is same as world coordinate system (positive x is right, positive y is up)
 * 
 * important: grid position data is stored as string ("x_y" format)
 * so this component might not work properly if this component's gameObject.position is not integer
 */
export class GridObjectCollideMap extends Component implements IGridCollidable {
    private readonly _collideMap: Map<`${number}_${number}`, number> = new Map();
    private _gridCellWidth = 1;
    private _gridCellHeight = 1;
    private _showCollider = false;
    private _colliderIsShowing = false;
    private readonly _colliderImages: Map<`${number}_${number}`, GameObject> = new Map();
    private _collideEnabled = false;
    
    private _initializeFunctions: ((() => void))[] = [];
    private _started = false;

    public start(): void {
        this._started = true;
        this._initializeFunctions.forEach(func => func());
        this._initializeFunctions = [];
    }

    public onEnable(): void {
        if (this._showCollider && !this._colliderIsShowing) {
            this.addColliderImages();
            this._colliderIsShowing = true;
        }
        this._collideEnabled = true;
    }

    public onDisable(): void {
        this.removeColliderImages();
        this._colliderIsShowing = false;
        this._collideEnabled = false;
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
        const collideValue = this._collideMap.get(`${x}_${y}`);
        this._collideMap.set(`${x}_${y}`, collideValue === undefined ? 1 : collideValue + 1);
        if (this._showCollider) {
            this.addDebugImage(x * this.gridCellWidth, y * this.gridCellHeight);
        }
    }

    /**
     * add collider from two dimensional array. array left bottom is (0, 0) in grid coordinate system
     * @param array array that contains 1 or 0. 1 means collider is there
     * @param xOffset array x offset, if you want to add collider from array[1][3] to (2, 3) you should set xOffset = 1
     * @param yOffset array y offset, if you want to add collider from array[3][1] to (3, 2) you should set yOffset = 1
     * @returns 
     */
    public addColliderFromTwoDimensionalArray(array: (1|0)[][], xOffset: number, yOffset: number): void {
        if (!this._started) {
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

    /**
     * remove collider at position
     * @param x x position in grid
     * @param y y position in grid
     * @returns 
     */
    public removeCollider(x: number, y: number): void {
        const collideValue = this._collideMap.get(`${x}_${y}`);
        if (collideValue === undefined) {
            return;
        }
        if (collideValue === 1) {
            this._collideMap.delete(`${x}_${y}`);
        } else {
            this._collideMap.set(`${x}_${y}`, collideValue - 1);
        }

        if (this._showCollider) {
            this.removeDebugImage(x * this.gridCellWidth, y * this.gridCellHeight);
        }
    }

    private addColliderImages(): void {
        this._collideMap.forEach((_value, key) => {
            const [x, y] = key.split("_").map(Number);
            this.addDebugImage(x * this.gridCellWidth, y * this.gridCellHeight);
        });
    }

    private removeColliderImages(): void {
        this._colliderImages.forEach(image => {
            image.destroy();
        });
        this._colliderImages.clear();
    }
    
    private addDebugImage(x: number, y: number): void {
        const gameObjectRef = new PrefabRef<GameObject>();
        this.gameObject.addChildFromBuilder(
            this.engine.instantiater.buildGameObject(
                "debugImage", new Vector3(x, y, 410000))
                .withComponent(ZaxisInitializer)
                .withComponent(CssSpriteRenderer, c => {
                    c.opacity = 0.5;
                    c.pointerEvents = false;
                })
                .getGameObject(gameObjectRef));
        this._colliderImages.set(`${x}_${y}`, gameObjectRef.ref!);
    }

    private removeDebugImage(x: number, y: number): void {
        const image = this._colliderImages.get(`${x}_${y}`);
        if (image) {
            image.destroy();
            this._colliderImages.delete(`${x}_${y}`);
        }
    }

    /**
     * query that collides at position
     * @param x world position x
     * @param y world position y
     * @param width collison width
     * @param height collision height
     * @returns if collides, return true. otherwise, return false
     */
    public checkCollision(x: number, y: number, width: number, height: number): boolean {
        if (!this._collideEnabled) return false;
        const worldPosition = this.transform.position;
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

    /**
     * grid cell width, if this value is not integer, might not work properly (default: 1)
     */
    public get gridCellWidth(): number {
        return this._gridCellWidth;
    }

    /**
     * grid cell width, if this value is not integer, might not work properly (default: 1)
     */
    public set gridCellWidth(value: number) {
        this._gridCellWidth = value;
    }

    /**
     * grid cell height, if this value is not integer, might not work properly (default: 1)
     */
    public get gridCellHeight(): number {
        return this._gridCellHeight;
    }

    /**
     * grid cell height, if this value is not integer, might not work properly (default: 1)
     */
    public set gridCellHeight(value: number) {
        this._gridCellHeight = value;
    }

    /**
     * if this value is true, grid collide map will visualized as debug image (default: false)
     */
    public get showCollider(): boolean {
        return this._showCollider;
    }

    /**
     * if this value is true, grid collide map will visualized as debug image (default: false)
     */
    public set showCollider(value: boolean) {
        if (this._showCollider === value) return;
        this._showCollider = value;
        if (this._showCollider && !this._colliderIsShowing) {
            this.addColliderImages();
            this._colliderIsShowing = true;
        } else {
            this.removeColliderImages();
            this._colliderIsShowing = false;
        }
    }

    /**
     * grid coordinate center position
     */
    public get gridCenter(): Vector2 {
        const worldPosition = this.transform.position;
        return new Vector2(worldPosition.x, worldPosition.y);
    }

    /**
     * grid coordinate center position x
     */
    public get gridCenterX(): number {
        return this.transform.position.x;
    }

    /**
     * grid coordinate center position y
     */
    public get gridCenterY(): number {
        return this.transform.position.y;
    }
}
