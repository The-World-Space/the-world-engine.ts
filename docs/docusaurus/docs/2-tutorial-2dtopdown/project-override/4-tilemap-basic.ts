import {
    AsyncImageLoader,
    Bootstrapper as BaseBootstrapper,
    Camera,
    CssTilemapChunkRenderer,
    EditorCameraController,
    EditorGridRenderer,
    SceneBuilder,
    TileAtlasItem,
    TwoDimensionalStringMapper
} from "the-world-engine";
import { Vector3 } from "three/src/Three";

import OverworldTileset from "../project/image/Overworld_Tileset.png";
import { BackgroundPrefab } from "../project/prefab/world/BackgroundPrefab";

export class Bootstrapper extends BaseBootstrapper {
    public override run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("background", new Vector3(0, 0, -1))
                .withComponent(CssTilemapChunkRenderer, c => {
                    c.chunkSize = 15;
                    c.tileResolutionX = 16;
                    c.tileResolutionY = 16;
    
                    AsyncImageLoader.loadImageFromPath(OverworldTileset).then(image => {
                        if (!c.exists) return;
    
                        c.imageSources = [ new TileAtlasItem(image, 18, 13) ];
                        c.drawTile(0, 0, 0, 24);
                    });
                }))

            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera, c => {
                    c.viewSize = 4;
                })
                .withComponent(EditorCameraController, c => {
                    c.mouseMoveButton = 0;
                    c.maxViewSize = 4;
                })
                .withComponent(EditorGridRenderer, c => {
                    c.renderWidth = 50;
                    c.renderHeight = 50;
                }))
        ;
    }
}

export class Bootstrapper2 extends BaseBootstrapper {
    public override run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("background", new Vector3(0, 0, -1))
                .withComponent(CssTilemapChunkRenderer, c => {
                    c.chunkSize = 15;
                    c.tileResolutionX = 16;
                    c.tileResolutionY = 16;
    
                    AsyncImageLoader.loadImageFromPath(OverworldTileset).then(image => {
                        if (!c.exists) return;
    
                        c.imageSources = [ new TileAtlasItem(image, 18, 13) ];
    
                        // const g = { i: 0, a: 24 };
    
                        // c.drawTileFromTwoDimensionalArray(
                        //     [
                        //         [g, g, g, g],
                        //         [g, g, g, g],
                        //         [g, g, g, g],
                        //         [g, g, g, g]
                        //     ],
                        //     0, 0
                        // );

                        c.drawTileFromTwoDimensionalArray(
                            TwoDimensionalStringMapper.map([
                                "gggg",
                                "gggg",
                                "gggg",
                                "gggg"
                            ], {
                                "g": () => ({ i: 0, a: 24 })
                            }),
                            0, 0
                        );
                    });
                }))

            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera, c => {
                    c.viewSize = 4;
                })
                .withComponent(EditorCameraController, c => {
                    c.mouseMoveButton = 0;
                    c.maxViewSize = 4;
                })
                .withComponent(EditorGridRenderer, c => {
                    c.renderWidth = 50;
                    c.renderHeight = 50;
                }))
        ;
    }
}

export class Bootstrapper3 extends BaseBootstrapper {
    public override run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("background", new Vector3(0, 0, -1))
                .withComponent(CssTilemapChunkRenderer, c => {
                    c.chunkSize = 15;
                    c.tileResolutionX = 16;
                    c.tileResolutionY = 16;
    
                    AsyncImageLoader.loadImageFromPath(OverworldTileset).then(image => {
                        if (!c.exists) return;
    
                        c.imageSources = [ new TileAtlasItem(image, 18, 13) ];

                        const grass = { i: 0 as const, a: 24 };
                        const planeSize = 51;

                        const array2d: { i: 0; a: number; }[][] = [];
                        for (let i = 0; i < planeSize; i++) {
                            array2d[i] = [];
                            for (let j = 0; j < planeSize; j++) {
                                array2d[i][j] = grass;
                            }
                        }

                        const planeSizeHalf = Math.floor(planeSize / 2);

                        c.drawTileFromTwoDimensionalArray(
                            array2d,
                            -planeSizeHalf, -planeSizeHalf
                        );
                    });
                }))

            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera, c => {
                    c.viewSize = 4;
                })
                .withComponent(EditorCameraController, c => {
                    c.mouseMoveButton = 0;
                    c.maxViewSize = 4;
                })
                .withComponent(EditorGridRenderer, c => {
                    c.renderWidth = 50;
                    c.renderHeight = 50;
                }))
        ;
    }
}

export class Bootstrapper4 extends BaseBootstrapper {
    public override run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildPrefab("background", BackgroundPrefab, new Vector3(0, 0, -1))
                .make())

            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera, c => {
                    c.viewSize = 4;
                })
                .withComponent(EditorCameraController, c => {
                    c.mouseMoveButton = 0;
                    c.maxViewSize = 4;
                })
                .withComponent(EditorGridRenderer, c => {
                    c.renderWidth = 50;
                    c.renderHeight = 50;
                }))
        ;
    }
}
