import type { Vector2 } from "three/src/Three";

/**
 * Interface for objects that has grid coordinate system
 *
 * coordinate system is same as world coordinate system (positive x is right, positive y is up)
 */
export interface IGridCoordinatable {
    /**
     * grid cell width, if this value is not integer, might not work properly
     */
    get gridCellWidth(): number;

    /**
     * grid cell height, if this value is not integer, might not work properly
     */
    get gridCellHeight(): number;

    /**
     * grid coordinate center position x
     */
    get gridCenterX(): number;

    /**
     * grid coordinate center position y
     */
    get gridCenterY(): number;

    /**
     * grid coordinate center position
     */
    get gridCenter(): Vector2;
}
