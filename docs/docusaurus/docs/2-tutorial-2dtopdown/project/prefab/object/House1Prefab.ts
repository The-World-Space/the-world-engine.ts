import { CssSpriteAtlasRenderer, GridCollider, InitializeComponent } from "the-world-engine";
import { Vector2 } from "three/src/Three";

import OverworldTileset from "../../image/Overworld_Tileset.png";
import { StaticObjectPrefabBase } from "./StaticObjectPrefabBase";

export class House1Prefab extends StaticObjectPrefabBase {
    protected rendererInitializer(c: InitializeComponent<CssSpriteAtlasRenderer>): void {
        c.asyncSetImageFromPath(OverworldTileset, 18 / 6, 13 / 5);
        c.imageIndex = 2;
        c.imageWidth = 6;
        c.imageHeight = 5;
        c.centerOffset = new Vector2(0, 0.45);
        c.filter.brightness = 1.5;
    }

    protected colliderInitializer(c: InitializeComponent<GridCollider>): void {
        c.addColliderFromTwoDimensionalArray([
            [1, 1, 1, 1],
            [1, 1, 1, 1, 1]
        ], -2, 1);
    }
}
