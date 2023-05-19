import { Vector2, Vector3 } from "three/src/Three";

import type { IEventContainer } from "../../collection/EventContainer";
import { EventContainer } from "../../collection/EventContainer";
import { Component } from "../../hierarchy_object/Component";
import { Transform } from "../../hierarchy_object/Transform";
import type { ReadonlyVector2 } from "../../math/ReadonlyVector2";
import type { WritableVector2 } from "../../math/WritableVector2";
import { CSS3DObject } from "../../render/CSS3DRenderer"; //use duck typed class for tree shaking
//import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import type { IGridCollidable } from "../grid_physics2d/IGridCollidable";

/**
 * pointer grid event object
 */
export class PointerGridEvent {
    private readonly _gridPosition: Vector2;
    private readonly _position: Vector2;
    private readonly _button: number;

    public constructor(gridPosition: Vector2, position: Vector2, button: number) {
        this._gridPosition = new Vector2(gridPosition.x, gridPosition.y);
        this._position = new Vector2(position.x, position.y);
        this._button = button;
    }

    /**
     * grid position
     */
    public get gridPosition(): Vector2 {
        return this._gridPosition;
    }

    /**
     * world position
     */
    public get position(): Vector2 {
        return this._position;
    }

    /**
     * pressed button number (0: left, 1: middle, 2: right)
     */
    public get button(): number {
        return this._button;
    }
}

/**
 * pointer grid input listener
 *
 * this component create div element and receive pointer events
 *
 * when use this component on orthographic camera, i recommend to attach this component to camera
 *
 * when event does not fired, increase z coordinate of transform and expend inputWidth and inputHeight
 *
 *
 * disallow multiple component
 */
export class PointerGridInputListener extends Component {
    public override readonly disallowMultipleComponent: boolean = true;

    private _css3DObject: CSS3DObject | null = null;
    private _htmlDivElement: HTMLDivElement | null = null;
    private _gridCellWidth = 1;
    private _gridCellHeight = 1;
    private readonly _gridCenter: Vector2 = new Vector2();
    private _viewScale = 0.1;
    private _inputWidth = 64;
    private _inputHeight = 64;
    private readonly _onPointerDownEvent = new EventContainer<(event: PointerGridEvent) => void>();
    private readonly _onPointerUpEvent = new EventContainer<(event: PointerGridEvent) => void>();
    private readonly _onPointerEnterEvent = new EventContainer<(event: PointerGridEvent) => void>();
    private readonly _onPointerLeaveEvent = new EventContainer<(event: PointerGridEvent) => void>();
    private readonly _onPointerMoveEvent = new EventContainer<(event: PointerGridEvent) => void>();
    private _onTouchStartFunc: (() => void) | null = null;
    private _touchMoveOccured = false;
    private _started = false;

    public start(): void {
        this._htmlDivElement = document.createElement("div");
        this._css3DObject = new CSS3DObject(this._htmlDivElement);
        this._css3DObject.scale.setScalar(this._viewScale);

        this._htmlDivElement.style.width = this._inputWidth / this._viewScale + "px";
        this._htmlDivElement.style.height = this._inputHeight / this._viewScale + "px";
        this._htmlDivElement.addEventListener("mousedown", this.onMouseDown);
        this._htmlDivElement.addEventListener("mouseup", this.onMouseUp);
        this._htmlDivElement.addEventListener("mouseenter", this.onMouseEnter);
        this._htmlDivElement.addEventListener("mouseleave", this.onMouseLeave);
        this._htmlDivElement.addEventListener("mousemove", this.onMouseMove);
        this._htmlDivElement.addEventListener("touchstart", this.onTouchStart);
        this._htmlDivElement.addEventListener("touchend", this.onTouchEnd);
        this._htmlDivElement.addEventListener("touchmove", this.onTouchMove);
        this._htmlDivElement.addEventListener("touchcancel", this.onTouchCancel);

        this.transform.unsafeGetObject3D().add(this._css3DObject);
        //it's safe because _css3DObject is not a GameObject and i'm removing it from the scene in onDestroy
        Transform.updateRawObject3DWorldMatrixRecursively(this._css3DObject);
        this.transform.enqueueRenderAttachedObject3D(this._css3DObject);

        this._started = true;
    }

    private readonly _tempVector3: Vector3 = new Vector3();

    public update(): void {
        let cameraLocalPosition: Vector3;
        this._tempVector3.copy(this.engine.cameraContainer.camera!.transform.position);
        if (this.transform.parent) {
            cameraLocalPosition = this.transform.parent!.inverseTransformPoint(this._tempVector3);
        } else { // if no parent transform, world position is same as local position
            cameraLocalPosition = this._tempVector3;
        }
        this._css3DObject!.position.x = cameraLocalPosition.x;
        this._css3DObject!.position.y = cameraLocalPosition.y;
        Transform.updateRawObject3DWorldMatrixRecursively(this._css3DObject!);
        this.transform.enqueueRenderAttachedObject3D(this._css3DObject!);
    }

    public onDestroy(): void {
        if (!this._started) return;
        if (this._htmlDivElement) { //it's the intended useless branch
            this._htmlDivElement.removeEventListener("mousedown", this.onMouseDown);
            this._htmlDivElement.removeEventListener("mouseup", this.onMouseUp);
            this._htmlDivElement.removeEventListener("mouseenter", this.onMouseEnter);
            this._htmlDivElement.removeEventListener("mouseleave", this.onMouseLeave);
            this._htmlDivElement.removeEventListener("mousemove", this.onMouseMove);
            this._htmlDivElement.removeEventListener("touchstart", this.onTouchStart);
            this._htmlDivElement.removeEventListener("touchend", this.onTouchEnd);
            this._htmlDivElement.removeEventListener("touchmove", this.onTouchMove);
            this._htmlDivElement.removeEventListener("touchcancel", this.onTouchCancel);
        }
        if (this._css3DObject) {
            this.transform.unsafeGetObject3D().remove(this._css3DObject);
            //it's safe because _css3DObject is not a GameObject and i'm removing it from the scene in onDestroy
        }
    }

    public onWorldMatrixUpdated(): void {
        if (this._css3DObject) {
            Transform.updateRawObject3DWorldMatrixRecursively(this._css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this._css3DObject);
        }
    }

    private createPointerGridEventFromOffset(offsetX: number, offsetY: number, button: number): PointerGridEvent {
        offsetX = offsetX * this._viewScale;
        offsetY = offsetY * this._viewScale;

        const worldPosition = this.transform.position;

        const positionX = this._css3DObject!.position.x + worldPosition.x - this._inputWidth / 2 +
            offsetX - this._gridCenter.x;
        const positionY = this._css3DObject!.position.y + worldPosition.y - this._inputHeight / 2 +
            (this._inputHeight - offsetY) - this._gridCenter.y;

        const gridPositionX = Math.floor((positionX + this._gridCellWidth * 0.5) / this._gridCellWidth);
        const gridPositionY = Math.floor((positionY + this._gridCellHeight * 0.5) / this._gridCellHeight);

        return new PointerGridEvent(
            new Vector2(gridPositionX, gridPositionY),
            new Vector2(positionX, positionY),
            button
        );
    }

    private readonly onMouseDown = (event: MouseEvent): void => {
        const gridEvent = this.createPointerGridEventFromOffset(event.offsetX, event.offsetY, event.button);
        this._onPointerDownEvent.invoke(gridEvent);
    };

    private readonly onMouseUp = (event: MouseEvent): void => {
        const gridEvent = this.createPointerGridEventFromOffset(event.offsetX, event.offsetY, event.button);
        this._onPointerUpEvent.invoke(gridEvent);
    };

    private readonly onMouseEnter = (event: MouseEvent): void => {
        const gridEvent = this.createPointerGridEventFromOffset(event.offsetX, event.offsetY, event.button);
        this._onPointerEnterEvent.invoke(gridEvent);
    };

    private readonly onMouseLeave = (event: MouseEvent): void => {
        const gridEvent = this.createPointerGridEventFromOffset(event.offsetX, event.offsetY, event.button);
        this._onPointerLeaveEvent.invoke(gridEvent);
    };

    private readonly onMouseMove = (event: MouseEvent): void => {
        const gridEvent = this.createPointerGridEventFromOffset(event.offsetX, event.offsetY, event.button);
        this._onPointerMoveEvent.invoke(gridEvent);
    };

    private simulateMouseEvent(eventName: string, touch: Touch): void {
        const simulatedEvent = new MouseEvent(
            eventName, {
                bubbles: true, cancelable: true, view: window, detail: 1,
                screenX: touch.screenX, screenY: touch.screenY, clientX: touch.clientX, clientY: touch.clientY,
                ctrlKey: false, altKey: false, shiftKey: false, metaKey: false, button: 0, relatedTarget: null
            });
        touch.target.dispatchEvent(simulatedEvent);
    }

    private readonly onTouchStart = (event: TouchEvent): void => {
        this._onTouchStartFunc = (): void => {
            this.simulateMouseEvent("mouseenter", event.touches[0]);
            this.simulateMouseEvent("mousedown", event.touches[0]);
        };
    };

    private readonly onTouchEnd = (event: TouchEvent): void => {
        if (!this._touchMoveOccured) return;
        this._touchMoveOccured = false;
        this.simulateMouseEvent("mouseup", event.changedTouches[0]);
        this.simulateMouseEvent("mouseleave", event.changedTouches[0]);
    };

    private readonly onTouchMove = (event: TouchEvent): void => {
        if (this._onTouchStartFunc) {
            this._onTouchStartFunc();
            this._onTouchStartFunc = null;
        }
        this.simulateMouseEvent("mousemove", event.touches[0]);
        this._touchMoveOccured = true;
    };

    private readonly onTouchCancel = (event: TouchEvent): void => {
        if (!this._touchMoveOccured) return;
        this._touchMoveOccured = false;
        this.simulateMouseEvent("mouseleave", event.changedTouches[0]);
    };

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
     * on pointer enter event
     */
    public get onPointerEnter(): IEventContainer<(event: PointerGridEvent) => void> {
        return this._onPointerEnterEvent;
    }

    /**
     * on pointer leave event
     */
    public get onPointerLeave(): IEventContainer<(event: PointerGridEvent) => void> {
        return this._onPointerLeaveEvent;
    }

    /**
     * on pointer move event
     */
    public get onPointerMove(): IEventContainer<(event: PointerGridEvent) => void> {
        return this._onPointerMoveEvent;
    }

    /**
     * grid center (default: (0, 0))
     */
    public get gridCenter(): ReadonlyVector2 {
        return this._gridCenter;
    }

    /**
     * grid center (default: (0, 0))
     */
    public set gridCenter(value: ReadonlyVector2) {
        (this._gridCenter as WritableVector2).copy(value);
    }

    /**
     * grid cell width (default: 1)
     */
    public get gridCellWidth(): number {
        return this._gridCellWidth;
    }

    /**
     * grid cell width (default: 1)
     */
    public set gridCellWidth(value: number) {
        this._gridCellWidth = value;
    }

    /**
     * grid cell height (default: 1)
     */
    public get gridCellHeight(): number {
        return this._gridCellHeight;
    }

    /**
     * grid cell height (default: 1)
     */
    public set gridCellHeight(value: number) {
        this._gridCellHeight = value;
    }

    public setGridInfoFromCollideMap(collideMap: IGridCollidable): void {
        this._gridCellWidth = collideMap.gridCellWidth;
        this._gridCellHeight = collideMap.gridCellHeight;
        this._gridCenter.set(collideMap.gridCenterX, collideMap.gridCenterY);
    }

    public get inputWidth(): number {
        return this._inputWidth;
    }

    public set inputWidth(value: number) {
        this._inputWidth = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.width = this._inputWidth / this._viewScale + "px";
        }
    }

    public get inputHeight(): number {
        return this._inputHeight;
    }

    public set inputHeight(value: number) {
        this._inputHeight = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.height = this._inputHeight / this._viewScale + "px";
        }
    }

    public get viewScale(): number {
        return this._viewScale;
    }

    public set viewScale(value: number) {
        this._viewScale = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.width = this._inputWidth / this._viewScale + "px";
            this._htmlDivElement.style.height = this._inputHeight / this._viewScale + "px";
        }

        if (this._css3DObject) {
            this._css3DObject.scale.setScalar(this._viewScale);

            Transform.updateRawObject3DWorldMatrixRecursively(this._css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this._css3DObject);
        }
    }
}
