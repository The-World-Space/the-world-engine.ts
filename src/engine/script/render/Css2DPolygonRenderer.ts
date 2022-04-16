import { Vector2 } from "three/src/Three";
import { ReadonlyVector2 } from "../../math/ReadonlyVector2";
import { Color } from "../../render/Color";
import { Transform } from "../../hierarchy_object/Transform";
import { CssRenderer } from "./CssRenderer";
import { DEG2RAD } from "three/src/math/MathUtils";
import { ReadonlyColor } from "../../render/ReadonlyColor";

export class Css2DPolygonRenderer extends CssRenderer<HTMLDivElement> {
    private _svgElement: SVGPolygonElement|null = null;
    private _points: Vector2[] = [
        new Vector2(-2, -2),
        new Vector2(2, -2),
        new Vector2(2, 2),
        new Vector2(-2, 2)
    ];
    private _width = 4;
    private _height = 4;
    private _color = Color.fromHex("#39C5BB");
    private _borderColor = Color.fromHex("#00FF00");
    private _borderWidth = 0;

    protected override renderInitialize(): void {
        if (!this.htmlElement) {
            this.htmlElement = document.createElement("div");
            const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgElement.setAttribute("width", "100%");
            svgElement.setAttribute("height", "100%");
            
            //blur test code
            // const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
            // const filter = document.createElementNS("http://www.w3.org/2000/svg", "filter");
            // filter.setAttribute("id", "blur");
            // filter.setAttribute("x", "-50%");
            // filter.setAttribute("y", "-50%");
            // filter.setAttribute("width", "200%");
            // filter.setAttribute("height", "200%");
            // const feGaussianBlur = document.createElementNS("http://www.w3.org/2000/svg", "feGaussianBlur");
            // feGaussianBlur.setAttribute("in", "SourceGraphic");
            // feGaussianBlur.setAttribute("stdDeviation", "100");
            // filter.appendChild(feGaussianBlur);
            // defs.appendChild(filter);
            // svgElement.appendChild(defs);

            const svgPolygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            svgPolygon.style.fill = this._color.toHexWithAlpha();
            svgPolygon.style.stroke = this._borderColor.toHexWithAlpha();
            svgPolygon.style.strokeWidth = this._borderWidth + "px";
            // svgPolygon.style.filter = "url(#blur)";
            svgElement.appendChild(svgPolygon);
            this.htmlElement.appendChild(svgElement);
            this._svgElement = svgPolygon;
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
        this._svgElement!.setAttribute("points", this.createPolygonPoints());
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
        this._width = maxX * 2 + this._borderWidth * 0.03;
        this._height = maxY * 2 + this._borderWidth * 0.03;
        this.htmlElement!.style.width = (this._width / this.viewScale) + "px";
        this.htmlElement!.style.height = (this._height / this.viewScale) + "px";
    }

    private createPolygonPoints(): string {
        let points = "";
        for (let i = 0; i < this._points.length; i++) {
            const rawPoint = this._points[i];

            const pointX = (rawPoint.x + (this._width / 2)) / this.viewScale;
            const pointY = (this._height - (rawPoint.y + (this._height / 2))) / this.viewScale;
            
            points += pointX + "," + pointY;
            if (i < this._points.length - 1) {
                points += " ";
            }
        }
        return points;
    }

    public get points(): readonly ReadonlyVector2[] {
        return this._points;
    }

    public set points(value: readonly ReadonlyVector2[]) {
        this._points.length = 0;
        for (let i = 0; i < value.length; i++) {
            this._points.push(value[i].clone());
        }

        if (this.htmlElement) {
            this.updateCssSize();
            this._svgElement!.setAttribute("points", this.createPolygonPoints());
            this.updateCenterOffset(true);
        }
    }

    public setShapeToRegularPolygon(sides: number, radius: number): void {
        const points = [];
        const angle = DEG2RAD * 360 / sides;
        for (let i = 0; i < sides; i++) {
            points.push(new Vector2(
                radius * Math.cos(angle * i + Math.PI / 2),
                radius * Math.sin(angle * i + Math.PI / 2)
            ));
        }
        this.points = points;
    }

    public get color(): Color {
        return this._color;
    }

    public set color(value: Color) {
        this._color = value;
        if (this.htmlElement) {
            this._svgElement!.style.fill = value.toHexWithAlpha();
        }
    }

    public get borderColor(): ReadonlyColor {
        return this._borderColor;
    }

    public set borderColor(value: ReadonlyColor) {
        this._borderColor.copy(value);
        if (this.htmlElement) {
            this._svgElement!.style.stroke = value.toHexWithAlpha();
        }
    }

    public get borderWidth(): number {
        return this._borderWidth;
    }

    public set borderWidth(value: number) {
        this._borderWidth = value;
        if (this.htmlElement) {
            this._svgElement!.style.strokeWidth = value + "px";
        }
    }
}
