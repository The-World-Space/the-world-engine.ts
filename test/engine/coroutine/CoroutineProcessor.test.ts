import { jest } from "@jest/globals";
import { Coroutine } from "@src/engine/coroutine/Coroutine";
import { CoroutineIterator } from "@src/engine/coroutine/CoroutineIterator";
import { CoroutineProcessor } from "@src/engine/coroutine/CoroutineProcessor";
import { WaitForEndOfFrame, WaitForSeconds, WaitUntil, WaitWhile } from "@src/engine/coroutine/YieldInstruction";
import { Time } from "@src/engine/time/Time";

const createCoroutine = jest.fn<(iterator: CoroutineIterator) => Coroutine>(iterator => {
    return new Coroutine({} as any, iterator, () => jest.fn());
});

describe("CoroutineProcessor Test", () => {
    it("CoroutineProcessor.constructor()", () => {
        const coroutineProcessor = new CoroutineProcessor(new Time());

        expect(coroutineProcessor).toBeDefined();
    });

    it("CoroutineProcessor.addCoroutine()", () => {
        const coroutineProcessor = new CoroutineProcessor(new Time());
        
        function *testIterator(): CoroutineIterator {
            yield null;
        }

        const coroutine = createCoroutine(testIterator());

        expect(() => {
            coroutineProcessor.addCoroutine(coroutine);
        }).not.toThrow();
    });

    it("CoroutineProcessor.removeCoroutine()", () => {
        const coroutineProcessor = new CoroutineProcessor(new Time());
        
        function *testIterator(): CoroutineIterator {
            yield null;
        }

        const coroutine = createCoroutine(testIterator());

        coroutineProcessor.addCoroutine(coroutine);

        expect(() => {
            coroutineProcessor.removeCoroutine(coroutine);
        }).not.toThrow();
    });

    it("CoroutineProcessor.tryCompact()", () => {
        const coroutineProcessor = new CoroutineProcessor(new Time());

        function *testIterator(): CoroutineIterator {
            yield null;
        }

        const coroutines: Coroutine[] = [];

        for (let i = 0; i < 128; ++i) {
            const coroutine = createCoroutine(testIterator());
            coroutineProcessor.addCoroutine(coroutine);
            coroutines.push(coroutine);
        }

        for (let i = 0; i < 64; ++i) {
            coroutineProcessor.removeCoroutine(coroutines[i]);
        }

        expect(() => {
            coroutineProcessor.tryCompact();
        }).not.toThrow();
    });

    it("CoroutineProcessor.updateAfterProcess()", () => {
        const result: number[] = [];

        const time = new Time();
        const coroutineProcessor = new CoroutineProcessor(time);

        function *testIterator(): CoroutineIterator {
            yield null;
            result.push(1);
            yield new WaitForSeconds(0);
            result.push(2);
            yield new WaitUntil(() => true);
            result.push(3);
            yield new WaitWhile(() => false);
            result.push(4);
            yield WaitForEndOfFrame.instance;
            result.push(5);
            yield new WaitForEndOfFrame();
            result.push(6);
        }

        const coroutine = createCoroutine(testIterator());
        coroutineProcessor.addCoroutine(coroutine);
        coroutine.fatchNextInstruction();

        coroutineProcessor.updateAfterProcess();
        coroutineProcessor.endFrameAfterProcess();

        coroutineProcessor.updateAfterProcess();
        coroutineProcessor.endFrameAfterProcess();

        coroutineProcessor.updateAfterProcess();
        coroutineProcessor.endFrameAfterProcess();

        coroutineProcessor.updateAfterProcess();
        coroutineProcessor.endFrameAfterProcess();

        coroutineProcessor.updateAfterProcess();
        coroutineProcessor.endFrameAfterProcess();

        coroutineProcessor.updateAfterProcess();
        coroutineProcessor.endFrameAfterProcess();

        expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it("CoroutineProcessor.endFrameAfterProcess()", () => {
        const result: number[] = [];

        const time = new Time();
        const coroutineProcessor = new CoroutineProcessor(time);

        function *testIterator(): CoroutineIterator {
            yield new WaitForEndOfFrame();
            result.push(1);
        }

        const coroutine = createCoroutine(testIterator());
        coroutineProcessor.addCoroutine(coroutine);
        coroutine.fatchNextInstruction();

        coroutineProcessor.endFrameAfterProcess();
        coroutineProcessor.endFrameAfterProcess();
        
        expect(result).toEqual([1]);
    });

    it("CoroutineProcessor delete and process", () => {
        const result: number[] = [];
        
        const time = new Time();
        const coroutineProcessor = new CoroutineProcessor(time);

        function *testIterator(): CoroutineIterator {
            yield null;
            result.push(1);
        }

        const coroutine = createCoroutine(testIterator());
        const coroutine2 = createCoroutine(testIterator());
        coroutineProcessor.addCoroutine(coroutine);
        coroutineProcessor.addCoroutine(coroutine2);
        coroutine.fatchNextInstruction();
        coroutine2.fatchNextInstruction();

        coroutineProcessor.removeCoroutine(coroutine);

        coroutineProcessor.updateAfterProcess();
        coroutineProcessor.endFrameAfterProcess();

        expect(result).toEqual([1]);
    });
});
