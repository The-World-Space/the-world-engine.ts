import { Component } from "../../hierarchy_object/Component";
import { ComponentConstructor } from "../../hierarchy_object/ComponentConstructor";
import { PlayerGridMovementController } from "../controller/PlayerGridMovementController";
import { GridEventMap } from "./GridEventMap";

/**
 * for player interact with GridEventMap you should add this component to your player
 * and use PlayerGridEventInvoker.addGridEventMap to register your grid event map
 *
 *
 * disallow multiple component
 *
 * require components: `PlayerGridMovementController`
 */
export class PlayerGridEventInvoker extends Component {
    public override readonly disallowMultipleComponent: boolean = true;
    public override readonly requiredComponents: ComponentConstructor[] = [PlayerGridMovementController];

    private _collideSize = 0.5;
    private _playerGridMovementController: PlayerGridMovementController|null = null;
    private readonly _gridEventMaps: GridEventMap[] = [];

    private readonly onMoveToTarget = (x: number, y: number): void => {
        const gridCenter = this._playerGridMovementController!.gridCenter;
        const gridCellWidth = this._playerGridMovementController!.gridCellWidth;
        const gridCellHeight = this._playerGridMovementController!.gridCellHeight;
        const worldX = gridCenter.x + x * gridCellWidth;
        const worldY = gridCenter.y + y * gridCellHeight;
        const gridEventMaps = this._gridEventMaps;
        for (let i = 0; i < gridEventMaps.length; ++i) {
            gridEventMaps[i].tryInvokeEvent(worldX, worldY, this._collideSize, this._collideSize, this.gameObject);
        }
    };

    public awake(): void {
        this._playerGridMovementController = this.gameObject.getComponent(PlayerGridMovementController);
        this._playerGridMovementController!.onMoveToTarget.addListener(this.onMoveToTarget);
    }

    public onDestroy(): void {
        this._playerGridMovementController!.onMoveToTarget.removeListener(this.onMoveToTarget);
    }

    /**
     * add GridEventMap to this player, you should add GridEventMap for interaction
     * @param gridEventMap grid event map
     */
    public addGridEventMap(gridEventMap: GridEventMap): void {
        this._gridEventMaps.push(gridEventMap);
    }

    /**
     * remove GridEventMap from this player
     * @param gridEventMap grid event map
     */
    public removeGridEventMap(gridEventMap: GridEventMap): void {
        const index = this._gridEventMaps.indexOf(gridEventMap);
        if (index >= 0) {
            this._gridEventMaps.splice(index, 1);
        }
    }

    /**
     * remove all GridEventMap from this player
     * @param gridEventMap grid event map
     */
    public removeAllGridEventMap(): void {
        this._gridEventMaps.length = 0;
    }

    /**
     * collide size of `tryInvokeEvent` (default: 0.5)
     *
     * The larger this value, the greater the range of event invocation
     *
     * The default is to match the tile size of 1x1
     */
    public get collideSize(): number {
        return this._collideSize;
    }

    /**
     * collide size of `tryInvokeEvent` (default: 0.5)
     *
     * The larger this value, the greater the range of event invocation
     *
     * The default is to match the tile size of 1x1
     */
    public set collideSize(value: number) {
        this._collideSize = value;
    }
}
