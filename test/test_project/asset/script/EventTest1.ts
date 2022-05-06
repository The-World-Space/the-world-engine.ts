import { Component } from "src/engine/hierarchy_object/Component";

/** @internal */
export class EventTest1 extends Component {
    public awake(): void {
        console.log("EventTest1.awake()");
    }

    public onEnable(): void {
        console.log("EventTest1.onEnable()");
        this.destroy();
    }

    public onDisable(): void {
        console.log("EventTest1.onDisable()");
    }

    public start(): void {
        console.log("EventTest1.start()");
    }

    public update(): void {
        console.log("EventTest1.update()");
    }

    public onDestroy(): void {
        console.log("EventTest1.onDestroy()");
    }
}
