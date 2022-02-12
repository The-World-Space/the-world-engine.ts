import { Vector3 } from "three";
import { Camera, Color, CssCollideTilemapChunkRenderer, CssSpriteRenderer, EditorCameraController, EditorGridRenderer, GameObject, PlayerGridMovementController, PointerGridInputListener, PrefabRef } from "..";
import { Bootstrapper } from "../engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "../engine/bootstrap/SceneBuilder";
import { CameraPrefab } from "./prefab/CameraPrefab";
import { SansFightRoomPrefab } from "./prefab/SansFightRoomPrefab";
import { TimeTest } from "./script/TimeTest";

/** @internal */
export class TestBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.engine.instantiater;

        const trackObject = new PrefabRef<GameObject>();
        const gridMap = new PrefabRef<CssCollideTilemapChunkRenderer>();

        return this.sceneBuilder
            .withChild(instantiater.buildPrefab("sans_fight_room", SansFightRoomPrefab, new Vector3(8, 8, 0))
                .getColideTilemapChunkRendererRef(gridMap)
                .make()
                //.active(false)
            )

            .withChild(instantiater.buildGameObject("test_object")
                .active(false)
                .withComponent(TimeTest, c => c.enabled = false)
                .withComponent(PointerGridInputListener))

            .withChild(instantiater.buildGameObject("track_object")
                //.active(false)
                .withComponent(CssSpriteRenderer)
                .withComponent(PlayerGridMovementController, c => {
                    c.setGridInfoFromCollideMap(gridMap.ref!);
                })
                .getGameObject(trackObject))
            
            .withChild(instantiater.buildGameObject("camera_parent")
                .withChild(instantiater.buildGameObject("editor_camera", new Vector3(0, 0, 100))
                    //.active(false)
                    .withComponent(Camera)
                    .withComponent(EditorCameraController, c => {
                        c.maxViewSize = 500;
                    })
                    .withComponent(EditorGridRenderer, c => {
                        c.renderWidth = 1000;
                        c.renderHeight = 1000;
                    }))
                .withChild(instantiater.buildPrefab("track_camera", CameraPrefab)
                    .withTrackTarget(trackObject)
                    .withBackgroundColor(new PrefabRef(new Color(0, 0, 0)))
                    .withViewSize(new PrefabRef(200))
                    .make()
                    .active(false)
                    .withComponent(EditorGridRenderer, c => {
                        //c.enabled = false;
                        c.renderWidth = 1000;
                        c.renderHeight = 1000;
                    })))
        ;
    }
}
