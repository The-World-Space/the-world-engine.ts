import type { EngineGlobalObject } from "../EngineGlobalObject";
import type { ReadonlyQuaternion } from "../math/ReadonlyQuaternion";
import type { ReadonlyVector3 } from "../math/ReadonlyVector3";
import type { Prefab } from "./Prefab";

export type PrefabConstructor<T extends Prefab = Prefab> = new (
    engineGlobalObject: EngineGlobalObject,
    name: string,
    localPosition?: ReadonlyVector3,
    localRotation?: ReadonlyQuaternion,
    localScale?: ReadonlyVector3
) => T;
