import { Vector2 } from "three";
import { ReadOnlyVector2 } from "../../math/ReadOnlyVector2";
import { Color } from "../../render/Color";
import { Transform } from "../../hierarchy_object/Transform";
import { CssRenderer } from "./CssRenderer";
import { DEG2RAD } from "three/src/math/MathUtils";

export class Css2DPolygonRenderer extends CssRenderer<HTMLDivElement> {
    private _points: Vector2[] = [
        new Vector2(-64, -64),
        new Vector2(64, -64),
        new Vector2(64, 64),
        new Vector2(-64, 64),
    ];
    private _width = 128;
    private _height = 128;
    private _color = Color.fromHex("#39C5BB");

    protected override renderInitialize(): void {
        if (!this.htmlElement) {
            this.htmlElement = document.createElement("div");
            this.htmlElement.style.backgroundColor = this._color.toHex();
            this.htmlElement.style.opacity = this._color.a.toString();
            //this.updateCssSize();
            //this.htmlElement.style.clipPath = this.createPolygonCss();
            this.initializeBaseComponents(false);
        }
    }

    protected override updateCenterOffset(updateTransform: boolean): void {
        if (!this.css3DObject) return;

        this.css3DObject.position.set(
            this._width * this.centerOffset.x,
            this._height * this.centerOffset.y, 0
        );

        if (updateTransform) {
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    protected override updateViewScale(updateTransform: boolean): void {
        if (!this.css3DObject) return;
        
        const value = this.viewScale;
        this.updateCssSize();
        this.htmlElement!.style.clipPath = this.createPolygonCss();
        this.css3DObject.scale.set(value, value, value);

        if (updateTransform) {
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    private updateCssSize(): void {
        let maxX = 0;
        let maxY = 0;
        for (let i = 0; i < this._points.length; i++) {
            const point = this._points[i];
            if (Math.abs(point.x) > maxX) maxX = Math.abs(point.x);
            if (Math.abs(point.y) > maxY) maxY = Math.abs(point.y);
        }
        this._width = maxX * 2;
        this._height = maxY * 2;
        this.htmlElement!.style.width = (this._width / this.viewScale) + "px";
        this.htmlElement!.style.height = (this._height / this.viewScale) + "px";
    }

    private createPolygonCss(): string {
        let clipPathCss = "polygon(";
        for (let i = 0; i < this._points.length; i++) {
            const rawPoint = this._points[i];

            const pointX = (rawPoint.x + (this._width / 2)) / this.viewScale;
            const pointY = (this._height - (rawPoint.y + (this._height / 2))) / this.viewScale;
            
            clipPathCss += " " + pointX + "px " + pointY + "px";
            if (i < this._points.length - 1) {
                clipPathCss += ",";
            }
        }
        clipPathCss += ")";
        return clipPathCss;
    }

    public get points(): readonly ReadOnlyVector2[] {
        return this._points;
    }

    public set points(value: readonly ReadOnlyVector2[]) {
        this._points.length = 0;
        for (let i = 0; i < value.length; i++) {
            this._points.push(value[i].clone());
        }

        if (this.htmlElement) {
            this.updateCssSize();
            this.htmlElement.style.clipPath = this.createPolygonCss();
            this.updateCenterOffset(true);
        }
    }

    public setShapeToRegularPolygon(sides: number, radius: number): void {
        const points = [];
        for (let i = 0; i < 360; i++) {
            if (i % (360 / sides) === 0) {
                points.push(
                    new Vector2(
                        Math.cos(i * DEG2RAD + Math.PI / 2) * radius,
                        Math.sin(i * DEG2RAD + Math.PI / 2) * radius
                    )
                );
            }
        }
        this.points = points;
    }

    public get color(): Color {
        return this._color;
    }

    public set color(value: Color) {
        this._color = value;
        if (this.htmlElement) {
            this.htmlElement.style.backgroundColor = value.toHex();
            this.htmlElement.style.opacity = value.a.toString();
        }
    }
}
