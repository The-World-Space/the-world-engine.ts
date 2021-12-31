import { Vector2, Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { GameObject } from "../../hierarchy_object/GameObject";
import { PrefabRef } from "../../hierarchy_object/PrefabRef";
import { CssSpriteRenderer } from "../render/CssSpriteRenderer";
import { ZaxisInitializer } from "../render/ZaxisInitializer";
import { IGridCollidable } from "./IGridCollidable";

export class GridObjectCollideMap extends Component implements IGridCollidable {
    private readonly _collideMap: Map<`${number}_${number}`, number> = new Map();
    private _gridCellWidth: number = 16;
    private _gridCellHeight: number = 16;
    private _showCollider: boolean = false;
    private _colliderIsShowing: boolean = false;
    private _colliderImages: Map<`${number}_${number}`, GameObject> = new Map();
    private _collideEnabled: boolean = false;
    
    private _initializeFunctions: ((() => void))[] = [];

    protected start(): void {
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

    public addCollider(x: number, y: number): void {
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

    public addColliderFromTwoDimensionalArray(array: (1|0)[][], xOffset: number, yOffset: number): void {
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
            this.engine.instantlater.buildGameObject(
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
    
    private readonly _tempVector3 = new Vector3();

    public checkCollision(x: number, y: number, width: number, height: number): boolean {
        if (!this._collideEnabled) return false;
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

    public get showCollider(): boolean {
        return this._showCollider;
    }

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

    public get gridCenter(): Vector2 {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
        return new Vector2(worldPosition.x, worldPosition.y);
    }

    public get gridCenterX(): number {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
        return worldPosition.x;
    }

    public get gridCenterY(): number {
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
        return worldPosition.y;
    }
}
