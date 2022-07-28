import { Vector2, Vector3 } from "three/src/Three";

import type { Shape } from "../../../../box2d.ts/build/index";
import { EdgeShape } from "../../../../box2d.ts/build/index";
import type { GameObject } from "../../../hierarchy_object/GameObject";
import { PrefabRef } from "../../../hierarchy_object/PrefabRef";
import type { ReadonlyVector2 } from "../../../math/ReadonlyVector2";
import { Color } from "../../../render/Color";
import { CssEdgeRenderer } from "../../render/CssEdgeRenderer";
import { ObjectAttacher2D } from "../ObjectAttacher2D";
import { getOrCreatePhysicsDebugRenderObject } from "../PhysicsDebugRender";
import { Collider2D } from "./Collider2D";

/**
 * Collider for 2D physics representing an arbitrary set of connected edges (lines) defined by its vertices.
 */
export class EdgeCollider2D extends Collider2D {
    private _points: Vector2[] = [
        new Vector2(-2, 0),
        new Vector2(2, 0)
    ];
    private _edgeRadius = 0;
    private _debugDraw = true;
    private _debugObject: GameObject|null = null;
    private _debugRenderer: CssEdgeRenderer|null = null;

    private updateDebugDraw(): void {
        if (this._debugDraw) {
            let objectAttacher = this.gameObject.getComponent(ObjectAttacher2D);
            if (!objectAttacher) objectAttacher = this.gameObject.addComponent(ObjectAttacher2D)!;
            
            if (this._debugObject) {
                this._debugRenderer!.points = this._points;
            } else {
                const physicsDebugRenderObject = getOrCreatePhysicsDebugRenderObject(this.engine);
                const debugRenderer = new PrefabRef<CssEdgeRenderer>();
                this._debugObject = physicsDebugRenderObject.addChildFromBuilder(
                    this.engine.instantiater.buildGameObject(this.gameObject.name + "_debug_edge")
                        .withChild(this.engine.instantiater.buildGameObject("debug_edge", new Vector3(this.offset.x, this.offset.y, 200))
                            .withComponent(CssEdgeRenderer, c => {
                                c.points = this._points;
                                c.viewScale = 0.01;
                                c.edgeWidth = 2;
                                c.edgeColor = new Color(1, 1, 0, 0.3);
                                c.pointerEvents = false;
                            })
                            .getComponent(CssEdgeRenderer, debugRenderer)));
                
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

    protected override createShapes(): Shape[] {
        const shapes: Shape[] = [];
        const points = this._points;
        for (let i = 0; i < points.length - 1; ++i) {
            const shape = new EdgeShape();
            shape.SetTwoSided(points[i], points[i + 1]);
            shape.m_radius = this._edgeRadius;
            shapes.push(shape);
        }
        return shapes;
    }

    /**
     * Get the points defining multiple continuous edges. (default: [(-2, 0), (2, 0)])
     */
    public get points(): readonly ReadonlyVector2[] {
        return this._points;
    }

    /**
     * Set the points defining multiple continuous edges. (default: [(-2, 0), (2, 0)])
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
     * Controls the radius of all edges created by the collider.
     */
    public get edgeRadius(): number {
        return this._edgeRadius;
    }

    /**
     * Controls the radius of all edges created by the collider.
     */
    public set edgeRadius(value: number) {
        this._edgeRadius = value;
        this.updateFixture();
        //this.updateDebugDraw();
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
