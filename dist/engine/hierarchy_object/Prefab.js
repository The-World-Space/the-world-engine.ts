import { GameObjectBuilder } from "./GameObject";
/**
 * this class is used to define a prefab
 */
export class Prefab {
    constructor(engineGlobalObject, name, localPosition, localRotation, localScale) {
        this._engine = engineGlobalObject;
        this._gameObjectBuilder = new GameObjectBuilder(engineGlobalObject, name, localPosition, localRotation, localScale);
    }
    /**
     * get global engine object
     */
    get engine() {
        return this._engine;
    }
    /**
     * get game object builder
     */
    get gameObjectBuilder() {
        return this._gameObjectBuilder;
    }
}
