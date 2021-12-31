import { Vector2 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { GameObject } from "../../hierarchy_object/GameObject";
import { IGridCoordinatable } from "../helper/IGridCoordinatable";
export declare class GridEventMap extends Component implements IGridCoordinatable {
    private readonly _eventMap;
    private _gridCellWidth;
    private _gridCellHeight;
    private _showCollider;
    private _eventVisualizeImages;
    private _initializeFunctions;
    protected start(): void;
    addEvent(x: number, y: number, callback: (gridX: number, gridY: number, target: GameObject) => void): void;
    addEventsFromTwoDimensionalArray(array: (((gridX: number, gridY: number, target: GameObject) => void) | null)[][], xOffset: number, yOffset: number): void;
    private addVisualizeImages;
    private removeVisualizeImages;
    private addDebugImage;
    private readonly _tempVector3;
    tryInvokeEvent(x: number, y: number, width: number, height: number, target: GameObject): boolean;
    get gridCellWidth(): number;
    set gridCellWidth(value: number);
    get gridCellHeight(): number;
    set gridCellHeight(value: number);
    get showEvents(): boolean;
    set showEvents(value: boolean);
    get gridCenter(): Vector2;
    get gridCenterX(): number;
    get gridCenterY(): number;
}
