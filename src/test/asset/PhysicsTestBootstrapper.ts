import { Vector2 } from "three/src/math/Vector2";
import { Vector3 } from "three/src/math/Vector3";
import { Bootstrapper } from "../../engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "../../engine/bootstrap/SceneBuilder";
import { Physics2DLoader } from "../../engine/physics/2d/Physics2DLoader";
import { Color } from "../../engine/render/Color";
import { EditorCameraController } from "../../engine/script/controller/EditorCameraController";
import { BoxCollider2D } from "../../engine/script/physics2d/collider/BoxCollider2D";
import { RigidBody2D } from "../../engine/script/physics2d/RigidBody2D";
import { Camera } from "../../engine/script/render/Camera";
import { CssHtmlElementRenderer } from "../../engine/script/render/CssHtmlElementRenderer";
import { CollisionEventTest } from "./script/CollisionEventTest";
import { PhysicsController } from "./script/PhysicsController";

/** @internal */
export class PhysicsTestBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {
        this.setting.physics.loader(Physics2DLoader);

        const instantiater = this.instantiater;
        return this.sceneBuilder
            
            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera, c => {
                    c.viewSize = 10;
                    c.backgroundColor = new Color(0.1, 0.1, 0.1);
                })
                .withComponent(EditorCameraController, c => {
                    c.maxViewSize = 20;
                    c.minViewSize = 5;
                }))

            .withChild(instantiater.buildGameObject("ground", new Vector3(0, -3, 0))
                .withComponent(CssHtmlElementRenderer, c => {
                    const div = document.createElement("div");
                    div.style.backgroundColor = "#00cc00";
                    c.element = div;
                    c.elementWidth = 8;
                    c.elementHeight = 1;
                })
                .withComponent(BoxCollider2D, c => {
                    c.size = new Vector2(8, 1);
                    c.debugDraw = false;
                }))

            .withChild(instantiater.buildGameObject("box", new Vector3(0, 1, 0))
                .withComponent(CssHtmlElementRenderer, c => {
                    const div = document.createElement("div");
                    div.style.backgroundColor = "#cc0000";
                    c.element = div;
                    c.elementWidth = 1;
                    c.elementHeight = 1;
                })
                .withComponent(RigidBody2D)
                .withComponent(BoxCollider2D, c => {
                    c.size = new Vector2(1, 1);
                    c.debugDraw = false;
                })
                .withComponent(CollisionEventTest)
                .withComponent(PhysicsController))
        ;
    }
}
