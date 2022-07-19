import { Vector3 } from "three/src/Three";

import { Component } from "../../hierarchy_object/Component";
import { GameObject } from "../../hierarchy_object/GameObject";
import { CssSpriteRenderer } from "../render/CssSpriteRenderer";
import { ZaxisInitializer } from "../render/ZaxisInitializer";
import { GridObjectCollideMap } from "./GridObjectCollideMap";

/**
 * collider work with `GridObjectCollideMap`
 * 
 * coordinate system is same as world coordinate system (positive x is right, positive y is up)
 * 
 * important: grid position data is stored as string ("x_y" format)
 * so this component might not work properly if this component's gameObject.position is not integer
 * 
 * don't use this component on dynamic gameObject you can only use this component on static gameObject (don't move your gameObject)
 */
export class GridCollider extends Component {
    private readonly _collideMap: Map<`${number}_${number}`, boolean> = new Map();
    private _showCollideSpot = false;
    private _collideSpotIsShowing = false;
    private readonly _colliderImages: Map<`${number}_${number}`, GameObject> = new Map();
    private _gridObjectCollideMap: GridObjectCollideMap|null = null;
    private _collideInfoAddedToMap = false;
    private _initializeFunctions: ((() => void))[] = [];
    private _started = false;

    public start(): void {
        this._started = true;
        this._initializeFunctions.forEach(func => func());
        this._initializeFunctions = [];

        if (!this._gridObjectCollideMap) {
            throw new Error("GridCollider: gridObjectCollideMap must be set");
        }
    }

    public onEnable(): void {
        if (this._showCollideSpot && !this._collideSpotIsShowing) {
            this.addColliderImages();
            this._collideSpotIsShowing = true;
        }
        this.addAllCollideInfoToMap();
    }

    public onDisable(): void {
        if (this._showCollideSpot) {
            this.removeColliderImages();
            this._collideSpotIsShowing = false;
        }
        if (this._collideInfoAddedToMap) {
            this.removeAllCollideInfoFromMap();
        }
    }

    public onDestroy(): void {
        this.removeColliderImages();
        this.removeAllCollideInfoFromMap();
    }

    /**
     * add collider, relative to object space center
     * @param x x position in object space grid
     * @param y y position in object space grid
     * @returns 
     */
    public addCollider(x: number, y: number): void {
        if (!this._started) {
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

    /**
     * add collider from two dimensional array. array left bottom is (0, 0) in object space grid coordinate system
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
        if (!this._started) {
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

    private addColliderImages(): void {
        this._collideMap.forEach((_value, key) => {
            const [x, y] = key.split("_").map(Number);
            this.addDebugImage(x, y);
        });
    }

    private removeColliderImages(): void {
        this._colliderImages.forEach(image => {
            image.destroy();
        });
        this._colliderImages.clear();
    }
    
    private addDebugImage(x: number, y: number): void {
        if (!this._gridObjectCollideMap) return;
        const gridCellWidth = this._gridObjectCollideMap.gridCellWidth;
        const gridCellHeight = this._gridObjectCollideMap.gridCellHeight;

        const localX = x * gridCellWidth;
        const localY = y * gridCellHeight;

        const gameObjectRef: {ref: GameObject|null} = {ref: null};
        this.gameObject.addChildFromBuilder(
            this.engine.instantiater.buildGameObject(
                "debug-image", new Vector3(localX, localY, 410000))
                .withComponent(ZaxisInitializer)
                .withComponent(CssSpriteRenderer, c => {
                    c.opacity = 0.5;
                    c.imageWidth = gridCellWidth;
                    c.imageHeight = gridCellHeight;
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

    private addCollideInfoToMap(x: number, y: number): void {
        if (!this._gridObjectCollideMap) return;
        
        const worldPosition = this.transform.position;
        const gridCellWidth = this._gridObjectCollideMap.gridCellWidth;
        const gridCellHeight = this._gridObjectCollideMap.gridCellHeight;
        const gridCenter = this._gridObjectCollideMap.gridCenter;

        const gridObjectCollideMapX = Math.floor(x + (worldPosition.x + gridCenter.x) / gridCellWidth);
        const gridObjectCollideMapY = Math.floor(y + (worldPosition.y + gridCenter.y) / gridCellHeight);
        this._gridObjectCollideMap!.addCollider(gridObjectCollideMapX, gridObjectCollideMapY);
    }

    private addAllCollideInfoToMap(): void {
        if (!this._gridObjectCollideMap) return;

        const worldPosition = this.transform.position;
        const gridCellWidth = this._gridObjectCollideMap.gridCellWidth;
        const gridCellHeight = this._gridObjectCollideMap.gridCellHeight;
        const gridCenter = this._gridObjectCollideMap.gridCenter;

        this._collideMap.forEach((_value, key) => {
            const [x, y] = key.split("_").map(Number);
            
            const gridObjectCollideMapX = Math.floor(x + worldPosition.x / gridCellWidth + gridCenter.x);
            const gridObjectCollideMapY = Math.floor(y + worldPosition.y / gridCellHeight + gridCenter.y);
            this._gridObjectCollideMap!.addCollider(gridObjectCollideMapX, gridObjectCollideMapY);
        });
    }
    
    private removeCollideInfoFromMap(x: number, y: number): void {
        if (!this._gridObjectCollideMap) return;
        
        const worldPosition = this.transform.position;
        const gridCellWidth = this._gridObjectCollideMap.gridCellWidth;
        const gridCellHeight = this._gridObjectCollideMap.gridCellHeight;
        const gridCenter = this._gridObjectCollideMap.gridCenter;

        const gridObjectCollideMapX = Math.floor(x + (worldPosition.x + gridCenter.x) / gridCellWidth);
        const gridObjectCollideMapY = Math.floor(y + (worldPosition.y + gridCenter.y) / gridCellHeight);

        this._gridObjectCollideMap!.removeCollider(gridObjectCollideMapX, gridObjectCollideMapY);
    }

    private removeAllCollideInfoFromMap(): void {
        if (!this._gridObjectCollideMap) return;

        const worldPosition = this.transform.position;
        const gridCellWidth = this._gridObjectCollideMap.gridCellWidth;
        const gridCellHeight = this._gridObjectCollideMap.gridCellHeight;
        const gridCenter = this._gridObjectCollideMap.gridCenter;

        this._collideMap.forEach((_value, key) => {
            const [x, y] = key.split("_").map(Number);
            
            const gridObjectCollideMapX = Math.floor(x + (worldPosition.x + gridCenter.x) / gridCellWidth);
            const gridObjectCollideMapY = Math.floor(y + (worldPosition.y + gridCenter.y) / gridCellHeight);
            this._gridObjectCollideMap!.removeCollider(gridObjectCollideMapX, gridObjectCollideMapY);
        });
    }

    /**
     * `GridObjectCollideMap` component is used to store collider information in a grid. (default: null)
     * 
     * when set this property, it will automatically add collider information to grid.
     */
    public get gridObjectCollideMap(): GridObjectCollideMap|null {
        return this._gridObjectCollideMap;
    }

    /**
     * `GridObjectCollideMap` component is used to store collider information in a grid. (default: null)
     * 
     * when set this property, it will automatically add collider information to grid.
     */
    public set gridObjectCollideMap(value: GridObjectCollideMap|null) {
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
    
    /**
     * if this property is true, collider will be displayed. (default: false)
     */
    public get showCollideSpot(): boolean {
        return this._showCollideSpot;
    }

    /**
     * if this property is true, collider will be displayed. (default: false)
     */
    public set showCollideSpot(value: boolean) {
        if (this._showCollideSpot === value) return;
        this._showCollideSpot = value;
        if (this._showCollideSpot && !this._collideSpotIsShowing) {
            this.addColliderImages();
            this._collideSpotIsShowing = true;
        } else {
            this.removeColliderImages();
            this._collideSpotIsShowing = false;
        }
    }
}
