import { Component } from "../../hierarchy_object/Component";
import { CssSpriteRenderer } from "../render/CssSpriteRenderer";
export class SpriteAnimator extends Component {
    constructor() {
        super(...arguments);
        this._disallowMultipleComponent = true;
        this._requiredComponents = [CssSpriteRenderer];
        this._spriteRenderer = null;
        this._animations = {};
        this._playingAnimationName = null;
        this._playingAnimation = null;
        this._playingAnimationFrame = 0;
        this._playing = false;
        this._frameDuration = 2;
        this._currentFrameDuration = 0;
    }
    awake() {
        this._spriteRenderer = this.gameObject.getComponent(CssSpriteRenderer);
    }
    update() {
        if (!this._playing)
            return;
        this._currentFrameDuration += this.engine.time.deltaTime;
        if (this._currentFrameDuration >= this._frameDuration) {
            this._currentFrameDuration = 0;
            this._playingAnimationFrame++;
            if (this._playingAnimationFrame >= this._playingAnimation.length) {
                this._playingAnimationFrame = 0;
            }
            this._spriteRenderer.asyncSetImagePath(this._playingAnimation[this._playingAnimationFrame]);
        }
    }
    playAnimation(name) {
        if (this._spriteRenderer === null)
            return;
        if (this._playingAnimationName === name)
            return;
        this._playingAnimationName = name;
        this._playingAnimation = this._animations[name];
        this._playingAnimationFrame = 0;
        this._spriteRenderer.asyncSetImagePath(this._animations[name][0]);
        this._playing = true;
    }
    stopAnimation() {
        if (this._spriteRenderer === null)
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
    addAnimationFromPath(name, animationFrames) {
        const animationFramesArray = [];
        for (const frame of animationFrames) {
            const image = document.createElement("img");
            image.style.imageRendering = "pixelated";
            image.src = frame;
            animationFramesArray.push(image);
        }
        this.addAnimation(name, animationFrames);
    }
    get frameDuration() {
        return this._frameDuration;
    }
    set frameDuration(value) {
        this._frameDuration = value;
    }
}
