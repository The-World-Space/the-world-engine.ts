import { Component, CoroutineIterator, PlayerGridMovementController, WaitForSeconds } from "the-world-engine";
import { Vector2 } from "three/src/Three";

export class LastPositionSaver extends Component {
    public override requiredComponents = [PlayerGridMovementController];
    public override disallowMultipleComponent = true;

    public saveInterval = 1;
    public localStorageKey = "lastPosition";

    private _movementController: PlayerGridMovementController|null = null;

    public awake(): void {
        this._movementController = this.gameObject.getComponent(PlayerGridMovementController);
    }

    public start(): void {
        this.startCoroutine(this.savePosition());
    }

    private *savePosition(): CoroutineIterator {
        for (; ;) {
            yield new WaitForSeconds(this.saveInterval);
            const position = this._movementController!.positionInGrid;
            const x = position.x;
            const y = position.y;
            localStorage.setItem(this.localStorageKey, x + "," + y);
        }
    }

    public static loadPosition(localStorageKey = "lastPosition"): Vector2 {
        const lastPosition = localStorage.getItem(localStorageKey);
        if (lastPosition) {
            const [x, y] = lastPosition.split(",");
            return new Vector2(parseFloat(x), parseFloat(y));
        }
        return new Vector2(0, 0);
    }
}
