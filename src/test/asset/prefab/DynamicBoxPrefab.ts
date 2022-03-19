import { GameObjectBuilder } from "../../../engine/hierarchy_object/GameObjectBuilder";
import { Prefab } from "../../../engine/hierarchy_object/Prefab";
import { BoxCollider2D } from "../../../engine/script/physics2d/collider/BoxCollider2D";
import { RigidBody2D } from "../../../engine/script/physics2d/RigidBody2D";
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
