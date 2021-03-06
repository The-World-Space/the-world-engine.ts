import { Bootstrapper } from "./bootstrap/Bootstrapper";
import { BootstrapperConstructor } from "./bootstrap/BootstrapperConstructor";
import { GameSettingObject } from "./bootstrap/setting/GameSetting";
import { CoroutineProcessor } from "./coroutine/CoroutineProcessor";
import { EngineGlobalObject } from "./EngineGlobalObject";
import { GameState, GameStateKind } from "./GameState";
import { Scene } from "./hierarchy_object/Scene";
import { IInputEventHandleable } from "./input/IInputEventHandleable";
import { Physics2DProcessor } from "./physics/2d/Physics2DProcessor";
import { CameraContainer } from "./render/CameraContainer";
import { GameScreen } from "./render/GameScreen";
import { OptimizedCSS3DRenderer } from "./render/OptimizedCSS3DRenderer";
import { ReadonlyColor } from "./render/ReadonlyColor";
import { TransformMatrixProcessor } from "./render/TransformMatrixProcessor";
import { SceneProcessor } from "./SceneProcessor";
import { Time } from "./time/Time";
import { DeepReadonly } from "./type/DeepReadonly";
    
/**
 * game engine class
 */
export class Game {
    private readonly _rootScene: Scene;
    private readonly _gameScreen: GameScreen;
    private readonly _css3DRenderer: OptimizedCSS3DRenderer;
    private readonly _cameraContainer: CameraContainer;
    private readonly _time: Time;
    private readonly _gameState: GameState;
    private readonly _sceneProcessor: SceneProcessor;
    private readonly _coroutineProcessor: CoroutineProcessor;
    private readonly _transformMatrixProcessor: TransformMatrixProcessor;
    private readonly _physics2DProcessor: Physics2DProcessor;
    private readonly _engineGlobalObject: EngineGlobalObject;
    private readonly _container: HTMLElement;
    private _gameSetting: DeepReadonly<GameSettingObject>|null = null;
    private _animationFrameId: number|null;
    private _isDisposed: boolean;
    private readonly _autoResize: boolean;
    private readonly _resizeFrameBufferBind: () => void;
    private readonly _loopBind: () => void;

    /**
     * 
     * @param container html element that mount the game view
     * @param autoResize if true, the game view will be resized when the window is resized. (default: true)
     */
    public constructor(container: HTMLElement, autoResize = true) {
        this._rootScene = new Scene();
        this._gameScreen = new GameScreen(container.clientWidth, container.clientHeight);
        this._container = container;
        
        this._css3DRenderer = new OptimizedCSS3DRenderer();
        this._css3DRenderer.setSize(container.clientWidth, container.clientHeight);
        this._css3DRenderer.domElement.style.width = "100%";
        this._css3DRenderer.domElement.style.height = "100%";
        this._css3DRenderer.domElement.onscroll = (): void => { //block scroll to prevent camera bug
            this._css3DRenderer.domElement.scrollLeft = 0;
            this._css3DRenderer.domElement.scrollTop = 0;
        };

        this._cameraContainer = new CameraContainer((color: ReadonlyColor): void => {
            this._css3DRenderer.domElement.style.backgroundColor = "rgba(" + (color.r * 255) + "," + (color.g * 255) + "," + (color.b * 255) + "," + color.a + ")";
        });
        
        this._time = new Time();
        this._gameState = new GameState(GameStateKind.WaitingForStart);
        
        this._sceneProcessor = new SceneProcessor();
        this._coroutineProcessor = new CoroutineProcessor(this._time);
        this._transformMatrixProcessor = new TransformMatrixProcessor();
        this._physics2DProcessor = new Physics2DProcessor();
        
        this._engineGlobalObject = new EngineGlobalObject(
            this._rootScene,
            this._cameraContainer,
            this._time,
            this._gameState,
            this._gameScreen,
            this._sceneProcessor,
            this._coroutineProcessor,
            this._transformMatrixProcessor,
            this._physics2DProcessor,
            this._css3DRenderer.domElement
        );
        
        this._animationFrameId = null;
        this._isDisposed = false;
        this._autoResize = autoResize;
        this._resizeFrameBufferBind = this.resizeFramebuffer.bind(this);
        if (autoResize) window.addEventListener("resize", this._resizeFrameBufferBind);
        this._loopBind = this.loop.bind(this);
    }

    /**
     * resize the game view, update the camera matrix
     */
    public resizeFramebuffer(): void {
        const width = this._container.clientWidth;
        const height = this._container.clientHeight;
        if (width === this._gameScreen.width && height === this._gameScreen.height) return;
        this._gameScreen.resize(width, height);
        this._css3DRenderer.setSize(width, height);
        this._css3DRenderer.domElement.style.width = "100%";
        this._css3DRenderer.domElement.style.height = "100%";
    }

    /**
     * run game
     * @param bootstrapperCtor bootstrapper constructor is used to initialize the game.
     * @param interopObject interop object passed to the bootstrapper.
     */
    public run<T, U extends Bootstrapper<T> = Bootstrapper<T>>(bootstrapperCtor: BootstrapperConstructor<T, U>, interopObject?: T): void {
        if (this._isDisposed) throw new Error("Game is disposed.");
        if (this._gameState.kind !== GameStateKind.WaitingForStart) throw new Error("Game is already running.");

        this._gameState.kind = GameStateKind.Initializing;
        this._time.start();
        
        const bootstrapper = new bootstrapperCtor(this._engineGlobalObject, interopObject);
        const scene = bootstrapper.run();
        this._gameSetting = bootstrapper.getGameSettingObject();
        this._engineGlobalObject.applyGameSetting(this._gameSetting);
        if (this._gameSetting.render.useCss3DRenderer) {
            this._container.appendChild(this._css3DRenderer.domElement);
        }
        scene.build();
        
        //If a camera exists in the bootstrapper,
        //it is certain that the camera exists in the global variable from this point on.
        if (!this._cameraContainer.camera) throw new Error("Camera is not exist or not active in the scene.");
        this._gameState.kind = GameStateKind.Running;
        this._sceneProcessor.startProcessNonSyncedEvent(); // execute start() and update() event
        this._physics2DProcessor.update(this._time.deltaTime);
        this._coroutineProcessor.updateAfterProcess();
        if (!this._cameraContainer.camera) throw new Error("Camera is not exist or not active in the scene.");
        this._sceneProcessor.processRemoveObject();
        const renderObjects = this._transformMatrixProcessor.update();
        if (this._gameSetting.render.useCss3DRenderer) {
            this._css3DRenderer.render(renderObjects, this._rootScene.unsafeGetThreeScene(), this._cameraContainer.camera.threeCamera!);
        }
        this._transformMatrixProcessor.flush();
        this._coroutineProcessor.endFrameAfterProcess();
        this._animationFrameId = requestAnimationFrame(this._loopBind);
    }

    private loop(): void {
        this._time.update();
        this._sceneProcessor.startProcessNonSyncedEvent();
        this._physics2DProcessor.update(this._time.deltaTime);
        this._coroutineProcessor.tryCompact();
        this._coroutineProcessor.updateAfterProcess();
        if (!this._cameraContainer.camera) throw new Error("Camera is not exist or not active in the scene.");
        this._sceneProcessor.processRemoveObject();
        const renderObjects = this._transformMatrixProcessor.update();
        if (this._gameSetting!.render.useCss3DRenderer) {
            this._css3DRenderer.render(renderObjects, this._rootScene.unsafeGetThreeScene(), this._cameraContainer.camera.threeCamera!);
        }
        this._transformMatrixProcessor.flush();
        this._coroutineProcessor.endFrameAfterProcess();
        this._animationFrameId = requestAnimationFrame(this._loopBind);
    }

    /**
     * stop game (you can resume game after game is stopped.)
     */
    public stop(): void {
        if (this._isDisposed) throw new Error("Game is disposed.");
        if (this._gameState.kind !== GameStateKind.Running) throw new Error("Game is not running.");
        this._gameState.kind = GameStateKind.Stopped;
        if (this._animationFrameId) cancelAnimationFrame(this._animationFrameId);
        this._animationFrameId = null;
    }

    /**
     * resume game
     */
    public resume(): void {
        if (this._isDisposed) throw new Error("Game is disposed.");
        if (this._gameState.kind !== GameStateKind.Stopped) throw new Error("Game is not stopped.");
        this._gameState.kind = GameStateKind.Running;
        this.loop();
    }

    /**
     * dispose game
     * 
     * dispose game will dispose all resources used by game.
     * 
     * game will be unmounted from the dom.
     * 
     * after dispose, you can't use game anymore.
     */
    public dispose(): void {
        if (this._isDisposed) return;
        
        this._gameState.kind = GameStateKind.Finalizing;
        if (this._animationFrameId) cancelAnimationFrame(this._animationFrameId);
        this._engineGlobalObject.dispose();

        const rootChildren = this._rootScene.children;
        for (let i = 0; i < rootChildren.length; i++) {
            rootChildren[i].gameObject.destroy();
        }
        
        if (this._autoResize) window.removeEventListener("resize", this._resizeFrameBufferBind);
        this._container.removeChild(this._css3DRenderer.domElement);
        
        this._isDisposed = true;
        this._gameState.kind = GameStateKind.Finalized;
    }

    /**
     * get inputHandler for eventhandle toggle.
     */
    public get inputHandler(): IInputEventHandleable {
        return this._engineGlobalObject.input;
    }

    /**
     * get current game state
     */
    public get currentGameState(): GameStateKind {
        return this._gameState.kind;
    }
}
