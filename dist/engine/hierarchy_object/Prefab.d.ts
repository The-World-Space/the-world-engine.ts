import { Quaternion, Vector3 } from "three";
import { EngineGlobalObject } from "../EngineGlobalObject";
import { IEngine } from "../IEngine";
import { GameObjectBuilder } from "./GameObject";
/**
 * this class is used to define a prefab
 */
export declare abstract class Prefab {
    protected _engine: IEngine;
    protected _gameObjectBuilder: GameObjectBuilder;
    constructor(engineGlobalObject: EngineGlobalObject, name: string, localPosition?: Vector3, localRotation?: Quaternion, localScale?: Vector3);
    /**
     * make a builder for game object
     */
    abstract make(): GameObjectBuilder;
    /**
     * get global engine object
     */
    protected get engine(): IEngine;
    /**
     * get game object builder
     */
    protected get gameObjectBuilder(): GameObjectBuilder;
}
