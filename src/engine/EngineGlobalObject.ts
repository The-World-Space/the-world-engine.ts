import { IReadonlyTime } from "./time/IReadonlyTime";
import { InputHandler } from "./input/InputHandler";
import { Instantiater } from "./Instantiater";
import { IReadonlyGameState } from "./GameState";
import { Scene } from "./hierarchy_object/Scene";
import { CameraContainer } from "./render/CameraContainer";
import { IReadonlyGameScreen } from "./render/IReadonlyGameScreen";
import { SceneProcessor } from "./SceneProcessor";
import { IEngine } from "./IEngine";
import { CoroutineProcessor } from "./coroutine/CoroutineProcessor";

export class EngineGlobalObject implements IEngine {
    private readonly _rootScene: Scene;
    private readonly _cameraContainer: CameraContainer;
    private readonly _time: IReadonlyTime;
    private readonly _inputHandler: InputHandler;
    private readonly _instantlater: Instantiater;
    private readonly _gameState: IReadonlyGameState;
    private readonly _screen: IReadonlyGameScreen;
    
    //engine internal objects
    private readonly _sceneProcessor: SceneProcessor;
    private readonly _coroutineProcessor: CoroutineProcessor;
    
    public constructor(
        rootScene: Scene,
        cameraContainer: CameraContainer,
        time: IReadonlyTime,
        gameState: IReadonlyGameState,
        gameScreen: IReadonlyGameScreen,
        sceneProcessor: SceneProcessor,
        coroutineProcessor: CoroutineProcessor,
        renderTargetDom: HTMLElement
    ) {
        this._rootScene = rootScene;
        this._cameraContainer = cameraContainer;
        this._time = time;
        this._gameState = gameState;
        this._screen = gameScreen;
        this._sceneProcessor = sceneProcessor;
        this._coroutineProcessor = coroutineProcessor;
        this._inputHandler = new InputHandler(renderTargetDom);
        this._instantlater = new Instantiater(this);
    }

    public dispose(): void {
        this._inputHandler.dispose();
    }

    public get rootScene(): Scene {
        return this._rootScene;
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

    public get time(): IReadonlyTime {
        return this._time;
    }

    public get gameState(): IReadonlyGameState {
        return this._gameState;
    }

    public get instantlater(): Instantiater {
        return this._instantlater;
    }

    public get sceneProcessor(): SceneProcessor {
        return this._sceneProcessor;
    }

    public get coroutineProcessor(): CoroutineProcessor {
        return this._coroutineProcessor;
    }
}
