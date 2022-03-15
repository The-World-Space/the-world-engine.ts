import { Vector2 } from "three/src/math/Vector2";

export interface IGridCoordinatable {
    get gridCellWidth(): number;
    get gridCellHeight(): number;
    get gridCenterX(): number;
    get gridCenterY(): number;
    get gridCenter(): Vector2;
}
