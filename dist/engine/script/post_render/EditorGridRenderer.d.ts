import { Component } from "../../hierarchy_object/Component";
import { ComponentConstructor } from "../../hierarchy_object/ComponentConstructor";
export declare class EditorGridRenderer extends Component {
    protected readonly _disallowMultipleComponent: boolean;
    protected readonly _requiredComponents: ComponentConstructor[];
    private _cssHtmlRenderer;
    private _cssHtmlRendererObject;
    private _gridCellWidth;
    private _gridCellHeight;
    private _renderWidth;
    private _renderHeight;
    private _lineWidth;
    protected awake(): void;
    onEnable(): void;
    onDisable(): void;
    private readonly _lastPosition;
    update(): void;
    onDestroy(): void;
    get gridCellWidth(): number;
    set gridCellWidth(value: number);
    get gridCellHeight(): number;
    set gridCellHeight(value: number);
    get renderWidth(): number;
    set renderWidth(value: number);
    get renderHeight(): number;
    set renderHeight(value: number);
    get lineWidth(): number;
    set lineWidth(value: number);
}
