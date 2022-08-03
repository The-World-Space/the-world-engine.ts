import { CssSpriteAtlasRenderer, GridCollider } from "the-world-engine";
import { Vector2 } from "three/src/Three";

import OverworldTileset from "../../image/Overworld_Tileset.png";
import { StaticObjectPrefabBase } from "./StaticObjectPrefabBase";

export class Tree1Prefab extends StaticObjectPrefabBase {
    protected rendererInitializer(c: CssSpriteAtlasRenderer): void {
        c.asyncSetImageFromPath(OverworldTileset, 18 / 2, 13 / 3);
        c.imageIndex = 28.5;
        c.imageWidth = 2;
        c.imageHeight = 3;
        c.centerOffset = new Vector2(0, 0.3);
        c.filter.brightness = 1.5;
    }

    protected colliderInitializer(c: GridCollider): void {
        c.addColliderFromTwoDimensionalArray([
            [1]
        ], 0, 1);
    }
}
