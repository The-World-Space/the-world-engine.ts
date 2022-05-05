import { IGridCoordinatable } from "../helper/IGridCoordinatable";

/**
 * Interface for objects that has grid coordinate system and can be collided with other objects
 */
export interface IGridCollidable extends IGridCoordinatable {
    /**
     * query that collides at position
     * @param x world position x
     * @param y world position y
     * @param width collison width
     * @param height collision height
     * @returns if collides, return true. otherwise, return false
     */
    checkCollision(x: number, y: number, width: number, height: number): boolean;
}
