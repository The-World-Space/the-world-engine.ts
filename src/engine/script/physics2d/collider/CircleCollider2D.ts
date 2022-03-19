import type { Shape } from "../../../../box2d.ts/build/index";
import { CircleShape } from "../../../../box2d.ts/build/index";
import { Vector3 } from "three/src/Three";
import { Collider2D } from "./Collider2D";
import { CssHtmlElementRenderer } from "../../render/CssHtmlElementRenderer";
import type { GameObject } from "../../../hierarchy_object/GameObject";
import { getOrCreatePhysicsDebugRenderObject } from "../PhysicsDebugRender";
import { Object2DAttacher } from "../Object2DAttacher";

export class CircleCollider2D extends Collider2D {
    private _radius = 1;
    private _debugDraw = true;
    private _debugObject: GameObject|null = null;

    public override onEnable(): void {
        super.onEnable();
        if (this._debugDraw) {
            const objectAttacher = this.gameObject.addComponent(Object2DAttacher);

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

    public override onDisable(): void {
        super.onDisable();
        if (this._debugObject) {
            this._debugObject.destroy();
            this._debugObject = null;
        }
    }

    private _shapeArray: CircleShape[] = [ new CircleShape() ];

    protected override createShapes(): Shape[] {
        const shape = this._shapeArray[0];
        shape.Set(this.offset, this._radius);
        return this._shapeArray;
    }

    public get radius(): number {
        return this._radius;
    }

    public set radius(value: number) {
        this._radius = value;
        this.updateFixture();
    }

    public get debugDraw(): boolean {
        return this._debugDraw;
    }

    public set debugDraw(value: boolean) {
        this._debugDraw = value;
    }
}
