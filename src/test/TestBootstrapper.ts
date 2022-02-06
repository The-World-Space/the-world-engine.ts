import { Vector2, Vector3 } from "three";
import { CssHtmlElementRenderer, CssSpriteRenderer, GameObject, PrefabRef } from "..";
import { Bootstrapper } from "../engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "../engine/bootstrap/SceneBuilder";
import { Rotator } from "./script/Rotator";
import { TimeDestroy } from "./script/TimeDestroy";
import { CameraPrefab } from "./prefab/CameraPrefab";

/** @internal */
export class TestBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {
        const instantlater = this.engine.instantiater;

        const test_object = new PrefabRef<GameObject>();

        return this.sceneBuilder
            .withChild(instantlater.buildGameObject("test_object")
                .withComponent(TimeDestroy, c => {
                    c.enabled = false;
                })
                .withComponent(CssSpriteRenderer)
                .withComponent(Rotator)
                .getGameObject(test_object))
                
            .withChild(instantlater.buildGameObject("test_object2", new Vector3(0, 10, 0))
                .withComponent(CssHtmlElementRenderer, c => {
                    c.autoSize = true;
                    const element = document.createElement("div");
                    element.innerText = "test";
                    element.style.backgroundColor = "#F0DB4F";
                    element.style.color = "#323330";
                    c.setElement(element);
                    c.centerOffset = new Vector2(0.5, 0.5);
                }))
                
            .withChild(instantlater.buildPrefab("camera_controller", CameraPrefab)
                .withTrackTarget(test_object)
                .make())
        ;
    }
}
