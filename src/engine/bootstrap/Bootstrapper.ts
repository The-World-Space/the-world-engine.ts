import { IEngine } from "../IEngine";
import { SceneBuilder } from "./SceneBuilder";
import { EngineGlobalObject } from "../EngineGlobalObject";

/**
 * make game scene with interop object and scene builder
 */
export abstract class Bootstrapper<T = any> {
    private _engineGlobalObject: EngineGlobalObject;
    private _interopObject: T|null;
    private _sceneBuilder: SceneBuilder;

    public constructor(engineGlobalObject: EngineGlobalObject, interopObject?: T) {
        this._engineGlobalObject = engineGlobalObject;
        this._interopObject = interopObject || null;
        this._sceneBuilder = new SceneBuilder(this._engineGlobalObject.sceneProcessor, this._engineGlobalObject.rootScene);
    }

    /**
     * make scene builder
     */
    abstract run(): SceneBuilder;

    /**
     * get engine global object
     */
    protected get engine(): IEngine {
        return this._engineGlobalObject;
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
}
