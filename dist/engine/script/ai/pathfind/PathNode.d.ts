export declare class PathNode {
    private _x;
    private _y;
    private _gCost;
    private _hCost;
    private _fCost;
    private _isWalkable;
    private _previousNode;
    constructor(x: number, y: number);
    calculateFCost(): void;
    equals(other: PathNode): boolean;
    get x(): number;
    get y(): number;
    get gCost(): number;
    set gCost(gCost: number);
    get hCost(): number;
    set hCost(hCost: number);
    get fCost(): number;
    set fCost(fCost: number);
    get isWalkable(): boolean;
    set isWalkable(isWalkable: boolean);
    get previousNode(): PathNode | null;
    set previousNode(previousNode: PathNode | null);
}
