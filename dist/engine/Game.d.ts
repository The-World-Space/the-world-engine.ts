import { Bootstrapper } from "./bootstrap/Bootstrapper";
import { GameStateKind } from "./GameState";
import { IInputEventHandleable } from "./input/IInputEventHandleable";
import { BootstrapperConstructor } from "./bootstrap/BootstrapperConstructor";
/**
 * game engine class
 */
export declare class Game {
    private readonly _rootScene;
    private readonly _gameScreen;
    private readonly _renderer;
    private readonly _cameraContainer;
    private readonly _clock;
    private readonly _time;
    private readonly _gameState;
    private readonly _sceneProcessor;
    private readonly _coroutineProcessor;
    private readonly _engineGlobalObject;
    private readonly _container;
    private _animationFrameId;
    private _isDisposed;
    private _resizeFrameBufferBind;
    private _loopBind;
    /**
     *
     * @param container html element that mount the game view
     */
    constructor(container: HTMLElement);
    private resizeFramebuffer;
    /**
     * run game
     * @param bootstrapperCtor
     * @param interopObject
     */
    run<T, U extends Bootstrapper<T> = Bootstrapper<T>>(bootstrapperCtor: BootstrapperConstructor<T, U>, interopObject?: T): void;
    private loop;
    /**
     * stop game (you can resume game after game is stopped.)
     */
    stop(): void;
    /**
     * resume game
     */
    resume(): void;
    /**
     * dispose game
     */
    dispose(): void;
    /**
     * get inputHandler for eventhandle toggle.
     */
    get inputHandler(): IInputEventHandleable;
    /**
     * get current game state
     */
    get currentGameState(): GameStateKind;
}
