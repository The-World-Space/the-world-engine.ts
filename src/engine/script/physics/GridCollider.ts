import { Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { GameObject } from "../../hierarchy_object/GameObject";
import { CssSpriteRenderer } from "../render/CssSpriteRenderer";
import { ZaxisInitializer } from "../render/ZaxisInitializer";
import { GridObjectCollideMap } from "./GridObjectCollideMap";

export class GridCollider extends Component {
    private readonly _collideMap: Map<`${number}_${number}`, boolean> = new Map();
    private _showCollideSpot: boolean = false;
    private _collideSpotIsShowing: boolean = false;
    private readonly _colliderImages: Map<`${number}_${number}`, GameObject> = new Map();
    private _gridObjectCollideMap: GridObjectCollideMap|null = null;
    private _collideInfoAddedToMap: boolean = false;
    private _initializeFunctions: ((() => void))[] = [];

    protected start(): void {
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
     * @param x grid unit x
     * @param y grid unit y
     * @returns 
     */
    public addCollider(x: number, y: number): void {
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

    private addColliderImages() {
        this._collideMap.forEach((_value, key) => {
            const [x, y] = key.split("_").map(Number);
            this.addDebugImage(x, y);
        });
    }

    private removeColliderImages() {
        this._colliderImages.forEach(image => {
            image.destroy();
        });
        this._colliderImages.clear();
    }
    
    private addDebugImage(x: number, y: number) {
        if (!this._gridObjectCollideMap) return;
        const gridCellWidth = this._gridObjectCollideMap.gridCellWidth;
        const gridCellHeight = this._gridObjectCollideMap.gridCellHeight;

        const localX = x * gridCellWidth;
        const localY = y * gridCellHeight;

        const gameObjectRef: {ref: GameObject|null} = {ref: null};
        this.gameObject.addChildFromBuilder(
            this.engine.instantlater.buildGameObject(
                "debugImage", new Vector3(localX, localY, 410000))
                .withComponent(ZaxisInitializer)
                .withComponent(CssSpriteRenderer, c => c.opacity = 0.5)
                .getGameObject(gameObjectRef));
        this._colliderImages.set(`${x}_${y}`, gameObjectRef.ref!);
    }

    private removeDebugImage(x: number, y: number) {
        const image = this._colliderImages.get(`${x}_${y}`);
        if (image) {
            image.destroy();
            this._colliderImages.delete(`${x}_${y}`);
        }
    }

    private readonly _tempVector = new Vector3();

    private addCollideInfoToMap(x: number, y: number) {
        if (!this._gridObjectCollideMap) return;
        
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector);
        const gridCellWidth = this._gridObjectCollideMap.gridCellWidth;
        const gridCellHeight = this._gridObjectCollideMap.gridCellHeight;
        const gridCenter = this._gridObjectCollideMap.gridCenter;

        const GridObjectCollideMapX = Math.floor(x + (worldPosition.x + gridCenter.x) / gridCellWidth);
        const GridObjectCollideMapY = Math.floor(y + (worldPosition.y + gridCenter.y) / gridCellHeight);
        this._gridObjectCollideMap!.addCollider(GridObjectCollideMapX, GridObjectCollideMapY);
    }

    private addAllCollideInfoToMap() {
        if (!this._gridObjectCollideMap) return;

        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector);
        const gridCellWidth = this._gridObjectCollideMap.gridCellWidth;
        const gridCellHeight = this._gridObjectCollideMap.gridCellHeight;
        const gridCenter = this._gridObjectCollideMap.gridCenter;

        this._collideMap.forEach((_value, key) => {
            const [x, y] = key.split("_").map(Number);
            
            const GridObjectCollideMapX = Math.floor(x + worldPosition.x / gridCellWidth + gridCenter.x);
            const GridObjectCollideMapY = Math.floor(y + worldPosition.y / gridCellHeight + gridCenter.y);
            this._gridObjectCollideMap!.addCollider(GridObjectCollideMapX, GridObjectCollideMapY);
        });
    }
    
    private removeCollideInfoFromMap(x: number, y: number) {
        if (!this._gridObjectCollideMap) return;
        
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector);
        const gridCellWidth = this._gridObjectCollideMap.gridCellWidth;
        const gridCellHeight = this._gridObjectCollideMap.gridCellHeight;
        const gridCenter = this._gridObjectCollideMap.gridCenter;

        const GridObjectCollideMapX = Math.floor(x + (worldPosition.x + gridCenter.x) / gridCellWidth);
        const GridObjectCollideMapY = Math.floor(y + (worldPosition.y + gridCenter.y) / gridCellHeight);

        this._gridObjectCollideMap!.removeCollider(GridObjectCollideMapX, GridObjectCollideMapY);
    }

    private removeAllCollideInfoFromMap() {
        if (!this._gridObjectCollideMap) return;

        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector);
        const gridCellWidth = this._gridObjectCollideMap.gridCellWidth;
        const gridCellHeight = this._gridObjectCollideMap.gridCellHeight;
        const gridCenter = this._gridObjectCollideMap.gridCenter;

        this._collideMap.forEach((_value, key) => {
            const [x, y] = key.split("_").map(Number);
            
            const GridObjectCollideMapX = Math.floor(x + (worldPosition.x + gridCenter.x) / gridCellWidth);
            const GridObjectCollideMapY = Math.floor(y + (worldPosition.y + gridCenter.y) / gridCellHeight);
            this._gridObjectCollideMap!.removeCollider(GridObjectCollideMapX, GridObjectCollideMapY);
        });
    }

    public get gridObjectCollideMap(): GridObjectCollideMap|null {
        return this._gridObjectCollideMap;
    }

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
    
    public get showCollideSpot(): boolean {
        return this._showCollideSpot;
    }

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
