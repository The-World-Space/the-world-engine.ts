import {
    AsyncImageLoader,
    CameraRelativeZaxisSorter,
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
            .withComponent(CameraRelativeZaxisSorter, c => {
                c.offset = -100;
            })
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
