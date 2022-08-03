import {
    AsyncImageLoader,
    CameraRelativeZaxisSorter,
    CssCollideTilemapChunkRenderer,
    CssTilemapChunkRenderer,
    GameObjectBuilder,
    Prefab,
    PrefabRef,
    TileAtlasItem,
    TwoDimensionalStringMapper
} from "the-world-engine";

import OverworldTileset from "../../image/Overworld_Tileset.png";

export class DetailPrefab extends Prefab {
    private _collideTilemap = new PrefabRef<CssCollideTilemapChunkRenderer>();

    public getCollideTilemap(ref: PrefabRef<CssCollideTilemapChunkRenderer>): this {
        this._collideTilemap = ref;
        return this;
    }

    public override make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(CameraRelativeZaxisSorter, c => {
                c.offset = -98;
            })
            .withComponent(CssCollideTilemapChunkRenderer, c => {
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
                        /* eslint-disable @typescript-eslint/naming-convention */
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
                        /* eslint-enable @typescript-eslint/naming-convention */
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
                        /* eslint-disable @typescript-eslint/naming-convention */
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
                        /* eslint-enable @typescript-eslint/naming-convention */
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
                        /* eslint-disable @typescript-eslint/naming-convention */
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
                        /* eslint-enable @typescript-eslint/naming-convention */
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
            .getComponent(CssCollideTilemapChunkRenderer, this._collideTilemap)
        ;
    }    
}
