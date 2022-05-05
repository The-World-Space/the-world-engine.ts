import { Vector2 } from "three/src/Three";

/**
 * Interface for objects that possitioned in grid
 */
export interface IGridPositionable {
    /**
     * position in grid
     */
    get positionInGrid(): Vector2;
}
