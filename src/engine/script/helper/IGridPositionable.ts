import { Vector2 } from "three/src/Three";

export interface IGridPositionable {
    get positionInGrid(): Vector2;
}
