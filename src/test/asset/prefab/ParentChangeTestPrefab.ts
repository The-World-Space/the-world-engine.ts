import { Vector3 } from "three";
import { GameObject } from "../../../engine/hierarchy_object/GameObject";
import { GameObjectBuilder } from "../../../engine/hierarchy_object/GameObjectBuilder";
import { Prefab } from "../../../engine/hierarchy_object/Prefab";
import { PrefabRef } from "../../../engine/hierarchy_object/PrefabRef";
import { CssSpriteRenderer } from "../../../engine/script/render/CssSpriteRenderer";
import { ChangeParentTest } from "../script/ChangeParentTest";
import { Rotator2 } from "../script/Rotator2";

/** @internal */
export class ParentChangeTestPrefab extends Prefab {

    public make(): GameObjectBuilder {
        
        const instantiater = this.instantiater;

        const parent1 = new PrefabRef<GameObject>();
        const parent2 = new PrefabRef<GameObject>();

        return this.gameObjectBuilder
            .withChild(instantiater.buildGameObject("parent1", new Vector3(16 * 1, 0, 0))
                //.active(false)
                .withComponent(CssSpriteRenderer)
                .withComponent(Rotator2)
                .getGameObject(parent1))
                
            .withChild(instantiater.buildGameObject("parent2", new Vector3(16 * -1, 0, 0))
                //.active(false)
                .withComponent(CssSpriteRenderer)
                .withComponent(Rotator2)
                .getGameObject(parent2))

            .withChild(instantiater.buildGameObject("child", new Vector3(0, 0, 0))
                //.active(false)
                .withComponent(CssSpriteRenderer)
                .withComponent(ChangeParentTest, c => {
                    c.parent1 = parent1.ref!;
                    c.parent2 = parent2.ref!;
                }))
        ;
    }
}
