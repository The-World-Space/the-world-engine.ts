import { Component } from "src/engine/hierarchy_object/Component";

/** @internal */
export class EventTest2 extends Component {
    public onEnable(): void {
        console.log("EventTest2.onEnable()");
    }

    public start(): void {
        console.log("EventTest2.start()");
    }

    public update(): void {
        console.log("EventTest2.update()");
    }

    public onDestroy(): void {
        console.log("EventTest2.onDestroy()");
    }
}
