import { Component } from "the-world-engine";

export class Rotator extends Component {
    private readonly _rotationSpeed: number = 1;
    
    public update(): void {
        this.gameObject.transform.rotateZ(
            this._rotationSpeed * this.engine.time.deltaTime);
    }
}
