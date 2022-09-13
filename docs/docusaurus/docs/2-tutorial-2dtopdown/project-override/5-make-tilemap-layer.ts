import {
    Bootstrapper as BaseBootstrapper,
    Camera,
    EditorCameraController,
    EditorGridRenderer,
    SceneBuilder
} from "the-world-engine";
import { Vector3 } from "three/src/Three";

import { BackgroundPrefab } from "../project/prefab/world/BackgroundPrefab";
import { DetailPrefab } from "../project/prefab/world/DetailPrefab";
import { IslandPrefab } from "../project/prefab/world/IslandPrefab";

export class Bootstrapper extends BaseBootstrapper {
    public override run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("tilemap")
                .withChild(instantiater.buildPrefab("background", BackgroundPrefab, new Vector3(0, 0, -2))
                    .make())

                .withChild(instantiater.buildPrefab("islands", IslandPrefab, new Vector3(0, 0, -1))
                    .make()))

            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera, c => {
                    c.viewSize = 4;
                })
                .withComponent(EditorCameraController, c => {
                    c.mouseMoveButton = 0;
                    c.maxViewSize = 4;
                })
                .withComponent(EditorGridRenderer, c => {
                    c.renderWidth = 50;
                    c.renderHeight = 50;
                }))
        ;
    }
}

export class Bootstrapper2 extends BaseBootstrapper {
    public override run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("tilemap")
                .withChild(instantiater.buildPrefab("background", BackgroundPrefab, new Vector3(0, 0, -3))
                    .make())

                .withChild(instantiater.buildPrefab("islands", IslandPrefab, new Vector3(0, 0, -2))
                    .make())
                    
                .withChild(instantiater.buildPrefab("detail", DetailPrefab, new Vector3(0, 0, -1))
                    .make()))

            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera, c => {
                    c.viewSize = 4;
                })
                .withComponent(EditorCameraController, c => {
                    c.mouseMoveButton = 0;
                    c.maxViewSize = 4;
                })
                .withComponent(EditorGridRenderer, c => {
                    c.renderWidth = 50;
                    c.renderHeight = 50;
                }))
        ;
    }
}
