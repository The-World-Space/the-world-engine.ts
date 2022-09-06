import { Camera, GameObject, GameObjectBuilder, Prefab, PrefabRef, TrackCameraController } from "the-world-engine";

export class CameraPrefab extends Prefab {
    private _trackObject = new PrefabRef<GameObject>();
    private _camera = new PrefabRef<Camera>();

    public withTrackObject(trackObject: PrefabRef<GameObject>): this {
        this._trackObject = trackObject;
        return this;
    }

    public getCamera(componentRef: PrefabRef<Camera>): this {
        this._camera = componentRef;
        return this;
    }

    public override make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(Camera)
            .withComponent(TrackCameraController, c => {
                c.smoothTrack = true;
                if (this._trackObject.ref) c.setTrackTarget(this._trackObject.ref);
            })
            .getComponent(Camera, this._camera)
        ;
    }
}
