import { Component, SpriteAtlasAnimator } from "the-world-engine";
import { Vector2, Vector3 } from "three/src/Three";

export class PlayerController extends Component {
    private readonly _speed = 4;
    private readonly _direction: Vector2 = new Vector2(0, -1);
    private _isMoving: boolean = false;
    private _spriteAtlasAnimator: SpriteAtlasAnimator|null = null;

    private _tempVector3: Vector3 = new Vector3();

    public awake(): void {
        this._spriteAtlasAnimator = this.gameObject.getComponent(SpriteAtlasAnimator);
    }
    
    public update(): void {
        const inputMap = this.engine.input.map;

        if (inputMap.get("w")) {
            this._direction.set(0, 1);
            this._isMoving = true;
        } else if (inputMap.get("s")) {
            this._direction.set(0, -1);
            this._isMoving = true;
        } else if (inputMap.get("a")) {
            this._direction.set(-1, 0);
            this._isMoving = true;
        } else if (inputMap.get("d")) {
            this._direction.set(1, 0);
            this._isMoving = true;
        } else {
            this._isMoving = false;
        }

        if (this._direction.x === 1) {
            this._spriteAtlasAnimator!.playAnimation(this._isMoving ? "walk_right" : "idle_right");
        } else if (this._direction.x === -1) {
            this._spriteAtlasAnimator!.playAnimation(this._isMoving ? "walk_left" : "idle_left");
        } else if (this._direction.y === 1) {
            this._spriteAtlasAnimator!.playAnimation(this._isMoving ? "walk_up" : "idle_up");
        } else if (this._direction.y === -1) {
            this._spriteAtlasAnimator!.playAnimation(this._isMoving ? "walk_down" : "idle_down");
        }

        if (this._isMoving) {
            const addVector = this._tempVector3
                .set(this._direction.x, this._direction.y, 0)
                .multiplyScalar(this.engine.time.deltaTime * this._speed);

            this.gameObject.transform.position.add(addVector);
        }
    }
}
