import { IEngine } from "../IEngine";
import { SceneBuilder } from "./SceneBuilder";
import { EngineGlobalObject } from "../EngineGlobalObject";
/**
 * make game scene with interop object and scene builder
 */
export declare abstract class Bootstrapper<T = any> {
    private _engineGlobalObject;
    private _interopObject;
    private _sceneBuilder;
    constructor(engineGlobalObject: EngineGlobalObject, interopObject?: T);
    /**
     * make scene builder
     */
    abstract run(): SceneBuilder;
    /**
     * get engine global object
     */
    protected get engine(): IEngine;
    /**
     * get interop object
     */
    protected get interopObject(): T | null;
    /**
     * get scene builder
     */
    protected get sceneBuilder(): SceneBuilder;
}
