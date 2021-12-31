import { Vector2 } from "three";
import { Component } from "../../hierarchy_object/Component";
export declare class ParallaxTranslater extends Component {
    protected readonly _disallowMultipleComponent: boolean;
    private _offsetX;
    private _offsetY;
    private _initializeCenterFromPosition;
    private readonly _center;
    protected start(): void;
    private readonly _tempVector3;
    private readonly _tempVector2;
    update(): void;
    get offsetX(): number;
    set offsetX(value: number);
    get offsetY(): number;
    set offsetY(value: number);
    get initializeCenterFromPosition(): boolean;
    set initializeCenterFromPosition(value: boolean);
    get center(): Vector2;
    set center(value: Vector2);
}
