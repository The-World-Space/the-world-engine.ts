import { 
    Bootstrapper as BaseBootstrapper,
    Camera,
    CssSpriteRenderer,
    EditorCameraController,
    EditorGridRenderer,
    SceneBuilder
} from "the-world-engine";

export class Bootstrapper1 extends BaseBootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera)
                .withComponent(EditorGridRenderer, c => {
                    c.renderWidth = 50;
                    c.renderHeight = 50;
                }))

            .withChild(instantiater.buildGameObject("object1")
                .withComponent(CssSpriteRenderer))
        ;
    }
}

export class Bootstrapper2 extends BaseBootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera)
                .withComponent(EditorGridRenderer, c => {
                    c.renderWidth = 50;
                    c.renderHeight = 50;
                })
                .withComponent(EditorCameraController, c => {
                    c.mouseMoveButton = 0;
                }))

            .withChild(instantiater.buildGameObject("object1")
                .withComponent(CssSpriteRenderer))
        ;
    }
}
