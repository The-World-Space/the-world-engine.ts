import { Vector2 } from "three/src/math/Vector2";

export interface IGridPositionable {
    get positionInGrid(): Vector2;
}
