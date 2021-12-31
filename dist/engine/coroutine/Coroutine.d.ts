import { Component } from "../hierarchy_object/Component";
import { CoroutineIterator } from "./CoroutineIterator";
import { ICoroutine } from "./ICoroutine";
import { YieldInstruction } from "./YieldInstruction";
export declare class Coroutine implements ICoroutine {
    private _component;
    private _elapsedTime;
    private _coroutineIterator;
    private _currentYieldInstruction;
    private _isCurrenYieldInstructionExist;
    private _onFinish;
    constructor(component: Component, coroutineIterator: CoroutineIterator, onFinish: () => void);
    get component(): Component;
    get elapsedTime(): number;
    set elapsedTime(value: number);
    get currentYieldInstruction(): YieldInstruction | null;
    get currentYieldInstructionExist(): boolean;
    fatchNextInstruction(): YieldInstruction | null;
}
