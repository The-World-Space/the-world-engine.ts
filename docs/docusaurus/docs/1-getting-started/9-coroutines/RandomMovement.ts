import { Component, CoroutineIterator, WaitForSeconds } from "the-world-engine";

export class RandomMovement extends Component {
    private readonly _range = 6;
    
    public awake(): void {
        this.startCoroutine(this.move());
    }

    private *move(): CoroutineIterator {
        for (; ;) {
            const x = Math.random() * this._range - this._range / 2;
            const y = Math.random() * this._range - this._range / 2;
            this.gameObject.transform.position.set(x, y, 0); //move to random position

            yield new WaitForSeconds(1); //wait for 1 second
        }
    }
}
