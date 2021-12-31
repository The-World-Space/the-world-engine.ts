import { Vector2, Vector3 } from "three";
import { Pathfinder } from "../ai/pathfind/Pathfinder";
import { GridPointer } from "../input/GridPointer";
import { PointerGridEvent } from "../input/PointerGridInputListener";
import { IGridCollidable } from "../physics/IGridCollidable";
import { Direction, Directionable } from "../helper/Directionable";
import { IGridPositionable } from "../helper/IGridPositionable";

export class PlayerGridMovementController extends Directionable
    implements IGridPositionable {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _speed: number = 80;
    private _gridCellHeight: number = 16;
    private _gridCellWidth: number = 16;
    private _collideMaps: IGridCollidable[] = [];
    private readonly _collideSize: number = 8;
    private readonly _gridCenter: Vector2 = new Vector2();
    private readonly _currentGridPosition: Vector2 = new Vector2();
    private readonly _targetGridPosition: Vector2 = new Vector2();
    private readonly _initPosition: Vector2 = new Vector2(); //integer position
    private readonly _onMoveToTargetDelegates: ((x: number, y: number) => void)[] = []; //integer position
    private readonly _onMovedToTargetDelegates: ((x: number, y: number) => void)[] = []; //integer position

    private _onPointerDownBind = this.onPointerDown.bind(this);
    private _gridPointer: GridPointer|null = null;
    private _pathfinder: Pathfinder|null = null;
    private _movingByPathfinder: boolean = false;
    private _findedPath: Vector2[]|null = null;
    private _currentPathIndex: number = 0;
    private _pathfindStartFunction: (() => void)|null = null;

    private readonly _tempVector3: Vector3 = new Vector3();
    private readonly _tempVector2: Vector2 = new Vector2();

    protected start(): void {
        this._pathfinder = new Pathfinder(this._collideMaps);

        const transform = this.gameObject.transform;
        const worldPosition = transform.getWorldPosition(this._tempVector3);
        worldPosition.x = this._gridCenter.x + this._initPosition.x * this._gridCellWidth;
        worldPosition.y = this._gridCenter.y + this._initPosition.y * this._gridCellHeight;
        if (transform.parentTransform) {
            transform.position.copy(transform.parentTransform.worldToLocal(worldPosition));
        } else {
            transform.position.copy(worldPosition);
        }
        this._currentGridPosition.set(transform.position.x, transform.position.y);
    }

    public update(): void {
        this._pathfindStartFunction?.();
        this.processInput();
        this.processPathfinderInput();
        this.processMovement();
    }

    private processInput(): void {
        if (this.isMoving) {
            this.tryCancelPathfinder();
            return;
        }

        const inputMap = this.engine.input.map;
        if (inputMap.get("w") || inputMap.get("W") || inputMap.get("ArrowUp")) {
            this.direction = Direction.Up;
            if (this.checkCollision(this._currentGridPosition.x, this._currentGridPosition.y + this._gridCellHeight)) return;
            this._targetGridPosition.set(this._currentGridPosition.x, this._currentGridPosition.y + this._gridCellHeight);
            this.invokeOnMoveToTarget(this._targetGridPosition);
            this.isMoving = true;
        } else if (inputMap.get("s") || inputMap.get("S") || inputMap.get("ArrowDown")) {
            this.direction = Direction.Down;
            if (this.checkCollision(this._currentGridPosition.x, this._currentGridPosition.y - this._gridCellHeight)) return;
            this._targetGridPosition.set(this._currentGridPosition.x, this._currentGridPosition.y - this._gridCellHeight);
            this.invokeOnMoveToTarget(this._targetGridPosition);
            this.isMoving = true;
        } else if (inputMap.get("a") || inputMap.get("A") || inputMap.get("ArrowLeft")) {
            this.direction = Direction.Left;
            if (this.checkCollision(this._currentGridPosition.x - this._gridCellWidth, this._currentGridPosition.y)) return;
            this._targetGridPosition.set(this._currentGridPosition.x - this._gridCellWidth, this._currentGridPosition.y);
            this.invokeOnMoveToTarget(this._targetGridPosition);
            this.isMoving = true;
        } else if (inputMap.get("d") || inputMap.get("D") || inputMap.get("ArrowRight")) {
            this.direction = Direction.Right;
            if (this.checkCollision(this._currentGridPosition.x + this._gridCellWidth, this._currentGridPosition.y)) return;
            this._targetGridPosition.set(this._currentGridPosition.x + this._gridCellWidth, this._currentGridPosition.y);
            this.invokeOnMoveToTarget(this._targetGridPosition);
            this.isMoving = true;
        }
    }

    private noncheckProcessInput(currentGridPosotion: Vector2): boolean {
        const inputMap = this.engine.input.map;
        if (inputMap.get("w") || inputMap.get("W") || inputMap.get("ArrowUp")) {
            this.direction = Direction.Up;
            if (this.checkCollision(currentGridPosotion.x, currentGridPosotion.y + this._gridCellHeight)) return false;
            this._targetGridPosition.set(currentGridPosotion.x, currentGridPosotion.y + this._gridCellHeight);
            this.invokeOnMoveToTarget(this._targetGridPosition);
            return true;
        } else if (inputMap.get("s") || inputMap.get("S") || inputMap.get("ArrowDown")) {
            this.direction = Direction.Down;
            if (this.checkCollision(currentGridPosotion.x, currentGridPosotion.y - this._gridCellHeight)) return false;
            this._targetGridPosition.set(currentGridPosotion.x, currentGridPosotion.y - this._gridCellHeight);
            this.invokeOnMoveToTarget(this._targetGridPosition);
            return true;
        } else if (inputMap.get("a") || inputMap.get("A") || inputMap.get("ArrowLeft")) {
            this.direction = Direction.Left;
            if (this.checkCollision(currentGridPosotion.x - this._gridCellWidth, currentGridPosotion.y)) return false;
            this._targetGridPosition.set(currentGridPosotion.x - this._gridCellWidth, currentGridPosotion.y);
            this.invokeOnMoveToTarget(this._targetGridPosition);
            return true;
        } else if (inputMap.get("d") || inputMap.get("D") || inputMap.get("ArrowRight")) {
            this.direction = Direction.Right;
            if (this.checkCollision(currentGridPosotion.x + this._gridCellWidth, currentGridPosotion.y)) return false;
            this._targetGridPosition.set(currentGridPosotion.x + this._gridCellWidth, currentGridPosotion.y);
            this.invokeOnMoveToTarget(this._targetGridPosition);
            return true;
        }
        return false;
    }

    private invokeOnMoveToTarget(_vector2: Vector2): void {
        this._onMoveToTargetDelegates.forEach(
            (delegate) => delegate(
                Math.floor(this._targetGridPosition.x / this._gridCellWidth),
                Math.floor(this._targetGridPosition.y / this._gridCellHeight)
            )
        );
    }

    private invokeOnMovedToTarget(_vector2: Vector2): void {
        this._onMovedToTargetDelegates.forEach(
            (delegate) => delegate(
                Math.floor(this._currentGridPosition.x / this._gridCellWidth),
                Math.floor(this._currentGridPosition.y / this._gridCellHeight)
            )
        );
    }

    private tryCancelPathfinder(): void {
        const inputMap = this.engine.input.map;
        if (inputMap.get("w") || inputMap.get("W") || inputMap.get("ArrowUp")) {
            this._movingByPathfinder = false;
        } else if (inputMap.get("s") || inputMap.get("S") || inputMap.get("ArrowDown")) {
            this._movingByPathfinder = false;
        } else if (inputMap.get("a") || inputMap.get("A") || inputMap.get("ArrowLeft")) {
            this._movingByPathfinder = false;
        } else if (inputMap.get("d") || inputMap.get("D") || inputMap.get("ArrowRight")) {
            this._movingByPathfinder = false;
        }
    }

    private processPathfinderInput(): void {
        if (!this._movingByPathfinder) return;

        const transform = this.gameObject.transform;
        const currentPositionVector2 = this._tempVector2.set(transform.position.x, transform.position.y);
        const currentPath = this._findedPath![this._currentPathIndex];
        const distance = currentPath.distanceTo(currentPositionVector2);
        if (distance < this._speed * this.engine.time.deltaTime) {
            this._currentPathIndex++;
            if (this._currentPathIndex >= this._findedPath!.length) {
                this._movingByPathfinder = false;
                return;
            } else {
                this.invokeOnMovedToTarget(currentPositionVector2);
            }
        }
        if (this.checkCollision(currentPath.x, currentPath.y)) { //path changed while moving
            this._movingByPathfinder = false;
            return;
        }
        if (this._targetGridPosition.equals(this._findedPath![this._currentPathIndex])) return;
        this._targetGridPosition.copy(this._findedPath![this._currentPathIndex]);
        this.invokeOnMoveToTarget(this._targetGridPosition);
        const prevPositionX = this._findedPath![this._currentPathIndex - 1].x;
        const prevPositionY = this._findedPath![this._currentPathIndex - 1].y;
        const currentPositionX = this._findedPath![this._currentPathIndex].x;
        const currentPositionY = this._findedPath![this._currentPathIndex].y;
        if (prevPositionY < currentPositionY) {
            this.direction = Direction.Up;
        } else if (prevPositionY > currentPositionY) {
            this.direction = Direction.Down;
        } else if (prevPositionX < currentPositionX) {
            this.direction = Direction.Right;
        } else if (prevPositionX > currentPositionX) {
            this.direction = Direction.Left;
        }
        this.isMoving = true;
    }

    private processMovement(): void {
        if (!this.isMoving) return;
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
        } else {
            this.isMoving = false;
            this._currentGridPosition.copy(this._targetGridPosition);
            this.invokeOnMovedToTarget(this._targetGridPosition);
        }
    }

    private checkCollision(x: number, y: number): boolean {
        for (let i = 0; i < this._collideMaps.length; i++) {
            if (this._collideMaps[i].checkCollision(x, y, this._collideSize, this._collideSize)){
                return true;
            }
        }
        return false;
    }

    private _lastPointerDownTime: number = -1;
    private readonly _lastPointerDownPosition: Vector2 = new Vector2();
    private _doubleClickTime: number = 0.3;

    private onPointerDown(event: PointerGridEvent): void {
        if (event.button !== 0) return;
        this._movingByPathfinder = false;
        const currentElapsedTime = this.engine.time.elapsedTime;
        if (currentElapsedTime - this._lastPointerDownTime < this._doubleClickTime) {
            if (this._lastPointerDownPosition.equals(event.gridPosition)) {
                this.onDoubleClick(event);
                this._lastPointerDownTime = -1;
            }
        } else {
            this._lastPointerDownTime = currentElapsedTime;
            this._lastPointerDownPosition.copy(event.gridPosition);
        }
    }

    private onDoubleClick(event: PointerGridEvent): void {
        if (this._movingByPathfinder) {
            this._movingByPathfinder = false;
            this._pathfindStartFunction = () => this.tryStartPathfind(event.gridPosition);
            return;
        }
        this._pathfindStartFunction = () => this.tryStartPathfind(event.gridPosition);
    }

    private tryStartPathfind(targetGridPosition: Vector2): void {
        if (this._movingByPathfinder) return;
        this._pathfindStartFunction = null;
        
        this._findedPath = this._pathfinder!.findPath(this.positionInGrid, targetGridPosition);
        if (!this._findedPath || this._findedPath.length <= 1) return;
        this._findedPath.forEach((path) => {
            path.x = path.x * this._gridCellWidth + this._gridCenter.x;
            path.y = path.y * this._gridCellHeight + this._gridCenter.y;
        });
        this._currentPathIndex = 1;
        this.isMoving = true;
        this._movingByPathfinder = true;
    }

    public addOnMoveToTargetEventListener(delegate: (x: number, y: number) => void): void {
        this._onMoveToTargetDelegates.push(delegate);
    }

    public removeOnMoveToTargetEventListener(delegate: (x: number, y: number) => void): void {
        const index = this._onMoveToTargetDelegates.indexOf(delegate);
        if (index >= 0) {
            this._onMoveToTargetDelegates.splice(index, 1);
        }
    }

    public addOnMovedToTargetEventListener(delegate: (x: number, y: number) => void): void {
        this._onMovedToTargetDelegates.push(delegate);
    }

    public removeOnMovedToTargetEventListener(delegate: (x: number, y: number) => void): void {
        const index = this._onMovedToTargetDelegates.indexOf(delegate);
        if (index >= 0) {
            this._onMovedToTargetDelegates.splice(index, 1);
        }
    }

    public get speed(): number {
        return this._speed;
    }

    public set speed(value: number) {
        this._speed = value;
    }

    public get gridCenter(): Vector2 {
        return this._gridCenter.clone();
    }

    public set gridCenter(value: Vector2) {
        this._gridCenter.copy(value);
    }

    public get gridCellHeight(): number {
        return this._gridCellHeight;
    }

    public set gridCellHeight(value: number) {
        this._gridCellHeight = value;
    }

    public get gridCellWidth(): number {
        return this._gridCellWidth;
    }

    public set gridCellWidth(value: number) {
        this._gridCellWidth = value;
    }

    public set initPosition(value: Vector2) {
        this._initPosition.copy(value);
    }

    public set gridPointer(value: GridPointer|null) {
        if (this._gridPointer) {
            this._gridPointer.removeOnPointerDownEventListener(this._onPointerDownBind);
        }
        this._gridPointer = value;
        if (this._gridPointer) {
            this._gridPointer.addOnPointerDownEventListener(this._onPointerDownBind);
        }
    }

    public get gridPointer(): GridPointer|null {
        return this._gridPointer;
    }

    public addCollideMap(collideMap: IGridCollidable): void {
        this._collideMaps.push(collideMap);
        this._pathfinder?.addCollideMap(collideMap);
    }

    public setGridInfoFromCollideMap(collideMap: IGridCollidable): void {
        this._gridCellWidth = collideMap.gridCellWidth;
        this._gridCellHeight = collideMap.gridCellHeight;
        this._gridCenter.set(collideMap.gridCenterX, collideMap.gridCenterY);
    }

    public get positionInGrid(): Vector2 {
        return new Vector2(
            Math.floor(this.gameObject.transform.position.x / this._gridCellWidth),
            Math.floor(this.gameObject.transform.position.y / this._gridCellHeight)
        );
    }
}
