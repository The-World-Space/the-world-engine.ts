//use a star algorithm to find the shortest path
import { Vector2 } from "three";
import { PathNode } from "./PathNode";
export class Pathfinder {
    constructor(collideMaps) {
        var _a;
        this.collideMaps = (_a = collideMaps === null || collideMaps === void 0 ? void 0 : collideMaps.slice()) !== null && _a !== void 0 ? _a : [];
    }
    addCollideMap(collideMap) {
        this.collideMaps.push(collideMap);
    }
    findPath(startGridPosition, endGridPosition) {
        const startNode = new PathNode(startGridPosition.x, startGridPosition.y);
        const endNode = new PathNode(endGridPosition.x, endGridPosition.y);
        if (this.checkCollision(startNode.x, startNode.y))
            return null; //start position is blocked
        if (this.checkCollision(endNode.x, endNode.y))
            return null; //end position is blocked
        const openList = [];
        const closedList = [];
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
            for (const neighbor of neighbors) {
                if (closedList.find(node => node.equals(neighbor)) !== undefined)
                    continue; //already visited
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
    getNeighbors(node) {
        const neighbors = [];
        neighbors.push(new PathNode(node.x, node.y - 1));
        neighbors.push(new PathNode(node.x + 1, node.y));
        neighbors.push(new PathNode(node.x, node.y + 1));
        neighbors.push(new PathNode(node.x - 1, node.y));
        return neighbors;
    }
    calculatePath(endNode) {
        const path = [];
        let currentNode = endNode;
        while (currentNode.previousNode) {
            path.push(new Vector2(currentNode.x, currentNode.y));
            currentNode = currentNode.previousNode;
        }
        path.push(new Vector2(currentNode.x, currentNode.y));
        return path.reverse();
    }
    calculateDistanceCost(a, b) {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
    getLowestFcostNode(openList) {
        let lowestFcostNode = openList[0];
        for (let i = 1; i < openList.length; i++) {
            if (openList[i].fCost < lowestFcostNode.fCost) {
                lowestFcostNode = openList[i];
            }
        }
        return lowestFcostNode;
    }
    checkCollision(x, y) {
        for (const collideMap of this.collideMaps) {
            if (collideMap.checkCollision(x * collideMap.gridCellWidth + collideMap.gridCenterX, y * collideMap.gridCellHeight + collideMap.gridCenterY, Pathfinder._checkCollisionScale, Pathfinder._checkCollisionScale)) {
                return true;
            }
        }
        return false;
    }
}
Pathfinder._checkCollisionScale = 8;
Pathfinder._iterationLimit = 1000;
