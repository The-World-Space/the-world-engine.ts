import { Vector3 } from "three/src/Three";

import { EventContainer, IEventContainer } from "../../collection/EventContainer";
import { Component } from "../../hierarchy_object/Component";
import { ComponentConstructor } from "../../hierarchy_object/ComponentConstructor";
import { GameObject } from "../../hierarchy_object/GameObject";
import { PrefabRef } from "../../hierarchy_object/PrefabRef";
import { CssHtmlElementRenderer } from "../render/CssHtmlElementRenderer";
import { PointerGridEvent, PointerGridInputListener } from "./PointerGridInputListener";

/**
 * grid pointer
 *
 * draw grid aligned rectangle cursor and receive pointer events
 *
 *
 * disallow multiple component
 *
 * require components: `PointerGridInputListener`
 */
export class GridPointer extends Component {
    public override readonly disallowMultipleComponent: boolean = true;
    public override readonly requiredComponents: ComponentConstructor[] = [PointerGridInputListener];

    private _pointerGridInputListener: PointerGridInputListener|null = null;
    private _pointerZoffset = 0;
    private _pointerObject: GameObject|null = null;
    private _pointerRenderer: CssHtmlElementRenderer|null = null;
    private readonly _onPointerDownEvent = new EventContainer<((event: PointerGridEvent) => void)>();
    private readonly _onPointerUpEvent = new EventContainer<((event: PointerGridEvent) => void)>();
    private readonly _onPointerMoveEvent = new EventContainer<((event: PointerGridEvent) => void)>();
    private _isMouseDown = false;
    private _started = false;

    public start(): void {
        this._pointerGridInputListener = this.gameObject.getComponent(PointerGridInputListener);
        this._pointerGridInputListener!.onPointerEnter.addListener(this.onPointerEnterBind);
        this._pointerGridInputListener!.onPointerLeave.addListener(this.onPointerLeaveBind);
        this._pointerGridInputListener!.onPointerDown.addListener(this.onPointerDownBind);
        this._pointerGridInputListener!.onPointerUp.addListener(this.onPointerUpBind);
        this._pointerGridInputListener!.onPointerMove.addListener(this.onPointerMoveBind);

        const pointerObject: PrefabRef<GameObject> = new PrefabRef();
        const pointerRenderer: PrefabRef<CssHtmlElementRenderer> = new PrefabRef();
        this.gameObject.addChildFromBuilder(
            this.engine.instantiater.buildGameObject("pointer", new Vector3(0, 0, this._pointerZoffset))
                .active(false)
                .withComponent(CssHtmlElementRenderer, c => {
                    c.pointerEvents = false;
                    const cursorElement = document.createElement("div");
                    cursorElement.style.backgroundColor = "white";
                    cursorElement.style.opacity = "0.3";
                    c.element = cursorElement;
                })
                .getComponent(CssHtmlElementRenderer, pointerRenderer)
                .getGameObject(pointerObject));
        this._pointerObject = pointerObject.ref;
        this._pointerRenderer = pointerRenderer.ref;
        this._started = true;
    }

    public onDestroy(): void {
        if (!this._started) return;
        if (this._pointerGridInputListener) {
            this._pointerGridInputListener.onPointerEnter.removeListener(this.onPointerEnterBind);
            this._pointerGridInputListener.onPointerLeave.removeListener(this.onPointerLeaveBind);
            this._pointerGridInputListener.onPointerDown.removeListener(this.onPointerDownBind);
            this._pointerGridInputListener.onPointerUp.removeListener(this.onPointerUpBind);
            this._pointerGridInputListener.onPointerMove.removeListener(this.onPointerMoveBind);
        }
    }

    private readonly onPointerEnterBind = (event: PointerGridEvent): void => {
        this._pointerObject!.activeSelf = true;
        this.onPointerMoveBind(event);
    };

    private readonly onPointerLeaveBind = (event: PointerGridEvent): void => {
        if (this._isMouseDown) this.onPointerUpBind(event);
        this._pointerObject!.activeSelf = false;
    };

    private readonly onPointerDownBind = (event: PointerGridEvent): void => {
        this._isMouseDown = true;
        this.updatePointerPosition(event);
        const container = this._pointerRenderer?.element;
        if (container) container.style.backgroundColor = "#DDDDDD";
        this._onPointerDownEvent.invoke(event);
    };

    private readonly onPointerUpBind = (event: PointerGridEvent): void => {
        this._isMouseDown = false;
        this.updatePointerPosition(event);
        const container = this._pointerRenderer?.element;
        if (container) container.style.backgroundColor = "white";
        this._onPointerUpEvent.invoke(event);
    };

    private readonly onPointerMoveBind = (event: PointerGridEvent): void => {
        this.updatePointerPosition(event);
        this._onPointerMoveEvent.invoke(event);
    };

    private updatePointerPosition(event: PointerGridEvent): void {
        const gridCellWidth = this._pointerGridInputListener!.gridCellWidth;
        const gridCellHeight = this._pointerGridInputListener!.gridCellHeight;
        const gridCenter = this._pointerGridInputListener!.gridCenter;
        const positionX = event.gridPosition.x * gridCellWidth + gridCenter.x;
        const positionY = event.gridPosition.y * gridCellHeight + gridCenter.y;
        this._pointerObject!.transform.localPosition.set(positionX, positionY, this._pointerZoffset);
    }

    /**
     * on pointer down event
     */
    public get onPointerDown(): IEventContainer<(event: PointerGridEvent) => void> {
        return this._onPointerDownEvent;
    }

    /**
     * on pointer up event
     */
    public get onPointerUp(): IEventContainer<(event: PointerGridEvent) => void> {
        return this._onPointerUpEvent;
    }

    /**
     * on pointer move event
     */
    public get onPointerMove(): IEventContainer<(event: PointerGridEvent) => void> {
        return this._onPointerMoveEvent;
    }

    /**
     * pointer z offset from gameObject.transform.position.z. default: 0
     *
     * if cursor is not visible, set this to a big positive value
     */
    public get pointerZoffset(): number {
        return this._pointerZoffset;
    }

    /**
     * pointer z offset from gameObject.transform.position.z. (default: 0)
     *
     * if cursor is not visible, set this to a big positive value
     */
    public set pointerZoffset(value: number) {
        this._pointerZoffset = value;
    }
}
