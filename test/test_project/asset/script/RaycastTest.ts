import { Vector2, Vector3 } from "three/src/Three";
import { Component } from "@src/engine/hierarchy_object/Component";
import { GameObject } from "@src/engine/hierarchy_object/GameObject";
import { WritableVector2 } from "@src/engine/math/WritableVector2";
import { ContactFilter2D } from "@src/engine/physics/2d/ContactFilter2D";
import { RaycastHit2D } from "@src/engine/physics/2d/RaycastHit2D";
import { Color } from "@src/engine/render/Color";
import { Css2DLineRenderer } from "@src/engine/script/render/Css2DLineRenderer";
import { CssHtmlElementRenderer } from "@src/engine/script/render/CssHtmlElementRenderer";
//import { Css2DPolygonRenderer } from "../../../engine/script/render/Css2DPolygonRenderer";

export class RaycastTest extends Component {
    private _lineRenderer: Css2DLineRenderer|null = null;
    //private _polygonRenderer: Css2DPolygonRenderer|null = null;
    private _degrees = 0;
    private readonly _directionVector = new Vector2();
    private readonly _positionVector2 = new Vector2();
    private readonly _localPositionVector3 = new Vector3();
    private readonly _raycastHit = new RaycastHit2D();
    private readonly _rayPoint = new Vector2();
    // private readonly _polygonPoints: Vector2[] = [];
    // private _frameCount = 0;
    private readonly _resultBuffer: RaycastHit2D[] = [];
    private readonly _pointPool: GameObject[] = [];

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
        
        {
            const result = this.engine.physics.raycastOne(position, direction, this._raycastHit);
            if (result?.point) {
                const localPosition = this.gameObject.transform.inverseTransformPoint(
                    this._localPositionVector3.set(
                        result.point.x,
                        result.point.y,
                        0
                    )
                );
                this._rayPoint.set(localPosition.x, localPosition.y);
            } else {
                (this._rayPoint as WritableVector2).copy(direction.multiplyScalar(100));
            }
        }

        {
            const resultCount = this.engine.physics.raycast(position, direction, ContactFilter2D.noFilter, this._resultBuffer);
            for (let i = this._pointPool.length; i < resultCount; i++) {
                this._pointPool.push(
                    this.engine.scene.addChildFromBuilder(this.engine.instantiater.buildGameObject("point")
                        .withComponent(CssHtmlElementRenderer, c => {
                            const div = document.createElement("div");
                            div.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
                            div.style.borderRadius = "50%";
                            c.element = div;
                            c.elementWidth = 0.5;
                            c.elementHeight = 0.5;
                        }))
                );
            }
            for (let i = 0; i < resultCount; i++) {
                const point = this._pointPool[i];
                point.transform.position.x = this._resultBuffer[i].point.x;
                point.transform.position.y = this._resultBuffer[i].point.y;
                point.activeSelf = true;
            }
            for (let i = resultCount; i < this._pointPool.length; i++) {
                this._pointPool[i].activeSelf = false;
            }
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
