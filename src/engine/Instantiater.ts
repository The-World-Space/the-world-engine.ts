import { EngineGlobalObject } from "./EngineGlobalObject";
import { GameObjectBuilder } from "./hierarchy_object/GameObjectBuilder";
import { Prefab } from "./hierarchy_object/Prefab";
import { PrefabConstructor } from "./hierarchy_object/PrefabConstructor";
import { ReadonlyQuaternion } from "./math/ReadonlyQuaternion";
import { ReadonlyVector3 } from "./math/ReadonlyVector3";

/**
 * instantiate a game object
 * do not drive this class
 */
export class Instantiater {
    private readonly _engineGlobalObject: EngineGlobalObject;
    private _instanceNextId = 0;
    private _eventInstanceNextId = 0;

    /** @internal */
    public constructor(engineGlobalObject: EngineGlobalObject) {
        this._engineGlobalObject = engineGlobalObject;
    }

    /** @internal */
    public generateId(): number {
        const id = this._instanceNextId;
        this._instanceNextId += 1;
        return id;
    }

    /** @internal */
    public generateEventId(): number {
        const id = this._eventInstanceNextId;
        this._eventInstanceNextId += 1;
        return id;
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
        localPosition?: ReadonlyVector3,
        localRotation?: ReadonlyQuaternion,
        localScale?: ReadonlyVector3
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
        localPosition?: ReadonlyVector3,
        localRotation?: ReadonlyQuaternion,
        localScale?: ReadonlyVector3
    ): T {
        return new prefabCtor(this._engineGlobalObject, name, localPosition, localRotation, localScale);
    }
}
