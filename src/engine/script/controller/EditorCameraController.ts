import { Vector2, Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { ComponentConstructor } from "../../hierarchy_object/ComponentConstructor";
import { Camera } from "../render/Camera";

export class EditorCameraController extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;
    protected readonly _requiredComponents: ComponentConstructor[] = [Camera];

    private _camera: Camera|null = null;
    private _mouseMiddleDown: boolean = false;
    private readonly _lastOffset: Vector2 = new Vector2();
    private _minViewSize: number = 30;
    private _maxViewSize: number = 100;
    private _defaultViewSize: number = 200;
    private _currentViewSize: number = 200;
    private readonly _defaultPosition = new Vector3();
    private _onKeyDownBind = this.onKeyDown.bind(this);
    private _onWheelBind = this.onWheel.bind(this);
    private _onPointerDownBind = this.onPointerDown.bind(this);
    private _onPointerUpBind = this.onPointerUp.bind(this);
    private _onPointerMoveBind = this.onPointerMove.bind(this);
    private _onPointerLeaveBind = this.onPointerLeave.bind(this);
    private _onResizeBind = this.onResize.bind(this);

    protected awake(): void {
        this._camera = this.gameObject.getComponent(Camera);
        const aspect = this.engine.screen.width / this.engine.screen.height;
        this._defaultViewSize = this._camera!.viewSize;
        this._defaultPosition.copy(this.gameObject.transform.position);
        this._currentViewSize = this._defaultViewSize;
        this._camera!.viewSize = this._currentViewSize / aspect;
    }

    public onEnable(): void {
        const input = this.engine.input;
        input.addOnKeyDownEventListener(this._onKeyDownBind);
        input.addOnWheelEventListener(this._onWheelBind);
        input.addOnPointerDownEventListener(this._onPointerDownBind);
        input.addOnPointerUpEventListener(this._onPointerUpBind);
        input.addOnPointerMoveEventListener(this._onPointerMoveBind);
        input.addOnPointerLeaveEventListener(this._onPointerLeaveBind);
        this.engine.screen.addOnResizeEventListener(this._onResizeBind);
    }

    public onDisable(): void {
        const input = this.engine.input;
        input.removeOnKeyDownEventListener(this._onKeyDownBind);
        input.removeOnWheelEventListener(this._onWheelBind);
        input.removeOnPointerDownEventListener(this._onPointerDownBind);
        input.removeOnPointerUpEventListener(this._onPointerUpBind);
        input.removeOnPointerMoveEventListener(this._onPointerMoveBind);
        input.removeOnPointerLeaveEventListener(this._onPointerLeaveBind);
        this.engine.screen.removeOnResizeEventListener(this._onResizeBind);
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (event.key === " ") {
            this._currentViewSize = this._defaultViewSize;
            this.onResize();
            this.gameObject.transform.position.copy(this._defaultPosition);
        }
    }

    private onWheel(event: WheelEvent): void {
        this._currentViewSize += event.deltaY * 0.1;
        if (this._currentViewSize < this._minViewSize) {
            this._currentViewSize = this._minViewSize;
        } else if (this._currentViewSize > this._maxViewSize) {
            this._currentViewSize = this._maxViewSize;
        }
        this.onResize();
    }

    private onPointerDown(event: MouseEvent): void {
        this._lastOffset.set(
            event.clientX / this.engine.screen.width,
            event.clientY / this.engine.screen.height
        );
        if (event.button === 1) {
            this._mouseMiddleDown = true;
        }
    }

    private onPointerUp(event: MouseEvent): void {
        if (event.button === 1) {
            this._mouseMiddleDown = false;
        }
    }

    private onPointerLeave(_event: MouseEvent): void {
        this._mouseMiddleDown = false;
    }

    private onPointerMove(event: MouseEvent): void {
        if (!this._mouseMiddleDown) return;

        const clientOffsetX = event.clientX / this.engine.screen.width;
        const clientOffsetY = event.clientY / this.engine.screen.height;

        const clientXdiff = clientOffsetX - this._lastOffset.x;
        const clientYdiff = clientOffsetY - this._lastOffset.y;

        const aspect = this.engine.screen.width / this.engine.screen.height;

        this.gameObject.transform.position.x -= clientXdiff * this._camera!.viewSize * aspect;
        this.gameObject.transform.position.y += clientYdiff * this._camera!.viewSize;

        this._lastOffset.set(clientOffsetX, clientOffsetY);
    }

    private onResize(): void {
        const aspect = this.engine.screen.width / this.engine.screen.height;
        this._camera!.viewSize = this._currentViewSize / aspect;
    }

    public get minViewSize(): number {
        return this._minViewSize;
    }

    public set minViewSize(value: number) {
        this._minViewSize = value;

        if (this._currentViewSize < this._minViewSize) {
            this._currentViewSize = this._minViewSize;
            this.onResize();
        }
    }

    public get maxViewSize(): number {
        return this._maxViewSize;
    }

    public set maxViewSize(value: number) {
        this._maxViewSize = value;

        if (this._currentViewSize > this._maxViewSize) {
            this._currentViewSize = this._maxViewSize;
            this.onResize();
        }
    }
}
