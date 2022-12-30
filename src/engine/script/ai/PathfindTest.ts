import { Vector3 } from "three/src/Three";

import { Component } from "../../hierarchy_object/Component";
import { GameObject } from "../../hierarchy_object/GameObject";
import { IGridCollidable } from "../grid_physics2d/IGridCollidable";
import { IGridPositionable } from "../helper/IGridPositionable";
import { GridPointer } from "../input/GridPointer";
import { PointerGridEvent } from "../input/PointerGridInputListener";
import { CssSpriteRenderer } from "../render/CssSpriteRenderer";
import { Pathfinder } from "./pathfind/Pathfinder";

/**
 * Pathfind visualizer component for testing purposes
 */
export class PathfindTest extends Component {
    private _player: IGridPositionable|null = null;
    private _collideMaps: IGridCollidable[]|null = null;
    private _gridPointer: GridPointer|null = null;
    private _pathfinder: Pathfinder|null = null;
    private readonly _debugImages: GameObject[] = [];

    private readonly _onPointerDownBind = this.onPointerDown.bind(this);

    public start(): void {
        if (this._player === null) {
            throw new Error("Player not set");
        }
        if (this._collideMaps === null) {
            throw new Error("Collide maps not set");
        }
        if (this._gridPointer === null) {
            throw new Error("Grid pointer not set");
        }
        this._pathfinder = new Pathfinder(this._collideMaps);
        this._gridPointer.onPointerDown.addListener(this._onPointerDownBind);
    }

    public onDestroy(): void {
        this._gridPointer?.onPointerDown.removeListener(this._onPointerDownBind);
    }

    private onPointerDown(event: PointerGridEvent): void {
        const start = this._player!.positionInGrid;
        const end = event.gridPosition;
        const path = this._pathfinder!.findPath(start, end);
        this.removeDebugImages();
        if (path) {
            for (let i = 0; i < path.length; ++i) {
                const p = path[i];
                this.addDebugImage(p.x * this._collideMaps![0].gridCellWidth, p.y * this._collideMaps![0].gridCellHeight);
            }
        }
    }

    private addDebugImage(x: number, y: number): void {
        const gameObjectRef: {ref: GameObject|null} = {ref: null};
        this.gameObject.addChildFromBuilder(
            this.engine.instantiater.buildGameObject(
                "debug-image", new Vector3(x, y, 10000))
                .withComponent(CssSpriteRenderer, c => c.opacity = 0.5)
                .getGameObject(gameObjectRef));
        this._debugImages.push(gameObjectRef.ref!);
    }

    private removeDebugImages(): void {
        const debugImages = this._debugImages;
        for (let i = 0; i < debugImages.length; ++i) {
            debugImages[i].destroy();
        }
        debugImages.length = 0;
    }

    /**
     * player to use pathfinding on (default: null)
     */
    public get player(): IGridPositionable|null {
        return this._player;
    }

    /**
     * player to use pathfinding on (default: null)
     */
    public set player(value: IGridPositionable|null) {
        this._player = value;
    }

    /**
     * collide maps to use for pathfinding (default: null)
     */
    public get collideMaps(): IGridCollidable[]|null {
        return this._collideMaps;
    }

    /**
     * collide maps to use for pathfinding (default: null)
     */
    public set collideMaps(value: IGridCollidable[]|null) {
        this._collideMaps = value;
    }

    /**
     * grid pointer to use for selecting the end point (default: null)
     */
    public get gridPointer(): GridPointer|null {
        return this._gridPointer;
    }

    /**
     * grid pointer to use for selecting the end point (default: null)
     */
    public set gridPointer(value: GridPointer|null) {
        this._gridPointer = value;
    }
}
