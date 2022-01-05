import { Quaternion, Vector3 } from "three";
import { EngineGlobalObject } from "./EngineGlobalObject";
import { GameObject, GameObjectBuilder } from "./hierarchy_object/GameObject";
import { Prefab } from "./hierarchy_object/Prefab";
import { PrefabConstructor } from "./hierarchy_object/PrefabConstructor";

/**
 * instantiate a game object
 */
export class Instantiater {
    private readonly _engineGlobalObject: EngineGlobalObject;
    
    public constructor(engineGlobalObject: EngineGlobalObject) {
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
    public createGameObject(
        name: string,
        localPosition?: Vector3,
        localRotation?: Quaternion,
        localScale?: Vector3
    ): GameObject {
        const gameObject = new GameObject(this._engineGlobalObject, name);
        const transform = gameObject.transform;
        if (localPosition) transform.localPosition.copy(localPosition);
        if (localRotation) transform.localRotation.copy(localRotation);
        if (localScale) transform.localScale.copy(localScale);
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
    public buildGameObject(
        name: string,
        localPosition?: Vector3,
        localRotation?: Quaternion,
        localScale?: Vector3
    ): GameObjectBuilder {
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
    public buildPrefab<T extends Prefab>(
        name: string,
        prefabCtor: PrefabConstructor<T>,
        localPosition?: Vector3,
        localRotation?: Quaternion,
        localScale?: Vector3
    ): T {
        return new prefabCtor(this._engineGlobalObject, name, localPosition, localRotation, localScale);
    }
}
