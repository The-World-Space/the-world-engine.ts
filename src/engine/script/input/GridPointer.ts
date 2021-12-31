import { Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { ComponentConstructor } from "../../hierarchy_object/ComponentConstructor";
import { CssHtmlElementRenderer } from "../render/CssHtmlElementRenderer";
import { GameObject } from "../../hierarchy_object/GameObject";
import { PointerGridEvent, PointerGridInputListener } from "./PointerGridInputListener";
import { PrefabRef } from "../../hierarchy_object/PrefabRef";

export class GridPointer extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    protected readonly _requiredComponents: ComponentConstructor[] = [PointerGridInputListener];

    private _pointerGridInputListener: PointerGridInputListener|null = null;
    private _pointerZoffset: number = 0;
    private _pointerObject: GameObject|null = null;
    private _pointerRenderer: CssHtmlElementRenderer|null = null;
    private _onPointerDownDelegates: ((event: PointerGridEvent) => void)[] = [];
    private _onPointerUpDelegates: ((event: PointerGridEvent) => void)[] = [];
    private _onPointerMoveDelegates: ((event: PointerGridEvent) => void)[] = [];
    private _isMouseDown: boolean = false;

    private readonly _onPointerEnterBind = this.onPointerEnter.bind(this);
    private readonly _onPointerLeaveBind = this.onPointerLeave.bind(this);
    private readonly _onPointerDownBind = this.onPointerDown.bind(this);
    private readonly _onPointerUpBind = this.onPointerUp.bind(this);
    private readonly _onPointerMoveBind = this.onPointerMove.bind(this);

    protected start(): void {
        this._pointerGridInputListener = this.gameObject.getComponent(PointerGridInputListener);
        this._pointerGridInputListener!.addOnPointerEnterEventListener(this._onPointerEnterBind);
        this._pointerGridInputListener!.addOnPointerLeaveEventListener(this._onPointerLeaveBind);
        this._pointerGridInputListener!.addOnPointerDownEventListener(this._onPointerDownBind);
        this._pointerGridInputListener!.addOnPointerUpEventListener(this._onPointerUpBind);
        this._pointerGridInputListener!.addOnPointerMoveEventListener(this._onPointerMoveBind);

        const pointerObject: PrefabRef<GameObject> = new PrefabRef();
        const pointerRenderer: PrefabRef<CssHtmlElementRenderer> = new PrefabRef();
        this.gameObject.addChildFromBuilder(
            this.engine.instantlater.buildGameObject("pointer", new Vector3(0, 0, this._pointerZoffset))
                .active(false)
                .withComponent(CssHtmlElementRenderer, c => {
                    c.pointerEvents = false;
                    const cursorElement = document.createElement("div");
                    cursorElement.style.backgroundColor = "white";
                    cursorElement.style.opacity = "0.3";
                    c.setElement(cursorElement);
                })
                .getComponent(CssHtmlElementRenderer, pointerRenderer)
                .getGameObject(pointerObject));
        this._pointerObject = pointerObject.ref;
        this._pointerRenderer = pointerRenderer.ref;
    }

    public onDestroy(): void {
        if (!this.started) return;
        if (this._pointerGridInputListener) {
            this._pointerGridInputListener.removeOnPointerEnterEventListener(this._onPointerEnterBind);
            this._pointerGridInputListener.removeOnPointerLeaveEventListener(this._onPointerLeaveBind);
            this._pointerGridInputListener.removeOnPointerDownEventListener(this._onPointerDownBind);
            this._pointerGridInputListener.removeOnPointerUpEventListener(this._onPointerUpBind);
            this._pointerGridInputListener.removeOnPointerMoveEventListener(this._onPointerMoveBind);
        }
    }

    private onPointerEnter(event: PointerGridEvent): void {
        this._pointerObject!.activeSelf = true;
        this.onPointerMove(event);
    }

    private onPointerLeave(event: PointerGridEvent): void {
        if (this._isMouseDown) this.onPointerUp(event);
        this._pointerObject!.activeSelf = false;
    }

    private onPointerDown(event: PointerGridEvent): void {
        this._isMouseDown = true;
        this.updatePointerPosition(event);
        const container = this._pointerRenderer?.getElementContainer();
        if (container) container.style.backgroundColor = "#DDDDDD";
        this._onPointerDownDelegates.forEach(delegate => delegate(event));
    }

    private onPointerUp(event: PointerGridEvent): void {
        this._isMouseDown = false;
        this.updatePointerPosition(event);
        const container = this._pointerRenderer?.getElementContainer();
        if (container) container.style.backgroundColor = "white";
        this._onPointerUpDelegates.forEach(delegate => delegate(event));
    }

    private onPointerMove(event: PointerGridEvent): void {
        this.updatePointerPosition(event);
        this._onPointerMoveDelegates.forEach(delegate => delegate(event));
    }

    private updatePointerPosition(event: PointerGridEvent): void {
        const gridCellWidth = this._pointerGridInputListener!.gridCellWidth;
        const gridCellHeight = this._pointerGridInputListener!.gridCellHeight;
        const gridCenter = this._pointerGridInputListener!.gridCenter;
        const positionX = event.gridPosition.x * gridCellWidth + gridCenter.x;
        const positionY = event.gridPosition.y * gridCellHeight + gridCenter.y;
        this._pointerObject!.transform.position.set(positionX, positionY, this._pointerZoffset);
    }

    public addOnPointerDownEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onPointerDownDelegates.push(delegate);
    }

    public removeOnPointerDownEventListener(delegate: (event: PointerGridEvent) => void): void {
        const index = this._onPointerDownDelegates.indexOf(delegate);
        if (index !== -1) this._onPointerDownDelegates.splice(index, 1);
    }

    public addOnPointerUpEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onPointerUpDelegates.push(delegate);
    }

    public removeOnPointerUpEventListener(delegate: (event: PointerGridEvent) => void): void {
        const index = this._onPointerUpDelegates.indexOf(delegate);
        if (index !== -1) this._onPointerUpDelegates.splice(index, 1);
    }

    public addOnPointerMoveEventListener(delegate: (event: PointerGridEvent) => void): void {
        this._onPointerMoveDelegates.push(delegate);
    }

    public removeOnPointerMoveEventListener(delegate: (event: PointerGridEvent) => void): void {
        const index = this._onPointerMoveDelegates.indexOf(delegate);
        if (index !== -1) this._onPointerMoveDelegates.splice(index, 1);
    }

    public get pointerZoffset(): number {
        return this._pointerZoffset;
    }

    public set pointerZoffset(value: number) {
        this._pointerZoffset = value;
    }
}
