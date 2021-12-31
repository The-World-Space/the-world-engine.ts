import { IReadonlyTime } from "./time/IReadonlyTime";
import { InputHandler } from "./input/InputHandler";
import { Instantiater } from "./Instantiater";
import { IReadonlyGameState } from "./GameState";
import { Scene } from "./hierarchy_object/Scene";
import { CameraContainer } from "./render/CameraContainer";
import { IReadonlyGameScreen } from "./render/IReadonlyGameScreen";

/**
 * engine object interface with only safe functions exposed
 */
export interface IEngine {
    /**
     * get root scene
     */
    get rootScene(): Scene;

    /**
     * get camera container
     */
    get cameraContainer(): CameraContainer;

    /**
     * get game screen
     */
    get screen(): IReadonlyGameScreen;

    /**
     * get input handler for handling input events
     */
    get input(): InputHandler;

    /**
     * get time
     */
    get time(): IReadonlyTime;

    /**
     * get game state
     */
    get gameState(): IReadonlyGameState;

    /**
     * get instantiater for create game object
     */
    get instantlater(): Instantiater;
}
