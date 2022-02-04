import { Vector3 } from "three";
import { EditorGridRenderer, PointerGridInputListener } from "..";
import { Bootstrapper } from "../engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "../engine/bootstrap/SceneBuilder";
import { Camera } from "../engine/script/render/Camera";
//import { Rotator } from "./script/Rotator";
//import { TimeDestroy } from "./script/TimeDestroy";

/** @internal */
export class TestBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {
        const instantlater = this.engine.instantlater;
        
        return this.sceneBuilder
            .withChild(instantlater.buildGameObject("camera", new Vector3(0, 0, 10))
                .withComponent(Camera, c => {
                    c.viewSize = 200;
                })
                .withComponent(EditorGridRenderer)
                .withComponent(PointerGridInputListener));

        // .withChild(instantlater.buildGameObject("test_object")
        //     .withComponent(TimeDestroy, c => {
        //         c.enabled = false;
        //     })
        //     .withComponent(CssSpriteRenderer)
        //     .withComponent(Rotator))

        // .withChild(instantlater.buildGameObject("test_object2", new Vector3(0, 10, 0))
        //     .withComponent(CssHtmlElementRenderer, c => {
        //         c.autoSize = true;
        //         const element = document.createElement("div");
        //         element.innerText = "test";
        //         element.style.backgroundColor = "#F0DB4F";
        //         element.style.color = "#323330";
        //         c.setElement(element);
        //         c.centerOffset = new Vector2(0.5, 0.5);
        //     }));
    }
}
