import { Vector3 } from "three";
import { Camera, Color, CssSpriteRenderer, EditorCameraController, EditorGridRenderer, GameObject, PlayerGridMovementController, PointerGridInputListener, PrefabRef } from "..";
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

        return this.sceneBuilder
            .withChild(instantiater.buildPrefab("sans_fight_room", SansFightRoomPrefab, new Vector3(8, 8, 0))
                .make())

            .withChild(instantiater.buildGameObject("test_object")
                .withComponent(TimeTest, c => c.enabled = false)
                .withComponent(PointerGridInputListener))

            .withChild(instantiater.buildGameObject("track_object")
                .withComponent(CssSpriteRenderer)
                .withComponent(PlayerGridMovementController)
                .getGameObject(trackObject))
            
            .withChild(instantiater.buildGameObject("camera_parent")
                .withChild(instantiater.buildGameObject("editor_camera")
                    .active(false)
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
                    //.active(false)
                    .withComponent(EditorGridRenderer, c => {
                        //c.enabled = false;
                        c.renderWidth = 1000;
                        c.renderHeight = 1000;
                    })))
        ;
    }
}
