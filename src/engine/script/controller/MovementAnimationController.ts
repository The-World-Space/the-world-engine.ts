import { Component } from "../../hierarchy_object/Component";
import type { ComponentConstructor } from "../../hierarchy_object/ComponentConstructor";
import { Directable, Direction } from "../helper/Directable";
import { SpriteAtlasAnimator } from "../post_render/SpriteAtlasAnimator";

/**
 * controller for 2D Character
 *
 * Simple animation controller that handles idle and walk status
 *
 * `SpriteAtlasAnimator` must have animation
 * "up_idle", "up_walk", "down_idle", "down_walk", "left_idle", "left_walk", "right_idle", "right_walk"
 * for this component to function properly.
 *
 *
 * disallow multiple component
 *
 * require components: `Directable`, `SpriteAtlasAnimator`
 */
export class MovementAnimationController extends Component {
    public override readonly disallowMultipleComponent: boolean = true;
    public override readonly requiredComponents: ComponentConstructor[] = [Directable, SpriteAtlasAnimator];

    private _directable: Directable | null = null;
    private _spriteAtlasAnimator: SpriteAtlasAnimator | null = null;
    private _lastDirection: Direction = Direction.Down;
    private _lastIsMoving = false;

    public awake(): void {
        this._directable = this.gameObject.getComponent(Directable);
        this._spriteAtlasAnimator = this.gameObject.getComponent(SpriteAtlasAnimator);
    }

    public update(): void {
        const direction = this._directable!.direction;
        const isMoving = this._directable!.isMoving;

        if (isMoving) {
            if (direction === Direction.Up) {
                if (this._lastIsMoving !== isMoving || this._lastDirection !== direction) {
                    this._spriteAtlasAnimator!.playAnimation("up_walk");
                }
            } else if (direction === Direction.Down) {
                if (this._lastIsMoving !== isMoving || this._lastDirection !== direction) {
                    this._spriteAtlasAnimator!.playAnimation("down_walk");
                }
            } else if (direction === Direction.Left) {
                if (this._lastIsMoving !== isMoving || this._lastDirection !== direction) {
                    this._spriteAtlasAnimator!.playAnimation("left_walk");
                }
            } else if (direction === Direction.Right) {
                if (this._lastIsMoving !== isMoving || this._lastDirection !== direction) {
                    this._spriteAtlasAnimator!.playAnimation("right_walk");
                }
            }
        } else {
            if (direction === Direction.Up) {
                if (this._lastIsMoving !== isMoving || this._lastDirection !== direction) {
                    this._spriteAtlasAnimator!.playAnimation("up_idle");
                }
            } else if (direction === Direction.Down) {
                if (this._lastIsMoving !== isMoving || this._lastDirection !== direction) {
                    this._spriteAtlasAnimator!.playAnimation("down_idle");
                }
            } else if (direction === Direction.Left) {
                if (this._lastIsMoving !== isMoving || this._lastDirection !== direction) {
                    this._spriteAtlasAnimator!.playAnimation("left_idle");
                }
            } else if (direction === Direction.Right) {
                if (this._lastIsMoving !== isMoving || this._lastDirection !== direction) {
                    this._spriteAtlasAnimator!.playAnimation("right_idle");
                }
            }
        }

        this._lastIsMoving = isMoving;
        this._lastDirection = direction;
    }
}
