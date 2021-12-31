import { Quaternion, Vector3 } from "three";
import { EngineGlobalObject } from "../EngineGlobalObject";
import { IEngine } from "../IEngine";
import { GameObjectBuilder } from "./GameObject";

/**
 * this class is used to define a prefab
 */
export abstract class Prefab {
    protected _engine: IEngine;
    protected _gameObjectBuilder: GameObjectBuilder;

    public constructor(engineGlobalObject: EngineGlobalObject, name: string, localPosition?: Vector3, localRotation?: Quaternion, localScale?: Vector3) {
        this._engine = engineGlobalObject;
        this._gameObjectBuilder = new GameObjectBuilder(engineGlobalObject, name, localPosition, localRotation, localScale);
    }

    /**
     * make a builder for game object
     */
    public abstract make(): GameObjectBuilder;

    /**
     * get global engine object
     */
    protected get engine(): IEngine {
        return this._engine;
    }

    /**
     * get game object builder
     */
    protected get gameObjectBuilder(): GameObjectBuilder {
        return this._gameObjectBuilder;
    }
}
