import {
    Bootstrapper as BaseBootstrapper,
    Camera,
    CssCollideTilemapChunkRenderer,
    CssHtmlElementRenderer,
    EditorCameraController,
    GameObject,
    GridCollideMap,
    GridCollider,
    GridObjectCollideMap,
    PrefabRef,
    SceneBuilder,
    TrackCameraController
} from "the-world-engine";
import { Vector3 } from "three/src/Three";

import { PlayerPrefab } from "../project/prefab/PlayerPrefab";
import { BackgroundPrefab } from "../project/prefab/world/BackgroundPrefab";
import { DetailPrefab } from "../project/prefab/world/DetailPrefab";
import { IslandPrefab } from "../project/prefab/world/IslandPrefab";

export class Bootstrapper extends BaseBootstrapper {
    public override run(): SceneBuilder {
        const instantiater = this.instantiater;

        const player = new PrefabRef<GameObject>();
        const collideMap = new PrefabRef<GridCollideMap>();
        const collideTilemap = new PrefabRef<CssCollideTilemapChunkRenderer>();
        const collideTilemap2 = new PrefabRef<CssCollideTilemapChunkRenderer>();

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("tilemap")
                .withChild(instantiater.buildPrefab("background", BackgroundPrefab, new Vector3(0, 0, -3))
                    .make())

                .withChild(instantiater.buildPrefab("islands", IslandPrefab, new Vector3(0, 0, -2))
                    .getCollideTilemap(collideTilemap).make())
                    
                .withChild(instantiater.buildPrefab("detail", DetailPrefab, new Vector3(0, 0, -1))
                    .getCollideTilemap(collideTilemap2).make()))

            .withChild(instantiater.buildGameObject("collision")
                .withComponent(GridCollideMap, c => {
                    c.showCollider = false;

                    const range = 13;

                    for (let i = -range; i <= range; i++) {
                        c.addCollider(range, i);
                        c.addCollider(i, range);
                        c.addCollider(-range, i);
                        c.addCollider(i, -range);
                    }
                })
                .getComponent(GridCollideMap, collideMap))

            .withChild(instantiater.buildPrefab("player", PlayerPrefab)
                .withCollideMap(collideMap)
                .withCollideMap(collideTilemap)
                .withCollideMap(collideTilemap2)
                .make()
                .getGameObject(player))

            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera, c => {
                    c.viewSize = 4;
                })
                .withComponent(EditorCameraController, c => {
                    c.mouseMoveButton = 0;
                    c.minViewSize = 4;
                    c.maxViewSize = 4;
                })
                .withComponent(TrackCameraController, c => {
                    c.setTrackTarget(player.ref!);
                }))
        ;
    }
}

export class Bootstrapper2 extends BaseBootstrapper {
    public override run(): SceneBuilder {
        const instantiater = this.instantiater;

        const player = new PrefabRef<GameObject>();
        const collideMap = new PrefabRef<GridCollideMap>();
        const objectCollideMap = new PrefabRef<GridObjectCollideMap>();
        const collideTilemap = new PrefabRef<CssCollideTilemapChunkRenderer>();
        const collideTilemap2 = new PrefabRef<CssCollideTilemapChunkRenderer>();

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("tilemap")
                .withChild(instantiater.buildPrefab("background", BackgroundPrefab, new Vector3(0, 0, -3))
                    .make())

                .withChild(instantiater.buildPrefab("islands", IslandPrefab, new Vector3(0, 0, -2))
                    .getCollideTilemap(collideTilemap).make())
                    
                .withChild(instantiater.buildPrefab("detail", DetailPrefab, new Vector3(0, 0, -1))
                    .getCollideTilemap(collideTilemap2).make()))

            .withChild(instantiater.buildGameObject("collision")
                .withComponent(GridCollideMap, c => {
                    c.showCollider = false;

                    const range = 13;

                    for (let i = -range; i <= range; i++) {
                        c.addCollider(range, i);
                        c.addCollider(i, range);
                        c.addCollider(-range, i);
                        c.addCollider(i, -range);
                    }
                })
                .withComponent(GridObjectCollideMap, c => {
                    c.showCollider = true;
                })
                .getComponent(GridCollideMap, collideMap)
                .getComponent(GridObjectCollideMap, objectCollideMap))

            .withChild(instantiater.buildGameObject("test-object", new Vector3(2, 1, 0))
                .withComponent(CssHtmlElementRenderer, c => {
                    const div = document.createElement("div");
                    div.style.backgroundColor = "red";
                    c.element = div;
                })
                .withComponent(GridCollider, c => {
                    c.gridObjectCollideMap = objectCollideMap.ref!;
                    c.addCollider(0, 0);
                }))

            .withChild(instantiater.buildPrefab("player", PlayerPrefab)
                .withCollideMap(collideMap)
                .withCollideMap(objectCollideMap)
                .withCollideMap(collideTilemap)
                .withCollideMap(collideTilemap2)
                .make()
                .getGameObject(player))

            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera, c => {
                    c.viewSize = 4;
                })
                .withComponent(EditorCameraController, c => {
                    c.mouseMoveButton = 0;
                    c.minViewSize = 4;
                    c.maxViewSize = 4;
                })
                .withComponent(TrackCameraController, c => {
                    c.setTrackTarget(player.ref!);
                }))
        ;
    }
}
