import {
    AsyncImageLoader,
    CameraRelativeZaxisSorter,
    CssCollideTilemapChunkRenderer,
    CssTilemapChunkRenderer,
    GameObjectBuilder,
    Prefab,
    PrefabRef,
    TileAtlasItem
} from "the-world-engine";

import OverworldTileset from "../../image/Overworld_Tileset.png";
import { MakeIsland } from "../../script/MakeIsland";

export class IslandPrefab extends Prefab {
    private static readonly _islandList = [
        { width: 16, height: 6, topEntry: 1, bottomEntry: 2, x: -4, y: 3 },
        { width: 15, height: 8, topEntry: 8, bottomEntry: 3, x: -8, y: -9 }
    ];
    private _collideTilemap = new PrefabRef<CssCollideTilemapChunkRenderer>();

    public getCollideTilemap(ref: PrefabRef<CssCollideTilemapChunkRenderer>): this {
        this._collideTilemap = ref;
        return this;
    }

    public override make(): GameObjectBuilder {

        return this.gameObjectBuilder
            .withComponent(CameraRelativeZaxisSorter, c => {
                c.offset = -99;
            })
            .withComponent(CssCollideTilemapChunkRenderer, c => {
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
            .getComponent(CssCollideTilemapChunkRenderer, this._collideTilemap)
        ;
    }
}
