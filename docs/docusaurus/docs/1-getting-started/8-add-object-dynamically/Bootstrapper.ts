import { 
    Bootstrapper as BaseBootstrapper,
    Camera,
    SceneBuilder
} from "the-world-engine";

import { RandomSpawner1, RandomSpawner2, RandomSpawner3, RandomSpawner4, RandomSpawner5 } from "./RandomSpawner";

export class Bootstrapper1 extends BaseBootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera))

            .withChild(instantiater.buildGameObject("spawner")
                .withComponent(RandomSpawner1))
        ;
    }
}

export class Bootstrapper2 extends BaseBootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera))

            .withChild(instantiater.buildGameObject("spawner")
                .withComponent(RandomSpawner2))
        ;
    }
}

export class Bootstrapper3 extends BaseBootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera))

            .withChild(instantiater.buildGameObject("spawner")
                .withComponent(RandomSpawner3))
        ;
    }
}

export class Bootstrapper4 extends BaseBootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera))

            .withChild(instantiater.buildGameObject("spawner")
                .withComponent(RandomSpawner4))
        ;
    }
}

export class Bootstrapper5 extends BaseBootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera))

            .withChild(instantiater.buildGameObject("spawner")
                .withComponent(RandomSpawner5))
        ;
    }
}
