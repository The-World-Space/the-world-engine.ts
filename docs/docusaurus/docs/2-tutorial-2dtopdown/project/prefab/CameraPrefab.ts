import {
    Camera,
    CameraType,
    CssHtmlElementRenderer,
    EditorCameraController,
    EditorGridRenderer,
    GameObject,
    GameObjectBuilder,
    Prefab,
    PrefabRef,
    TrackCameraController
} from "the-world-engine";
import { Vector3 } from "three/src/Three";

import { DialogController } from "../script/DialogController";

export class CameraPrefab extends Prefab {
    private _target = new PrefabRef<GameObject>();
    private _dialogController = new PrefabRef<DialogController>();

    public withTarget(target: PrefabRef<GameObject>): this {
        this._target = target;
        return this;
    }

    public getDialogController(dialogController: PrefabRef<DialogController>): this {
        this._dialogController = dialogController;
        return this;
    }

    public override make(): GameObjectBuilder {
        const camera = new PrefabRef<Camera>();

        return this.gameObjectBuilder
            .withComponent(Camera, c => {
                c.cameraType = CameraType.Orthographic;
            })
            .withComponent(EditorCameraController, c => {
                c.mouseMoveButton = 0;
            })
            .withComponent(EditorGridRenderer, c => {
                c.renderWidth = 50;
                c.renderHeight = 50;
                c.zOffset = -1;
                c.enabled = false;
            })
            .withComponent(TrackCameraController, c => {
                c.setTrackTarget(this._target.ref!);
            })
            .getComponent(Camera, camera)
            
            .withChild(this.instantiater.buildGameObject("game-ui", new Vector3(0, -7, 2))
                .withComponent(CssHtmlElementRenderer, c => {
                    const div = document.createElement("div");
                    div.style.border = "2px solid black";
                    div.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
                    div.style.fontFamily = "'Press Start 2P', cursive";
                    div.style.fontSize = "3px";
                    div.style.color = "white";
                    div.style.padding = "3px";
                    div.style.boxSizing = "border-box";
                    div.textContent = "";

                    const textAreaDiv = document.createElement("div");
                    div.style.width = "100%";
                    div.style.height = "100%";
                    div.style.position = "absolute";
                    div.appendChild(textAreaDiv);

                    const css = document.createElement("style");
                    css.textContent = `
                        @keyframes blink {
                            50% { opacity: 0; }
                        }
                    `;
                    div.appendChild(css);

                    const animatedDiv = document.createElement("div");
                    animatedDiv.style.fontSize = "4px";
                    animatedDiv.style.color = "white";
                    animatedDiv.style.position = "absolute";
                    animatedDiv.style.bottom = "2px";
                    animatedDiv.style.right = "3px";
                    animatedDiv.textContent = "◀";
                    animatedDiv.style.animation = "blink 1s step-end infinite";

                    div.appendChild(animatedDiv);
                    
                    c.elementWidth = 10;
                    c.elementHeight = 2.5;
                    c.element = div;
                })
                .withComponent(DialogController, c => {
                    c.camera = camera.ref;
                })
                .getComponent(DialogController, this._dialogController))
        ;
    }
}
