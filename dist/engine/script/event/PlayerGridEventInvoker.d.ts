import { Component } from "../../hierarchy_object/Component";
import { ComponentConstructor } from "../../hierarchy_object/ComponentConstructor";
import { GridEventMap } from "./GridEventMap";
export declare class PlayerGridEventInvoker extends Component {
    protected readonly _disallowMultipleComponent: boolean;
    protected readonly _requiredComponents: ComponentConstructor[];
    private readonly _collideSize;
    private _playerGridMovementController;
    private _gridEventMaps;
    private _onMoveToTargetBind;
    protected awake(): void;
    onDestroy(): void;
    private onMoveToTarget;
    addGridEventMap(gridEventMap: GridEventMap): void;
}
