import { GameObjectBuilder } from "@src/engine/hierarchy_object/GameObjectBuilder";
import { Prefab } from "@src/engine/hierarchy_object/Prefab";
import { PrefabRef } from "@src/engine/hierarchy_object/PrefabRef";
import { CssCollideTilemapChunkRenderer } from "@src/engine/script/grid_physics2d/CssCollideTilemapChunkRenderer";
import { GridCollider } from "@src/engine/script/grid_physics2d/GridCollider";
import { GridObjectCollideMap } from "@src/engine/script/grid_physics2d/GridObjectCollideMap";
import { AsyncImageLoader } from "@src/engine/script/helper/AsyncImageLoader";
import { TwoDimensionalStringMapper } from "@src/engine/script/helper/TwoDimensionalStringMapper";
import { CssTilemapChunkRenderer } from "@src/engine/script/post_render/CssTilemapChunkRenderer";
import { ParallaxTranslater } from "@src/engine/script/post_render/ParallaxTranslater";
import { CameraRelativeZaxisSorter } from "@src/engine/script/render/CameraRelativeZaxisSorter";
import { CssIframeRenderer } from "@src/engine/script/render/CssIframeRenderer";
import { CssSpriteAtlasRenderer, CssSpriteAtlasRenderMode } from "@src/engine/script/render/CssSpriteAtlasRenderer";
import { CssSpriteRenderer } from "@src/engine/script/render/CssSpriteRenderer";
import { TileAtlasItem } from "@src/engine/script/render/CssTilemapRenderer";
import { ZaxisSorter } from "@src/engine/script/render/ZaxisSorter";
import { Vector2, Vector3 } from "three/src/Three";

import SansFightRoomTileAtlas from "../source/room_sanscorridor.png";
import SansBlack from "../source/Sans black.png";
import Pillar from "../source/spr_foregroundpillar.png";

/** @internal */
export class SansFightRoomPrefab extends Prefab {
    private _colideTilemapChunkRenderer = new PrefabRef<CssCollideTilemapChunkRenderer>();
    private _gridObjectCollideMap = new PrefabRef<GridObjectCollideMap>();

    public getColideTilemapChunkRendererRef(colideTilemapRenderer: PrefabRef<CssCollideTilemapChunkRenderer>): SansFightRoomPrefab {
        this._colideTilemapChunkRenderer = colideTilemapRenderer;
        return this;
    }

    public getGridObjectCollideMapRef(gridObjectCollideMap: PrefabRef<GridObjectCollideMap>): SansFightRoomPrefab {
        this._gridObjectCollideMap = gridObjectCollideMap;
        return this;
    }

    public make(): GameObjectBuilder {
        const instantiater = this.instantiater;

        return this.gameObjectBuilder
            .withChild(instantiater.buildGameObject("tilemap")
                //.active(false)
                .withComponent(CameraRelativeZaxisSorter, c => c.offset = -50)

                .withChild(instantiater.buildGameObject("floor", new Vector3(0, 0, -1))
                    .withComponent(CssTilemapChunkRenderer, c => {

                        c.pointerEvents = false;

                        AsyncImageLoader.loadImageFromPath(SansFightRoomTileAtlas).then(tilemap3 => {
                            if (!c.exists) return;

                            c.imageSources = [new TileAtlasItem(tilemap3, 3, 20)];

                            const f = (a: number): { i: number; a: number; } => {
                                return { i: 0, a: a };
                            };

                            const converter = {
                                /* eslint-disable @typescript-eslint/naming-convention */
                                "F": () => f(57),
                                "G": () => f(58),
                                "H": () => f(48),
                                "I": () => f(49),
                                "J": () => f(52),
                                "K": () => f(53)
                                /* eslint-enable @typescript-eslint/naming-convention */
                            };

                            c.drawTileFromTwoDimensionalArray(
                                TwoDimensionalStringMapper.map([
                                    "GFGFGFGHIHKJKHIHKJKHIHKJKHIHKJKHIHKJKHIHKJKHIHKJKHIHGFGFGFGF",
                                    "FGFGFGFIHIJKJIHIJKJIHIJKJIHIJKJIHIJKJIHIJKJIHIJKJIHIFGFGFGFG",
                                    "GFGFGFGHIHKJKHIHKJKHIHKJKHIHKJKHIHKJKHIHKJKHIHKJKHIHGFGFGFGF",
                                    "FGFGFGFIHIJKJIHIJKJIHIJKJIHIJKJIHIJKJIHIJKJIHIJKJIHIFGFGFGFG"
                                ], converter), -2, -2
                            );
                        });
                    }))

                .withChild(instantiater.buildGameObject("wall")
                    .withComponent(CssCollideTilemapChunkRenderer, c => {
                        c.pointerEvents = false;

                        AsyncImageLoader.loadImageFromPath(SansFightRoomTileAtlas).then(tilemap3 => {
                            if (!c.exists) return;
                            
                            c.imageSources = [
                                new TileAtlasItem(tilemap3, 3, 20)
                            ];

                            const f = (a: number): { i: number; a: number; } => {
                                return { i: 0, a: a };
                            };

                            const converter = {
                                /* eslint-disable @typescript-eslint/naming-convention */
                                "W": () => f(56),
                                "X": () => f(50),
                                "Y": () => f(59),
                                "Z": () => f(40),
                                "A": () => f(51),
                                " ": () => null,
                                "B": () => f(44),
                                "C": () => f(42)
                                /* eslint-enable @typescript-eslint/naming-convention */
                            };

                            c.drawTileFromTwoDimensionalArray(
                                TwoDimensionalStringMapper.map([
                                    "WWWWWWW   XXX   XXX   XXX   XXX   XXX   XXX   XXX   WWWWWWWW",
                                    "WWWWWWWWXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXWWWWWWWW",
                                    "WWWWWWWWXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXWWWWWWWW",
                                    "WWWWWWWWXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXWWWWWWWW",
                                    "WWWWWWWWXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXWWWWWWWW",
                                    "YYYYYYYYZZAAAZZZAAAZZZAAAZZZAAAZZZAAAZZZAAAZZZAAAZZZWWWWWWWW"
                                ], converter), -2, 2
                            );

                            c.drawTileFromTwoDimensionalArray(
                                TwoDimensionalStringMapper.map([
                                    "      B   C B   C B   C B   C B   C B   C B   C B   C"
                                ], converter), -2, 7
                            );
                            
                            c.addCollider(-3, 1);
                            c.addCollider(-3, 0);
                            c.addCollider(-3, -1);
                            c.addCollider(-3, -2);
                            for (let i = -4; i < 58; i++) {
                                c.addCollider(i, -3);
                            }
                            c.addCollider(58, 1);
                            c.addCollider(58, 0);
                            c.addCollider(58, -1);
                            c.addCollider(58, -2);

                            [
                                {x: 5, y: 1},
                                {x: 11, y: 1},
                                {x: 17, y: 1},
                                {x: 23, y: 1},
                                {x: 29, y: 1},
                                {x: 35, y: 1},
                                {x: 41, y: 1},
                                {x: 47, y: 1}
                            ].forEach(p => {
                                c.drawTileFromTwoDimensionalArray([
                                    [f(0), f(1), f(2)],
                                    [f(3), f(4), f(5)],
                                    [f(6), f(7), f(8)],
                                    [f(9), f(10), f(11)],
                                    [f(12), f(13), f(14)],
                                    [f(15), f(16), f(17)]
                                ], p.x, p.y);
                            });

                            [
                                {x: 8, y: 3},
                                {x: 14, y: 3},
                                {x: 20, y: 3},
                                {x: 26, y: 3},
                                {x: 32, y: 3},
                                {x: 38, y: 3},
                                {x: 44, y: 3}
                            ].forEach(p => {
                                c.drawTileFromTwoDimensionalArray([
                                    [f(24), f(25), f(26)],
                                    [f(27), f(28), f(29)],
                                    [f(30), f(31), f(32)],
                                    [f(33), f(34), f(35)],
                                    [f(36), f(37), f(38)]
                                ], p.x, p.y);
                            });
                        });
                    })
                    .getComponent(CssCollideTilemapChunkRenderer, this._colideTilemapChunkRenderer)))

            .withChild(instantiater.buildGameObject("object_collide_map", new Vector3(0.5, 0.5, 0))
                //.active(false)
                .withComponent(GridObjectCollideMap, c => {
                    c.gridCellHeight = this._colideTilemapChunkRenderer.ref!.gridCellHeight;
                    c.gridCellWidth = this._colideTilemapChunkRenderer.ref!.gridCellWidth;
                })
                .getComponent(GridObjectCollideMap, this._gridObjectCollideMap))

            .withChild(instantiater.buildGameObject("objects")

                .withChild(instantiater.buildGameObject("iframe", new Vector3(0.5 + 51, 0.5, 0))
                    .withComponent(CssIframeRenderer, c => {
                        c.iframeSource = "https://www.youtube.com/embed/p9wmCeqB0eA";
                        c.width = 4 * 3;
                        c.height = 2.25 * 3;
                        c.viewScale = 0.01;
                        c.centerOffset = new Vector2(0, 0.5);
                    })
                    .withComponent(ZaxisSorter))

                .withChild(instantiater.buildGameObject("sans", new Vector3(39, -1, 0))
                    .withComponent(CssSpriteAtlasRenderer, c => {
                        c.asyncSetImageFromPath(SansBlack, 4, 4);
                        c.centerOffset = new Vector2(0.5, 0.7);
                        c.pointerEvents = true;
                        c.imageIndex = 12;
                        c.imageWidth = 1;
                        c.imageHeight = 1.375;
                        c.viewScale = 1;
                        c.renderMode = CssSpriteAtlasRenderMode.ObjectFit;
                    })
                    .withComponent(GridCollider, c => {
                        c.addCollider(0, 0);
                        c.gridObjectCollideMap = this._gridObjectCollideMap.ref!;
                    })
                    .withComponent(ZaxisSorter))

                .withChild(instantiater.buildGameObject("pillar", new Vector3(0.5 + 5, -2, 0))
                    //.active(false)
                    .withComponent(CssSpriteRenderer, c => {
                        c.asyncSetImageFromPath(Pillar);
                        c.centerOffset = new Vector2(0, 0.5);
                        c.pointerEvents = false;
                        c.imageWidth = 3.35;
                        c.imageHeight = 10;
                    })
                    .withComponent(ParallaxTranslater, c => {
                        c.offsetX = -0.7;
                        c.offsetY = 0;
                    })
                    .withComponent(CameraRelativeZaxisSorter, c => c.offset = -6))
                    
                .withChild(instantiater.buildGameObject("pillar", new Vector3(0.5 + 11, -2, 0))
                    //.active(false)
                    .withComponent(CssSpriteRenderer, c => {
                        c.asyncSetImageFromPath(Pillar);
                        c.centerOffset = new Vector2(0, 0.5);
                        c.pointerEvents = false;
                        c.imageWidth = 3.35;
                        c.imageHeight = 10;
                    })
                    .withComponent(ParallaxTranslater, c => {
                        c.offsetX = -0.7;
                        c.offsetY = 0;
                    })
                    .withComponent(CameraRelativeZaxisSorter, c => c.offset = -6))
                    
                .withChild(instantiater.buildGameObject("pillar", new Vector3(0.5 + 17, -2, 0))
                    //.active(false)
                    .withComponent(CssSpriteRenderer, c => {
                        c.asyncSetImageFromPath(Pillar);
                        c.centerOffset = new Vector2(0, 0.5);
                        c.pointerEvents = false;
                        c.imageWidth = 3.35;
                        c.imageHeight = 10;
                    })
                    .withComponent(ParallaxTranslater, c => {
                        c.offsetX = -0.7;
                        c.offsetY = 0;
                    })
                    .withComponent(CameraRelativeZaxisSorter, c => c.offset = -6))
                    
                .withChild(instantiater.buildGameObject("pillar", new Vector3(0.5 + 23, -2, 0))
                    //.active(false)
                    .withComponent(CssSpriteRenderer, c => {
                        c.asyncSetImageFromPath(Pillar);
                        c.centerOffset = new Vector2(0, 0.5);
                        c.pointerEvents = false;
                        c.imageWidth = 3.35;
                        c.imageHeight = 10;
                    })
                    .withComponent(ParallaxTranslater, c => {
                        c.offsetX = -0.7;
                        c.offsetY = 0;
                    })
                    .withComponent(CameraRelativeZaxisSorter, c => c.offset = -6))
                    
                .withChild(instantiater.buildGameObject("pillar", new Vector3(0.5 + 29, -2, 0))
                    //.active(false)
                    .withComponent(CssSpriteRenderer, c => {
                        c.asyncSetImageFromPath(Pillar);
                        c.centerOffset = new Vector2(0, 0.5);
                        c.pointerEvents = false;
                        c.imageWidth = 3.35;
                        c.imageHeight = 10;
                    })
                    .withComponent(ParallaxTranslater, c => {
                        c.offsetX = -0.7;
                        c.offsetY = 0;
                    })
                    .withComponent(CameraRelativeZaxisSorter, c => c.offset = -6))
                    
                .withChild(instantiater.buildGameObject("pillar", new Vector3(0.5 + 35, -2, 0))
                    //.active(false)
                    .withComponent(CssSpriteRenderer, c => {
                        c.asyncSetImageFromPath(Pillar);
                        c.centerOffset = new Vector2(0, 0.5);
                        c.pointerEvents = false;
                        c.imageWidth = 3.35;
                        c.imageHeight = 10;
                    })
                    .withComponent(ParallaxTranslater, c => {
                        c.offsetX = -0.7;
                        c.offsetY = 0;
                    })
                    .withComponent(CameraRelativeZaxisSorter, c => c.offset = -6))
                    
                .withChild(instantiater.buildGameObject("pillar", new Vector3(0.5 + 41, -2, 0))
                    //.active(false)
                    .withComponent(CssSpriteRenderer, c => {
                        c.asyncSetImageFromPath(Pillar);
                        c.centerOffset = new Vector2(0, 0.5);
                        c.pointerEvents = false;
                        c.imageWidth = 3.35;
                        c.imageHeight = 10;
                    })
                    .withComponent(ParallaxTranslater, c => {
                        c.offsetX = -0.7;
                        c.offsetY = 0;
                    })
                    .withComponent(CameraRelativeZaxisSorter, c => c.offset = -6))
                    
                .withChild(instantiater.buildGameObject("pillar", new Vector3(0.5 + 47, -2, 0))
                    .active(false)
                    .withComponent(CssSpriteRenderer, c => {
                        c.asyncSetImageFromPath(Pillar);
                        c.centerOffset = new Vector2(0, 0.5);
                        c.pointerEvents = false;
                        c.imageWidth = 3.35;
                        c.imageHeight = 10;
                    })
                    .withComponent(ParallaxTranslater, c => {
                        c.offsetX = -0.7;
                        c.offsetY = 0;
                    })
                    .withComponent(CameraRelativeZaxisSorter, c => c.offset = -6)));
    }
}
