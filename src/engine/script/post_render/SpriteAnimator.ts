import { Component } from "../../hierarchy_object/Component";
import { ComponentConstructor } from "../../hierarchy_object/ComponentConstructor";
import { AsyncImageLoader } from "../helper/AsyncImageLoader";
import { CssSpriteRenderer } from "../render/CssSpriteRenderer";

/**
 * simple sprite animator
 *
 * this component will switch sprite image every interval time
 *
 *
 * disallow multiple component
 *
 * require components: `CssSpriteRenderer`
 */
export class SpriteAnimator extends Component {
    public override readonly disallowMultipleComponent: boolean = true;
    public override readonly requiredComponents: ComponentConstructor[] = [CssSpriteRenderer];

    private _spriteRenderer: CssSpriteRenderer|null = null;
    private readonly _animations: Map<string, HTMLImageElement[]> = new Map();
    private _playingAnimationName: string|null = null;
    private _playingAnimation: HTMLImageElement[]|null = null;
    private _playingAnimationFrame = 0;
    private _playing = false;
    private _frameDuration = 2;
    private _currentFrameDuration = 0;
    private _pendingPlayAnimation: string|null = null;

    public awake(): void {
        this._spriteRenderer = this.gameObject.getComponent(CssSpriteRenderer);

        if (this._pendingPlayAnimation !== null) {
            this.playAnimation(this._pendingPlayAnimation);
            this._pendingPlayAnimation = null;
        }
    }

    public update(): void {
        if (!this._playing) return;

        this._currentFrameDuration += this.engine.time.deltaTime;
        if (this._currentFrameDuration >= this._frameDuration) {
            this._currentFrameDuration = 0;
            this._playingAnimationFrame++;
            if (this._playingAnimationFrame >= this._playingAnimation!.length) {
                this._playingAnimationFrame = 0;
            }
            this._spriteRenderer!.setImage(this._playingAnimation![this._playingAnimationFrame]);
        }
    }

    /**
     * play animation by name
     * @param name animation name
     * @returns
     */
    public playAnimation(name: string): void {
        if (this._spriteRenderer === null) {
            this._pendingPlayAnimation = name;
            return;
        }
        if (this._playingAnimationName === name) return;

        this._playingAnimationName = name;
        const playingAnimation = this._animations.get(name);
        if (playingAnimation === undefined) {
            throw new Error(`Animation "${name}" does not exist.`);
        }
        this._playingAnimation = playingAnimation;
        this._playingAnimationFrame = 0;
        this._spriteRenderer.setImage(playingAnimation[0]);
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
     * add animation from image array
     * @param name animation name
     * @param animationFrames animation frames
     * @returns
     */
    public addAnimation(name: string, animationFrames: HTMLImageElement[]): void {
        if (animationFrames.length === 0) {
            console.warn(`Animation "${name}" has no frames.`);
            return;
        }
        this._animations.set(name, animationFrames);
    }

    /**
     * add animation from image url array
     * @param name animation name
     * @param animationFrames animation frames url
     */
    public addAnimationFromPath(name: string, animationFrames: string[]): void {
        const animationFramesArray: HTMLImageElement[] = [];
        for (let i = 0; i < animationFrames.length; ++i) {
            const image = new Image();
            image.src = animationFrames[i];
            animationFramesArray.push(image);
        }
        AsyncImageLoader.loadImages(animationFramesArray).then(() => {
            this.addAnimation(name, animationFramesArray);
        });
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
