import { GameObject, GameObjectBuilder } from "./hierarchy_object/GameObject";
/**
 * instantiate a game object
 */
export class Instantiater {
    constructor(engineGlobalObject) {
        this._engineGlobalObject = engineGlobalObject;
    }
    /**
     * create a new GameObject with the given name
     * @param name
     * @param localPosition
     * @param localRotation
     * @param localScale
     * @returns
     */
    createGameObject(name, localPosition, localRotation, localScale) {
        const gameObject = new GameObject(this._engineGlobalObject, name);
        const transform = gameObject.transform;
        if (localPosition)
            transform.position.copy(localPosition);
        if (localRotation)
            transform.quaternion.copy(localRotation);
        if (localScale)
            transform.scale.copy(localScale);
        return gameObject;
    }
    /**
     * create a new GameObject with the given name by use builder
     * @param name
     * @param localPosition
     * @param localRotation
     * @param localScale
     * @returns
     */
    buildGameObject(name, localPosition, localRotation, localScale) {
        return new GameObjectBuilder(this._engineGlobalObject, name, localPosition, localRotation, localScale);
    }
    /**
     * create a new instance of Prefab with the given name by use builder
     * @param name
     * @param localPosition
     * @param localRotation
     * @param localScale
     * @returns
     */
    buildPrefab(name, prefabCtor, localPosition, localRotation, localScale) {
        return new prefabCtor(this._engineGlobalObject, name, localPosition, localRotation, localScale);
    }
}
