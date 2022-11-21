import { Vector3 } from "three/src/Three";

import { Component } from "../../hierarchy_object/Component";
import { ComponentConstructor } from "../../hierarchy_object/ComponentConstructor";
import { GameObject } from "../../hierarchy_object/GameObject";
import { PrefabRef } from "../../hierarchy_object/PrefabRef";
import { Camera } from "../render/Camera";
import { CssHtmlElementRenderer } from "../render/CssHtmlElementRenderer";
import { CssRendererConst } from "../render/CssRenderer";

/**
 * editor grid renderer for debug
 *
 * just add this component to your camera it will render grid
 *
 *
 * disallow multiple component
 *
 * require components: `Camera`
 */
export class EditorGridRenderer extends Component {
    public override readonly disallowMultipleComponent: boolean = true;
    public override readonly requiredComponents: ComponentConstructor[] = [Camera];

    private _cssHtmlRenderer: CssHtmlElementRenderer|null = null;
    private _cssHtmlRendererObject: GameObject|null = null;
    private _gridCellWidth = 1;
    private _gridCellHeight = 1;
    private _renderWidth = 18;
    private _renderHeight = 10;
    private _additiveViewScale = 0.2;
    private _zOffset = 0;

    public awake(): void {
        const cssHtmlRendererRef = new PrefabRef<CssHtmlElementRenderer>();

        this._cssHtmlRendererObject = this.engine.scene.addChildFromBuilder(
            this.engine.instantiater.buildGameObject("grid-renderer",
                undefined,
                undefined,
                new Vector3(this._additiveViewScale, this._additiveViewScale, this._additiveViewScale)
            )
                .active(false)
                .withComponent(CssHtmlElementRenderer, c => {
                    const element = document.createElement("div");
                    element.style.backgroundImage = "\
                        repeating-linear-gradient(#999 0 1px, transparent 1px 100%),\
                        repeating-linear-gradient(90deg, #999 0 1px, transparent 1px 100%)";
                    element.style.backgroundSize =
                        (this._gridCellWidth / this._additiveViewScale / CssRendererConst.LengthUnitScalar) + "px " +
                        (this._gridCellHeight / this._additiveViewScale / CssRendererConst.LengthUnitScalar) + "px";
                    c.elementWidth = this._renderWidth / this._additiveViewScale;
                    c.elementHeight = this._renderHeight / this._additiveViewScale;
                    c.pointerEvents = false;
                    c.element = element;
                    c.viewScale = CssRendererConst.LengthUnitScalar;
                })
                .getComponent(CssHtmlElementRenderer, cssHtmlRendererRef));

        this._cssHtmlRenderer = cssHtmlRendererRef.ref;
    }

    public onEnable(): void {
        if (this._cssHtmlRendererObject!.exists) this._cssHtmlRendererObject!.activeSelf = true;
    }

    public onDisable(): void {
        if (this._cssHtmlRendererObject!.exists) this._cssHtmlRendererObject!.activeSelf = false;
    }

    private readonly _lastPosition: Vector3 = new Vector3(NaN, NaN, NaN);

    public update(): void {
        const position = this.transform.position;

        const worldToElementScale = 1 / this._additiveViewScale / CssRendererConst.LengthUnitScalar;

        const centerX = this._renderWidth * worldToElementScale / 2;
        const centerY = this._renderHeight * worldToElementScale / 2;
        const scaledGridCellWidth = this._gridCellWidth * worldToElementScale;
        const scaledGridCellHeight = this._gridCellHeight * worldToElementScale;
        const xRemainder = centerX % scaledGridCellWidth;
        const yRemainder = centerY % scaledGridCellHeight;

        if (!position.equals(this._lastPosition)) {
            const rendererPosition = this._cssHtmlRendererObject!.transform.position;
            rendererPosition.copy(position);
            rendererPosition.z += this._zOffset;
            this._cssHtmlRenderer!.element!.style.backgroundPosition =
                (-position.x * worldToElementScale + xRemainder + scaledGridCellWidth / 2 - 0.5) + "px " +
                (position.y * worldToElementScale + yRemainder + scaledGridCellHeight / 2 - 0.5) + "px";
        }
    }

    public onDestroy(): void {
        this._cssHtmlRendererObject?.destroy();
    }

    private updateBackgroundSize(): void {
        const cssHtmlRenderer = this._cssHtmlRenderer;
        if (cssHtmlRenderer) {
            cssHtmlRenderer.element!.style.backgroundSize =
                (this._gridCellWidth / this._additiveViewScale / CssRendererConst.LengthUnitScalar) + "px " +
                (this._gridCellHeight / this._additiveViewScale / CssRendererConst.LengthUnitScalar) + "px";
        }
    }

    /**
     * grid cell width. (default: 1)
     */
    public get gridCellWidth(): number {
        return this._gridCellWidth;
    }

    /**
     * grid cell width. (default: 1)
     */
    public set gridCellWidth(value: number) {
        this._gridCellWidth = value;
        this.updateBackgroundSize();
    }

    /**
     * grid cell height. (default: 1)
     */
    public get gridCellHeight(): number {
        return this._gridCellHeight;
    }

    /**
     * grid cell height. (default: 1)
     */
    public set gridCellHeight(value: number) {
        this._gridCellHeight = value;
        this.updateBackgroundSize();
    }

    /**
     * render width. (default: 18)
     *
     * if grid does not cover the whole screen, you must increase this value
     */
    public get renderWidth(): number {
        return this._renderWidth;
    }

    /**
     * render width. (default: 18)
     *
     * if grid does not cover the whole screen, you must increase this value
     */
    public set renderWidth(value: number) {
        this._renderWidth = value;

        if (this._cssHtmlRenderer) {
            this._cssHtmlRenderer.elementWidth = this._renderWidth / this._additiveViewScale;
        }
    }

    /**
     * render height. (default: 10)
     *
     * if grid does not cover the whole screen, you must increase this value
     */
    public get renderHeight(): number {
        return this._renderHeight;
    }

    /**
     * render height. (default: 10)
     *
     * if grid does not cover the whole screen, you must increase this value
     */
    public set renderHeight(value: number) {
        this._renderHeight = value;

        if (this._cssHtmlRenderer) {
            this._cssHtmlRenderer.elementHeight = this._renderHeight / this._additiveViewScale;
        }
    }

    /**
     * grid line width. (default: 0.2)
     *
     * if line width is too small, grid will not be visible on screen
     */
    public get lineWidth(): number {
        return this._additiveViewScale * CssRendererConst.LengthUnitScalar;
    }

    /**
     * grid line width. (default: 0.2)
     *
     * if line width is too small, grid will not be visible on screen
     */
    public set lineWidth(value: number) {
        this._additiveViewScale = value / CssRendererConst.LengthUnitScalar;

        const cssHtmlRenderer = this._cssHtmlRenderer!;
        if (cssHtmlRenderer) {
            this.updateBackgroundSize();
            cssHtmlRenderer.elementWidth = this._renderWidth / this._additiveViewScale;
            cssHtmlRenderer.elementHeight = this._renderHeight / this._additiveViewScale;
            cssHtmlRenderer.gameObject.transform.localScale.setScalar(this._additiveViewScale);
        }
    }

    /**
     * z offset from the camera. (default: 0)
     */
    public get zOffset(): number {
        return this._zOffset;
    }

    /**
     * z offset from the camera. (default: 0)
     */
    public set zOffset(value: number) {
        this._zOffset = value;
    }
}
