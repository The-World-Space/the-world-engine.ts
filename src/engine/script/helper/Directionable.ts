import { Component } from "../../hierarchy_object/Component";

export enum Direction {
    Up,
    Down,
    Left,
    Right
}

export class Directionable extends Component {
    private _direction: Direction = Direction.Down;
    private _isMoving: boolean = false;

    public get direction(): Direction {
        return this._direction;
    }

    protected set direction(direction: Direction) {
        this._direction = direction;
    }
    
    public get isMoving(): boolean {
        return this._isMoving;
    }

    protected set isMoving(isMoving: boolean) {
        this._isMoving = isMoving;
    }
}
