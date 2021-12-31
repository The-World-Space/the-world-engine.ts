import { Component } from "../../hierarchy_object/Component";
import { ComponentConstructor } from "../../hierarchy_object/ComponentConstructor";
export declare class SpriteAnimator extends Component {
    protected readonly _disallowMultipleComponent: boolean;
    protected readonly _requiredComponents: ComponentConstructor[];
    private _spriteRenderer;
    private _animations;
    private _playingAnimationName;
    private _playingAnimation;
    private _playingAnimationFrame;
    private _playing;
    private _frameDuration;
    private _currentFrameDuration;
    protected awake(): void;
    update(): void;
    playAnimation(name: string): void;
    stopAnimation(): void;
    addAnimation(name: string, animationFrames: string[]): void;
    addAnimationFromPath(name: string, animationFrames: string[]): void;
    get frameDuration(): number;
    set frameDuration(value: number);
}
