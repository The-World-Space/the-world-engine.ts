import { Component, EditorCameraController, SceneBuilder } from "the-world-engine";

import { Bootstrapper as Topdown2dBootstrapper } from "../project/Bootstrapper";

export class Bootstrapper extends Topdown2dBootstrapper {
    public override run(): SceneBuilder {
        return super.run()
            .withChild(this.instantiater.buildGameObject("camera-scroll-override")
                // eslint-disable-next-line react/display-name
                .withComponent(class extends Component {
                    public start(): void {
                        const camera = this.engine.cameraContainer.camera!;
                        camera.gameObject.getComponent(EditorCameraController)!.enabled = false;
                        camera.viewSize = 3.5;
                    }
                }))
        ;
    }
}
