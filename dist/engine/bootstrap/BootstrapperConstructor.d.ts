import { EngineGlobalObject } from "../EngineGlobalObject";
import { Bootstrapper } from "./Bootstrapper";
export declare type BootstrapperConstructor<T, U extends Bootstrapper<T> = Bootstrapper<T>> = new (engineGlobalObject: EngineGlobalObject, interopObject?: T) => U;
