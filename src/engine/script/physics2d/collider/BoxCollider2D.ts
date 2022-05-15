import { Vector2, Vector3 } from "three/src/Three";

import type { Shape } from "../../../../box2d.ts/build/index";
import { PolygonShape } from "../../../../box2d.ts/build/index";
import type { GameObject } from "../../../hierarchy_object/GameObject";
import type { ReadonlyVector2 } from "../../../math/ReadonlyVector2";
import type { WritableVector2 } from "../../../math/WritableVector2";
import { CssHtmlElementRenderer } from "../../render/CssHtmlElementRenderer";
import { Object2DAttacher } from "../Object2DAttacher";
import { getOrCreatePhysicsDebugRenderObject } from "../PhysicsDebugRender";
import { Collider2D } from "./Collider2D";

/**
 * Collider for 2D physics representing an axis-aligned rectangle.
 */
export class BoxCollider2D extends Collider2D {
    private readonly _size: Vector2 = new Vector2(1, 1);
    private _edgeRadius = 0;
    private _debugDraw = true;
    private _debugObject: GameObject|null = null;

    private updateDebugDraw(): void {
        if (this._debugDraw) {
            let objectAttacher = this.gameObject.getComponent(Object2DAttacher);
            if (!objectAttacher) objectAttacher = this.gameObject.addComponent(Object2DAttacher)!;

            if (this._debugObject) {
                const renderer = this._debugObject.getComponentInChildren(CssHtmlElementRenderer)!;
                renderer.element!.style.borderRadius = this.edgeRadius * 100 + "px";
                renderer.elementWidth = this._size.x + this.edgeRadius * 2;
                renderer.elementHeight = this._size.y + this.edgeRadius * 2;
            } else {
                const physicsDebugRenderObject = getOrCreatePhysicsDebugRenderObject(this.engine);
                this._debugObject = physicsDebugRenderObject.addChildFromBuilder(
                    this.engine.instantiater.buildGameObject(this.gameObject.name + "_debug_box")
                        .withChild(this.engine.instantiater.buildGameObject("debug_box", new Vector3(this.offset.x, this.offset.y, 200))
                            .withComponent(CssHtmlElementRenderer, c => {
                                const div = document.createElement("div");
                                div.style.border = "2px solid rgba(255, 255, 0, 0.3)";
                                div.style.borderRadius = this.edgeRadius * 100 + "px";
                                div.style.margin = "0";
                                div.style.padding = "0";
                                div.style.backgroundColor = "rgba(0, 0, 0, 0)";
                                c.element = div;
                                c.elementWidth = this._size.x + this.edgeRadius * 2;
                                c.elementHeight = this._size.y + this.edgeRadius * 2;
                                c.viewScale = 0.01;
                                c.pointerEvents = false;
                            })));

                objectAttacher.target = this._debugObject;
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
        shape.SetAsBox(
            this._size.x / 2,
            this._size.y / 2,
            this.offset
        );
        shape.m_radius = this._edgeRadius;
        return this._shapeArray;
    }

    /**
     * The width and height of the rectangle. (default: (1, 1))
     */
    public get size(): ReadonlyVector2 {
        return this._size;
    }

    /**
     * The width and height of the rectangle. (default: (1, 1))
     */
    public set size(value: ReadonlyVector2) {
        if (value.x <= 0 || value.y <= 0) throw new Error("size must be greater than 0");
        (this._size as WritableVector2).copy(value);
        this.updateFixture();
        this.updateDebugDraw();
    }

    /**
     * Controls the radius of all edges created by the collider. (default: 0)
     */
    public get edgeRadius(): number {
        return this._edgeRadius;
    }

    /**
     * Controls the radius of all edges created by the collider. (default: 0)
     */
    public set edgeRadius(value: number) {
        this._edgeRadius = value;
        this.updateFixture();
        this.updateDebugDraw();
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
