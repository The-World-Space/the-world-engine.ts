import { jest } from "@jest/globals";
import { Coroutine } from "@src/engine/coroutine/Coroutine";
import type { CoroutineIterator } from "@src/engine/coroutine/CoroutineIterator";
import { WaitForSeconds } from "@src/engine/coroutine/YieldInstruction";
import type { Component } from "@src/engine/hierarchy_object/Component";

const createComponent = jest.fn<() => Component>(() => {
    return {
        id: 0
    } as unknown as Component;
});

describe("Coroutine Test", () => {
    it("Coroutine.constructor()", () => {
        function *testCoroutine(): CoroutineIterator {
            yield 1;
        }

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const coroutine = new Coroutine(createComponent(), testCoroutine(), () => { });

        expect(coroutine).toBeDefined();
    });

    it("Coroutine.component", () => {
        function *testCoroutine(): CoroutineIterator {
            yield 1;
        }

        const component = createComponent();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const coroutine = new Coroutine(component, testCoroutine(), () => { });

        expect(coroutine.component).toBe(component);
    });

    it("Coroutine.elapsedTime getter", () => {
        function *testCoroutine(): CoroutineIterator {
            yield 1;
        }

        const component = createComponent();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const coroutine = new Coroutine(component, testCoroutine(), () => { });

        expect(coroutine.elapsedTime).toBe(0);
    });

    it("Coroutine.elapsedTime setter", () => {
        function *testCoroutine(): CoroutineIterator {
            yield 1;
        }

        const component = createComponent();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const coroutine = new Coroutine(component, testCoroutine(), () => { });

        coroutine.elapsedTime = 1;

        expect(coroutine.elapsedTime).toBe(1);
    });

    it("Coroutine.currentYieldInstruction", () => {
        function *testCoroutine(): CoroutineIterator {
            yield new WaitForSeconds(1.0);
        }

        const component = createComponent();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const coroutine = new Coroutine(component, testCoroutine(), () => { });

        expect(coroutine.currentYieldInstruction).toBeNull();
    });

    it("Coroutine.currentYieldInstruction 2", () => {
        function *testCoroutine(): CoroutineIterator {
            yield new WaitForSeconds(1.0);
        }

        const component = createComponent();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const coroutine = new Coroutine(component, testCoroutine(), () => { });

        coroutine.fatchNextInstruction();
        expect(coroutine.currentYieldInstruction).toEqual(new WaitForSeconds(1.0));
    });

    it("Coroutine.currentYieldInstruction 3", () => {
        function *testCoroutine(): CoroutineIterator {
            yield new WaitForSeconds(1.0);
            yield new WaitForSeconds(2.0);
        }

        const component = createComponent();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const coroutine = new Coroutine(component, testCoroutine(), () => { });

        coroutine.fatchNextInstruction();
        coroutine.fatchNextInstruction();

        expect(coroutine.currentYieldInstruction).toEqual(new WaitForSeconds(2.0));
    });

    it("Coroutine.currentYieldInstructionExist", () => {
        function *testCoroutine(): CoroutineIterator {
            yield new WaitForSeconds(1.0);
        }

        const component = createComponent();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const coroutine = new Coroutine(component, testCoroutine(), () => { });

        expect(coroutine.currentYieldInstructionExist).toBeFalsy();
    });

    it("Coroutine.currentYieldInstructionExist 2", () => {
        function *testCoroutine(): CoroutineIterator {
            yield new WaitForSeconds(1.0);
        }

        const component = createComponent();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const coroutine = new Coroutine(component, testCoroutine(), () => { });

        coroutine.fatchNextInstruction();
        expect(coroutine.currentYieldInstructionExist).toBeTruthy();
    });

    it("Coroutine.fatchNextInstruction", () => {
        function *testCoroutine(): CoroutineIterator {
            yield new WaitForSeconds(1.0);
        }

        const component = createComponent();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const coroutine = new Coroutine(component, testCoroutine(), () => { });

        coroutine.fatchNextInstruction();
        coroutine.fatchNextInstruction();

        expect(coroutine.currentYieldInstructionExist).toBeFalsy();
    });

    it("Coroutine onFinish must be called once", () => {
        let onFinishCalled = 0;
        function *testCoroutine(): CoroutineIterator {
            yield new WaitForSeconds(1.0);
        }

        const component = createComponent();
        const coroutine = new Coroutine(component, testCoroutine(), () => {
            onFinishCalled += 1;
        });

        coroutine.fatchNextInstruction();
        coroutine.fatchNextInstruction();
        coroutine.fatchNextInstruction();

        expect(onFinishCalled).toBe(1);
    });
});
