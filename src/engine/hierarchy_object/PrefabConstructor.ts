import { Quaternion, Vector3 } from "three";
import { EngineGlobalObject } from "../EngineGlobalObject";
import { Prefab } from "./Prefab";

export type PrefabConstructor<T extends Prefab = Prefab> = new (
    engineGlobalObject: EngineGlobalObject,
    name: string,
    localPosition?: Vector3,
    localRotation?: Quaternion,
    localScale?: Vector3
) => T;
