import type { EngineGlobalObject } from "../EngineGlobalObject";
import type { Instantiater } from "../Instantiater";
import type { ReadonlyQuaternion } from "../math/ReadonlyQuaternion";
import type { ReadonlyVector3 } from "../math/ReadonlyVector3";
import { GameObjectBuilder } from "./GameObjectBuilder";

/**
 * this class is used to define a prefab
 * do not override constructor it's break the engine
 */
export abstract class Prefab {
    private readonly _instantiater: Instantiater;
    private readonly _gameObjectBuilder: GameObjectBuilder;

    public constructor(
        engineGlobalObject: EngineGlobalObject,
        name: string,
        localPosition?: ReadonlyVector3,
        localRotation?: ReadonlyQuaternion,
        localScale?: ReadonlyVector3) {
        this._instantiater = engineGlobalObject.instantiater;
        this._gameObjectBuilder = new GameObjectBuilder(engineGlobalObject, name, localPosition, localRotation, localScale);
    }

    /**
     * make a builder for game object
     */
    public abstract make(): GameObjectBuilder;

    /**
     * get global engine object
     */
    protected get instantiater(): Instantiater {
        return this._instantiater;
    }

    /**
     * get game object builder
     */
    protected get gameObjectBuilder(): GameObjectBuilder {
        return this._gameObjectBuilder;
    }
}
