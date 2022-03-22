import { Vector2 } from "three/src/Three";
import { Component } from "../../../engine/hierarchy_object/Component";
import { WritableVector2 } from "../../../engine/math/WritableVector2";
import { RaycastHit2D } from "../../../engine/physics/2d/RaycastHit2D";
import { Color } from "../../../engine/render/Color";
import { Css2DLineRenderer } from "../../../engine/script/render/Css2DLineRenderer";
//import { Css2DPolygonRenderer } from "../../../engine/script/render/Css2DPolygonRenderer";

export class RaycastTest extends Component {
    private _lineRenderer: Css2DLineRenderer|null = null;
    //private _polygonRenderer: Css2DPolygonRenderer|null = null;
    private _degrees = 0;
    private readonly _directionVector = new Vector2();
    private readonly _positionVector2 = new Vector2();
    private readonly _raycastHit = new RaycastHit2D();
    private readonly _rayPoint = new Vector2();
    // private readonly _polygonPoints: Vector2[] = [];
    // private _frameCount = 0;

    public awake(): void {
        this._lineRenderer = this.gameObject.addComponent(Css2DLineRenderer)!;
        this._lineRenderer.lineWidth = 0.02;
        this._lineRenderer.lineColor = new Color(1, 1, 1);
        this._lineRenderer.viewScale = 0.01;
        this._lineRenderer.point1 = new Vector2();

        // this._polygonRenderer = this.gameObject.addComponent(Css2DPolygonRenderer)!;
        // this._polygonRenderer.viewScale = 0.01;
        // this._polygonRenderer.color = new Color(0.2, 0.2, 1);
    }

    public update(): void {
        const direction = this._directionVector.set(
            Math.cos(this._degrees * Math.PI / 180),
            Math.sin(this._degrees * Math.PI / 180)
        );
        const position = this._positionVector2.set(
            this.gameObject.transform.position.x,
            this.gameObject.transform.position.y
        );
        const result = this.engine.physics.raycastOne(position, direction, this._raycastHit);
        if (result?.point) {
            (this._rayPoint as WritableVector2).copy(result?.point).sub(position);
        } else {
            (this._rayPoint as WritableVector2).copy(direction.multiplyScalar(100));
        }
        this._lineRenderer!.point2 = this._rayPoint;

        // if (this._frameCount++ % 4 === 0) {
        //     this._polygonPoints.push(this._endPoint.clone());
        //     if (this._polygonPoints.length > 150) {
        //         this._polygonPoints.shift();
        //     }
        //     this._polygonRenderer!.points = this._polygonPoints;
        // }

        this._degrees += this.engine.time.deltaTime * 50;
        this._degrees %= 360;
    }
}