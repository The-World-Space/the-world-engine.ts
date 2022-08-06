# Make Them Into Prefab

Prefab is a feature created **based on the design of [Prefab of Unity](https://docs.unity3d.com/2022.1/Documentation/Manual/Prefabs.html)**.

However, in fact, the use of prefab itself **is similar to the React component**.

After you put the content to build the game object in the prefab, you can build the prefab from the bootstrapper.

Of course, you can dynamically add prefabs to a scene, but we won't cover it here.

## Our problem

So far, the bootstrapper's code has become huge while building a tile map.
At this rate, it will be very difficult to manage the code.

## Make Tilemap Into Prefab

So let's make the tile map building process into a prefab.

### Make Background Prefab

```typescript title="src/asset/prefab/world/BacgroundPrefab.ts"
import {
    AsyncImageLoader,
    CssTilemapChunkRenderer,
    GameObjectBuilder,
    Prefab,
    PrefabRef,
    TileAtlasItem
} from "the-world-engine";

import OverworldTileset from "../../image/Overworld_Tileset.png";

export class BackgroundPrefab extends Prefab {
    private _planeSize: PrefabRef<number>|null = null;

    public withPlaneSize(value: PrefabRef<number>): this {
        this._planeSize = value;
        return this;
    }

    public override make(): GameObjectBuilder {

        return this.gameObjectBuilder
            .withComponent(CssTilemapChunkRenderer, c => {
                c.chunkSize = 15;
                c.filter.brightness = 1.5;
                c.tileResolutionX = 16;
                c.tileResolutionY = 16;

                AsyncImageLoader.loadImageFromPath(OverworldTileset).then(image => {
                    if (!c.exists) return;

                    c.imageSources = [ new TileAtlasItem(image, 18, 13) ];

                    const grass = { i: 0 as const, a: 24 };
                    const planeSize = this._planeSize?.ref ?? 51;

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
            })
        ;
    }
}
```

First, I changed the background layer to prefab.

How to create a prefab is simple. You can implement the `make` method after inheriting the Prefab class.

use `PrefabRef` to export or import values from the prefab.
In the case of this code, the plane size can be specified from the outside through the `withPlaneSize` method.

### Make Island Prefab

```typescript title="src/asset/prefab/world/IslandPrefab.ts"
import {
    AsyncImageLoader,
    CssTilemapChunkRenderer,
    GameObjectBuilder,
    Prefab,
    TileAtlasItem
} from "the-world-engine";

import OverworldTileset from "../../image/Overworld_Tileset.png";
import { MakeIsland } from "../../script/MakeIsland";

export class IslandPrefab extends Prefab {
    private static readonly _islandList = [
        { width: 16, height: 6, topEntry: 1, bottomEntry: 2, x: -4, y: 3 },
        { width: 15, height: 8, topEntry: 8, bottomEntry: 3, x: -8, y: -9 }
    ];

    public override make(): GameObjectBuilder {

        return this.gameObjectBuilder
            .withComponent(CssTilemapChunkRenderer, c => {
                c.chunkSize = 15;
                c.filter.brightness = 1.5;
                c.tileResolutionX = 16;
                c.tileResolutionY = 16;

                AsyncImageLoader.loadImageFromPath(OverworldTileset).then(image => {
                    if (!c.exists) return;

                    c.imageSources = [ new TileAtlasItem(image, 18, 13) ];

                    for (const island of IslandPrefab._islandList) {
                        c.drawTileFromTwoDimensionalArray(
                            MakeIsland.make(island.width, island.height, island.topEntry, island.bottomEntry),
                            island.x, island.y
                        );
                    }
                });
            })
            .withComponent(CssTilemapChunkRenderer, c => {
                c.chunkSize = 15;
                c.filter.brightness = 1.5;
                c.tileResolutionX = 16;
                c.tileResolutionY = 16;

                const topEntry = 6;
                const bottomEntry = 42;

                AsyncImageLoader.loadImageFromPath(OverworldTileset).then(image => {
                    if (!c.exists) return;

                    c.imageSources = [ new TileAtlasItem(image, 18, 13) ];

                    for (const island of IslandPrefab._islandList) {
                        const entry = MakeIsland.computeEntryPosition(
                            island.height, island.topEntry, island.bottomEntry, island.x, island.y);

                        if (entry.top) c.drawTile(entry.top.x, entry.top.y, 0, topEntry);
                        if (entry.bottom) c.drawTile(entry.bottom.x, entry.bottom.y, 0, bottomEntry);
                    }
                });
            })
        ;
    }
}
```

you can separate the scope of the code by creating a prefab. in this case, `islandList` is become to private static variable.

### Make Detail Prefab

```typescript title="src/asset/prefab/world/DetailPrefab.ts"
import {
    AsyncImageLoader,
    CssTilemapChunkRenderer,
    GameObjectBuilder,
    Prefab,
    PrefabRef,
    TileAtlasItem,
    TwoDimensionalStringMapper
} from "the-world-engine";

import OverworldTileset from "../../image/Overworld_Tileset.png";

export class DetailPrefab extends Prefab {
    public override make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(CssTilemapChunkRenderer, c => {
                c.chunkSize = 15;
                c.filter.brightness = 1.5;
                c.tileResolutionX = 16;
                c.tileResolutionY = 16;

                AsyncImageLoader.loadImageFromPath(OverworldTileset).then(image => {
                    if (!c.exists) return;

                    c.imageSources = [ new TileAtlasItem(image, 18, 13) ];

                    function f(a: number): { i: 0; a: number; } {
                        return { i: 0, a: a };
                    }

                    const converter = {
                        //rock
                        "o": () => f(93),
                        "O": () => f(94),
                        //sign
                        "#": () => f(61),
                        //stump
                        "@": () => f(75),
                        "$": () => f(76),
                        //bush
                        "*": () => f(58),
                        "^": () => f(59),

                        " ": () => null
                    };

                    c.drawTileFromTwoDimensionalArray(
                        TwoDimensionalStringMapper.map(
                            [
                                "              ",
                                "   $          ",
                                "    #         ",
                                "              ",
                                "              "
                            ],
                            converter
                        ),
                        -3, 4
                    );
                    
                    c.drawTileFromTwoDimensionalArray(
                        TwoDimensionalStringMapper.map(
                            [
                                "             ",
                                "          o  ",
                                "         @   ",
                                "     #       ",
                                "             ",
                                "             ",
                                "O            "
                            ],
                            converter
                        ),
                        -7, -8
                    );
                });
            })
            .withComponent(CssTilemapChunkRenderer, c => {
                c.chunkSize = 15;
                c.filter.brightness = 1.5;
                c.tileResolutionX = 16;
                c.tileResolutionY = 16;

                AsyncImageLoader.loadImageFromPath(OverworldTileset).then(image => {
                    if (!c.exists) return;

                    c.imageSources = [ new TileAtlasItem(image, 18, 13) ];

                    function f(a: number): { i: 0; a: number; } {
                        return { i: 0, a: a };
                    }

                    const roadConverter = {
                        "ㅡ": () => f(47),
                        "ㅣ": () => f(46),
                        "ㅕ": () => f(11),
                        "ㅑ": () => f(29),
                        "ㅏ": () => f(44),
                        "ㅓ": () => f(45),
                        "ㅗ": () => f(62),
                        "ㅜ": () => f(63),
                        "ㄱ": () => f(8),
                        "ㄴ": () => f(26),
                        "ㄲ": () => f(9),
                        "ㄹ": () => f(27),
                        "ㅛ": () => f(28),
                        "ㅠ": () => f(10),
                        "ㅇ": () => null
                    };

                    c.drawTileFromTwoDimensionalArray(
                        TwoDimensionalStringMapper.map(
                            [
                                "ㅠ",
                                "ㄴㄱ",
                                "ㅇㅏㅡㅡㅡㅡㅡㅕ",
                                "ㅇㅛ"
                            ],
                            roadConverter
                        ),
                        -3, 4
                    );

                    c.drawTileFromTwoDimensionalArray(
                        TwoDimensionalStringMapper.map(
                            [
                                "ㅇㅇㅇㅇㅇㅇㅠ",
                                "ㅇㅇㅇㅇㅇㅇㅣ",
                                "ㅑㅡㅡㅡㅡㅡㅗㅡㅜㅡㅡㅡㅡㅡㅡㅕ",
                                "ㅇㅇㅇㅇㅇㅇㅇㅇㅛ"
                            ],
                            roadConverter
                        ),
                        -8, -1
                    );

                    c.drawTileFromTwoDimensionalArray(
                        TwoDimensionalStringMapper.map(
                            [
                                "ㅇㅇㅇㅇㅇㅠ",
                                "ㅇㅇㅇㅇㅇㅣ",
                                "ㅇㅇㅇㅇㅇㅣ",
                                "ㄲㅡㅡㅡㅡㄹ",
                                "ㅣㅇㅇㅇㅇㅇ",
                                "ㅛㅇㅇㅇㅇㅇ"
                            ],
                            roadConverter
                        ),
                        -5, -8
                    );

                    c.drawTileFromTwoDimensionalArray(
                        TwoDimensionalStringMapper.map(
                            [
                                "ㅠ",
                                "ㅣ",
                                "ㅣ",
                                "ㅣ",
                                "ㅣ",
                                "ㅛㅇㅇㅇㅇㅇ"
                            ],
                            roadConverter
                        ),
                        -5, -15
                    );

                    const foliageConverter = {
                        //grass
                        "^": () => f(56),
                        "%": () => f(57),
                        //flower
                        "*": () => f(72),
                        "&": () => f(73),
                        "!": () => f(90),
                        "~": () => f(91),
                        //rock
                        "o": () => f(74),
                        "O": () => f(92),

                        " ": () => null
                    };
                    
                    c.drawTileFromTwoDimensionalArray(
                        TwoDimensionalStringMapper.map(
                            [
                                "     ^",
                                "",
                                "^ %  ~*"
                            ],
                            foliageConverter
                        ),
                        3, 4
                    );

                    c.drawTileFromTwoDimensionalArray(
                        TwoDimensionalStringMapper.map(
                            [
                                "O%    ^",
                                " ^",
                                "",
                                "^  %"
                            ],
                            foliageConverter
                        ),
                        1, -1
                    );

                    c.drawTileFromTwoDimensionalArray(
                        TwoDimensionalStringMapper.map(
                            [
                                "%     ^",
                                " ",
                                "      *~",
                                "    % !~",
                                "     !**",
                                "o   !**~"
                            ],
                            foliageConverter
                        ),
                        -2, -8
                    );
                });
            })
        ;
    }    
}
```

## Build Prefab

All you have to do is add a prefab to the bootstrapper.

```typescript title="src/asset/Bootstrapper.ts"
export class Bootstrapper extends BaseBootstrapper {
    public override run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("tilemap")
                .withChild(instantiater.buildPrefab("background", BackgroundPrefab, new Vector3(0, 0, -3))
                    .make())

                .withChild(instantiater.buildPrefab("islands", IslandPrefab, new Vector3(0, 0, -2))
                    .make())
                    
                .withChild(instantiater.buildPrefab("detail", DetailPrefab, new Vector3(0, 0, -1))
                    .make()))

            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera)
                .withComponent(EditorCameraController, c => {
                    c.mouseMoveButton = 0;
                })
                .withComponent(EditorGridRenderer, c => {
                    c.renderWidth = 50;
                    c.renderHeight = 50;
                }))
        ;
    }
}
```

Looking good. From now on, We will build gameObject as possible as we can.

:::tip
Making a prefab is quite cumbersome, so if you make a prototype quickly, you don't have to make a prefab.

If you need to clean up the scene later, you can make a prefab.
:::
