import { Component } from "../../hierarchy_object/Component";
import { PlayerGridMovementController } from "../controller/PlayerGridMovementController";
export class PlayerGridEventInvoker extends Component {
    constructor() {
        super(...arguments);
        this._disallowMultipleComponent = true;
        this._requiredComponents = [PlayerGridMovementController];
        this._collideSize = 8;
        this._playerGridMovementController = null;
        this._gridEventMaps = [];
        this._onMoveToTargetBind = this.onMoveToTarget.bind(this);
    }
    awake() {
        this._playerGridMovementController = this.gameObject.getComponent(PlayerGridMovementController);
        this._playerGridMovementController.addOnMoveToTargetEventListener(this._onMoveToTargetBind);
    }
    onDestroy() {
        this._playerGridMovementController.removeOnMoveToTargetEventListener(this._onMoveToTargetBind);
    }
    onMoveToTarget(x, y) {
        const gridCenter = this._playerGridMovementController.gridCenter;
        const gridCellWidth = this._playerGridMovementController.gridCellWidth;
        const gridCellHeight = this._playerGridMovementController.gridCellHeight;
        const worldX = gridCenter.x + x * gridCellWidth;
        const worldY = gridCenter.y + y * gridCellHeight;
        this._gridEventMaps.forEach((gridEventMap) => {
            gridEventMap.tryInvokeEvent(worldX, worldY, this._collideSize, this._collideSize, this.gameObject);
        });
    }
    addGridEventMap(gridEventMap) {
        this._gridEventMaps.push(gridEventMap);
    }
}
