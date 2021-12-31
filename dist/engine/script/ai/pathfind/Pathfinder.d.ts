import { Vector2 } from "three";
import { IGridCollidable } from "../../physics/IGridCollidable";
export declare class Pathfinder {
    private static readonly _checkCollisionScale;
    private static readonly _iterationLimit;
    private collideMaps;
    constructor(collideMaps?: IGridCollidable[]);
    addCollideMap(collideMap: IGridCollidable): void;
    findPath(startGridPosition: Vector2, endGridPosition: Vector2): Vector2[] | null;
    private getNeighbors;
    private calculatePath;
    private calculateDistanceCost;
    private getLowestFcostNode;
    private checkCollision;
}
