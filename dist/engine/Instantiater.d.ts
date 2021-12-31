import { Quaternion, Vector3 } from "three";
import { EngineGlobalObject } from "./EngineGlobalObject";
import { GameObject, GameObjectBuilder } from "./hierarchy_object/GameObject";
import { Prefab } from "./hierarchy_object/Prefab";
import { PrefabConstructor } from "./hierarchy_object/PrefabConstructor";
/**
 * instantiate a game object
 */
export declare class Instantiater {
    private readonly _engineGlobalObject;
    constructor(engineGlobalObject: EngineGlobalObject);
    /**
     * create a new GameObject with the given name
     * @param name
     * @param localPosition
     * @param localRotation
     * @param localScale
     * @returns
     */
    createGameObject(name: string, localPosition?: Vector3, localRotation?: Quaternion, localScale?: Vector3): GameObject;
    /**
     * create a new GameObject with the given name by use builder
     * @param name
     * @param localPosition
     * @param localRotation
     * @param localScale
     * @returns
     */
    buildGameObject(name: string, localPosition?: Vector3, localRotation?: Quaternion, localScale?: Vector3): GameObjectBuilder;
    /**
     * create a new instance of Prefab with the given name by use builder
     * @param name
     * @param localPosition
     * @param localRotation
     * @param localScale
     * @returns
     */
    buildPrefab<T extends Prefab>(name: string, prefabCtor: PrefabConstructor<T>, localPosition?: Vector3, localRotation?: Quaternion, localScale?: Vector3): T;
}
