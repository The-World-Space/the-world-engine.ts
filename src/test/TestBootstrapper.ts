import { Camera, EditorCameraController, EditorGridRenderer, PointerGridInputListener } from "..";
import { Bootstrapper } from "../engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "../engine/bootstrap/SceneBuilder";
import { TimeTest } from "./script/TimeTest";

/** @internal */
export class TestBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.engine.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("test_object")
                .withComponent(TimeTest, c => c.enabled = false)
                .withComponent(PointerGridInputListener))
            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera)
                .withComponent(EditorCameraController, c => {
                    c.maxViewSize = 500;
                })
                .withComponent(EditorGridRenderer, c => {
                    c.renderWidth = 1000;
                    c.renderHeight = 1000;
                }))
        ;
    }
}
