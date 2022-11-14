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
import { CampfirePrefab } from "../project/prefab/object/CampfirePrefab";
import { House1Prefab } from "../project/prefab/object/House1Prefab";
import { House2Prefab } from "../project/prefab/object/House2Prefab";
import { Tree1Prefab } from "../project/prefab/object/Tree1Prefab";
import { Tree2Prefab } from "../project/prefab/object/Tree2Prefab";

import { PlayerPrefab } from "../project/prefab/PlayerPrefab";
import { BackgroundPrefab } from "../project/prefab/world/BackgroundPrefab";
import { DetailPrefab } from "../project/prefab/world/DetailPrefab";
import { IslandPrefab } from "../project/prefab/world/IslandPrefab";

export class Bootstrapper extends BaseBootstrapper<{option2?: boolean, option3?: boolean, option4?: boolean, option5?: boolean}> {
    public override run(): SceneBuilder {
        const instantiater = this.instantiater;

        const player = new PrefabRef<GameObject>();
        const collideMap = new PrefabRef<GridCollideMap>();
        const objectCollideMap = new PrefabRef<GridObjectCollideMap>();
        const collideTilemap = new PrefabRef<CssCollideTilemapChunkRenderer>();
        const collideTilemap2 = new PrefabRef<CssCollideTilemapChunkRenderer>();

        const option2 = this.interopObject?.option2 ?? false;
        const option3 = this.interopObject?.option3 ?? false;
        const option4 = this.interopObject?.option4 ?? false;
        const option5 = this.interopObject?.option5 ?? false;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("tilemap")
                .withChild(instantiater.buildPrefab("background", BackgroundPrefab)
                    .make())

                .withChild(instantiater.buildPrefab("islands", IslandPrefab)
                    .getCollideTilemap(collideTilemap).make())
                    
                .withChild(instantiater.buildPrefab("detail", DetailPrefab)
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
                    c.showCollider = !option5;
                })
                .getComponent(GridCollideMap, collideMap)
                .getComponent(GridObjectCollideMap, objectCollideMap))

            .withChild(instantiater.buildPrefab("tree1", Tree1Prefab, new Vector3(0, 2, 0))
                .withObjectCollideMap(objectCollideMap).make())

            .withChild(instantiater.buildPrefab("tree1", Tree1Prefab, new Vector3(-5, 2, 0))
                .withObjectCollideMap(objectCollideMap).make())

            .withChild(instantiater.buildPrefab("tree1", Tree1Prefab, new Vector3(-7, 3, 0))
                .withObjectCollideMap(objectCollideMap).make())
                
            .withChild(instantiater.buildPrefab("tree2", Tree2Prefab, new Vector3(2, -1, 0))
                .withObjectCollideMap(objectCollideMap).make()
                .active(option2))

            .withChild(instantiater.buildPrefab("tree2", Tree2Prefab, new Vector3(9, 7, 0))
                .withObjectCollideMap(objectCollideMap).make()
                .active(option2))
            
            .withChild(instantiater.buildPrefab("tree2", Tree2Prefab, new Vector3(10, 6, 0))
                .withObjectCollideMap(objectCollideMap).make()
                .active(option2))

            .withChild(instantiater.buildPrefab("house1", House1Prefab, new Vector3(5, 6, 0))
                .withObjectCollideMap(objectCollideMap).make()
                .active(option2))
            
            .withChild(instantiater.buildPrefab("house2", House2Prefab, new Vector3(-5, -5, 0))
                .withObjectCollideMap(objectCollideMap).make()
                .active(option3))
                
            .withChild(instantiater.buildPrefab("campfire", CampfirePrefab, new Vector3(4, 1, 0))
                .withObjectCollideMap(objectCollideMap).make()
                .active(option4))

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
