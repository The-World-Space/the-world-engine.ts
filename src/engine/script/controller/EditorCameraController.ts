import { Vector2 } from "three/src/math/Vector2";
import { Vector3 } from "three/src/math/Vector3";
import { Component } from "../../hierarchy_object/Component";
import { ComponentConstructor } from "../../hierarchy_object/ComponentConstructor";
import { Camera } from "../render/Camera";

/**
 * controller for 2D editor free camera
 * it requires a camera component to control
 * camera type is must be set to CameraType.Orthographic
 */
export class EditorCameraController extends Component {
    public override readonly disallowMultipleComponent: boolean = true;
    public override readonly requiredComponents: ComponentConstructor[] = [Camera];

    private _camera: Camera|null = null;
    private _mouseMiddleDown = false;
    private readonly _lastOffset: Vector2 = new Vector2();
    private _minViewSize = 1;
    private _maxViewSize = 10;
    private _defaultViewSize = 5;
    private _currentViewSize = 5;
    private readonly _defaultPosition = new Vector3();
    private _onKeyDownBind = this.onKeyDown.bind(this);
    private _onWheelBind = this.onWheel.bind(this);
    private _onPointerDownBind = this.onPointerDown.bind(this);
    private _onPointerUpBind = this.onPointerUp.bind(this);
    private _onPointerMoveBind = this.onPointerMove.bind(this);
    private _onPointerLeaveBind = this.onPointerLeave.bind(this);

    public awake(): void {
        this._camera = this.gameObject.getComponent(Camera);
        this._defaultViewSize = this._camera!.viewSize;
        this._defaultPosition.copy(this.transform.localPosition);
        this._currentViewSize = this._defaultViewSize;
        this._camera!.viewSize = this._currentViewSize;
    }

    public onEnable(): void {
        const input = this.engine.input;
        input.addOnKeyDownEventListener(this._onKeyDownBind);
        input.addOnWheelEventListener(this._onWheelBind);
        input.addOnPointerDownEventListener(this._onPointerDownBind);
        input.addOnPointerUpEventListener(this._onPointerUpBind);
        input.addOnPointerMoveEventListener(this._onPointerMoveBind);
        input.addOnPointerLeaveEventListener(this._onPointerLeaveBind);
    }

    public onDisable(): void {
        const input = this.engine.input;
        input.removeOnKeyDownEventListener(this._onKeyDownBind);
        input.removeOnWheelEventListener(this._onWheelBind);
        input.removeOnPointerDownEventListener(this._onPointerDownBind);
        input.removeOnPointerUpEventListener(this._onPointerUpBind);
        input.removeOnPointerMoveEventListener(this._onPointerMoveBind);
        input.removeOnPointerLeaveEventListener(this._onPointerLeaveBind);
    }

    private onKeyDown(event: KeyboardEvent): void {
        if (event.key === " ") {
            this._currentViewSize = this._defaultViewSize;
            this.resize();
            this.transform.localPosition.copy(this._defaultPosition);
        }
    }

    private onWheel(event: WheelEvent): void {
        this._currentViewSize += event.deltaY * 0.01;
        if (this._currentViewSize < this._minViewSize) {
            this._currentViewSize = this._minViewSize;
        } else if (this._currentViewSize > this._maxViewSize) {
            this._currentViewSize = this._maxViewSize;
        }
        this.resize();
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

        this.transform.localPosition.x -= clientXdiff * this._camera!.viewSize * 2 * aspect;
        this.transform.localPosition.y += clientYdiff * this._camera!.viewSize * 2;

        this._lastOffset.set(clientOffsetX, clientOffsetY);
    }

    private resize(): void {
        if (this._camera) {
            this._camera.viewSize = this._currentViewSize;
        }
    }

    /**
     * min view size
     */
    public get minViewSize(): number {
        return this._minViewSize;
    }

    /**
     * min view size
     */
    public set minViewSize(value: number) {
        this._minViewSize = value;

        if (this._currentViewSize < this._minViewSize) {
            this._currentViewSize = this._minViewSize;
            this.resize();
        }
    }

    /**
     * max view size
     */
    public get maxViewSize(): number {
        return this._maxViewSize;
    }

    /**
     * max view size
     */
    public set maxViewSize(value: number) {
        this._maxViewSize = value;

        if (this._currentViewSize > this._maxViewSize) {
            this._currentViewSize = this._maxViewSize;
            this.resize();
        }
    }
}
