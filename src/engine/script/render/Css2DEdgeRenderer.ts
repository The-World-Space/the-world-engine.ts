import { DEG2RAD } from "three/src/math/MathUtils";
import { Vector2 } from "three/src/Three";

import { Transform } from "../../hierarchy_object/Transform";
import { ReadonlyVector2 } from "../../math/ReadonlyVector2";
import { Color } from "../../render/Color";
import { ReadonlyColor } from "../../render/ReadonlyColor";
import { CssRenderer } from "./CssRenderer";

/**
 * css 2d edge renderer
 * 
 * this renderer use svg tag to render edge
 */
export class Css2DEdgeRenderer extends CssRenderer<HTMLDivElement> {
    private _svgElement: SVGPolylineElement|null = null;
    private _points: Vector2[] = [
        new Vector2(-2, -2),
        new Vector2(2, -2),
        new Vector2(2, 2),
        new Vector2(-2, 2)
    ];
    private _width = 4;
    private _height = 4;
    private readonly _edgeColor = Color.fromHex("#00FF00");
    private _edgeWidth = 0;
    private static readonly _safebound = 0.1;

    protected override renderInitialize(): void {
        if (!this.htmlElement) {
            this.htmlElement = document.createElement("div");
            const svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svgElement.setAttribute("width", "100%");
            svgElement.setAttribute("height", "100%");
            
            const svgPolyLine = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
            svgPolyLine.style.fill = "none";
            svgPolyLine.style.stroke = this._edgeColor.toHexWithAlpha();
            svgPolyLine.style.strokeWidth = this._edgeWidth + "px";
            
            svgElement.appendChild(svgPolyLine);
            this.htmlElement.appendChild(svgElement);
            this._svgElement = svgPolyLine;
            const css3DObject = this.initializeBaseComponents(false);
            
            Transform.updateRawObject3DWorldMatrixRecursively(css3DObject);
            this.transform.enqueueRenderAttachedObject3D(css3DObject);
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
        this._width = maxX * 2 + this._edgeWidth * 0.03 + Css2DEdgeRenderer._safebound * 2;
        this._height = maxY * 2 + this._edgeWidth * 0.03 + Css2DEdgeRenderer._safebound * 2;
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

    /**
     * edge points (default: [(-2, -2), (2, -2), (2, 2), (-2, 2)])
     */
    public get points(): readonly ReadonlyVector2[] {
        return this._points;
    }

    /**
     * edge points (default: [(-2, -2), (2, -2), (2, 2), (-2, 2)])
     */
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

    /**
     * set edge points to regular polygon
     * @param sides number of sides
     * @param radius radius of polygon
     */
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

    /**
     * edge color (default: "#00FF00")
     */
    public get edgeColor(): ReadonlyColor {
        return this._edgeColor;
    }

    /**
     * edge color (default: "#00FF00")
     */
    public set edgeColor(value: ReadonlyColor) {
        this._edgeColor.copy(value);
        if (this.htmlElement) {
            this._svgElement!.style.stroke = value.toHexWithAlpha();
        }
    }

    /**
     * edge width (default: 0)
     */
    public get edgeWidth(): number {
        return this._edgeWidth;
    }

    /**
     * edge width (default: 0)
     */
    public set edgeWidth(value: number) {
        this._edgeWidth = value;
        if (this.htmlElement) {
            this._svgElement!.style.strokeWidth = value + "px";
        }
    }
}
