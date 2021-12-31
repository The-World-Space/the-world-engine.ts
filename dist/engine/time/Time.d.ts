import { IReadonlyTime } from "./IReadonlyTime";
export declare class Time implements IReadonlyTime {
    private _deltaTime;
    private _startTime;
    private _elapsedTime;
    constructor();
    get deltaTime(): number;
    set deltaTime(value: number);
    get startTime(): number;
    set startTime(value: number);
    get elapsedTime(): number;
    set elapsedTime(value: number);
}
