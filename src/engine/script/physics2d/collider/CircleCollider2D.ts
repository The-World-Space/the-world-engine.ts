import { Vector3 } from "three/src/Three";

import type { Shape } from "../../../../box2d.ts/build/index";
import { CircleShape } from "../../../../box2d.ts/build/index";
import type { GameObject } from "../../../hierarchy_object/GameObject";
import { CssHtmlElementRenderer } from "../../render/CssHtmlElementRenderer";
import { ObjectAttacher2D } from "../ObjectAttacher2D";
import { getOrCreatePhysicsDebugRenderObject } from "../PhysicsDebugRender";
import { Collider2D } from "./Collider2D";

/**
 * Collider for 2D physics representing an circle.
 */
export class CircleCollider2D extends Collider2D {
    private _radius = 1;
    private _debugDraw = true;
    private _debugObject: GameObject|null = null;

    private updateDebugDraw(): void {
        if (this._debugDraw) {
            let objectAttacher = this.gameObject.getComponent(ObjectAttacher2D);
            if (!objectAttacher) objectAttacher = this.gameObject.addComponent(ObjectAttacher2D)!;

            if (this._debugObject) {
                const renderer = this._debugObject.getComponentInChildren(CssHtmlElementRenderer)!;
                renderer.elementWidth = this._radius * 2;
                renderer.elementHeight = this._radius * 2;
            } else {
                const physicsDebugRenderObject = getOrCreatePhysicsDebugRenderObject(this.engine);
                this._debugObject = physicsDebugRenderObject.addChildFromBuilder(
                    this.engine.instantiater.buildGameObject(this.gameObject.name + "_debug_circle")
                        .withChild(this.engine.instantiater.buildGameObject("debug_circle", new Vector3(this.offset.x, this.offset.y, 200))
                            .withComponent(CssHtmlElementRenderer, c => {
                                const div = document.createElement("div");
                                div.style.border = "2px solid rgba(255, 255, 0, 0.3)";
                                div.style.borderRadius = "50%";
                                div.style.margin = "0";
                                div.style.padding = "0";
                                div.style.backgroundColor = "rgba(0, 0, 0, 0)";
                                c.element = div;
                                c.elementHeight = this._radius * 2;
                                c.elementWidth = this._radius * 2;
                                c.viewScale = 0.01;
                                c.pointerEvents = false;
                            })));

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

    private readonly _shapeArray: CircleShape[] = [ new CircleShape() ];

    protected override createShapes(): Shape[] {
        const shape = this._shapeArray[0];
        shape.Set(this.offset, this._radius);
        return this._shapeArray;
    }

    /**
     * Radius of the circle. (default: 1)
     */
    public get radius(): number {
        return this._radius;
    }

    /**
     * Radius of the circle. (default: 1)
     */
    public set radius(value: number) {
        this._radius = value;
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
