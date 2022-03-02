import * as b2 from "../../../../box2d.ts/build/index";
import { RigidBody2D } from "../RigidBody2D";
import { Vector2, Vector3 } from "three";
import { Collider2D } from "./Collider2D";
import { CssHtmlElementRenderer } from "../../render/CssHtmlElementRenderer";
import { GameObject } from "../../../hierarchy_object/GameObject";
import { ReadonlyVector2 } from "../../../math/ReadonlyVector2";

export class BoxCollider2D extends Collider2D {
    public override readonly requiredComponents = [RigidBody2D];

    private _size: Vector2 = new Vector2();
    private _debugDraw = true;
    private _debugObject: GameObject|null = null;

    public override onEnable(): void {
        super.onEnable();
        if (this._debugDraw) {
            this._debugObject = this.gameObject.addChildFromBuilder(
                this.engine.instantiater.buildGameObject("debug_box", new Vector3(this.offset.x, this.offset.y, 200))
                    .withComponent(CssHtmlElementRenderer, c => {
                        const div = document.createElement("div");
                        div.style.border = "1px solid rgba(255, 255, 0, 0.3)";
                        div.style.backgroundColor = "rgba(0, 0, 0, 0)";
                        c.element = div;
                        c.elementHeight = this._size.y;
                        c.elementWidth = this._size.x;
                    })
            );
        }
    }

    public override onDisable(): void {
        super.onDisable();
        if (this._debugObject) {
            this._debugObject.destroy();
            this._debugObject = null;
        }
    }

    private _b2Vector = new b2.Vec2();

    protected override createShape(): b2.Shape {
        const shape = new b2.PolygonShape();
        shape.SetAsBox(
            this._size.x / 2 * PhysicsProcessor.unitScalar,
            this._size.y / 2 * PhysicsProcessor.unitScalar,
            this._b2Vector.Copy(this.offset).SelfMul(PhysicsProcessor.unitScalar)
        );
        return shape;
    }

    public get size(): ReadonlyVector2 {
        return this._size;
    }

    public set size(value: ReadonlyVector2) {
        this._size.set(value.x, value.y);
        this.updateFixture();
    }

    public get debugDraw(): boolean {
        return this._debugDraw;
    }

    public set debugDraw(value: boolean) {
        this._debugDraw = value;
    }
}
