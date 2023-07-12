import type { EngineGlobalObject } from "../EngineGlobalObject";
import type { Bootstrapper } from "./Bootstrapper";

export type BootstrapperConstructor<T, U extends Bootstrapper<T> = Bootstrapper<T>> = new (engineGlobalObject: EngineGlobalObject, interopObject?: T) => U;
