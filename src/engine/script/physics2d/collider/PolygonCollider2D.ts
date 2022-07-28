import { DEG2RAD } from "three/src/math/MathUtils";
import { Vector2, Vector3 } from "three/src/Three";

import type { Shape } from "../../../../box2d.ts/build/index";
import { PolygonShape } from "../../../../box2d.ts/build/index";
import type { GameObject } from "../../../hierarchy_object/GameObject";
import { PrefabRef } from "../../../hierarchy_object/PrefabRef";
import type { ReadonlyVector2 } from "../../../math/ReadonlyVector2";
import { Color } from "../../../render/Color";
import { Css2DPolygonRenderer } from "../../render/Css2DPolygonRenderer";
import { Object2DAttacher } from "../Object2DAttacher";
import { getOrCreatePhysicsDebugRenderObject } from "../PhysicsDebugRender";
import { Collider2D } from "./Collider2D";

/**
 * Collider for 2D physics representing an arbitrary polygon defined by its vertices.
 */
export class PolygonCollider2D extends Collider2D {
    private _points: Vector2[] = [
        new Vector2(-2, -2),
        new Vector2(2, -2),
        new Vector2(2, 2),
        new Vector2(-2, 2)
    ];
    private _debugDraw = true;
    private _debugObject: GameObject|null = null;
    private _debugRenderer: Css2DPolygonRenderer|null = null;

    private updateDebugDraw(): void {
        if (this._debugDraw) {
            let objectAttacher = this.gameObject.getComponent(Object2DAttacher);
            if (!objectAttacher) objectAttacher = this.gameObject.addComponent(Object2DAttacher)!;

            if (this._debugObject) {
                this._debugRenderer!.points = this._points;
            } else {
                const physicsDebugRenderObject = getOrCreatePhysicsDebugRenderObject(this.engine);
                const debugRenderer = new PrefabRef<Css2DPolygonRenderer>();
                this._debugObject = physicsDebugRenderObject.addChildFromBuilder(
                    this.engine.instantiater.buildGameObject(this.gameObject.name + "_debug_polygon")
                        .withChild(this.engine.instantiater.buildGameObject("debug_polygon", new Vector3(this.offset.x, this.offset.y, 200))
                            .withComponent(Css2DPolygonRenderer, c => {
                                c.points = this._points;
                                c.viewScale = 0.01;
                                c.color = new Color(0, 0, 0, 0);
                                c.borderWidth = 2;
                                c.borderColor = new Color(1, 1, 0, 0.3);
                                c.pointerEvents = false;
                            })
                            .getComponent(Css2DPolygonRenderer, debugRenderer)));
                
                this._debugRenderer = debugRenderer.ref;
                objectAttacher!.target = this._debugObject;
            }
        }
    }

    public override onEnable(): void {
        super.onEnable();
        this.updateDebugDraw();
    }

    public override onDisable(): void {
        super.onDisable();
        if (this._debugObject) {
            this._debugObject.destroy();
            this._debugObject = null;
        }
    }

    private readonly _shapeArray: PolygonShape[] = [ new PolygonShape() ];

    protected override createShapes(): Shape[] {
        const shape = this._shapeArray[0];
        shape.Set(this._points);
        return this._shapeArray;
    }

    /**
     * Corner points that define the collider's shape in local space. (default: [(-2, -2), (2, -2), (2, 2), (-2, 2)])
     */
    public get points(): readonly ReadonlyVector2[] {
        return this._points;
    }

    /**
     * Corner points that define the collider's shape in local space. (default: [(-2, -2), (2, -2), (2, 2), (-2, 2)])
     */
    public set points(value: readonly ReadonlyVector2[]) {
        this._points.length = 0;
        for (let i = 0; i < value.length; ++i) {
            this._points.push(value[i].clone());
        }
        this.updateFixture();
        this.updateDebugDraw();
    }
    
    /**
     * set shape to regular polygon with given number of sides and radius
     * @param sides number of sides
     * @param radius radius
     */
    public setShapeToRegularPolygon(sides: number, radius: number): void {
        const points = [];
        const angle = DEG2RAD * 360 / sides;
        for (let i = 0; i < sides; ++i) {
            points.push(new Vector2(
                radius * Math.cos(angle * i + Math.PI / 2),
                radius * Math.sin(angle * i + Math.PI / 2)
            ));
        }
        this.points = points;
    }

    /**
     * if true, the collider will be rendered (default: false)
     */
    public get debugDraw(): boolean {
        return this._debugDraw;
    }

    /**
     * if true, the collider will be rendered (default: false)
     */
    public set debugDraw(value: boolean) {
        this._debugDraw = value;

        if (this.enabled && this.gameObject.activeInHierarchy) {
            if (value) {
                this.updateDebugDraw();
            } else {
                if (this._debugObject) {
                    this._debugObject.destroy();
                    this._debugObject = null;
                }
            }
        }
    }
}
