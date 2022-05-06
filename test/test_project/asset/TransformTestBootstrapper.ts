import { Vector3 } from "three/src/Three";
import { Bootstrapper } from "@src/engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "@src/engine/bootstrap/SceneBuilder";
import { GameObjectBuilder } from "@src/engine/hierarchy_object/GameObjectBuilder";
import { Prefab } from "@src/engine/hierarchy_object/Prefab";
import { Color } from "@src/engine/render/Color";
import { EditorCameraController } from "@src/engine/script/controller/EditorCameraController";
import { Camera } from "@src/engine/script/render/Camera";
import { CssSpriteRenderer } from "@src/engine/script/render/CssSpriteRenderer";
import { HorizontalObjectsAnimator } from "./script/HorizontalObjectsAnimator";
import Pillar from "./source/spr_foregroundpillar.png";

/** @internal */
export class TransformTestBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;
        return this.sceneBuilder
            
            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera, c => {
                    c.viewSize = 10;
                    c.backgroundColor = new Color(0.1, 0.1, 0.1);
                })
                .withComponent(EditorCameraController, c => {
                    c.maxViewSize = 20;
                    c.minViewSize = 5;
                }))

            .withChild(instantiater.buildGameObject("objects_animator",
                new Vector3(0, 1, 0))
                .withComponent(HorizontalObjectsAnimator, c => {
                    c.prefab = class extends Prefab {
                        public make(): GameObjectBuilder {
                            return this.gameObjectBuilder
                                .withComponent(CssSpriteRenderer, c => {
                                    c.asyncSetImageFromPath(Pillar);
                                });
                        }
                    };
                    c.spawnCount = 3;
                    c.padding = 3;
                }))
        ;
    }
}
