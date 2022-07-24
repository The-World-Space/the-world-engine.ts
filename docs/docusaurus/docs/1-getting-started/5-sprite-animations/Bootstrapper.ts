import { 
    Bootstrapper as BaseBootstrapper,
    Camera,
    CssSpriteAtlasRenderer,
    SceneBuilder,
    SpriteAtlasAnimator
} from "the-world-engine";
import { Vector3 } from "three/src/Three";
import { PlayerController } from "./PlayerController";

export class Bootstrapper1 extends BaseBootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera", new Vector3(0, 0, 10))
                .withComponent(Camera))
            
            .withChild(instantiater.buildGameObject("sprite1", new Vector3(0, 0, 0))
                .withComponent(CssSpriteAtlasRenderer, c => {
                    c.asyncSetImageFromPath(
                        "https://i.stack.imgur.com/eUJdp.png",
                        4, 9,
                        () => {
                            if (!c.exists) return;
                            c.imageWidth *= 3;
                            c.imageHeight *= 3;
                        }
                    );

                    c.imageIndex = 0;
                })
                .withComponent(SpriteAtlasAnimator, c => {
                    c.addAnimation("idle_up", [0]);
                    c.addAnimation("walk_up", [1, 2, 3, 4, 5, 6, 7, 8]);
                    c.addAnimation("idle_left", [9]);
                    c.addAnimation("walk_left", [10, 11, 12, 13, 14, 15, 16, 17]);
                    c.addAnimation("idle_down", [18]);
                    c.addAnimation("walk_down", [19, 20, 21, 22, 23, 24, 25, 26]);
                    c.addAnimation("idle_right", [27]);
                    c.addAnimation("walk_right", [28, 29, 30, 31, 32, 33, 34, 35]);

                    c.frameDuration = 0.2;
                }))
        ;
    }
}

export class Bootstrapper2 extends BaseBootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera", new Vector3(0, 0, 10))
                .withComponent(Camera))
            
            .withChild(instantiater.buildGameObject("sprite1", new Vector3(0, 0, 0))
                .withComponent(CssSpriteAtlasRenderer, c => {
                    c.asyncSetImageFromPath(
                        "https://i.stack.imgur.com/eUJdp.png",
                        4, 9,
                        () => {
                            if (!c.exists) return;
                            c.imageWidth *= 3;
                            c.imageHeight *= 3;
                        }
                    );

                    c.imageIndex = 0;
                })
                .withComponent(SpriteAtlasAnimator, c => {
                    c.addAnimation("idle_up", [0]);
                    c.addAnimation("walk_up", [1, 2, 3, 4, 5, 6, 7, 8]);
                    c.addAnimation("idle_left", [9]);
                    c.addAnimation("walk_left", [10, 11, 12, 13, 14, 15, 16, 17]);
                    c.addAnimation("idle_down", [18]);
                    c.addAnimation("walk_down", [19, 20, 21, 22, 23, 24, 25, 26]);
                    c.addAnimation("idle_right", [27]);
                    c.addAnimation("walk_right", [28, 29, 30, 31, 32, 33, 34, 35]);

                    c.frameDuration = 0.1;
                })
                .withComponent(PlayerController))
        ;
    }
}
