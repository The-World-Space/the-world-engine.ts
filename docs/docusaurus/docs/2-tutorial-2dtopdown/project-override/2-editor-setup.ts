import {
    Bootstrapper as BaseBootstrapper,
    Camera,
    EditorCameraController,
    EditorGridRenderer,
    SceneBuilder
} from "the-world-engine";

export class Bootstrapper extends BaseBootstrapper {
    public override run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
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
