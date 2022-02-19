import { Vector2 } from "three";
import { Transform } from "../../hierarchy_object/Transform";
import { CssRenderer } from "./CssRenderer";

export class Css2DPolygonRenderer extends CssRenderer<HTMLDivElement> {
    private _points: Vector2[]|null = null;

    protected override renderInitialize(): void {
        if (!this.htmlElement) {
            this.htmlElement = document.createElement("div");
            this.htmlElement.style.width = "128px";
            this.htmlElement.style.height = "128px";
            this.htmlElement.style.backgroundColor = "red";
            this.htmlElement.style.clipPath = this.createPolygonCss();
            this.initializeBaseComponents(false);
        }
    }

    protected override updateCenterOffset(updateTransform: boolean): void {
        if (!this.css3DObject) return;

        if (updateTransform) {
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    protected override updateViewScale(updateTransform: boolean): void {
        if (!this.css3DObject) return;

        if (updateTransform) {
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    private createPolygonCss(): string {
        let clipPathCss = "polygon(";
        if (this._points) {
            for (let i = 0; i < this._points.length; i++) {
                const point = this._points[i];
                clipPathCss += " " + point.x + "px " + point.y + "px";
                if (i < this._points.length - 1) {
                    clipPathCss += ",";
                }
            }
        } else {
            clipPathCss += "0px 0px, 100px 0px, 100px 100px, 0px 100px";
        }
        clipPathCss += ")";
        return clipPathCss;
    }

    public get points(): Vector2[]|null {
        return this._points;
    }

    public set points(value: Vector2[]|null) {
        this._points = value;

        if (this.htmlElement) {
            this.htmlElement.style.clipPath = this.createPolygonCss();
        }
    }
}
