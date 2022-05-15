import { GameObjectBuilder } from "@src/engine/hierarchy_object/GameObjectBuilder";
import { Prefab } from "@src/engine/hierarchy_object/Prefab";
import { PrefabRef } from "@src/engine/hierarchy_object/PrefabRef";
import { BoxCollider2D } from "@src/engine/script/physics2d/collider/BoxCollider2D";
import { RigidBody2D } from "@src/engine/script/physics2d/RigidBody2D";
import { CssIframeRenderer } from "@src/engine/script/render/CssIframeRenderer";
import { Vector2 } from "three/src/Three";

/** @internal */
export class IframeDynamicBoxPrefab extends Prefab {
    private _iframeSrc: PrefabRef<string> = new PrefabRef("https://www.youtube.com/embed/thzz6KT6LMA");

    public withSrc(src: PrefabRef<string>): Prefab {
        this._iframeSrc = src;
        return this;
    }

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
                c.iframeSource = this._iframeSrc.ref!;
                c.viewScale = 0.01;
            })
        ;
    }
}
