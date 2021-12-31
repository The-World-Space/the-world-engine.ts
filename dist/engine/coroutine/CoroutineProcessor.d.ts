import { IReadonlyTime } from "../time/IReadonlyTime";
import { Coroutine } from "./Coroutine";
export declare class CoroutineProcessor {
    private _time;
    private _coroutines;
    private _coroutineCount;
    private static readonly _needToCompactCount;
    constructor(time: IReadonlyTime);
    addCoroutine(coroutine: Coroutine): void;
    removeCoroutine(coroutine: Coroutine): void;
    tryCompact(): void;
    updateAfterProcess(): void;
    private updateAfterProcessSingleInstruction;
    endFrameAfterProcess(): void;
    private endFrameAfterProcessSingleInstruction;
}
