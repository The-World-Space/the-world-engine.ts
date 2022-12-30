import { EngineGlobalObject } from "../EngineGlobalObject";
import { Instantiater } from "../Instantiater";
import { DeepReadonly } from "../type/DeepReadonly";
import { SceneBuilder } from "./SceneBuilder";
import { GameSetting, GameSettingObject } from "./setting/GameSetting";

/**
 * make game scene with interop object and scene builder
 */
export abstract class Bootstrapper<T = any> {
    private readonly _instantiater: Instantiater;
    private readonly _interopObject: T|null;
    private readonly _sceneBuilder: SceneBuilder;
    private readonly _gameSetting: GameSetting;

    public constructor(engineGlobalObject: EngineGlobalObject, interopObject?: T) {
        this._instantiater = engineGlobalObject.instantiater;
        this._interopObject = interopObject || null;
        this._sceneBuilder = new SceneBuilder(engineGlobalObject.sceneProcessor);
        this._gameSetting = new GameSetting(GameSetting.createDefaultObject());
    }

    /** @internal */
    public getGameSettingObject(): DeepReadonly<GameSettingObject> {
        Object.freeze(this._gameSetting);
        return this._gameSetting.make();
    }

    /**
     * set game setting and make scene
     */
    public abstract run(): SceneBuilder;

    /**
     * get instantiater
     *
     * You can instantiate object through instantiater
     */
    protected get instantiater(): Instantiater {
        return this._instantiater;
    }

    /**
     * get interop object
     */
    protected get interopObject(): T|null {
        return this._interopObject;
    }

    /**
     * get scene builder
     */
    protected get sceneBuilder(): SceneBuilder {
        return this._sceneBuilder;
    }

    /**
     * get game setting, this value will be frozen after run
     */
    protected get setting(): GameSetting {
        return this._gameSetting;
    }
}
