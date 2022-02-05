import { Vector3 } from "three";
//import { PointerGridInputListener } from "..";
import { Bootstrapper } from "../engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "../engine/bootstrap/SceneBuilder";
import { MutIteratableCollection } from "../engine/collection/MutIteratableCollection";
//import { Camera } from "../engine/script/render/Camera";
import { EventTest1 } from "./script/EventTest1";
import { EventTest2 } from "./script/EventTest2";
//import { Rotator } from "./script/Rotator";
//import { TimeDestroy } from "./script/TimeDestroy";

/** @internal */
export class TestBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {
        const instantlater = this.engine.instantiater;
        
        console.log("TestBootstrapper.run()");

        const testCollection = new MutIteratableCollection<{id: number, f: () => void}>((a, b) => a.id < b.id);

        const item1 = {id: 1, f: () => console.log("item1")};
        const item2 = {id: 2, f: () => console.log("item2")};
        const item3 = {id: 3, f: () => console.log("item3")};
        const item4 = {id: 4, f: () => console.log("item4")};

        testCollection.insert(item1);
        testCollection.insert(item2);
        testCollection.insert(item3);
        testCollection.insert(item4);

        testCollection.delete(item1);
        testCollection.delete(item3);

        return this.sceneBuilder
            .withChild(instantlater.buildGameObject("camera", new Vector3(0, 0, 10))
                // .withComponent(Camera, c => {
                //     c.viewSize = 200;
                // })
                //.withComponent(EditorGridRenderer)
                //.withComponent(PointerGridInputListener)
                .withComponent(EventTest1)
                .withComponent(EventTest2)
            );

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
