import type { GameObjectBuilder } from "@src/engine/hierarchy_object/GameObjectBuilder";
import { Prefab } from "@src/engine/hierarchy_object/Prefab";
import { PrefabRef } from "@src/engine/hierarchy_object/PrefabRef";
import { PlayerGridMovementController } from "@src/engine/script/controller/PlayerGridMovementController";
import type { CssCollideTilemapChunkRenderer } from "@src/engine/script/grid_physics2d/CssCollideTilemapChunkRenderer";
import { CssSpriteAtlasRenderer, CssSpriteAtlasRenderMode } from "@src/engine/script/render/CssSpriteAtlasRenderer";
import { CssTextRenderer, TextAlign } from "@src/engine/script/render/CssTextRenderer";
import { ZaxisSorter } from "@src/engine/script/render/ZaxisSorter";
import { GlobalConfig } from "@src/GlobalConfig";
import { Vector2, Vector3 } from "three/src/Three";

import { SansFightRoomPrefab } from "./SansFightRoomPrefab";

/** @internal */
export class TopDownScenePrefab extends Prefab {

    public make(): GameObjectBuilder {
        const instantiater = this.instantiater;

        const gridMap = new PrefabRef<CssCollideTilemapChunkRenderer>();

        return this.gameObjectBuilder
            .withChild(instantiater.buildGameObject("title", new Vector3(0, 13, 0))
                .withComponent(CssTextRenderer, c => {
                    c.text = "Scene Test";
                    c.fontSize = 20;
                    c.textWidth = 50;
                    c.textAlign = TextAlign.Center;
                }))

            .withChild(instantiater.buildPrefab("sans_fight_room", SansFightRoomPrefab, new Vector3(-28, 0, 0))
                .getColideTilemapChunkRendererRef(gridMap)
                .make()
            )

            .withChild(instantiater.buildGameObject("track_object")
                //.active(false)
                .withComponent(CssSpriteAtlasRenderer, c => {
                    //c.enabled = false;
                    c.asyncSetImageFromPath(GlobalConfig.defaultSpriteSrc, 3, 2);
                    c.viewScale = 1;
                    c.imageIndex = 0;
                    c.pointerEvents = true;
                    c.imageFlipX = true;
                    c.imageFlipY = true;
                    c.imageWidth = 1;
                    c.imageHeight = 2;
                    c.centerOffset = new Vector2(0, 0.4);
                    c.renderMode = CssSpriteAtlasRenderMode.ObjectFit;
                })
                .withComponent(PlayerGridMovementController, c => {
                    c.setGridInfoFromCollideMap(gridMap.ref!);
                    c.addCollideMap(gridMap.ref!);
                })
                .withComponent(ZaxisSorter, c => {
                    c.runOnce = false;
                    c.offset = 0.7;
                }))
        ;
    }
}
