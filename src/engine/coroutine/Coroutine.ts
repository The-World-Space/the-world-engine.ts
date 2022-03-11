import { Component } from "../hierarchy_object/Component";
import { CoroutineIterator } from "./CoroutineIterator";
import { YieldInstruction } from "./YieldInstruction";

/**
 * do not drive this class
 */
export class Coroutine {
    private _component: Component;
    private _elapsedTime: number;
    private _coroutineIterator: CoroutineIterator;
    private _currentYieldInstruction: YieldInstruction|null;
    private _isCurrenYieldInstructionExist: boolean;
    private _onFinish: (() => void)|null;

    /** @internal */
    public constructor(component: Component, coroutineIterator: CoroutineIterator, onFinish: () => void) {
        this._component = component;
        this._elapsedTime = 0;
        this._coroutineIterator = coroutineIterator;
        this._currentYieldInstruction = null;
        this._isCurrenYieldInstructionExist = false;
        this._onFinish = onFinish;
    }

    /** @internal */
    public get component(): Component {
        return this._component;
    }

    /** @internal */
    public get elapsedTime(): number {
        return this._elapsedTime;
    }

    /** @internal */
    public set elapsedTime(value: number) {
        this._elapsedTime = value;
    }

    /** @internal */
    public get currentYieldInstruction(): YieldInstruction|null {
        return this._currentYieldInstruction;
    }

    /** @internal */
    public get currentYieldInstructionExist(): boolean {
        return this._isCurrenYieldInstructionExist;
    }

    /** @internal */
    public fatchNextInstruction(): YieldInstruction|null {
        const result = this._coroutineIterator.next();
        if (result.done) {
            this._currentYieldInstruction = null;
            this._isCurrenYieldInstructionExist = false;
            this._onFinish?.();
            this._onFinish = null;
            return null;
        }
        this._currentYieldInstruction = result.value;
        this._isCurrenYieldInstructionExist = true;
        return this._currentYieldInstruction;
    }
}
