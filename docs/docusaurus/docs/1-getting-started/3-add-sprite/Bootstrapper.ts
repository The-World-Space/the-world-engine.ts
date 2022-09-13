import { 
    Bootstrapper as BaseBootstrapper,
    Camera,
    CssSpriteRenderer,
    SceneBuilder
} from "the-world-engine";
import { MathUtils, Quaternion, Vector3 } from "three/src/Three";

export class Bootstrapper1 extends BaseBootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera", new Vector3(0, 0, 10))
                .withComponent(Camera))
            
            .withChild(instantiater.buildGameObject("sprite1") // create a sprite!
                .withComponent(CssSpriteRenderer))
        ;
    }
}

export class Bootstrapper2 extends BaseBootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera", new Vector3(0, 0, 10))
                .withComponent(Camera))
            
            .withChild(instantiater.buildGameObject("sprite1", new Vector3(4, 0, 0)) // x is 4
                .withComponent(CssSpriteRenderer))
        ;
    }
}

export class Bootstrapper3 extends BaseBootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera", new Vector3(0, 0, 10))
                .withComponent(Camera))
            
            .withChild(instantiater.buildGameObject("sprite1",
                new Vector3(4, 0, 0),
                new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), 45 * MathUtils.DEG2RAD), // rotate 45 degree around z axis
                new Vector3(2, 1, 1) // stretch x by 2
            )
                .withComponent(CssSpriteRenderer))
        ;
    }
}

export class Bootstrapper4 extends BaseBootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera", new Vector3(0, 0, 10))
                .withComponent(Camera))
            
            .withChild(instantiater.buildGameObject("sprite1", new Vector3(0, 0, 0))
                .withComponent(CssSpriteRenderer, c => {
                    c.asyncSetImageFromPath("https://c.tenor.com/jJalYO9p0PAAAAAd/hatsune-miku-plush.gif");
                    c.imageWidth = 6;
                    c.imageHeight = 6;
                }))
        ;
    }
}
