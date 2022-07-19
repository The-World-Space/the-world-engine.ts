import { Vector2 } from "three/src/Three";

import { EventContainer, IEventContainer } from "../../collection/EventContainer";
import { ReadonlyVector2 } from "../../math/ReadonlyVector2";
import { WritableVector2 } from "../../math/WritableVector2";
import { Pathfinder } from "../ai/pathfind/Pathfinder";
import { IGridCollidable } from "../grid_physics2d/IGridCollidable";
import { Direction, Directionable } from "../helper/Directionable";
import { IGridPositionable } from "../helper/IGridPositionable";
import { GridPointer } from "../input/GridPointer";
import { PointerGridEvent } from "../input/PointerGridInputListener";

/**
 * make gameobject moves on grid coordinates
 * 
 * supports keyboard wasd and arrow keys input
 * 
 * supports pathfinding as optional feature
 * 
 * disallow multiple component
 */
export class PlayerGridMovementController extends Directionable
    implements IGridPositionable {
    public override readonly disallowMultipleComponent: boolean = true;

    private _speed = 8;
    private _gridCellHeight = 1;
    private _gridCellWidth = 1;
    private readonly _collideMaps: IGridCollidable[] = [];
    private readonly _collideSize: number = 0.5;
    private readonly _gridCenter: Vector2 = new Vector2();
    private readonly _currentGridPosition: Vector2 = new Vector2();
    private readonly _targetGridPosition: Vector2 = new Vector2();
    private readonly _initPosition: Vector2 = new Vector2(); //integer position
    private readonly _onMoveToTargetEvent = new EventContainer<(x: number, y: number) => void>(); //integer position
    private readonly _onMovedToTargetEvent = new EventContainer<(x: number, y: number) => void>(); //integer position

    private _gridPointer: GridPointer|null = null;
    private _pathfinder: Pathfinder|null = null;
    private _movingByPathfinder = false;
    private _findedPath: Vector2[]|null = null;
    private _currentPathIndex = 0;
    private _pathfindStartFunction: (() => void)|null = null;
    private readonly _cachedParentWorldPosition: Vector2 = new Vector2();

    private readonly _tempVector2 = new Vector2();

    public start(): void {
        this._pathfinder = new Pathfinder(this._collideMaps);

        const transform = this.transform;
        const position = transform.position;
        position.x = this._gridCenter.x + this._initPosition.x * this._gridCellWidth;
        position.y = this._gridCenter.y + this._initPosition.y * this._gridCellHeight;
        this._currentGridPosition.set(transform.localPosition.x, transform.localPosition.y);

        const parent = transform.parent;
        if (parent) this._cachedParentWorldPosition.set(parent.position.x, parent.position.y);
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
        this._onMoveToTargetEvent.invoke(
            Math.floor(this._targetGridPosition.x / this._gridCellWidth),
            Math.floor(this._targetGridPosition.y / this._gridCellHeight)
        );
    }

    private invokeOnMovedToTarget(_vector2: Vector2): void {
        this._onMovedToTargetEvent.invoke(
            Math.floor(this._currentGridPosition.x / this._gridCellWidth),
            Math.floor(this._currentGridPosition.y / this._gridCellHeight)
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

        const transform = this.transform;
        const currentPositionVector2 = this._tempVector2.set(transform.localPosition.x, transform.localPosition.y);
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
        const transform = this.transform;
        const vector2Pos = new Vector2(transform.localPosition.x, transform.localPosition.y);
        let distance = vector2Pos.distanceTo(this._targetGridPosition);

        if (distance < this._speed * this.engine.time.deltaTime) {
            if (this.noncheckProcessInput(this._targetGridPosition)) {
                distance = vector2Pos.distanceTo(this._targetGridPosition);
                this.invokeOnMovedToTarget(vector2Pos);
            }
        }

        if (distance > 0.01) {
            const direction = this._tempVector2.copy(this._targetGridPosition).sub(vector2Pos).normalize();
            direction.multiplyScalar(Math.min(this._speed * this.engine.time.deltaTime, distance));
            transform.localPosition.x += direction.x;
            transform.localPosition.y += direction.y;
        } else {
            this.isMoving = false;
            this._currentGridPosition.copy(this._targetGridPosition);
            transform.localPosition.x = this._currentGridPosition.x;
            transform.localPosition.y = this._currentGridPosition.y;
            this.invokeOnMovedToTarget(this._targetGridPosition);
        }
    }

    private checkCollision(x: number, y: number): boolean {
        x += this._cachedParentWorldPosition.x;
        y += this._cachedParentWorldPosition.y;
        
        for (let i = 0; i < this._collideMaps.length; i++) {
            if (this._collideMaps[i].checkCollision(x, y, this._collideSize, this._collideSize)) {
                return true;
            }
        }
        return false;
    }

    private _lastPointerDownTime = -1;
    private readonly _lastPointerDownPosition: Vector2 = new Vector2();
    private readonly _doubleClickTime = 0.3;

    private readonly onPointerDown = (event: PointerGridEvent): void => {
        if (event.button !== 0) return;
        this._movingByPathfinder = false;
        const currentElapsedTime = this.engine.time.unscaledTime;
        if (currentElapsedTime - this._lastPointerDownTime < this._doubleClickTime) {
            if (this._lastPointerDownPosition.equals(event.gridPosition)) {
                this.onDoubleClick(event);
                this._lastPointerDownTime = -1;
            }
        } else {
            this._lastPointerDownTime = currentElapsedTime;
            this._lastPointerDownPosition.copy(event.gridPosition);
        }
    };

    private onDoubleClick(event: PointerGridEvent): void {
        if (this._movingByPathfinder) {
            this._movingByPathfinder = false;
            this._pathfindStartFunction = (): void => { this.tryStartPathfind(event.gridPosition) };
            return;
        }
        this._pathfindStartFunction = (): void => { this.tryStartPathfind(event.gridPosition) };
    }

    /**
     * try to move to target grid position
     * @param targetGridPosition 
     * @returns if object already moving by pathfinder return false,
     * 
     * if object can't move to target grid position return false,
     * 
     * if object can move to target grid position return true
     */
    public tryStartPathfind(targetGridPosition: Vector2): boolean {
        if (this._movingByPathfinder) return false;
        this._pathfindStartFunction = null;
        
        this._findedPath = this._pathfinder!.findPath(this.positionInGrid, targetGridPosition);
        if (!this._findedPath || this._findedPath.length <= 1) return false;
        this._findedPath.forEach((path) => {
            path.x = path.x * this._gridCellWidth + this._gridCenter.x;
            path.y = path.y * this._gridCellHeight + this._gridCenter.y;
        });
        this._currentPathIndex = 1;
        this.isMoving = true;
        this._movingByPathfinder = true;

        return true;
    }

    /**
     * cancel moving by pathfinder
     */
    public cancelPathfind(): void {
        this._movingByPathfinder = false;
    }

    public get onMoveToTarget(): IEventContainer<(x: number, y: number) => void> {
        return this._onMoveToTargetEvent;
    }

    public get onMovedToTarget(): IEventContainer<(x: number, y: number) => void> {
        return this._onMovedToTargetEvent;
    }

    /**
     * move speed (default: 8)
     */
    public get speed(): number {
        return this._speed;
    }

    /**
     * move speed (default: 8)
     */
    public set speed(value: number) {
        this._speed = value;
    }

    /**
     * grid center position (default: (0, 0))
     */
    public get gridCenter(): ReadonlyVector2 {
        return this._gridCenter;
    }

    /**
     * grid center position (default: (0, 0))
     */
    public set gridCenter(value: ReadonlyVector2) {
        (this._gridCenter as WritableVector2).copy(value);
    }

    /**
     * grid cell height (default: 1)
     */
    public get gridCellHeight(): number {
        return this._gridCellHeight;
    }

    /**
     * grid cell height (default: 1)
     */
    public set gridCellHeight(value: number) {
        this._gridCellHeight = value;
    }

    /**
     * grid cell width (default: 1)
     */
    public get gridCellWidth(): number {
        return this._gridCellWidth;
    }

    /**
     * grid cell width (default: 1)
     */
    public set gridCellWidth(value: number) {
        this._gridCellWidth = value;
    }

    /**
     * initial grid position (default: (0, 0))
     * 
     * this option is valid only when evaluated before PlayerGridMovementController.start()
     */
    public set initPosition(value: ReadonlyVector2) {
        (this._initPosition as WritableVector2).copy(value);
    }

    /**
     * grid pointer for pathfinding (default: null)
     */
    public set gridPointer(value: GridPointer|null) {
        if (this._gridPointer) {
            this._gridPointer.onPointerDown.removeListener(this.onPointerDown);
        }
        this._gridPointer = value;
        if (this._gridPointer) {
            this._gridPointer.onPointerDown.addListener(this.onPointerDown);
        }
    }

    /**
     * grid pointer for pathfinding (default: null)
     */
    public get gridPointer(): GridPointer|null {
        return this._gridPointer;
    }

    /**
     * add collide map for collision detection
     * @param collideMap 
     */
    public addCollideMap(collideMap: IGridCollidable): void {
        this._collideMaps.push(collideMap);
        this._pathfinder?.addCollideMap(collideMap);
    }

    /**
     * set grid cell size and grid center position from grid collide map
     * @param collideMap
     */
    public setGridInfoFromCollideMap(collideMap: IGridCollidable): void {
        this._gridCellWidth = collideMap.gridCellWidth;
        this._gridCellHeight = collideMap.gridCellHeight;
        this._gridCenter.set(collideMap.gridCenterX, collideMap.gridCenterY);
    }

    /**
     * position in grid coordinate(integer value)
     */
    public get positionInGrid(): Vector2 {
        return new Vector2(
            Math.floor(this.transform.localPosition.x / this._gridCellWidth),
            Math.floor(this.transform.localPosition.y / this._gridCellHeight)
        );
    }
}
