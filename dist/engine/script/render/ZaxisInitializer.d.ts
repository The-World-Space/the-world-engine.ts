import { GameObject } from "../../hierarchy_object/GameObject";
import { ZaxisSortable } from "./ZaxisSortable";
export declare class ZaxisInitializer extends ZaxisSortable {
    protected readonly _disallowMultipleComponent: boolean;
    private _runOnce;
    protected start(): void;
    update(): void;
    private readonly _tempVector3;
    private process;
    static checkAncestorZaxisInitializer(gameObject: GameObject, onSortByZaxis: (z: number) => void): void;
    get runOnce(): boolean;
    set runOnce(value: boolean);
}
