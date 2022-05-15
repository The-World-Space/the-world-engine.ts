import { Vector2 } from "three/src/Three";

import { Transform } from "../../hierarchy_object/Transform";
import { ReadonlyVector2 } from "../../math/ReadonlyVector2";
import { WritableVector2 } from "../../math/WritableVector2";
import { Color } from "../../render/Color";
import { ReadonlyColor } from "../../render/ReadonlyColor";
import { CssRenderer } from "./CssRenderer";

export class Css2DLineRenderer extends CssRenderer<HTMLDivElement> {
    private readonly _lineColor = Color.fromHex("#00FF00");
    private _lineWidth = 1;
    private readonly _point1 = new Vector2(-2, -2);
    private readonly _point2 = new Vector2(2, 2);

    protected override renderInitialize(): void {
        this.htmlElement = document.createElement("div");
        this.htmlElement.style.backgroundColor = this._lineColor.toHexWithAlpha();

        const css3DObject = this.initializeBaseComponents(false);

        const angle = Math.atan2(this._point2.y - this._point1.y, this._point2.x - this._point1.x);
        css3DObject.rotation.z = angle + Math.PI / 2;

        Transform.updateRawObject3DWorldMatrixRecursively(css3DObject);
        this.transform.enqueueRenderAttachedObject3D(css3DObject);
    }

    protected override updateCenterOffset(updateTransform: boolean): void {
        if (!this.css3DObject) return;

        const width = Math.max(Math.abs(this._point1.x), Math.abs(this._point2.x)) * 2;
        const height = Math.max(Math.abs(this._point1.y), Math.abs(this._point2.y)) * 2;
        
        const x = (this._point1.x + this._point2.x) / 2;
        const y = (this._point1.y + this._point2.y) / 2;
        this.css3DObject.position.set(
            width * this.centerOffset.x + x,
            height * this.centerOffset.y + y, 0
        );
        
        if (updateTransform) {
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    protected override updateViewScale(updateTransform: boolean): void {
        if (!this.css3DObject) return;
        
        const value = this.viewScale;

        this.css3DObject.element.style.width = (this._lineWidth / value) + "px";
        this.css3DObject.element.style.height = (this._point1.distanceTo(this._point2) / value) + "px";
        this.css3DObject.scale.set(value, value, value);

        if (updateTransform) {
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    public get lineColor(): ReadonlyColor {
        return this._lineColor;
    }

    public set lineColor(value: ReadonlyColor) {
        this._lineColor.copy(value);
        if (this.htmlElement) {
            this.htmlElement.style.backgroundColor = value.toHexWithAlpha();
        }
    }

    public get lineWidth(): number {
        return this._lineWidth;
    }

    public set lineWidth(value: number) {
        this._lineWidth = value;
        if (this.htmlElement) {
            this.htmlElement.style.width = (value / this.viewScale) + "px";
        }
    }

    public get point1(): ReadonlyVector2 {
        return this._point1;
    }

    public set point1(value: ReadonlyVector2) {
        (this._point1 as WritableVector2).copy(value);

        if (this.css3DObject) {
            this.css3DObject.element.style.height = (this._point1.distanceTo(this._point2) / this.viewScale) + "px";

            const angle = Math.atan2(this._point2.y - this._point1.y, this._point2.x - this._point1.x);
            this.css3DObject.rotation.z = angle + Math.PI / 2;
            this.updateCenterOffset(true);
        }
    }

    public get point2(): ReadonlyVector2 {
        return this._point2;
    }

    public set point2(value: ReadonlyVector2) {
        (this._point2 as WritableVector2).copy(value);

        if (this.css3DObject) {
            this.css3DObject.element.style.height = (this._point1.distanceTo(this._point2) / this.viewScale) + "px";

            const angle = Math.atan2(this._point2.y - this._point1.y, this._point2.x - this._point1.x);
            this.css3DObject.rotation.z = angle + Math.PI / 2;
            this.updateCenterOffset(true);
        }
    }

    public setPoints(point1: ReadonlyVector2, point2: ReadonlyVector2): void {
        (this._point1 as WritableVector2).copy(point1);
        (this._point2 as WritableVector2).copy(point2);

        if (this.css3DObject) {
            this.css3DObject.element.style.height = (this._point1.distanceTo(this._point2) / this.viewScale) + "px";

            const angle = Math.atan2(this._point2.y - this._point1.y, this._point2.x - this._point1.x);
            this.css3DObject.rotation.z = -angle;
            this.updateCenterOffset(true);
        }
    }
}
