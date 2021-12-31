import { Component } from "../../hierarchy_object/Component";
import { IGridPositionable } from "../helper/IGridPositionable";
import { GridPointer } from "../input/GridPointer";
import { IGridCollidable } from "../physics/IGridCollidable";
export declare class PathfindTest extends Component {
    private _player;
    private _collideMaps;
    private _gridPointer;
    private _pathfinder;
    private _debugImages;
    private readonly _onPointerDownBind;
    protected start(): void;
    onDestroy(): void;
    private onPointerDown;
    private addDebugImage;
    private removeDebugImages;
    get player(): IGridPositionable | null;
    set player(value: IGridPositionable | null);
    get collideMaps(): IGridCollidable[] | null;
    set collideMaps(value: IGridCollidable[] | null);
    get gridPointer(): GridPointer | null;
    set gridPointer(value: GridPointer | null);
}
