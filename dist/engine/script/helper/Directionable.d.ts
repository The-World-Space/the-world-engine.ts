import { Component } from "../../hierarchy_object/Component";
export declare enum Direction {
    Up = 0,
    Down = 1,
    Left = 2,
    Right = 3
}
export declare class Directionable extends Component {
    private _direction;
    private _isMoving;
    get direction(): Direction;
    protected set direction(direction: Direction);
    get isMoving(): boolean;
    protected set isMoving(isMoving: boolean);
}
