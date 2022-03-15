import { Vector2 } from "three/src/math/Vector2";
import { Vector3 } from "three/src/math/Vector3";
import { Component } from "../../hierarchy_object/Component";
import { GameObject } from "../../hierarchy_object/GameObject";
import { IGridCoordinatable } from "../helper/IGridCoordinatable";
import { CssSpriteRenderer } from "../render/CssSpriteRenderer";
import { ZaxisInitializer } from "../render/ZaxisInitializer";

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

    private addVisualizeImages() {
        this._eventMap.forEach((_value, key) => {
            const [x, y] = key.split("_").map(Number);
            this.addDebugImage(x * this.gridCellWidth, y * this.gridCellHeight);
        });
    }

    private removeVisualizeImages() {
        this._eventVisualizeImages.forEach(image => {
            image.destroy();
        });
        this._eventVisualizeImages = [];
    }
    
    private addDebugImage(x: number, y: number) {
        const gameObjectRef: {ref: GameObject|null} = {ref: null};
        this.gameObject.addChildFromBuilder(
            this.engine.instantiater.buildGameObject(
                "debugImage", new Vector3(x, y, 10000))
                .withComponent(ZaxisInitializer)
                .withComponent(CssSpriteRenderer, c => c.opacity = 0.5)
                .getGameObject(gameObjectRef));
        this._eventVisualizeImages.push(gameObjectRef.ref!);
    }

    public tryInvokeEvent(x: number, y: number, width: number, height: number, target: GameObject): boolean {
        const worldPosition = this.transform.position;
        x -= worldPosition.x;
        y -= worldPosition.y;
        
        const left = Math.floor(x / this.gridCellWidth);
        const right = Math.floor((x + width) / this.gridCellWidth);
        const top = Math.floor(y / this.gridCellHeight);
        const bottom = Math.floor((y + height) / this.gridCellHeight);
        
        for (let y = top; y <= bottom; y++) {
            for (let x = left; x <= right; x++) {
                if (this._eventMap.has(`${x}_${y}`)) {
                    this._eventMap.get(`${x}_${y}`)!(x, y, target);
                }
            }
        }
        return false;
    }

    public get gridCellWidth(): number {
        return this._gridCellWidth;
    }

    public set gridCellWidth(value: number) {
        this._gridCellWidth = value;
    }

    public get gridCellHeight(): number {
        return this._gridCellHeight;
    }

    public set gridCellHeight(value: number) {
        this._gridCellHeight = value;
    }

    public get showEvents(): boolean {
        return this._showCollider;
    }

    public set showEvents(value: boolean) {
        this._showCollider = value;
        if (this._showCollider) {
            this.addVisualizeImages();
        } else {
            this.removeVisualizeImages();
        }
    }

    public get gridCenter(): Vector2 {
        const worldPosition = this.transform.position;
        return new Vector2(worldPosition.x, worldPosition.y);
    }

    public get gridCenterX(): number {
        const worldPosition = this.transform.position;
        return worldPosition.x;
    }

    public get gridCenterY(): number {
        const worldPosition = this.transform.position;
        return worldPosition.y;
    }
}
