import { Camera, Color } from "..";
import { Bootstrapper } from "../engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "../engine/bootstrap/SceneBuilder";
import { TimeTest } from "./script/TimeTest";

/** @internal */
export class TestBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.engine.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("test_object")
                .withComponent(TimeTest))
            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera, c => {
                    c.backgroundColor = new Color(0.1, 0.1, 0.1);
                }))
        ;
    }
}
