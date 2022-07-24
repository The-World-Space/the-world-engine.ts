import { 
    Bootstrapper as BaseBootstrapper,
    Camera,
    CssSpriteRenderer,
    SceneBuilder
} from "the-world-engine";
import { Vector3 } from "three/src/Three";
import { Rotator } from "./Rotator";

export class Bootstrapper1 extends BaseBootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera", new Vector3(0, 0, 10))
                .withComponent(Camera))
            
            .withChild(instantiater.buildGameObject("sprite1")
                .withComponent(CssSpriteRenderer, c => {
                    c.asyncSetImageFromPath("https://c.tenor.com/jJalYO9p0PAAAAAd/hatsune-miku-plush.gif");
                    c.imageWidth = 6;
                    c.imageHeight = 6;
                })
                .withComponent(Rotator))
        ;
    }
}
