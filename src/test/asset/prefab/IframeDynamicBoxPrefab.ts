import { Vector2 } from "three/src/math/Vector2";
import { GameObjectBuilder } from "../../../engine/hierarchy_object/GameObjectBuilder";
import { Prefab } from "../../../engine/hierarchy_object/Prefab";
import { BoxCollider2D } from "../../../engine/script/physics2d/collider/BoxCollider2D";
import { RigidBody2D } from "../../../engine/script/physics2d/RigidBody2D";
import { CssIframeRenderer } from "../../../engine/script/render/CssIframeRenderer";

/** @internal */
export class IframeDynamicBoxPrefab extends Prefab {

    public make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(RigidBody2D)
            .withComponent(BoxCollider2D, c => {
                c.debugDraw = false;
                c.size = new Vector2(4, 3);
            })
            .withComponent(CssIframeRenderer, c => {
                c.width = 4;
                c.height = 3;
                c.iframeSource = "https://www.youtube.com/embed/thzz6KT6LMA";
                c.viewScale = 0.01;
            })
        ;
    }
}
