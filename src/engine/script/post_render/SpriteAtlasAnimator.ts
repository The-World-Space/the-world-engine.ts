import { Component } from "../../hierarchy_object/Component";
import type { ComponentConstructor } from "../../hierarchy_object/ComponentConstructor";
import { CssSpriteAtlasRenderer } from "../render/CssSpriteAtlasRenderer";

/**
 * simple sprite atlas animator
 *
 * this component will switch sprite atlas index every interval time
 *
 *
 * disallow multiple component
 *
 * require components: `CssSpriteAtlasRenderer`
 */
export class SpriteAtlasAnimator extends Component {
    public override readonly disallowMultipleComponent: boolean = true;
    public override readonly requiredComponents: ComponentConstructor[] = [CssSpriteAtlasRenderer];

    private _spriteAtlasRenderer: CssSpriteAtlasRenderer | null = null;
    private _animations: { [key: string]: number[] } = {};
    private _playingAnimationName: string | null = null;
    private _playingAnimation: number[] | null = null;
    private _playingAnimationFrame = 0;
    private _playing = false;
    private _frameDuration = 2;
    private _currentFrameDuration = 0;
    private _pendingPlayAnimation: string | null = null;

    public awake(): void {
        this._spriteAtlasRenderer = this.gameObject.getComponent(CssSpriteAtlasRenderer);

        if (this._pendingPlayAnimation !== null) {
            this.playAnimation(this._pendingPlayAnimation);
            this._pendingPlayAnimation = null;
        }
    }

    public update(): void {
        if (this._spriteAtlasRenderer === null) return;
        if (!this._playing) return;

        this._currentFrameDuration += this.engine.time.deltaTime;
        if (this._currentFrameDuration >= this._frameDuration) {
            this._currentFrameDuration = 0;
            this._playingAnimationFrame += 1;
            if (this._playingAnimationFrame >= this._playingAnimation!.length) {
                this._playingAnimationFrame = 0;
            }
            this._spriteAtlasRenderer!.imageIndex = this._playingAnimation![this._playingAnimationFrame];
        }
    }

    /**
     * play animation by name
     * @param name animation name
     * @returns
     */
    public playAnimation(name: string): void {
        if (this._spriteAtlasRenderer === null) {
            this._pendingPlayAnimation = name;
            return;
        }

        if (this._playingAnimationName === name) return;

        this._playingAnimationName = name;
        this._playingAnimation = this._animations[name];
        this._playingAnimationFrame = 0;
        this._spriteAtlasRenderer!.imageIndex = this._animations[name][0];
        this._playing = true;
    }

    /**
     * stop current animation
     */
    public stopAnimation(): void {
        this._playing = false;
        this._pendingPlayAnimation = null;
    }

    /**
     * add animation from atlas index array
     * @param name animation name
     * @param animationFrames animation frames
     * @returns
     */
    public addAnimation(name: string, animationFrames: number[]): void {
        if (animationFrames.length === 0) {
            console.warn(`Animation "${name}" has no frames.`);
            return;
        }
        this._animations[name] = animationFrames;
    }

    /**
     * frame duration (default: 2)
     *
     * larger value means slower animation
     */
    public get frameDuration(): number {
        return this._frameDuration;
    }

    /**
     * frame duration (default: 2)
     *
     * larger value means slower animation
     */
    public set frameDuration(value: number) {
        this._frameDuration = value;
    }
}
