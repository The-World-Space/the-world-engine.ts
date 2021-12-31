import { Component } from "../../hierarchy_object/Component";
import { GridObjectCollideMap } from "./GridObjectCollideMap";
export declare class GridCollider extends Component {
    private readonly _collideMap;
    private _showCollideSpot;
    private _collideSpotIsShowing;
    private readonly _colliderImages;
    private _gridObjectCollideMap;
    private _collideInfoAddedToMap;
    private _initializeFunctions;
    protected start(): void;
    onEnable(): void;
    onDisable(): void;
    onDestroy(): void;
    /**
     * add collider, relative to object space center
     * @param x grid unit x
     * @param y grid unit y
     * @returns
     */
    addCollider(x: number, y: number): void;
    addColliderFromTwoDimensionalArray(array: (1 | 0)[][], xOffset: number, yOffset: number): void;
    removeCollider(x: number, y: number): void;
    private addColliderImages;
    private removeColliderImages;
    private addDebugImage;
    private removeDebugImage;
    private readonly _tempVector;
    private addCollideInfoToMap;
    private addAllCollideInfoToMap;
    private removeCollideInfoFromMap;
    private removeAllCollideInfoFromMap;
    get gridObjectCollideMap(): GridObjectCollideMap | null;
    set gridObjectCollideMap(value: GridObjectCollideMap | null);
    get showCollideSpot(): boolean;
    set showCollideSpot(value: boolean);
}
