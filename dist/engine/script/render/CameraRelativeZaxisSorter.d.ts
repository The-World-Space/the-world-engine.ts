import { ZaxisSortable } from "./ZaxisSortable";
export declare class CameraRelativeZaxisSorter extends ZaxisSortable {
    protected readonly _disallowMultipleComponent: boolean;
    private _offset;
    private readonly _tempVector3;
    update(): void;
    get offset(): number;
    set offset(value: number);
}
