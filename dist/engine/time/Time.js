export class Time {
    constructor() {
        this._deltaTime = 0;
        this._startTime = 0;
        this._elapsedTime = 0;
    }
    get deltaTime() {
        return this._deltaTime;
    }
    set deltaTime(value) {
        this._deltaTime = value;
    }
    get startTime() {
        return this._startTime;
    }
    set startTime(value) {
        this._startTime = value;
    }
    get elapsedTime() {
        return this._elapsedTime;
    }
    set elapsedTime(value) {
        this._elapsedTime = value;
    }
}
