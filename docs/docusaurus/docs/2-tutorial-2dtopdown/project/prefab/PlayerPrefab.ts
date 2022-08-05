import {
    CssSpriteAtlasRenderer,
    GameObjectBuilder,
    GridEventMap,
    GridPointer,
    IGridCollidable,
    MovementAnimationController,
    PlayerGridEventInvoker,
    PlayerGridMovementController,
    Prefab,
    PrefabRef,
    ReadonlyVector2,
    SpriteAtlasAnimator,
    ZaxisSorter
} from "the-world-engine";

import CharSpriteSheet from "../image/Char_Sprites/char_spritesheet.png";
import { PlayerGridInteractionInvoker } from "../script/PlayerGridInteractionInvoker";

export class PlayerPrefab extends Prefab {
    private readonly _collideMaps: PrefabRef<IGridCollidable>[] = [];
    private _gridPointer = new PrefabRef<GridPointer>();
    private _gridPosition = new PrefabRef<ReadonlyVector2>();
    private _gridEventMap = new PrefabRef<GridEventMap>();

    public withCollideMap(collideMap: PrefabRef<IGridCollidable>): this {
        this._collideMaps.push(collideMap);
        return this;
    }

    public withGridPointer(gridPointer: PrefabRef<GridPointer>): this {
        this._gridPointer = gridPointer;
        return this;
    }

    public withGridPosition(position: PrefabRef<ReadonlyVector2>): this {
        this._gridPosition = position;
        return this;
    }

    public withGridEventMap(eventMap: PrefabRef<GridEventMap>): this {
        this._gridEventMap = eventMap;
        return this;
    }

    public override make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(CssSpriteAtlasRenderer, c => {
                c.asyncSetImageFromPath(CharSpriteSheet, 26, 23);
                c.imageWidth = 1;
                c.imageHeight = 1;
                c.viewScale = 1;
                c.filter.brightness = 1.2;
            })
            .withComponent(SpriteAtlasAnimator, c => {
                c.addAnimation("down_walk", [27, 28, 29, 30, 31, 32]);
                c.addAnimation("left_walk", [53, 54, 55, 56, 57, 58]);
                c.addAnimation("right_walk", [79, 80, 81, 82, 83, 84]);
                c.addAnimation("up_walk", [105, 106, 107, 108, 109, 110]);

                c.addAnimation("down_idle", [34, 35, 36, 37, 38, 39]);
                c.addAnimation("left_idle", [60, 61, 62, 63, 64, 65]);
                c.addAnimation("right_idle", [86, 87, 88, 89, 90, 91]);
                c.addAnimation("up_idle", [112, 113, 114, 115, 116, 117]);

                c.addAnimation("down_hit", [41, 42, 43]);
                c.addAnimation("left_hit", [67, 68, 69]);
                c.addAnimation("right_hit", [93, 94, 95]);
                c.addAnimation("up_hit", [119, 120, 121]);

                c.addAnimation("down_push", [45, 46, 47, 48, 49, 50]);
                c.addAnimation("left_push", [71, 72, 73, 74, 75, 76]);
                c.addAnimation("right_push", [97, 98, 99, 100, 101, 102]);
                c.addAnimation("up_push", [123, 124, 125, 126, 127, 128]);

                c.addAnimation("down_climb", [157, 158, 159, 160, 161, 162]);
                c.addAnimation("up_climb", [183, 184, 185, 186, 187, 188]);

                c.addAnimation("down_shield_hit", [168, 169, 170, 171, 172]);
                c.addAnimation("left_shield_hit", [194, 195, 196, 197, 198]);
                c.addAnimation("right_shield_hit", [220, 221, 222, 223, 224]);
                c.addAnimation("up_shield_hit", [246, 247, 248, 249, 250]);

                c.addAnimation("down_shield", [174]);
                c.addAnimation("left_shield", [200]);
                c.addAnimation("right_shield", [226]);
                c.addAnimation("up_shield", [252]);

                c.addAnimation("death_all_air", [235, 236, 237, 238, 239, 240, 241, 242, 243, 244]);
                c.addAnimation("falling_all_air", [287, 288, 289, 290, 291, 292]);
                c.frameDuration = 0.1;

                c.playAnimation("down_idle");
            })
            .withComponent(PlayerGridMovementController, c => {
                c.speed = 4;
                for (const collideMap of this._collideMaps) {
                    if (collideMap.ref) c.addCollideMap(collideMap.ref);
                }
                c.gridPointer = this._gridPointer.ref;
                if (this._gridPosition.ref) c.initPosition = this._gridPosition.ref;
            })
            .withComponent(MovementAnimationController)
            .withComponent(PlayerGridEventInvoker, c => {
                if (this._gridEventMap.ref) c.addGridEventMap(this._gridEventMap.ref);
            })
            .withComponent(PlayerGridInteractionInvoker, c => {
                if (this._gridEventMap.ref) c.addGridEventMap(this._gridEventMap.ref);
            })
            .withComponent(ZaxisSorter, c => {
                c.runOnce = false;
                c.offset = 0.5;
            })
        ;
    }
}
