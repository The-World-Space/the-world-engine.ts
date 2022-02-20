import { Component } from "../../../engine/hierarchy_object/Component";

/** @internal */
export class EventTest2 extends Component {
    public onEnable() {
        console.log("EventTest2.onEnable()");
    }

    public start() {
        console.log("EventTest2.start()");
    }

    public update() {
        console.log("EventTest2.update()");
    }

    public onDestroy() {
        console.log("EventTest2.onDestroy()");
    }
}
