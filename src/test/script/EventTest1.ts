import { Component } from "../../engine/hierarchy_object/Component";

/** @internal */
export class EventTest1 extends Component {
    public awake() {
        console.log("EventTest1.awake()");
    }

    public onEnable() {
        console.log("EventTest1.onEnable()");
        this.destroy();
    }

    public onDisable() {
        console.log("EventTest1.onDisable()");
    }

    public start() {
        console.log("EventTest1.start()");
    }

    public update() {
        console.log("EventTest1.update()");
    }

    public onDestroy() {
        console.log("EventTest1.onDestroy()");
    }
}
