import { Component } from "../../hierarchy_object/Component";

/**
 * enum for 4-directional movement
 */
export enum Direction {
    Up,
    Down,
    Left,
    Right
}

/**
 * component that has direction information for movement
 * 
 * this component is used for 2d grid-based game
 */
export class Directionable extends Component {
    private _direction: Direction = Direction.Down;
    private _isMoving = false;

    /**
     * looking direction
     */
    public get direction(): Direction {
        return this._direction;
    }

    /**
     * looking direction
     */
    protected set direction(direction: Direction) {
        this._direction = direction;
    }
    
    /**
     * if this component is moving this value will be true
     */
    public get isMoving(): boolean {
        return this._isMoving;
    }

    /**
     * if this component is moving this value will be true
     */
    protected set isMoving(isMoving: boolean) {
        this._isMoving = isMoving;
    }
}
