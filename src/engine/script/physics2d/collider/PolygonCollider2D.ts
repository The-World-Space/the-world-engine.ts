import type { Shape } from "../../../../box2d.ts/build/index";
import { PolygonShape } from "../../../../box2d.ts/build/index";
import { Vector2, Vector3 } from "three/src/Three";
import { Collider2D } from "./Collider2D";
import type { GameObject } from "../../../hierarchy_object/GameObject";
import type { ReadonlyVector2 } from "../../../math/ReadonlyVector2";
import { getOrCreatePhysicsDebugRenderObject } from "../PhysicsDebugRender";
import { Object2DAttacher } from "../Object2DAttacher";
import { Css2DPolygonRenderer } from "../../render/Css2DPolygonRenderer";
import { PrefabRef } from "../../../hierarchy_object/PrefabRef";
import { Color } from "../../../render/Color";
import { DEG2RAD } from "three/src/math/MathUtils";

export class PolygonCollider2D extends Collider2D {
    private _points: Vector2[] = [
        new Vector2(-2, -2),
        new Vector2(2, -2),
        new Vector2(2, 2),
        new Vector2(-2, 2),
    ];
    private _debugDraw = true;
    private _debugObject: GameObject|null = null;
    private _debugRenderer: Css2DPolygonRenderer|null = null;

    public override onEnable(): void {
        super.onEnable();
        if (this._debugDraw) {
            const objectAttacher = this.gameObject.addComponent(Object2DAttacher);

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

    public override onDisable(): void {
        super.onDisable();
        if (this._debugObject) {
            this._debugObject.destroy();
            this._debugObject = null;
        }
    }

    protected override createShapes(): Shape[] {
        const shape = new PolygonShape();
        shape.Set(this._points);
        return [shape];
    }

    public get points(): readonly ReadonlyVector2[] {
        return this._points;
    }

    public set points(value: readonly ReadonlyVector2[]) {
        this._points.length = 0;
        for (let i = 0; i < value.length; i++) {
            this._points.push(value[i].clone());
        }
        this.updateFixture();
        if (this._debugRenderer) {
            this._debugRenderer.points = this._points;
        }
    }
    
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

    public get debugDraw(): boolean {
        return this._debugDraw;
    }

    public set debugDraw(value: boolean) {
        this._debugDraw = value;
    }
}
