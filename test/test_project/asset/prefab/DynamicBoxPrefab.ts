import { GameObjectBuilder } from "@src/engine/hierarchy_object/GameObjectBuilder";
import { Prefab } from "@src/engine/hierarchy_object/Prefab";
import { BoxCollider2D } from "@src/engine/script/physics2d/collider/BoxCollider2D";
import { RigidBody2D } from "@src/engine/script/physics2d/RigidBody2D";
import { TestLayer } from "../TestLayer";

/** @internal */
export class DynamicBoxPrefab extends Prefab {

    public make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(RigidBody2D)
            .withComponent(BoxCollider2D, c => {
                c.setLayerFromName<TestLayer>("default");
            })
        ;
    }
}
