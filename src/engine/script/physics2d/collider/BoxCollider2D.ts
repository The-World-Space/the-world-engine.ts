import type { Shape } from "../../../../box2d.ts/build/index";
import { Vec2, PolygonShape } from "../../../../box2d.ts/build/index";
import { Vector2, Vector3 } from "three/src/Three";
import { Collider2D } from "./Collider2D";
import { CssHtmlElementRenderer } from "../../render/CssHtmlElementRenderer";
import type { GameObject } from "../../../hierarchy_object/GameObject";
import type { ReadonlyVector2 } from "../../../math/ReadonlyVector2";
import type { WritableVector2 } from "../../../math/WritableVector2";
import { getOrCreatePhysicsDebugRenderObject } from "../PhysicsDebugRender";
import { ObjectAttacher } from "../ObjectAttacher";

export class BoxCollider2D extends Collider2D {
    private _size: Vector2 = new Vector2(1, 1);
    private _edgeRadius = 0;
    private _debugDraw = true;
    private _debugObject: GameObject|null = null;

    public override onEnable(): void {
        super.onEnable();
        if (this._debugDraw) {
            const objectAttacher = this.gameObject.addComponent(ObjectAttacher);

            const physicsDebugRenderObject = getOrCreatePhysicsDebugRenderObject(this.engine);
            this._debugObject = physicsDebugRenderObject.addChildFromBuilder(
                this.engine.instantiater.buildGameObject("debug_box", new Vector3(this.offset.x, this.offset.y, 200))
                    .withComponent(CssHtmlElementRenderer, c => {
                        const div = document.createElement("div");
                        div.style.border = "2px solid rgba(255, 255, 0, 0.3)";
                        div.style.borderRadius = this.edgeRadius * 100 + "px";
                        div.style.margin = "0";
                        div.style.padding = "0";
                        div.style.backgroundColor = "rgba(0, 0, 0, 0)";
                        c.element = div;
                        c.elementHeight = this._size.y + this.edgeRadius * 2;
                        c.elementWidth = this._size.x + this.edgeRadius * 2;
                        c.viewScale = 0.01;
                    })
            );
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

    private _b2Vector = new Vec2();

    protected override createShape(): Shape {
        const shape = new PolygonShape();
        shape.SetAsBox(
            this._size.x / 2,
            this._size.y / 2,
            this._b2Vector.Copy(this.offset)
        );
        shape.m_radius = this._edgeRadius;
        return shape;
    }

    public get size(): ReadonlyVector2 {
        return this._size;
    }

    public set size(value: ReadonlyVector2) {
        if (value.x <= 0 || value.y <= 0) throw new Error("size must be greater than 0");
        (this._size as WritableVector2).copy(value);
        this.updateFixture();
    }

    public get edgeRadius(): number {
        return this._edgeRadius;
    }

    public set edgeRadius(value: number) {
        this._edgeRadius = value;
        this.updateFixture();
    }

    public get debugDraw(): boolean {
        return this._debugDraw;
    }

    public set debugDraw(value: boolean) {
        this._debugDraw = value;
    }
}
