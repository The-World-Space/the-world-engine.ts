import { Vector3 } from "three/src/Three";
import { Bootstrapper } from "../../engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "../../engine/bootstrap/SceneBuilder";
import { GameObjectBuilder } from "../../engine/hierarchy_object/GameObjectBuilder";
import { Prefab } from "../../engine/hierarchy_object/Prefab";
import { Color } from "../../engine/render/Color";
import { EditorCameraController } from "../../engine/script/controller/EditorCameraController";
import { Camera } from "../../engine/script/render/Camera";
import { CssSpriteRenderer } from "../../engine/script/render/CssSpriteRenderer";
import { HorizontalObjectsAnimator } from "./script/HorizontalObjectsAnimator";

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
                                .withComponent(CssSpriteRenderer);
                        }
                    };
                    c.spawnCount = 3;
                    c.padding = 3;
                }))
        ;
    }
}
