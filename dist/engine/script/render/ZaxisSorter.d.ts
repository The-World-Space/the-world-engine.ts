import { ZaxisSortable } from "./ZaxisSortable";
export declare class ZaxisSorter extends ZaxisSortable {
    protected readonly _disallowMultipleComponent: boolean;
    private _offset;
    private _runOnce;
    protected start(): void;
    private readonly _tempVector;
    update(): void;
    get offset(): number;
    set offset(value: number);
    get runOnce(): boolean;
    set runOnce(value: boolean);
}
