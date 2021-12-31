import { WaitForEndOfFrame, WaitForSeconds, WaitUntil, WaitWhile } from "./YieldInstruction";
export class CoroutineProcessor {
    constructor(time) {
        this._time = time;
        this._coroutines = [];
        this._coroutineCount = 0;
    }
    addCoroutine(coroutine) {
        this._coroutines.push(coroutine);
        this._coroutineCount += 1;
    }
    removeCoroutine(coroutine) {
        const index = this._coroutines.indexOf(coroutine);
        if (index >= 0) {
            this._coroutines[index] = null;
            this._coroutineCount -= 1;
        }
    }
    tryCompact() {
        if (CoroutineProcessor._needToCompactCount <= this._coroutines.length - this._coroutineCount) {
            let insertPosition = 0;
            for (let i = 0; i < this._coroutines.length; i++) {
                const coroutine = this._coroutines[i];
                if (coroutine === null)
                    continue;
                this._coroutines[insertPosition] = coroutine;
                insertPosition += 1;
            }
            this._coroutines.length = this._coroutineCount;
        }
    }
    updateAfterProcess() {
        const coroutines = this._coroutines;
        for (let i = 0; i < coroutines.length; i++) {
            const coroutine = coroutines[i];
            if (coroutine == null)
                continue;
            if (coroutine.currentYieldInstructionExist) {
                this.updateAfterProcessSingleInstruction(coroutine);
            }
            else {
                coroutines[i] = null;
                this._coroutineCount -= 1;
            }
        }
    }
    updateAfterProcessSingleInstruction(coroutine) {
        const currentYieldInstruction = coroutine.currentYieldInstruction;
        if (currentYieldInstruction instanceof WaitForSeconds) {
            coroutine.elapsedTime += this._time.deltaTime;
            if (coroutine.elapsedTime >= currentYieldInstruction.seconds) {
                coroutine.elapsedTime = 0;
                coroutine.fatchNextInstruction();
            }
        }
        else if (currentYieldInstruction instanceof WaitUntil) {
            if (currentYieldInstruction.predicate()) {
                coroutine.fatchNextInstruction();
            }
        }
        else if (currentYieldInstruction instanceof WaitWhile) {
            if (!currentYieldInstruction.predicate()) {
                coroutine.fatchNextInstruction();
            }
        }
        else if (currentYieldInstruction === null) {
            coroutine.fatchNextInstruction();
        }
    }
    endFrameAfterProcess() {
        const coroutines = this._coroutines;
        for (let i = 0; i < coroutines.length; i++) {
            const coroutine = coroutines[i];
            if (coroutine == null)
                continue;
            if (coroutine.currentYieldInstructionExist) {
                this.endFrameAfterProcessSingleInstruction(coroutine);
            }
            else {
                coroutines[i] = null;
                this._coroutineCount -= 1;
            }
        }
    }
    endFrameAfterProcessSingleInstruction(coroutine) {
        const currentYieldInstruction = coroutine.currentYieldInstruction;
        if (currentYieldInstruction instanceof WaitForEndOfFrame) {
            coroutine.fatchNextInstruction();
        }
    }
}
CoroutineProcessor._needToCompactCount = 16;
