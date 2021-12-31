import { Component } from "../../hierarchy_object/Component";
import { CssSpriteAtlasRenderer } from "../render/CssSpriteAtlasRenderer";
export class SpriteAtlasAnimator extends Component {
    constructor() {
        super(...arguments);
        this._disallowMultipleComponent = true;
        this._requiredComponents = [CssSpriteAtlasRenderer];
        this._spriteAtlasRenderer = null;
        this._animations = {};
        this._playingAnimationName = null;
        this._playingAnimation = null;
        this._playingAnimationFrame = 0;
        this._playing = false;
        this._frameDuration = 2;
        this._currentFrameDuration = 0;
    }
    awake() {
        this._spriteAtlasRenderer = this.gameObject.getComponent(CssSpriteAtlasRenderer);
    }
    update() {
        if (this._spriteAtlasRenderer === null)
            return;
        if (!this._playing)
            return;
        this._currentFrameDuration += this.engine.time.deltaTime;
        if (this._currentFrameDuration >= this._frameDuration) {
            this._currentFrameDuration = 0;
            this._playingAnimationFrame++;
            if (this._playingAnimationFrame >= this._playingAnimation.length) {
                this._playingAnimationFrame = 0;
            }
            this._spriteAtlasRenderer.imageIndex = this._playingAnimation[this._playingAnimationFrame];
        }
    }
    playAnimation(name) {
        if (this._spriteAtlasRenderer === null)
            return;
        if (this._playingAnimationName === name)
            return;
        this._playingAnimationName = name;
        this._playingAnimation = this._animations[name];
        this._playingAnimationFrame = 0;
        this._spriteAtlasRenderer.imageIndex = this._animations[name][0];
        this._playing = true;
    }
    stopAnimation() {
        if (this._spriteAtlasRenderer === null)
            return;
        this._playing = false;
    }
    addAnimation(name, animationFrames) {
        if (animationFrames.length === 0) {
            console.warn(`Animation "${name}" has no frames.`);
            return;
        }
        this._animations[name] = animationFrames;
    }
    get frameDuration() {
        return this._frameDuration;
    }
    set frameDuration(value) {
        this._frameDuration = value;
    }
}
