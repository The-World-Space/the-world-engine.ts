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

    private readonly _collideSize: number = 0.5;
    private _playerGridMovementController: PlayerGridMovementController|null = null;
    private readonly _gridEventMaps: GridEventMap[] = [];

    private readonly onMoveToTarget = (x: number, y: number): void => {
        const gridCenter = this._playerGridMovementController!.gridCenter;
        const gridCellWidth = this._playerGridMovementController!.gridCellWidth;
        const gridCellHeight = this._playerGridMovementController!.gridCellHeight;
        const worldX = gridCenter.x + x * gridCellWidth;
        const worldY = gridCenter.y + y * gridCellHeight;
        this._gridEventMaps.forEach((gridEventMap) => {
            gridEventMap.tryInvokeEvent(worldX, worldY, this._collideSize, this._collideSize, this.gameObject);
        });
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
}
