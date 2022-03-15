//use a star algorithm to find the shortest path

import { Vector2 } from "three";
import { IGridCollidable } from "../../grid_physics2d/IGridCollidable";
import { PathNode } from "./PathNode";

/**
 * Pathfinder that uses the A* algorithm to find the shortest path between two points.
 * it works in grid coordinates.
 * it has iteration limits to prevent infinite loops.
 */
export class Pathfinder {
    private static readonly _checkCollisionScale: number = 8;
    private static readonly _iterationLimit: number = 1000;

    private collideMaps: IGridCollidable[];

    /**
     * 
     * @param collideMaps collide maps to use for collision detection
     */
    public constructor(collideMaps?: IGridCollidable[]) {
        this.collideMaps = collideMaps?.slice() ?? [];
    }

    /**
     * adds a new collide map to the list of collide maps
     * @param collideMap 
     */
    public addCollideMap(collideMap: IGridCollidable): void {
        this.collideMaps.push(collideMap);
    }

    /**
     * finds the shortest path between two points
     * @param startGridPosition start position in grid coordinates (integers value)
     * @param endGridPosition end position in grid coordinates (integers value)
     * @returns the shortest path between the two points
     */
    public findPath(startGridPosition: Vector2, endGridPosition: Vector2): Vector2[]|null {
        const startNode = new PathNode(startGridPosition.x, startGridPosition.y);
        const endNode = new PathNode(endGridPosition.x, endGridPosition.y);

        if (this.checkCollision(startNode.x, startNode.y)) return null; //start position is blocked
        if (this.checkCollision(endNode.x, endNode.y)) return null; //end position is blocked

        const openList: PathNode[] = [];
        const closedList: PathNode[] = [];
        
        startNode.gCost = 0;
        startNode.hCost = this.calculateDistanceCost(startNode, endNode);
        startNode.calculateFCost();

        openList.push(startNode);

        let iterations = 0;
        while (openList.length > 0 && iterations < Pathfinder._iterationLimit) {
            iterations++;
            const currentNode = this.getLowestFcostNode(openList);
            if (currentNode.equals(endNode)) {
                return this.calculatePath(currentNode); //reached the end
            }

            openList.splice(openList.indexOf(currentNode), 1);
            closedList.push(currentNode);

            const neighbors = this.getNeighbors(currentNode);
            for (let i = 0; i < neighbors.length; i++) {
                const neighbor = neighbors[i];
                if (closedList.find(node => node.equals(neighbor)) !== undefined) continue; //already visited
                else {
                    neighbor.gCost = Number.MAX_VALUE; 
                    neighbor.calculateFCost();
                    neighbor.previousNode = null;
                }

                if (this.checkCollision(neighbor.x, neighbor.y)) {
                    closedList.push(neighbor);
                    continue; //blocked
                }

                const tentativeGCost = currentNode.gCost + this.calculateDistanceCost(currentNode, neighbor);
                if (tentativeGCost < neighbor.gCost) {
                    neighbor.previousNode = currentNode;
                    neighbor.gCost = tentativeGCost;
                    neighbor.hCost = this.calculateDistanceCost(neighbor, endNode);
                    neighbor.calculateFCost();
                    if (openList.find(node => node.equals(neighbor)) === undefined) {
                        openList.push(neighbor);
                    }
                }
            }
        }
        return null;
    }

    private getNeighbors(node: PathNode): PathNode[] {
        const neighbors: PathNode[] = [];
        neighbors.push(new PathNode(node.x, node.y - 1));
        neighbors.push(new PathNode(node.x + 1, node.y));
        neighbors.push(new PathNode(node.x, node.y + 1));
        neighbors.push(new PathNode(node.x - 1, node.y));
        return neighbors;
    }

    private calculatePath(endNode: PathNode): Vector2[] {
        const path: Vector2[] = [];
        let currentNode = endNode;
        while (currentNode.previousNode) {
            path.push(new Vector2(currentNode.x, currentNode.y));
            currentNode = currentNode.previousNode;
        }
        path.push(new Vector2(currentNode.x, currentNode.y));
        return path.reverse();
    }

    private calculateDistanceCost(a: PathNode, b: PathNode): number {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }

    private getLowestFcostNode(openList: PathNode[]): PathNode {
        let lowestFcostNode: PathNode = openList[0];
        for (let i = 1; i < openList.length; i++) {
            if (openList[i].fCost < lowestFcostNode.fCost) {
                lowestFcostNode = openList[i];
            }
        }
        return lowestFcostNode;
    }

    private checkCollision(x: number, y: number): boolean {
        const collideMaps = this.collideMaps;
        for (let i = 0; i < collideMaps.length; i++) {
            const collideMap = collideMaps[i];
            if (collideMap.checkCollision(
                x * collideMap.gridCellWidth + collideMap.gridCenterX,
                y * collideMap.gridCellHeight + collideMap.gridCenterY,
                Pathfinder._checkCollisionScale, Pathfinder._checkCollisionScale)
            ) {
                return true;
            }
        }
        return false;
    }
}
