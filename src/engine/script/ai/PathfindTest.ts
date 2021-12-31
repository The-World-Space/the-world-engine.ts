import { Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { GameObject } from "../../hierarchy_object/GameObject";
import { IGridPositionable } from "../helper/IGridPositionable";
import { GridPointer } from "../input/GridPointer";
import { PointerGridEvent } from "../input/PointerGridInputListener";
import { IGridCollidable } from "../physics/IGridCollidable";
import { CssSpriteRenderer } from "../render/CssSpriteRenderer";
import { ZaxisInitializer } from "../render/ZaxisInitializer";
import { Pathfinder } from "./pathfind/Pathfinder";

export class PathfindTest extends Component {
    private _player: IGridPositionable|null = null;
    private _collideMaps: IGridCollidable[]|null = null;
    private _gridPointer: GridPointer|null = null;
    private _pathfinder: Pathfinder|null = null;
    private _debugImages: GameObject[] = [];

    private readonly _onPointerDownBind = this.onPointerDown.bind(this);

    protected start(): void {
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
        this._gridPointer.addOnPointerDownEventListener(this._onPointerDownBind);
    }

    public onDestroy(): void {
        this._gridPointer?.removeOnPointerDownEventListener(this._onPointerDownBind);
    }

    private onPointerDown(event: PointerGridEvent): void {
        const start = this._player!.positionInGrid;
        const end = event.gridPosition;
        const path = this._pathfinder!.findPath(start, end);
        this.removeDebugImages();
        path?.forEach(p => {
            this.addDebugImage(p.x * this._collideMaps![0].gridCellWidth, p.y * this._collideMaps![0].gridCellHeight);
        });
    }
    
    private addDebugImage(x: number, y: number) {
        const gameObjectRef: {ref: GameObject|null} = {ref: null};
        this.gameObject.addChildFromBuilder(
            this.engine.instantlater.buildGameObject(
                "debugImage", new Vector3(x, y, 10000))
                .withComponent(ZaxisInitializer)
                .withComponent(CssSpriteRenderer, c => c.opacity = 0.5)
                .getGameObject(gameObjectRef));
        this._debugImages.push(gameObjectRef.ref!);
    }

    private removeDebugImages() {
        this._debugImages.forEach(image => {
            image.destroy();
        });
        this._debugImages = [];
    }

    public get player(): IGridPositionable|null {
        return this._player;
    }

    public set player(value: IGridPositionable|null) {
        this._player = value;
    }

    public get collideMaps(): IGridCollidable[]|null {
        return this._collideMaps;
    }

    public set collideMaps(value: IGridCollidable[]|null) {
        this._collideMaps = value;
    }

    public get gridPointer(): GridPointer|null {
        return this._gridPointer;
    }

    public set gridPointer(value: GridPointer|null) {
        this._gridPointer = value;
    }
}
