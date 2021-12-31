export class PathNode {
    private _x: number;
    private _y: number;
    
    private _gCost: number;
    private _hCost: number;
    private _fCost: number;
    
    private _isWalkable: boolean;
    private _previousNode: PathNode|null;

    public constructor(x: number, y: number) {
        this._x = x;
        this._y = y;

        this._gCost = 0;
        this._hCost = 0;
        this._fCost = 0;

        this._previousNode = null;
        this._isWalkable = true;
    }

    public calculateFCost(): void {
        this._fCost = this._gCost + this._hCost;
    }

    public equals(other: PathNode): boolean {
        return this._x === other._x && this._y === other._y;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public get gCost(): number {
        return this._gCost;
    }

    public set gCost(gCost: number) {
        this._gCost = gCost;
    }

    public get hCost(): number {
        return this._hCost;
    }

    public set hCost(hCost: number) {
        this._hCost = hCost;
    }

    public get fCost(): number {
        return this._fCost;
    }

    public set fCost(fCost: number) {
        this._fCost = fCost;
    }

    public get isWalkable(): boolean {
        return this._isWalkable;
    }

    public set isWalkable(isWalkable: boolean) {
        this._isWalkable = isWalkable;
    }

    public get previousNode(): PathNode|null {
        return this._previousNode;
    }

    public set previousNode(previousNode: PathNode|null) {
        this._previousNode = previousNode;
    }
}
