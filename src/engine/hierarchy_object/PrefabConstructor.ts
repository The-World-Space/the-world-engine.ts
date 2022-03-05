import { EngineGlobalObject } from "../EngineGlobalObject";
import { ReadonlyQuaternion } from "../math/ReadonlyQuaternion";
import { ReadonlyVector3 } from "../math/ReadonlyVector3";
import { Prefab } from "./Prefab";

export type PrefabConstructor<T extends Prefab = Prefab> = new (
    engineGlobalObject: EngineGlobalObject,
    name: string,
    localPosition?: ReadonlyVector3,
    localRotation?: ReadonlyQuaternion,
    localScale?: ReadonlyVector3
) => T;
