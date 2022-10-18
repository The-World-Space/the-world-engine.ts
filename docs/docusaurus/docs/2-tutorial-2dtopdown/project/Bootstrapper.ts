import {
    Bootstrapper as BaseBootstrapper,
    CameraRelativeZaxisSorter,
    CssCollideTilemapChunkRenderer,
    GameObject,
    GridCollideMap,
    GridEventMap,
    GridObjectCollideMap,
    GridPointer,
    PointerGridInputListener,
    PrefabRef,
    SceneBuilder
} from "the-world-engine";
import {
    Vector3
} from "three/src/Three";

import { CameraPrefab } from "./prefab/CameraPrefab";
import { PlayerPrefab } from "./prefab/PlayerPrefab";
import { BackgroundPrefab } from "./prefab/world/BackgroundPrefab";
import { CollisionPrefab } from "./prefab/world/CollisionPrefab";
import { DetailPrefab } from "./prefab/world/DetailPrefab";
import { IslandPrefab } from "./prefab/world/IslandPrefab";
import { ObjectsPrefab } from "./prefab/world/ObjectsPrefab";
import { DialogController } from "./script/DialogController";
import { FontLoader } from "./script/FontLoader";

export class Bootstrapper extends BaseBootstrapper {
    public override run(): SceneBuilder {
        const instantiater = this.instantiater;

        const player = new PrefabRef<GameObject>();
        const collideMap = new PrefabRef<GridCollideMap>();
        const objectCollideMap = new PrefabRef<GridObjectCollideMap>();
        const collideTilemap = new PrefabRef<CssCollideTilemapChunkRenderer>();
        const collideTilemap2 = new PrefabRef<CssCollideTilemapChunkRenderer>();
        const gridEventMap = new PrefabRef<GridEventMap>();
        const pointer = new PrefabRef<GridPointer>();
        const dialogController = new PrefabRef<DialogController>();

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("world")
                .withChild(instantiater.buildGameObject("tilemap")
                    .withChild(instantiater.buildPrefab("background", BackgroundPrefab).make())

                    .withChild(instantiater.buildPrefab("islands", IslandPrefab)
                        .getCollideTilemap(collideTilemap).make())

                    .withChild(instantiater.buildPrefab("detail", DetailPrefab)
                        .getCollideTilemap(collideTilemap2).make()))

                .withChild(instantiater.buildPrefab("collision", CollisionPrefab)
                    .getCollideMap(collideMap)
                    .getObjectCollideMap(objectCollideMap)
                    .make())
                
                .withChild(instantiater.buildGameObject("event")
                    .withComponent(GridEventMap, c => {
                        c.showEvents = false;
                        c.addEvent(0, -2, () => {
                            if (dialogController.ref) dialogController.ref.showMessage("Press E to interact with the object.");
                        });

                        c.addEvent(-2, -5, () => {
                            if (dialogController.ref) dialogController.ref.showMessage("john's house");
                        });

                        c.addEvent(-4, -4, () => {
                            if (dialogController.ref) dialogController.ref.showMessage("door is locked");
                        });

                        c.addEvent(2, -4, () => {
                            if (dialogController.ref) dialogController.ref.showMessage("a stump");
                        });

                        c.addEvent(4, 1, () => {
                            if (dialogController.ref) dialogController.ref.showMessage("The campfire is warm");
                        });

                        c.addEvent(1, 6, () => {
                            if (dialogController.ref) dialogController.ref.showMessage("Lorem ipsum dolor sit amet, consectetur adipiscing elit,");
                        });

                        c.addEvent(4, 7, () => {
                            if (dialogController.ref) dialogController.ref.showMessage("door is locked");
                        });
                    })
                    .getComponent(GridEventMap, gridEventMap))
                    
                .withChild(instantiater.buildPrefab("objects", ObjectsPrefab)
                    .withObjectCollideMap(objectCollideMap).make()))

            .withChild(instantiater.buildPrefab("player", PlayerPrefab)
                .withCollideMap(collideMap)
                .withCollideMap(objectCollideMap)
                .withCollideMap(collideTilemap)
                .withCollideMap(collideTilemap2)
                .withGridEventMap(gridEventMap)
                .withGridPointer(pointer)
                .make()
                .getGameObject(player))

            .withChild(instantiater.buildGameObject("pointer")
                .withComponent(PointerGridInputListener)
                .withComponent(GridPointer)
                .withComponent(CameraRelativeZaxisSorter, c => {
                    c.offset = 0;
                })
                .getComponent(GridPointer, pointer))
                
            .withChild(instantiater.buildPrefab("camera", CameraPrefab, new Vector3(0, 0, 10))
                .withTarget(player)
                .getDialogController(dialogController)
                .make())

            .withChild(instantiater.buildGameObject("font-loader")
                .withComponent(FontLoader))
        ;
    }
}
