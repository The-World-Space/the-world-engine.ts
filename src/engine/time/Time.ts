import { IReadonlyTime } from "./IReadonlyTime";

export class Time implements IReadonlyTime {
    private _deltaTime: number;
    private _startTime: number;
    private _elapsedTime: number;

    public constructor() {
        this._deltaTime = 0;
        this._startTime = 0;
        this._elapsedTime = 0;
    }

    public get deltaTime(): number {
        return this._deltaTime;
    }

    public set deltaTime(value: number) {
        this._deltaTime = value;
    }

    public get startTime(): number {
        return this._startTime;
    }

    public set startTime(value: number) {
        this._startTime = value;
    }

    public get elapsedTime(): number {
        return this._elapsedTime;
    }

    public set elapsedTime(value: number) {
        this._elapsedTime = value;
    }
}
