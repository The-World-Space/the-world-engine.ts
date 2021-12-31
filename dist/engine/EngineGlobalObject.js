import { InputHandler } from "./input/InputHandler";
import { Instantiater } from "./Instantiater";
export class EngineGlobalObject {
    constructor(rootScene, cameraContainer, time, gameState, gameScreen, sceneProcessor, coroutineProcessor, renderTargetDom) {
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
    dispose() {
        this._inputHandler.dispose();
    }
    get rootScene() {
        return this._rootScene;
    }
    get cameraContainer() {
        return this._cameraContainer;
    }
    get screen() {
        return this._screen;
    }
    get input() {
        return this._inputHandler;
    }
    get time() {
        return this._time;
    }
    get gameState() {
        return this._gameState;
    }
    get instantlater() {
        return this._instantlater;
    }
    get sceneProcessor() {
        return this._sceneProcessor;
    }
    get coroutineProcessor() {
        return this._coroutineProcessor;
    }
}
