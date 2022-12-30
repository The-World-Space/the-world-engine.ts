import { Bootstrapper } from "@src/engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "@src/engine/bootstrap/SceneBuilder";
import { Color } from "@src/engine/render/Color";
import { EditorCameraController } from "@src/engine/script/controller/EditorCameraController";
import { Camera } from "@src/engine/script/render/Camera";
import { CssHtmlElementRenderer } from "@src/engine/script/render/CssHtmlElementRenderer";
import { Vector3 } from "three/src/Three";

/** @internal */
export class NonPhysicsTestBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;
        return this.sceneBuilder

            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera, c => {
                    c.viewSize = 10;
                    c.backgroundColor = new Color(0.1, 0.1, 0.1);
                })
                .withComponent(EditorCameraController, c => {
                    c.maxViewSize = 20;
                    c.minViewSize = 5;
                }))

            .withChild(instantiater.buildGameObject("ground", new Vector3(0, -3, 0))
                .withComponent(CssHtmlElementRenderer, c => {
                    const div = document.createElement("div");
                    div.style.backgroundColor = "#00cc00";
                    c.element = div;
                    c.elementWidth = 8;
                    c.elementHeight = 1;
                }))

            .withChild(instantiater.buildGameObject("box", new Vector3(0, 1, 0))
                .withComponent(CssHtmlElementRenderer, c => {
                    const div = document.createElement("div");
                    div.style.backgroundColor = "#cc0000";
                    c.element = div;
                    c.elementWidth = 1;
                    c.elementHeight = 1;
                }))
        ;
    }
}
