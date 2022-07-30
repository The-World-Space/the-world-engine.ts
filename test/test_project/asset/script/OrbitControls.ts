import { Component } from "@src/engine/hierarchy_object/Component";
import { ReadonlyVector3 } from "@src/engine/math/ReadonlyVector3";
import { WritableVector3 } from "@src/engine/math/WritableVector3";
import { Camera } from "@src/engine/script/render/Camera";
import { DuckThreeCamera } from "@src/engine/script/render/DuckThreeCamera";
import { OrbitControls as ThreeOrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Vector3 } from "three/src/Three";

export class OrbitControls extends Component {
    private _camera: Camera|null = null;
    private _orbitControls: ThreeOrbitControls|null = null;

    private readonly _target: Vector3 = new Vector3(0, 0, 0);
    private _minDistance = 20;
    private _maxDistance = 50;
    private _maxPolarAngle = Math.PI / 2;
    private _enableDamping = true;
    private _dampingFactor = 0.05;

    public awake(): void {
        this._camera = this.gameObject.getComponent(Camera);
    }

    public start(): void {
        const controls = this._orbitControls = new ThreeOrbitControls(
            DuckThreeCamera.createInterface(this._camera!, false).toThreeCamera(),
            this.engine.domElement
        );
        controls.listenToKeyEvents(window);

        controls.enableDamping = this._enableDamping;
        controls.dampingFactor = this._dampingFactor;
        controls.screenSpacePanning = true;
        controls.minDistance = this._minDistance;
        controls.maxDistance = this._maxDistance;

        controls.maxPolarAngle = this._maxPolarAngle;

        controls.target = this._target;
    }

    public onEnable(): void {
        if (this._orbitControls) {
            this._orbitControls.enabled = true;
        }
    }

    public onDisable(): void {
        if (this._orbitControls) {
            this._orbitControls.enabled = false;
        }
    }

    public update(): void {
        this._orbitControls!.update();
    }

    public onDestroy(): void {
        this._orbitControls!.dispose();
        this._orbitControls = null;
        this._camera = null;
    }

    public get target(): ReadonlyVector3 {
        return this._target;
    }

    public set target(value: ReadonlyVector3) {
        (this._target as WritableVector3).copy(value);
        if (this._orbitControls) {
            this._orbitControls.target = this._target;
        }
    }

    public get minDistance(): number {
        return this._minDistance;
    }

    public set minDistance(value: number) {
        this._minDistance = value;
        if (this._orbitControls) {
            this._orbitControls.minDistance = value;
        }
    }

    public get maxDistance(): number {
        return this._maxDistance;
    }

    public set maxDistance(value: number) {
        this._maxDistance = value;
        if (this._orbitControls) {
            this._orbitControls.maxDistance = value;
        }
    }

    public get maxPolarAngle(): number {
        return this._maxPolarAngle;
    }

    public set maxPolarAngle(value: number) {
        this._maxPolarAngle = value;
        if (this._orbitControls) {
            this._orbitControls.maxPolarAngle = value;
        }
    }

    public get enableDamping(): boolean {
        return this._enableDamping;
    }

    public set enableDamping(value: boolean) {
        this._enableDamping = value;
        if (this._orbitControls) {
            this._orbitControls.enableDamping = value;
        }
    }

    public get dampingFactor(): number {
        return this._dampingFactor;
    }

    public set dampingFactor(value: number) {
        this._dampingFactor = value;
        if (this._orbitControls) {
            this._orbitControls.dampingFactor = value;
        }
    }
}
