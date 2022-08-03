import { CssSpriteAtlasRenderer, GameObjectBuilder, GridCollider, SpriteAtlasAnimator } from "the-world-engine";

import BonfirePropLit from "../../image/Props_Items_(animated)/bonfire_prop_lit_anim_strip_5.png";
import { StaticObjectPrefabBase } from "./StaticObjectPrefabBase";

export class CampfirePrefab extends StaticObjectPrefabBase {
    protected rendererInitializer(c: CssSpriteAtlasRenderer): void {
        c.asyncSetImageFromPath(BonfirePropLit, 5, 1);
        c.imageWidth = 1;
        c.imageHeight = 1;
    }

    protected colliderInitializer(c: GridCollider): void {
        c.addColliderFromTwoDimensionalArray([
            [1]
        ], 0, 0);
    }

    public override make(): GameObjectBuilder {
        return super.make()
            .withComponent(SpriteAtlasAnimator, c => {
                c.addAnimation("anim", [0, 1, 2, 3, 4]);
                c.frameDuration = 0.1;
                c.playAnimation("anim");
            })
        ;
    }
}
