import { Bootstrapper } from "../../engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "../../engine/bootstrap/SceneBuilder";

export class EventTestBootstrapper extends Bootstrapper {
    public override run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder

            .withChild(instantiater.buildGameObject("object1"))

            .withChild(instantiater.buildGameObject("object2"))

            .withChild(instantiater.buildGameObject("object3"))

        ;
    }
}
