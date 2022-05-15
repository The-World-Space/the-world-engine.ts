import { Vector2, Vector3 } from "three/src/Three";

import { Component } from "../../hierarchy_object/Component";
import { GameObject } from "../../hierarchy_object/GameObject";
import { IGridCoordinatable } from "../helper/IGridCoordinatable";
import { CssSpriteRenderer } from "../render/CssSpriteRenderer";
import { ZaxisInitializer } from "../render/ZaxisInitializer";

/**
 * event map for grid system
 * 
 * coordinate system is same as world coordinate system (positive x is right, positive y is up)
 * 
 * important: grid position data is stored as string ("x_y" format)
 * so this component might not work properly if this component's gameObject.position is not integer
 */
export class GridEventMap extends Component implements IGridCoordinatable {
    private readonly _eventMap: Map<`${number}_${number}`, (gridX: number, gridY: number, target: GameObject) => void> = new Map();
    private _gridCellWidth = 1;
    private _gridCellHeight = 1;
    private _showCollider = false;
    private _eventVisualizeImages: GameObject[] = [];
    
    private _initializeFunctions: ((() => void))[] = [];
    private _started = false;

    public start(): void {
        this._started = true;
        this._initializeFunctions.forEach(func => func());
        this._initializeFunctions = [];
    }

    /**
     * add event at position
     * @param x x position in grid
     * @param y y position in grid
     * @param callback event callback
     * @returns 
     */
    public addEvent(x: number, y: number, callback: (gridX: number, gridY: number, target: GameObject) => void): void {
        if (!this._started) {
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

    /**
     * add event from two dimensional array. array left bottom is (0, 0) in grid coordinate system
     * @param array array that contains event callback
     * @param xOffset array x offset, if you want to add event from array[1][3] to (2, 3) you should set xOffset = 1
     * @param yOffset array y offset, if you want to add event from array[3][1] to (3, 2) you should set yOffset = 1
     * @returns 
     */
    public addEventsFromTwoDimensionalArray(
        array: (((gridX: number, gridY: number, target: GameObject) => void)|null)[][],
        xOffset: number,
        yOffset: number
    ): void {
        if (!this._started) {
            this._initializeFunctions.push(() => {
                this.addEventsFromTwoDimensionalArray(array, xOffset, yOffset);
            });
            return;
        }
        
        for (let y = 0; y < array.length; y++) {
            for (let x = 0; x < array[y].length; x++) {
                if (array[y][x] === null) continue;
                this.addEvent(x + xOffset, array.length - (y + yOffset), array[y][x]!);
            }
        }
    }

    private addVisualizeImages(): void {
        this._eventMap.forEach((_value, key) => {
            const [x, y] = key.split("_").map(Number);
            this.addDebugImage(x * this.gridCellWidth, y * this.gridCellHeight);
        });
    }

    private removeVisualizeImages(): void {
        this._eventVisualizeImages.forEach(image => {
            image.destroy();
        });
        this._eventVisualizeImages = [];
    }
    
    private addDebugImage(x: number, y: number): void {
        const gameObjectRef: {ref: GameObject|null} = {ref: null};
        this.gameObject.addChildFromBuilder(
            this.engine.instantiater.buildGameObject(
                "debugImage", new Vector3(x, y, 10000))
                .withComponent(ZaxisInitializer)
                .withComponent(CssSpriteRenderer, c => c.opacity = 0.5)
                .getGameObject(gameObjectRef));
        this._eventVisualizeImages.push(gameObjectRef.ref!);
    }

    /**
     * invoke event callback if there is event at grid position
     * @param x world position x
     * @param y world position y
     * @param width aabb collision width
     * @param height aabb collision height
     * @param target target game object
     * @returns true if there is event at grid position
     */
    public tryInvokeEvent(x: number, y: number, width: number, height: number, target: GameObject): boolean {
        const worldPosition = this.transform.position;
        x -= worldPosition.x;
        y -= worldPosition.y;
        
        const left = Math.floor(x / this.gridCellWidth);
        const right = Math.floor((x + width) / this.gridCellWidth);
        const top = Math.floor(y / this.gridCellHeight);
        const bottom = Math.floor((y + height) / this.gridCellHeight);
        
        let invoked = false;
        for (let y = top; y <= bottom; y++) {
            for (let x = left; x <= right; x++) {
                if (this._eventMap.has(`${x}_${y}`)) {
                    this._eventMap.get(`${x}_${y}`)!(x, y, target);
                    invoked = true;
                }
            }
        }
        return invoked;
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
     * if this value is true, grid event map will visualized as debug image (default: false)
     */
    public get showEvents(): boolean {
        return this._showCollider;
    }

    /**
     * if this value is true, grid event map will visualized as debug image (default: false)
     */
    public set showEvents(value: boolean) {
        this._showCollider = value;
        if (this._showCollider) {
            this.addVisualizeImages();
        } else {
            this.removeVisualizeImages();
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
        const worldPosition = this.transform.position;
        return worldPosition.x;
    }

    /**
     * grid coordinate center position y
     */
    public get gridCenterY(): number {
        const worldPosition = this.transform.position;
        return worldPosition.y;
    }
}
