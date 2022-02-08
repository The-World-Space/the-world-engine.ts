import { Vector2 } from "three";
import { TrackCameraController, Camera, GameObject, GameObjectBuilder, Prefab, PrefabRef, Color } from "../../index";

/** @internal */
export class CameraPrefab extends Prefab {
    private _trackTarget = new PrefabRef<GameObject>();
    private _backgroundColor = new PrefabRef<Color>();
    private _viewSize = new PrefabRef<number>();

    public withTrackTarget(target: PrefabRef<GameObject>): CameraPrefab {
        this._trackTarget = target;
        return this;
    }

    public withBackgroundColor(color: PrefabRef<Color>): CameraPrefab {
        this._backgroundColor = color;
        return this;
    }

    public withViewSize(size: PrefabRef<number>): CameraPrefab {
        this._viewSize = size;
        return this;
    }

    public make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(Camera, c => {
                if (this._backgroundColor.ref) {
                    c.backgroundColor = this._backgroundColor.ref;
                }
                
                if (this._viewSize.ref) {
                    c.viewSize = this._viewSize.ref;
                }
            })
            .withComponent(TrackCameraController, c => {
                c.setTrackTarget(this._trackTarget.ref!);
                c.targetOffset = new Vector2(0, 0);
            });
    }
}
