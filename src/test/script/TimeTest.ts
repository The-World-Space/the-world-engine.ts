import { Component } from "../../engine/hierarchy_object/Component";

export class TimeTest extends Component {
    private accumulator = 0;

    public update() {
        this.accumulator += this.engine.time.deltaTime;
        console.log(this.accumulator);
    }
}
