import { Vector2 } from "three";
import { Component } from "../../hierarchy_object/Component";
export declare enum TextAlign {
    Left = "left",
    Center = "center",
    Right = "right"
}
export declare enum FontWeight {
    Normal = "normal",
    Bold = "bold"
}
export declare class CssTextRenderer extends Component {
    protected readonly _disallowMultipleComponent: boolean;
    private _css3DObject;
    private _htmlDivElement;
    private readonly _textCenterOffset;
    private _zindex;
    private _textWidth;
    private _textHeight;
    private _fontSize;
    private _fontWeight;
    private _fontFamily;
    private _textalign;
    private _opacity;
    private _pointerEvents;
    private _initializeFunction;
    private static readonly _defaultText;
    protected awake(): void;
    protected start(): void;
    onEnable(): void;
    onDisable(): void;
    onDestroy(): void;
    onSortByZaxis(zaxis: number): void;
    get text(): string | null;
    set text(value: string | null);
    private updateCenterOffset;
    get textCenterOffset(): Vector2;
    set textCenterOffset(value: Vector2);
    get textWidth(): number;
    set textWidth(value: number);
    get textHeight(): number;
    set textHeight(value: number);
    get fontSize(): number;
    set fontSize(value: number);
    get fontWeight(): FontWeight;
    set fontWeight(value: FontWeight);
    get fontFamily(): string;
    set fontFamily(value: string);
    get textAlign(): TextAlign;
    set textAlign(value: TextAlign);
    get opacity(): number;
    set opacity(value: number);
    get pointerEvents(): boolean;
    set pointerEvents(value: boolean);
}
