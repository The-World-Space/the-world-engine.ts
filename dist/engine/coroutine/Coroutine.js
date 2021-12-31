export class Coroutine {
    constructor(component, coroutineIterator, onFinish) {
        this._component = component;
        this._elapsedTime = 0;
        this._coroutineIterator = coroutineIterator;
        this._currentYieldInstruction = null;
        this._isCurrenYieldInstructionExist = false;
        this._onFinish = onFinish;
        this.fatchNextInstruction();
    }
    get component() {
        return this._component;
    }
    get elapsedTime() {
        return this._elapsedTime;
    }
    set elapsedTime(value) {
        this._elapsedTime = value;
    }
    get currentYieldInstruction() {
        return this._currentYieldInstruction;
    }
    get currentYieldInstructionExist() {
        return this._isCurrenYieldInstructionExist;
    }
    fatchNextInstruction() {
        var _a;
        const result = this._coroutineIterator.next();
        if (result.done) {
            this._currentYieldInstruction = null;
            this._isCurrenYieldInstructionExist = false;
            (_a = this._onFinish) === null || _a === void 0 ? void 0 : _a.call(this);
            this._onFinish = null;
            return null;
        }
        this._currentYieldInstruction = result.value;
        this._isCurrenYieldInstructionExist = true;
        return this._currentYieldInstruction;
    }
}
