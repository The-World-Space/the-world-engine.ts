import { 
    Bootstrapper as BaseBootstrapper,
    Camera,
    CssSpriteRenderer,
    GameObject,
    PlayerGridMovementController,
    PrefabRef,
    SceneBuilder
} from "the-world-engine";
import { CameraPrefab } from "./CameraPrefab";

export class Bootstrapper extends BaseBootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;

        const trackObject = new PrefabRef<GameObject>();
        const camera = new PrefabRef<Camera>();

        return this.sceneBuilder
            .withChild(instantiater.buildPrefab("camera", CameraPrefab)
                .withTrackObject(trackObject)
                .getCamera(camera)
                .make())

            .withChild(instantiater.buildGameObject("player")
                .withComponent(CssSpriteRenderer)
                .withComponent(PlayerGridMovementController)
                .getGameObject(trackObject))
        ;
    }
}
