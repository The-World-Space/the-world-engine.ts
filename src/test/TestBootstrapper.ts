import { Vector2, Vector3 } from "three";
import { Camera, Color, CssHtmlElementRenderer, CssTextRenderer, ParallaxTranslater, TextAlign } from "..";
import { Bootstrapper } from "../engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "../engine/bootstrap/SceneBuilder";

/** @internal */
export class TestBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.engine.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("test_object", new Vector3(0, 10, 0))
                .withComponent(CssHtmlElementRenderer, c => {
                    c.autoSize = true;
                    const element = document.createElement("div");
                    element.innerText = "test1";
                    element.style.backgroundColor = "#F0DB4F";
                    element.style.color = "#323330";
                    c.setElement(element);
                    c.centerOffset = new Vector2(0.5, 0.5);
                })
                .withComponent(ParallaxTranslater, c => {
                    c.offsetX = 0.5;
                    c.offsetY = 0.5;
                }))
            
            
            .withChild(instantiater.buildGameObject("test_object2", new Vector3(50, 10, 0))
                .withComponent(CssHtmlElementRenderer, c => {
                    c.autoSize = true;
                    const element = document.createElement("div");
                    element.innerText = "test2";
                    element.style.backgroundColor = "#F0DB4F";
                    element.style.color = "#323330";
                    c.setElement(element);
                    c.centerOffset = new Vector2(0.5, 0.5);
                })
                .withComponent(ParallaxTranslater, c => {
                    c.offsetX = 0.5;
                    c.offsetY = 0.5;
                }))
            
            .withChild(instantiater.buildGameObject("test_object3", new Vector3(100, 10, 0))
                .withComponent(CssHtmlElementRenderer, c => {
                    c.autoSize = true;
                    const element = document.createElement("div");
                    element.innerText = "test3";
                    element.style.backgroundColor = "#F0DB4F";
                    element.style.color = "#323330";
                    c.setElement(element);
                    c.centerOffset = new Vector2(0.5, 0.5);
                })
                .withComponent(ParallaxTranslater, c => {
                    c.offsetX = 0.5;
                    c.offsetY = 0.5;
                }))
            
            .withChild(instantiater.buildGameObject("test_object4", new Vector3(0, -20, 0))
                .withComponent(CssHtmlElementRenderer, c => {
                    c.transform.position;
                    c.autoSize = true;
                    const element = document.createElement("div");
                    element.innerText = "test4";
                    element.style.backgroundColor = "#F0DB4F";
                    element.style.color = "#323330";
                    c.setElement(element);
                    c.centerOffset = new Vector2(0.5, 0.5);
                })
                .withComponent(ParallaxTranslater, c => {
                    c.offsetX = 0.5;
                    c.offsetY = 0.5;
                }))
            
            .withChild(instantiater.buildGameObject("test_object5", new Vector3(50, -20, 0))
                .withComponent(CssHtmlElementRenderer, c => {
                    c.transform.position;
                    c.autoSize = true;
                    const element = document.createElement("div");
                    element.innerText = "test5";
                    element.style.backgroundColor = "#F0DB4F";
                    element.style.color = "#323330";
                    c.setElement(element);
                    c.centerOffset = new Vector2(0.5, 0.5);
                })
                .withComponent(ParallaxTranslater, c => {
                    c.offsetX = 0.5;
                    c.offsetY = 0.5;
                }))
            
            .withChild(instantiater.buildGameObject("test_object6", new Vector3(100, -20, 0))
                .withComponent(CssHtmlElementRenderer, c => {
                    c.transform.position;
                    c.autoSize = true;
                    const element = document.createElement("div");
                    element.innerText = "test6";
                    element.style.backgroundColor = "#F0DB4F";
                    element.style.color = "#323330";
                    c.setElement(element);
                    c.centerOffset = new Vector2(0.5, 0.5);
                })
                .withComponent(ParallaxTranslater, c => {
                    c.offsetX = 0.5;
                    c.offsetY = 0.5;
                }))
            
            .withChild(instantiater.buildGameObject("test_object7", new Vector3(0, -40, 0))
                //.active(false)
                .withComponent(CssHtmlElementRenderer, c => {
                    c.transform.position;
                    c.autoSize = true;
                    const element = document.createElement("div");
                    element.innerText = "test7";
                    element.style.backgroundColor = "#F0DB4F";
                    element.style.color = "#323330";
                    c.setElement(element);
                    c.centerOffset = new Vector2(0.5, 0.5);
                })
                .withComponent(ParallaxTranslater, c => {
                    c.offsetX = 0.5;
                    c.offsetY = 0.5;
                }))
            
            .withChild(instantiater.buildGameObject("bug_object", new Vector3(100, -40, 0))
                //.active(false)
                .withComponent(CssTextRenderer, c => {
                    c.transform.position;
                    c.text = "bug";
                    c.textAlign = TextAlign.Center;
                })
                .withComponent(ParallaxTranslater, c => {
                    //c.enabled = false;
                    c.offsetX = 0.5;
                    c.offsetY = 0.5;
                }))

            .withChild(instantiater.buildGameObject("camera")
                .withComponent(Camera, c => {
                    c.backgroundColor = new Color(0.1, 0.1, 0.1);
                }))
        ;
    }
}
