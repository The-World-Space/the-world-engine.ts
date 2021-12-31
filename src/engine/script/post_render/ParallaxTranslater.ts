import { Vector2, Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";

export class ParallaxTranslater extends Component {
    protected readonly _disallowMultipleComponent: boolean = true;

    private _offsetX: number = 1.5;
    private _offsetY: number = 1.5;
    private _initializeCenterFromPosition: boolean = true;
    private readonly _center: Vector2 = new Vector2();

    protected start(): void {
        if (this._initializeCenterFromPosition) {
            this._center.set(this.gameObject.transform.position.x, this.gameObject.transform.position.y);
        }
    }

    private readonly _tempVector3 = new Vector3();
    private readonly _tempVector2 = new Vector2();

    public update(): void {
        const cameraWorldPosition = this.engine
            .cameraContainer.camera!.getWorldPosition(this._tempVector3);
        const cameraLocalPosition = this.gameObject.transform.parentTransform!.worldToLocal(cameraWorldPosition);
        const cameraPosition = this._tempVector2.set(cameraLocalPosition.x, cameraLocalPosition.y);
        const cameraDistanceX = cameraPosition.x - this._center.x;
        const cameraDistanceY = cameraPosition.y - this._center.y;

        const offsetX = this._offsetX * cameraDistanceX;
        const offsetY = this._offsetY * cameraDistanceY;

        this.gameObject.transform.position.x = this._center.x + offsetX;
        this.gameObject.transform.position.y = this._center.y + offsetY;
    }

    public get offsetX(): number {
        return this._offsetX;
    }

    public set offsetX(value: number) {
        this._offsetX = value;
    }

    public get offsetY(): number {
        return this._offsetY;
    }

    public set offsetY(value: number) {
        this._offsetY = value;
    }

    public get initializeCenterFromPosition(): boolean {
        return this._initializeCenterFromPosition;
    }

    public set initializeCenterFromPosition(value: boolean) {
        this._initializeCenterFromPosition = value;
    }

    public get center(): Vector2 {
        return this._center;
    }

    public set center(value: Vector2) {
        this._center.copy(value);
    }
}
