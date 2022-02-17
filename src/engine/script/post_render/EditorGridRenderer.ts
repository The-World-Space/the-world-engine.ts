import { Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { ComponentConstructor } from "../../hierarchy_object/ComponentConstructor";
import { GameObject } from "../../hierarchy_object/GameObject";
import { PrefabRef } from "../../hierarchy_object/PrefabRef";
import { Camera } from "../render/Camera";
import { CssHtmlElementRenderer } from "../render/CssHtmlElementRenderer";

export class EditorGridRenderer extends Component {
    public override readonly disallowMultipleComponent: boolean = true;
    public override readonly requiredComponents: ComponentConstructor[] = [Camera];
    
    private _cssHtmlRenderer: CssHtmlElementRenderer|null = null;
    private _cssHtmlRendererObject: GameObject|null = null;
    private _gridCellWidth = 16;
    private _gridCellHeight = 16;
    private _renderWidth = 180;
    private _renderHeight = 100;
    private _lineWidth = 0.2;

    public awake(): void {
        const cssHtmlRendererRef = new PrefabRef<CssHtmlElementRenderer>();

        this._cssHtmlRendererObject = this.gameObject.addChildFromBuilder(
            this.engine.instantiater.buildGameObject("grid-renderer", new Vector3(0, 0, -1), undefined, new Vector3(this._lineWidth, this._lineWidth, this._lineWidth))
                .active(false)
                .withComponent(CssHtmlElementRenderer, c => {
                    const element = document.createElement("div");
                    element.style.backgroundImage = "\
                        repeating-linear-gradient(#999 0 1px, transparent 1px 100%),\
                        repeating-linear-gradient(90deg, #999 0 1px, transparent 1px 100%)";
                    element.style.backgroundSize = (this.gridCellWidth / this._lineWidth) + "px " + (this.gridCellHeight / this._lineWidth) + "px";
                    c.elementWidth = this._renderWidth / this._lineWidth;
                    c.elementHeight = this._renderHeight / this._lineWidth;
                    c.pointerEvents = false;
                    c.element = element;
                })
                .getComponent(CssHtmlElementRenderer, cssHtmlRendererRef));
        
        this._cssHtmlRenderer = cssHtmlRendererRef.ref;
    }

    public onEnable(): void {
        this._cssHtmlRendererObject!.activeSelf = true;
    }

    public onDisable(): void {
        this._cssHtmlRendererObject!.activeSelf = false;
    }

    private readonly _lastPosition: Vector3 = new Vector3(NaN, NaN, NaN);

    public update(): void {
        const position = this.transform.position;

        const centerX = this._renderWidth / this._lineWidth / 2;
        const centerY = this._renderHeight / this._lineWidth / 2;
        const scaledGridCellWidth = this._gridCellWidth / this._lineWidth;
        const scaledGridCellHeight = this._gridCellHeight / this._lineWidth;
        const xRemainder = centerX % scaledGridCellWidth;
        const yRemainder = centerY % scaledGridCellHeight;

        if (!position.equals(this._lastPosition)) {
            this._cssHtmlRenderer!.element!.style.backgroundPosition = 
                (-position.x / this._lineWidth + xRemainder + scaledGridCellWidth / 2 - 0.5) + "px " +
                (position.y / this._lineWidth + yRemainder + scaledGridCellHeight / 2 - 0.5) + "px";
        }
    }

    public onDestroy(): void {
        this._cssHtmlRendererObject!.destroy();
    }

    public get gridCellWidth(): number {
        return this._gridCellWidth;
    }

    public set gridCellWidth(value: number) {
        this._gridCellWidth = value;
    }

    public get gridCellHeight(): number {
        return this._gridCellHeight;
    }

    public set gridCellHeight(value: number) {
        this._gridCellHeight = value;
    }

    public get renderWidth(): number {
        return this._renderWidth;
    }

    public set renderWidth(value: number) {
        this._renderWidth = value;
    }

    public get renderHeight(): number {
        return this._renderHeight;
    }

    public set renderHeight(value: number) {
        this._renderHeight = value;
    }

    public get lineWidth(): number {
        return this._lineWidth;
    }

    public set lineWidth(value: number) {
        this._lineWidth = value;
    }
}
