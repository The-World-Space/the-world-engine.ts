import {
    Bootstrapper as BaseBootstrapper,
    Camera,
    CssSpriteAtlasRenderer,
    CssSpriteRenderer,
    EditorCameraController,
    EditorGridRenderer,
    SceneBuilder
} from "the-world-engine";
import { Vector2, Vector3 } from "three/src/Three";
import OverworldTileset from "../project/image/Overworld_Tileset.png";
import { DrawIndex } from "../project/script/DrawIndex";

export class Bootstrapper extends BaseBootstrapper {
    public override run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("test-sprite-atlas")
                .withComponent(CssSpriteAtlasRenderer, c => {
                    c.asyncSetImageFromPath(OverworldTileset, 18, 13);
                    c.imageWidth = 1;
                    c.imageHeight = 1;
                    c.viewScale = 1;
                }))

            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera, c => {
                    c.viewSize = 1;
                })
                .withComponent(EditorCameraController, c => {
                    c.mouseMoveButton = 0;
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
            .withChild(instantiater.buildGameObject("test-sprite-atlas")
                .active(false)
                .withComponent(CssSpriteAtlasRenderer, c => {
                    c.asyncSetImageFromPath(OverworldTileset, 18, 13);
                    c.imageWidth = 1;
                    c.imageHeight = 1;
                    c.viewScale = 1;
                }))

            .withChild(instantiater.buildGameObject("draw-index")
                .withComponent(DrawIndex))

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

export class Bootstrapper3 extends BaseBootstrapper {
    public override run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("test-sprite-atlas")
                .active(false)
                .withComponent(CssSpriteAtlasRenderer, c => {
                    c.asyncSetImageFromPath(OverworldTileset, 18, 13);
                    c.imageWidth = 1;
                    c.imageHeight = 1;
                    c.viewScale = 1;
                }))

            .withChild(instantiater.buildGameObject("draw-index")
                .withComponent(DrawIndex))

            .withChild(instantiater.buildGameObject("overworld-tileset", new Vector3(-0.5, -0.5, 0))
                .withComponent(CssSpriteRenderer, c => {
                    c.asyncSetImageFromPath(OverworldTileset);
                    c.centerOffset = new Vector2(0.5, 0.5);
                    c.imageWidth = 18;
                    c.imageHeight = 13;
                }))

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
