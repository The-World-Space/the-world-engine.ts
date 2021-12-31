import { Component } from "../../hierarchy_object/Component";
export var Direction;
(function (Direction) {
    Direction[Direction["Up"] = 0] = "Up";
    Direction[Direction["Down"] = 1] = "Down";
    Direction[Direction["Left"] = 2] = "Left";
    Direction[Direction["Right"] = 3] = "Right";
})(Direction || (Direction = {}));
export class Directionable extends Component {
    constructor() {
        super(...arguments);
        this._direction = Direction.Down;
        this._isMoving = false;
    }
    get direction() {
        return this._direction;
    }
    set direction(direction) {
        this._direction = direction;
    }
    get isMoving() {
        return this._isMoving;
    }
    set isMoving(isMoving) {
        this._isMoving = isMoving;
    }
}
