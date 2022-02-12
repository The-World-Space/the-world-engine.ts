import { Time } from "./time/Time";
import { InputHandler } from "./input/InputHandler";
import { Instantiater } from "./Instantiater";
import { IReadOnlyGameState } from "./GameState";
import { Scene } from "./hierarchy_object/Scene";
import { CameraContainer } from "./render/CameraContainer";
import { IReadonlyGameScreen } from "./render/IReadonlyGameScreen";
import { SceneProcessor } from "./SceneProcessor";
import { CoroutineProcessor } from "./coroutine/CoroutineProcessor";
import { TransformMatrixProcessor } from "./render/TransformMatrixProcessor";
import { Physics2DProcessor } from "./physics2d/Physics2DProcessor";
import { IPhysics2D } from "..";

/** 
 * do not drive this class
 */
export class EngineGlobalObject {
    private readonly _scene: Scene;
    private readonly _cameraContainer: CameraContainer;
    private readonly _time: Time;
    private readonly _inputHandler: InputHandler;
    private readonly _instantiater: Instantiater;
    private readonly _gameState: IReadOnlyGameState;
    private readonly _screen: IReadonlyGameScreen;
    private readonly _physics2DProcessor: Physics2DProcessor;
    
    //engine internal objects
    private readonly _sceneProcessor: SceneProcessor;
    private readonly _coroutineProcessor: CoroutineProcessor;
    private readonly _transformMatrixProcessor: TransformMatrixProcessor;
    
    /** @internal */
    public constructor(
        scene: Scene,
        cameraContainer: CameraContainer,
        time: Time,
        gameState: IReadOnlyGameState,
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
        this._inputHandler = new InputHandler(renderTargetDom);
        this._instantiater = new Instantiater(this);
    }

    /** @internal */
    public dispose(): void {
        this._inputHandler.dispose();
    }

    public get scene(): Scene {
        return this._scene;
    }

    public get cameraContainer(): CameraContainer {
        return this._cameraContainer;
    }

    public get screen(): IReadonlyGameScreen {
        return this._screen;
    }

    public get input(): InputHandler {
        return this._inputHandler;
    }

    public get time(): Time {
        return this._time;
    }

    public get physics(): IPhysics2D {
        throw new Error("not implemented");
    }

    public get gameState(): IReadOnlyGameState {
        return this._gameState;
    }

    public get instantiater(): Instantiater {
        return this._instantiater;
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
