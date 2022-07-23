import { Bootstrapper } from "@src/engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "@src/engine/bootstrap/SceneBuilder";
import { Component } from "@src/engine/hierarchy_object/Component";
import { GameObject } from "@src/engine/hierarchy_object/GameObject";
import { PrefabRef } from "@src/engine/hierarchy_object/PrefabRef";
import { Color } from "@src/engine/render/Color";
import { EditorCameraController } from "@src/engine/script/controller/EditorCameraController";
import { MovementAnimationController } from "@src/engine/script/controller/MovementAnimationController";
import { PlayerGridMovementController } from "@src/engine/script/controller/PlayerGridMovementController";
import { TrackCameraController } from "@src/engine/script/controller/TrackCameraController";
import { GridCollideMap } from "@src/engine/script/grid_physics2d/GridCollideMap";
import { GridObjectCollideMap } from "@src/engine/script/grid_physics2d/GridObjectCollideMap";
import { TwoDimensionalStringMapper } from "@src/engine/script/helper/TwoDimensionalStringMapper";
import { GridPointer } from "@src/engine/script/input/GridPointer";
import { PointerGridInputListener } from "@src/engine/script/input/PointerGridInputListener";
import { CssTilemapChunkRenderer } from "@src/engine/script/post_render/CssTilemapChunkRenderer";
import { SpriteAtlasAnimator } from "@src/engine/script/post_render/SpriteAtlasAnimator";
import { Camera } from "@src/engine/script/render/Camera";
import { CameraRelativeZaxisSorter } from "@src/engine/script/render/CameraRelativeZaxisSorter";
import { CssIframeRenderer } from "@src/engine/script/render/CssIframeRenderer";
import { CssSpriteAtlasRenderer } from "@src/engine/script/render/CssSpriteAtlasRenderer";
import { TileAtlasItem } from "@src/engine/script/render/CssTilemapRenderer";
import { ZaxisSorter } from "@src/engine/script/render/ZaxisSorter";
import { Vector2, Vector3 } from "three/src/Three";

/** @internal */
export class Topdown2dTestBootstrapper extends Bootstrapper {
    public override run(): SceneBuilder {
        const instantiater = this.instantiater;

        const gridCellSize = 1;
        const gridPointer = new PrefabRef<GridPointer>();
        const gridCollideMap = new PrefabRef<GridCollideMap>();
        const gridObjectCollideMap = new PrefabRef<GridObjectCollideMap>();
        const player = new PrefabRef<GameObject>();
        
        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera", new Vector3(0, 0, 10))
                .withComponent(Camera, c => {
                    c.backgroundColor = new Color(0.5, 0.5, 0.5);
                })
                .withComponent(EditorCameraController, c => c.enabled = true)
                .withComponent(TrackCameraController, c => {
                    c.enabled = false;
                    if (player.ref) c.setTrackTarget(player.ref);
                }))

            .withChild(instantiater.buildGameObject("cursor")
                .withComponent(CameraRelativeZaxisSorter, c => {
                    c.offset = -100;
                })
                .withComponent(PointerGridInputListener, c => {
                    c.gridCellHeight = gridCellSize;
                    c.gridCellWidth = gridCellSize;
                    c.viewScale = 0.01;
                })
                .withComponent(GridPointer)
                .getComponent(GridPointer, gridPointer))

            
            .withChild(instantiater.buildGameObject("world")
                .withComponent(CameraRelativeZaxisSorter, c => {
                    c.offset = -200;
                })

                .withChild(instantiater.buildGameObject("collide-map")
                    .withComponent(GridCollideMap, c => {
                        c.gridCellWidth = gridCellSize;
                        c.gridCellHeight = gridCellSize;
                        c.showCollider = true;

                        c.addColliderFromTwoDimensionalArray([
                            [1, 1]
                        ], 0, 0);
                    })
                    .getComponent(GridCollideMap, gridCollideMap))
                
                .withChild(instantiater.buildGameObject("object-collide-map")
                    .withComponent(GridObjectCollideMap, c => {
                        c.gridCellHeight = gridCellSize;
                        c.gridCellWidth = gridCellSize;
                        c.showCollider = true;
                    })
                    .getComponent(GridObjectCollideMap, gridObjectCollideMap))

                .withChild(instantiater.buildGameObject("tile-map", new Vector3(gridCellSize * 0.5, gridCellSize * 0.5, 0))
                    .withComponent(CssTilemapChunkRenderer, c => {
                        c.gridCellHeight = gridCellSize;
                        c.gridCellWidth = gridCellSize;

                        c.chunkSize = 16;
                        c.tileResolutionX = 64;
                        c.tileResolutionY = 64;

                        const image = new Image();
                        image.src = "https://raw.githubusercontent.com/GDQuest/krita-tileset-templates/master/template-assets/tileset.png";

                        image.onload = (): void => {
                            c.imageSources = [ new TileAtlasItem(image, 8, 8) ];

                            const t = (index: number): { i: 0, a: number } => {
                                return { i: 0, a: index };
                            };

                            const converter = {
                                /* eslint-disable @typescript-eslint/naming-convention */
                                "1": () => t(0), "2": () => t(1), "3": () => t(2),
                                "7": () => t(3), "8": () => t(4), "9": () => t(5),
                                "0": () => t(6), " ": () => t(7), "q": () => t(8),
                                "w": () => t(9), "e": () => t(10), "u": () => t(11),
                                "i": () => t(12), "o": () => t(13), "p": () => t(14),
                                "a": () => t(16), "s": () => t(17), "d": () => t(18),
                                "j": () => t(19), "k": () => t(20), "l": () => t(21),
                                "4": () => t(24), "5": () => t(25), "6": () => t(26),
                                "m": () => t(27), ",": () => t(28), "r": () => t(32),
                                "t": () => t(33), "y": () => t(34), ".": () => t(35),
                                "f": () => t(40), "g": () => t(41), "h": () => t(42),
                                "v": () => t(48), "b": () => t(49), "n": () => t(50)
                                /* eslint-enable @typescript-eslint/naming-convention */
                            };

                            /*
                                "1237890 ",
                                "qweuiop ",
                                "asdjkl  ",
                                "456m,   ",
                                "rty.    ",
                                "fgh     ",
                                "vbn     "
                            */
                            c.drawTileFromTwoDimensionalArray(
                                TwoDimensionalStringMapper.map([
                                    "12222223",
                                    "qwwwwwwe",
                                    "assssssd"
                                ], converter), -4, -4
                            );
                        };
                    })
                )
            )

            .withChild(instantiater.buildGameObject("player")
                .withComponent(CssSpriteAtlasRenderer, c => {
                    c.asyncSetImageFromPath(
                        "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b6a35565-210f-476d-b139-ed3e879dab25/d2gj3yy-a3f09625-84c4-4ef7-b479-38a4f5631a65.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2I2YTM1NTY1LTIxMGYtNDc2ZC1iMTM5LWVkM2U4NzlkYWIyNVwvZDJnajN5eS1hM2YwOTYyNS04NGM0LTRlZjctYjQ3OS0zOGE0ZjU2MzFhNjUucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.E1u4UOfOATX-6M_AILzEDOed19UnpbEK4rLkUUMVfgE",
                        8, 12
                    );
                    c.imageIndex = 0;

                    c.imageWidth = 1;
                    c.imageHeight = 1;
                    c.viewScale = 1;
                })
                .withComponent(SpriteAtlasAnimator, c => {
                    c.addAnimation("down_idle", [ 1 ]);
                    c.addAnimation("up_idle", [ 37 ]);
                    c.addAnimation("left_idle", [ 13 ]);
                    c.addAnimation("right_idle", [ 25 ]);
                    c.addAnimation("down_walk", [ 0, 1, 2, 1 ]);
                    c.addAnimation("up_walk", [ 36, 37, 38, 37 ]);
                    c.addAnimation("left_walk", [ 12, 13, 14, 13 ]);
                    c.addAnimation("right_walk", [ 24, 25, 26, 25 ]);

                    c.frameDuration = 0.1;
                })
                .withComponent(PlayerGridMovementController, c => {
                    c.gridCellWidth = gridCellSize;
                    c.gridCellHeight = gridCellSize;

                    c.speed = 6;
                    c.gridPointer = gridPointer.ref;

                    if (gridCollideMap.ref) c.addCollideMap(gridCollideMap.ref);
                    if (gridObjectCollideMap.ref) c.addCollideMap(gridObjectCollideMap.ref);
                })
                .withComponent(MovementAnimationController)
                .withComponent(ZaxisSorter, c => {
                    c.runOnce = false;
                })
                .getGameObject(player)
            )

            .withChild(instantiater.buildGameObject("iframe", new Vector3(0.5 + 1, 0.5, 0))
                .withComponent(CssIframeRenderer, c => {
                    c.iframeSource = "https://www.youtube.com/embed/p9wmCeqB0eA";
                    c.width = 4 * 2;
                    c.height = 2.25 * 2;
                    c.viewScale = 0.01;
                    c.centerOffset = new Vector2(0, 0.5);
                })
                .withComponent(ZaxisSorter))

            .withChild(instantiater.buildGameObject("test-object")
                .withComponent(class StartInvoke extends Component {
                    public start(): void {
                        // do something
                    }
                }))
        ;
    }
}
