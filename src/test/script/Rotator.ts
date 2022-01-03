import { Component } from "../../engine/hierarchy_object/Component";

export class Rotator extends Component {
    //private _accumulator = 0;

    public update() {
        //this._accumulator += this.engine.time.deltaTime;

        this.gameObject.transform.rotateZ(this.engine.time.deltaTime * 0.5);
        //this.gameObject.transform.position.x = Math.sin(this._accumulator) * 50;
        //this.gameObject.transform.position.y = Math.cos(this._accumulator) * 50;
    }
}