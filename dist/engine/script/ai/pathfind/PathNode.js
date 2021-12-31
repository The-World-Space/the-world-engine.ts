export class PathNode {
    constructor(x, y) {
        this._x = x;
        this._y = y;
        this._gCost = 0;
        this._hCost = 0;
        this._fCost = 0;
        this._previousNode = null;
        this._isWalkable = true;
    }
    calculateFCost() {
        this._fCost = this._gCost + this._hCost;
    }
    equals(other) {
        return this._x === other._x && this._y === other._y;
    }
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    get gCost() {
        return this._gCost;
    }
    set gCost(gCost) {
        this._gCost = gCost;
    }
    get hCost() {
        return this._hCost;
    }
    set hCost(hCost) {
        this._hCost = hCost;
    }
    get fCost() {
        return this._fCost;
    }
    set fCost(fCost) {
        this._fCost = fCost;
    }
    get isWalkable() {
        return this._isWalkable;
    }
    set isWalkable(isWalkable) {
        this._isWalkable = isWalkable;
    }
    get previousNode() {
        return this._previousNode;
    }
    set previousNode(previousNode) {
        this._previousNode = previousNode;
    }
}
