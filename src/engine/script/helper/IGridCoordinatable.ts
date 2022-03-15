import { Vector2 } from "three";

export interface IGridCoordinatable {
    get gridCellWidth(): number;
    get gridCellHeight(): number;
    get gridCenterX(): number;
    get gridCenterY(): number;
    get gridCenter(): Vector2;
}
