import { Vector2, Vector3 } from "three";
import { Pathfinder } from "../ai/pathfind/Pathfinder";
import { Direction, Directionable } from "../helper/Directionable";
export class PlayerGridMovementController extends Directionable {
    constructor() {
        super(...arguments);
        this._disallowMultipleComponent = true;
        this._speed = 80;
        this._gridCellHeight = 16;
        this._gridCellWidth = 16;
        this._collideMaps = [];
        this._collideSize = 8;
        this._gridCenter = new Vector2();
        this._currentGridPosition = new Vector2();
        this._targetGridPosition = new Vector2();
        this._initPosition = new Vector2(); //integer position
        this._onMoveToTargetDelegates = []; //integer position
        this._onMovedToTargetDelegates = []; //integer position
        this._onPointerDownBind = this.onPointerDown.bind(this);
        this._gridPointer = null;
        this._pathfinder = null;
        this._movingByPathfinder = false;
        this._findedPath = null;
        this._currentPathIndex = 0;
        this._pathfindStartFunction = null;
        this._tempVector3 = new Vector3();
        this._tempVector2 = new Vector2();
        this._lastPointerDownTime = -1;
        this._lastPointerDownPosition = new Vector2();
        this._doubleClickTime = 0.3;
    }
    start() {
        this._pathfinder = new Pathfinder(this._collideMaps);
        const transform = this.gameObject.transform;
        const worldPosition = transform.getWorldPosition(this._tempVector3);
        worldPosition.x = this._gridCenter.x + this._initPosition.x * this._gridCellWidth;
        worldPosition.y = this._gridCenter.y + this._initPosition.y * this._gridCellHeight;
        if (transform.parentTransform) {
            transform.position.copy(transform.parentTransform.worldToLocal(worldPosition));
        }
        else {
            transform.position.copy(worldPosition);
        }
        this._currentGridPosition.set(transform.position.x, transform.position.y);
    }
    update() {
        var _a;
        (_a = this._pathfindStartFunction) === null || _a === void 0 ? void 0 : _a.call(this);
        this.processInput();
        this.processPathfinderInput();
        this.processMovement();
    }
    processInput() {
        if (this.isMoving) {
            this.tryCancelPathfinder();
            return;
        }
        const inputMap = this.engine.input.map;
        if (inputMap.get("w") || inputMap.get("W") || inputMap.get("ArrowUp")) {
            this.direction = Direction.Up;
            if (this.checkCollision(this._currentGridPosition.x, this._currentGridPosition.y + this._gridCellHeight))
                return;
            this._targetGridPosition.set(this._currentGridPosition.x, this._currentGridPosition.y + this._gridCellHeight);
            this.invokeOnMoveToTarget(this._targetGridPosition);
            this.isMoving = true;
        }
        else if (inputMap.get("s") || inputMap.get("S") || inputMap.get("ArrowDown")) {
            this.direction = Direction.Down;
            if (this.checkCollision(this._currentGridPosition.x, this._currentGridPosition.y - this._gridCellHeight))
                return;
            this._targetGridPosition.set(this._currentGridPosition.x, this._currentGridPosition.y - this._gridCellHeight);
            this.invokeOnMoveToTarget(this._targetGridPosition);
            this.isMoving = true;
        }
        else if (inputMap.get("a") || inputMap.get("A") || inputMap.get("ArrowLeft")) {
            this.direction = Direction.Left;
            if (this.checkCollision(this._currentGridPosition.x - this._gridCellWidth, this._currentGridPosition.y))
                return;
            this._targetGridPosition.set(this._currentGridPosition.x - this._gridCellWidth, this._currentGridPosition.y);
            this.invokeOnMoveToTarget(this._targetGridPosition);
            this.isMoving = true;
        }
        else if (inputMap.get("d") || inputMap.get("D") || inputMap.get("ArrowRight")) {
            this.direction = Direction.Right;
            if (this.checkCollision(this._currentGridPosition.x + this._gridCellWidth, this._currentGridPosition.y))
                return;
            this._targetGridPosition.set(this._currentGridPosition.x + this._gridCellWidth, this._currentGridPosition.y);
            this.invokeOnMoveToTarget(this._targetGridPosition);
            this.isMoving = true;
        }
    }
    noncheckProcessInput(currentGridPosotion) {
        const inputMap = this.engine.input.map;
        if (inputMap.get("w") || inputMap.get("W") || inputMap.get("ArrowUp")) {
            this.direction = Direction.Up;
            if (this.checkCollision(currentGridPosotion.x, currentGridPosotion.y + this._gridCellHeight))
                return false;
            this._targetGridPosition.set(currentGridPosotion.x, currentGridPosotion.y + this._gridCellHeight);
            this.invokeOnMoveToTarget(this._targetGridPosition);
            return true;
        }
        else if (inputMap.get("s") || inputMap.get("S") || inputMap.get("ArrowDown")) {
            this.direction = Direction.Down;
            if (this.checkCollision(currentGridPosotion.x, currentGridPosotion.y - this._gridCellHeight))
                return false;
            this._targetGridPosition.set(currentGridPosotion.x, currentGridPosotion.y - this._gridCellHeight);
            this.invokeOnMoveToTarget(this._targetGridPosition);
            return true;
        }
        else if (inputMap.get("a") || inputMap.get("A") || inputMap.get("ArrowLeft")) {
            this.direction = Direction.Left;
            if (this.checkCollision(currentGridPosotion.x - this._gridCellWidth, currentGridPosotion.y))
                return false;
            this._targetGridPosition.set(currentGridPosotion.x - this._gridCellWidth, currentGridPosotion.y);
            this.invokeOnMoveToTarget(this._targetGridPosition);
            return true;
        }
        else if (inputMap.get("d") || inputMap.get("D") || inputMap.get("ArrowRight")) {
            this.direction = Direction.Right;
            if (this.checkCollision(currentGridPosotion.x + this._gridCellWidth, currentGridPosotion.y))
                return false;
            this._targetGridPosition.set(currentGridPosotion.x + this._gridCellWidth, currentGridPosotion.y);
            this.invokeOnMoveToTarget(this._targetGridPosition);
            return true;
        }
        return false;
    }
    invokeOnMoveToTarget(_vector2) {
        this._onMoveToTargetDelegates.forEach((delegate) => delegate(Math.floor(this._targetGridPosition.x / this._gridCellWidth), Math.floor(this._targetGridPosition.y / this._gridCellHeight)));
    }
    invokeOnMovedToTarget(_vector2) {
        this._onMovedToTargetDelegates.forEach((delegate) => delegate(Math.floor(this._currentGridPosition.x / this._gridCellWidth), Math.floor(this._currentGridPosition.y / this._gridCellHeight)));
    }
    tryCancelPathfinder() {
        const inputMap = this.engine.input.map;
        if (inputMap.get("w") || inputMap.get("W") || inputMap.get("ArrowUp")) {
            this._movingByPathfinder = false;
        }
        else if (inputMap.get("s") || inputMap.get("S") || inputMap.get("ArrowDown")) {
            this._movingByPathfinder = false;
        }
        else if (inputMap.get("a") || inputMap.get("A") || inputMap.get("ArrowLeft")) {
            this._movingByPathfinder = false;
        }
        else if (inputMap.get("d") || inputMap.get("D") || inputMap.get("ArrowRight")) {
            this._movingByPathfinder = false;
        }
    }
    processPathfinderInput() {
        if (!this._movingByPathfinder)
            return;
        const transform = this.gameObject.transform;
        const currentPositionVector2 = this._tempVector2.set(transform.position.x, transform.position.y);
        const currentPath = this._findedPath[this._currentPathIndex];
        const distance = currentPath.distanceTo(currentPositionVector2);
        if (distance < this._speed * this.engine.time.deltaTime) {
            this._currentPathIndex++;
            if (this._currentPathIndex >= this._findedPath.length) {
                this._movingByPathfinder = false;
                return;
            }
            else {
                this.invokeOnMovedToTarget(currentPositionVector2);
            }
        }
        if (this.checkCollision(currentPath.x, currentPath.y)) { //path changed while moving
            this._movingByPathfinder = false;
            return;
        }
        if (this._targetGridPosition.equals(this._findedPath[this._currentPathIndex]))
            return;
        this._targetGridPosition.copy(this._findedPath[this._currentPathIndex]);
        this.invokeOnMoveToTarget(this._targetGridPosition);
        const prevPositionX = this._findedPath[this._currentPathIndex - 1].x;
        const prevPositionY = this._findedPath[this._currentPathIndex - 1].y;
        const currentPositionX = this._findedPath[this._currentPathIndex].x;
        const currentPositionY = this._findedPath[this._currentPathIndex].y;
        if (prevPositionY < currentPositionY) {
            this.direction = Direction.Up;
        }
        else if (prevPositionY > currentPositionY) {
            this.direction = Direction.Down;
        }
        else if (prevPositionX < currentPositionX) {
            this.direction = Direction.Right;
        }
        else if (prevPositionX > currentPositionX) {
            this.direction = Direction.Left;
        }
        this.isMoving = true;
    }
    processMovement() {
        if (!this.isMoving)
            return;
        const transform = this.gameObject.transform;
        const vector2Pos = new Vector2(transform.position.x, transform.position.y);
        let distance = vector2Pos.distanceTo(this._targetGridPosition);
        if (distance < this._speed * this.engine.time.deltaTime) {
            if (this.noncheckProcessInput(this._targetGridPosition)) {
                distance = vector2Pos.distanceTo(this._targetGridPosition);
                this.invokeOnMovedToTarget(vector2Pos);
            }
        }
        if (distance > 0.1) {
            const direction = this._targetGridPosition.clone().sub(vector2Pos).normalize();
            direction.multiplyScalar(Math.min(this._speed * this.engine.time.deltaTime, distance));
            transform.position.x += direction.x;
            transform.position.y += direction.y;
        }
        else {
            this.isMoving = false;
            this._currentGridPosition.copy(this._targetGridPosition);
            this.invokeOnMovedToTarget(this._targetGridPosition);
        }
    }
    checkCollision(x, y) {
        for (let i = 0; i < this._collideMaps.length; i++) {
            if (this._collideMaps[i].checkCollision(x, y, this._collideSize, this._collideSize)) {
                return true;
            }
        }
        return false;
    }
    onPointerDown(event) {
        if (event.button !== 0)
            return;
        this._movingByPathfinder = false;
        const currentElapsedTime = this.engine.time.elapsedTime;
        if (currentElapsedTime - this._lastPointerDownTime < this._doubleClickTime) {
            if (this._lastPointerDownPosition.equals(event.gridPosition)) {
                this.onDoubleClick(event);
                this._lastPointerDownTime = -1;
            }
        }
        else {
            this._lastPointerDownTime = currentElapsedTime;
            this._lastPointerDownPosition.copy(event.gridPosition);
        }
    }
    onDoubleClick(event) {
        if (this._movingByPathfinder) {
            this._movingByPathfinder = false;
            this._pathfindStartFunction = () => this.tryStartPathfind(event.gridPosition);
            return;
        }
        this._pathfindStartFunction = () => this.tryStartPathfind(event.gridPosition);
    }
    tryStartPathfind(targetGridPosition) {
        if (this._movingByPathfinder)
            return;
        this._pathfindStartFunction = null;
        this._findedPath = this._pathfinder.findPath(this.positionInGrid, targetGridPosition);
        if (!this._findedPath || this._findedPath.length <= 1)
            return;
        this._findedPath.forEach((path) => {
            path.x = path.x * this._gridCellWidth + this._gridCenter.x;
            path.y = path.y * this._gridCellHeight + this._gridCenter.y;
        });
        this._currentPathIndex = 1;
        this.isMoving = true;
        this._movingByPathfinder = true;
    }
    addOnMoveToTargetEventListener(delegate) {
        this._onMoveToTargetDelegates.push(delegate);
    }
    removeOnMoveToTargetEventListener(delegate) {
        const index = this._onMoveToTargetDelegates.indexOf(delegate);
        if (index >= 0) {
            this._onMoveToTargetDelegates.splice(index, 1);
        }
    }
    addOnMovedToTargetEventListener(delegate) {
        this._onMovedToTargetDelegates.push(delegate);
    }
    removeOnMovedToTargetEventListener(delegate) {
        const index = this._onMovedToTargetDelegates.indexOf(delegate);
        if (index >= 0) {
            this._onMovedToTargetDelegates.splice(index, 1);
        }
    }
    get speed() {
        return this._speed;
    }
    set speed(value) {
        this._speed = value;
    }
    get gridCenter() {
        return this._gridCenter.clone();
    }
    set gridCenter(value) {
        this._gridCenter.copy(value);
    }
    get gridCellHeight() {
        return this._gridCellHeight;
    }
    set gridCellHeight(value) {
        this._gridCellHeight = value;
    }
    get gridCellWidth() {
        return this._gridCellWidth;
    }
    set gridCellWidth(value) {
        this._gridCellWidth = value;
    }
    set initPosition(value) {
        this._initPosition.copy(value);
    }
    set gridPointer(value) {
        if (this._gridPointer) {
            this._gridPointer.removeOnPointerDownEventListener(this._onPointerDownBind);
        }
        this._gridPointer = value;
        if (this._gridPointer) {
            this._gridPointer.addOnPointerDownEventListener(this._onPointerDownBind);
        }
    }
    get gridPointer() {
        return this._gridPointer;
    }
    addCollideMap(collideMap) {
        var _a;
        this._collideMaps.push(collideMap);
        (_a = this._pathfinder) === null || _a === void 0 ? void 0 : _a.addCollideMap(collideMap);
    }
    setGridInfoFromCollideMap(collideMap) {
        this._gridCellWidth = collideMap.gridCellWidth;
        this._gridCellHeight = collideMap.gridCellHeight;
        this._gridCenter.set(collideMap.gridCenterX, collideMap.gridCenterY);
    }
    get positionInGrid() {
        return new Vector2(Math.floor(this.gameObject.transform.position.x / this._gridCellWidth), Math.floor(this.gameObject.transform.position.y / this._gridCellHeight));
    }
}
