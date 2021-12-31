import { SceneBuilder } from "./SceneBuilder";
/**
 * make game scene with interop object and scene builder
 */
export class Bootstrapper {
    constructor(engineGlobalObject, interopObject) {
        this._engineGlobalObject = engineGlobalObject;
        this._interopObject = interopObject || null;
        this._sceneBuilder = new SceneBuilder(this._engineGlobalObject.sceneProcessor, this._engineGlobalObject.rootScene);
    }
    /**
     * get engine global object
     */
    get engine() {
        return this._engineGlobalObject;
    }
    /**
     * get interop object
     */
    get interopObject() {
        return this._interopObject;
    }
    /**
     * get scene builder
     */
    get sceneBuilder() {
        return this._sceneBuilder;
    }
}
