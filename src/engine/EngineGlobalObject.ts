import { IPhysics2D } from "..";
import { GameSettingObject } from "./bootstrap/setting/GameSetting";
import { CoroutineProcessor } from "./coroutine/CoroutineProcessor";
import { IReadonlyGameState } from "./GameState";
import { Scene } from "./hierarchy_object/Scene";
import { InputHandler } from "./input/InputHandler";
import { Instantiater } from "./Instantiater";
import { Physics2DProcessor } from "./physics/2d/Physics2DProcessor";
import { CameraContainer, IReadonlyCameraContainer } from "./render/CameraContainer";
import { IReadonlyGameScreen } from "./render/IReadonlyGameScreen";
import { TransformMatrixProcessor } from "./render/TransformMatrixProcessor";
import { WebGLGlobalObject } from "./render/WebGLGlobalObject";
import { SceneProcessor } from "./SceneProcessor";
import { Time } from "./time/Time";
import { DeepReadonly } from "./type/DeepReadonly";

/** 
 * do not drive this class
 */
export class EngineGlobalObject {
    private readonly _scene: Scene;
    private readonly _cameraContainer: CameraContainer;
    private readonly _time: Time;
    private readonly _inputHandler: InputHandler;
    private readonly _instantiater: Instantiater;
    private readonly _gameState: IReadonlyGameState;
    private readonly _screen: IReadonlyGameScreen;
    private readonly _physics2DProcessor: Physics2DProcessor;
    private readonly _domElement: HTMLElement;
    private _webGLGlobalObject: WebGLGlobalObject|null = null;
    
    //engine internal objects
    private readonly _sceneProcessor: SceneProcessor;
    private readonly _coroutineProcessor: CoroutineProcessor;
    private readonly _transformMatrixProcessor: TransformMatrixProcessor;
    
    /** @internal */
    public constructor(
        scene: Scene,
        cameraContainer: CameraContainer,
        time: Time,
        gameState: IReadonlyGameState,
        gameScreen: IReadonlyGameScreen,
        sceneProcessor: SceneProcessor,
        coroutineProcessor: CoroutineProcessor,
        transformMatrixProcessor: TransformMatrixProcessor,
        physics2DProcessor: Physics2DProcessor,
        renderTargetDom: HTMLElement
    ) {
        this._scene = scene;
        this._cameraContainer = cameraContainer;
        this._time = time;
        this._gameState = gameState;
        this._screen = gameScreen;
        this._sceneProcessor = sceneProcessor;
        this._coroutineProcessor = coroutineProcessor;
        this._transformMatrixProcessor = transformMatrixProcessor;
        this._physics2DProcessor = physics2DProcessor;
        this._domElement = renderTargetDom;
        this._inputHandler = new InputHandler(renderTargetDom);
        this._instantiater = new Instantiater(this);
    }

    /** @internal */
    public applyGameSetting(gameSettingObject: DeepReadonly<GameSettingObject>): void {
        this._physics2DProcessor.applyPhysicsSettings(gameSettingObject.physics);
    }

    /** @internal */
    public setWebGLGlobalObject(webGLGlobalObject: WebGLGlobalObject): void {
        this._webGLGlobalObject = webGLGlobalObject;
    }

    /** @internal */
    public dispose(): void {
        this._inputHandler.dispose();
    }

    /**
     * game scene. You can add objects to the scene.
     */
    public get scene(): Scene {
        return this._scene;
    }

    /**
     * You can get the camera through the camera container.
     * 
     * `cameraContainer.camera` value is null until the `onEnable()` message of the camera is called.
     * 
     * This problem can be solved by placing the components that use the camera at the bottom of the tree rather than the Camera components.
     */
    public get cameraContainer(): IReadonlyCameraContainer {
        return this._cameraContainer;
    }

    /**
     * game screen. You can get the screen size.
     */
    public get screen(): IReadonlyGameScreen {
        return this._screen;
    }

    /**
     * game standard input system.
     * If possible, use this rather than implementing the input system yourself.
     */
    public get input(): InputHandler {
        return this._inputHandler;
    }

    /**
     * time information.
     * 
     * typically used to get delta time.
     */
    public get time(): Time {
        return this._time;
    }

    /**
     * physics2D related operations.
     */
    public get physics(): IPhysics2D {
        return this._physics2DProcessor;
    }

    /**
     * game state.
     */
    public get gameState(): IReadonlyGameState {
        return this._gameState;
    }

    /**
     * You can instantiate object through instantiater
     */
    public get instantiater(): Instantiater {
        return this._instantiater;
    }

    /**
     * dom element.
     * 
     * You can use it when you want to receive the event directly from the dom element.
     */
    public get domElement(): HTMLElement {
        return this._domElement;
    }

    /**
     * webGL object.
     * 
     * if you not use WebGL, this value is null.
     */
    public get webGL(): WebGLGlobalObject|null {
        return this._webGLGlobalObject;
    }

    /** @internal */
    public get sceneProcessor(): SceneProcessor {
        return this._sceneProcessor;
    }

    /** @internal */
    public get coroutineProcessor(): CoroutineProcessor {
        return this._coroutineProcessor;
    }

    /** @internal */
    public get transformMatrixProcessor(): TransformMatrixProcessor {
        return this._transformMatrixProcessor;
    }

    /** @internal */
    public get physics2DProcessor(): Physics2DProcessor {
        return this._physics2DProcessor;
    }
}
