import { Bootstrapper } from "@src/engine/bootstrap/Bootstrapper";
import type { SceneBuilder } from "@src/engine/bootstrap/SceneBuilder";
import { Physics2DLoader } from "@src/engine/physics/2d/Physics2DLoader";
import { Color } from "@src/engine/render/Color";
import { EditorCameraController } from "@src/engine/script/controller/EditorCameraController";
import { EditorGridRenderer } from "@src/engine/script/post_render/EditorGridRenderer";
import { Camera, CameraType } from "@src/engine/script/render/Camera";
import { CssTextRenderer } from "@src/engine/script/render/CssTextRenderer";
import { Vector2, Vector3 } from "three/src/Three";

import { PhysicsTestPrefab } from "./prefab/PhysicsTestPrefab";
import { RenderTestPrefab } from "./prefab/RenderTestPrefab";
import { TopDownScenePrefab } from "./prefab/TopDownScenePrefab";
import { FpsCounter } from "./script/FpsCounter";
import type { TestLayer } from "./TestLayer";

/** @internal */
export class TestBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {

        console.clear();

        this.setting.render
            .useCss3DRenderer(true);

        this.setting.physics
            .loader(Physics2DLoader)
            .layerCollisionMatrix<TestLayer>({
                default: { player: true, level: true, default: true },
                level: { player: true, level: true },
                player: { player: true }
            });

        const instantiater = this.instantiater;

        return this.sceneBuilder

        // .withChild(instantiater.buildPrefab("raycast_test", RaycastTestPrefab, new Vector3(0, 0, 0)).make())

            .withChild(instantiater.buildPrefab("physics_test", PhysicsTestPrefab, new Vector3(0, 0, 0)).make())

            .withChild(instantiater.buildPrefab("render_test", RenderTestPrefab, new Vector3(0, -25, 0)).make())

            .withChild(instantiater.buildPrefab("top_down_scene", TopDownScenePrefab,  new Vector3(0, -50, 0)).make())

            .withChild(instantiater.buildGameObject("editor_camera", new Vector3(0, 0, 80))
                .withComponent(Camera, c => {
                    c.viewSize = 10;
                    c.backgroundColor = new Color(0, 0, 0);
                    c.cameraType = CameraType.Orthographic;
                })
                .withComponent(EditorCameraController, c => {
                    c.maxViewSize = 40;
                })
                .withComponent(EditorGridRenderer, c => {
                    c.enabled = false;
                    c.renderWidth = 100;
                    c.renderHeight = 100;
                })
                .withComponent(CssTextRenderer, c => {
                    //c.enabled = false;
                    c.pointerEvents = false;
                    c.text = "e : spawn object  d : despawn object";
                    c.textWidth = 18;
                    c.centerOffset = new Vector2(0, 3);
                })
                .withChild(instantiater.buildGameObject("fps_counter")
                    .withComponent(CssTextRenderer, c => {
                        c.autoSize = true;
                        c.centerOffset = new Vector2(-1.8, 1.8);
                        c.textColor = new Color(1, 1, 1);
                    })
                    .withComponent(FpsCounter)))
        ;
    }
}
