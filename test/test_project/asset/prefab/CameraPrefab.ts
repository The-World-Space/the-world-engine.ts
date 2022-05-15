import { GameObject } from "@src/engine/hierarchy_object/GameObject";
import { GameObjectBuilder } from "@src/engine/hierarchy_object/GameObjectBuilder";
import { Prefab } from "@src/engine/hierarchy_object/Prefab";
import { PrefabRef } from "@src/engine/hierarchy_object/PrefabRef";
import { Color } from "@src/engine/render/Color";
import { TrackCameraController } from "@src/engine/script/controller/TrackCameraController";
import { Camera, CameraType } from "@src/engine/script/render/Camera";
import { Vector2 } from "three/src/Three";

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

                c.cameraType = CameraType.Orthographic;
            })
            .withComponent(TrackCameraController, c => {
                c.setTrackTarget(this._trackTarget.ref!);
                c.targetOffset = new Vector2(0, 0);
            });
    }
}
