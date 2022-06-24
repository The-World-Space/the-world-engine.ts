import { Bootstrapper } from "@src/engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "@src/engine/bootstrap/SceneBuilder";
import { Component } from "@src/engine/hierarchy_object/Component";
import { GameObject } from "@src/engine/hierarchy_object/GameObject";
import { EditorCameraController } from "@src/engine/script/controller/EditorCameraController";
import { EditorGridRenderer } from "@src/engine/script/post_render/EditorGridRenderer";
import { Camera } from "@src/engine/script/render/Camera";
import { CssSpriteRenderer } from "@src/engine/script/render/CssSpriteRenderer";
import { Vector3 } from "three/src/Three";

export class ObjectPoolTestBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;
        
        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera)
                .withComponent(EditorCameraController)
                .withComponent(EditorGridRenderer)
                
                .withComponent(class PoolTest extends Component {
                    private readonly _objectPool: GameObject[] = [];
                    private readonly _activeObjects: GameObject[] = [];

                    private createSprite(): GameObject {
                        let spriteObject = this._objectPool.pop();

                        if (!spriteObject) {
                            spriteObject = this.gameObject.addChildFromBuilder(
                                instantiater.buildGameObject("sprite", new Vector3(0, 0, 0))
                                    .active(false)
                                    .withComponent(CssSpriteRenderer));
                        }

                        spriteObject.activeSelf = true;
                        return spriteObject;
                    }

                    private releaseSprite(spriteObject: GameObject): void {
                        spriteObject.activeSelf = false;
                        this._objectPool.push(spriteObject);
                    }

                    public update(): void {
                        for (let i = 0; i < this._activeObjects.length; ++i) {
                            this.releaseSprite(this._activeObjects[i]);
                        }
                        this._activeObjects.length = 0;

                        for (let i = 4; i >= 0; --i) {
                            const gameObject = this.createSprite();
                            this._activeObjects.push(gameObject);

                            gameObject.transform.position.x = i * 2;
                        }
                    }
                }))

        // .withChild(instantiater.buildGameObject("test-object")
        //     .withComponent(CssSpriteRenderer))
        ;
    }
}
