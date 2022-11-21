import { WaitForEndOfFrame, WaitForSeconds, WaitUntil, WaitWhile } from "@src/engine/coroutine/YieldInstruction";

describe("YieldInstruction Test", () => {
    it("WaitForEndOfFrame.constructor()", () => {
        const waitForEndOfFrame = new WaitForEndOfFrame();

        expect(waitForEndOfFrame).toBeDefined();
    });

    it("WaitForEndOfFrame.instance", () => {
        const waitForEndOfFrame = WaitForEndOfFrame.instance;

        expect(waitForEndOfFrame).toBeDefined();
    });

    it("WaitForSeconds.constructor()", () => {
        const waitForSeconds = new WaitForSeconds(1.0);

        expect(waitForSeconds).toBeDefined();
    });

    it("WaitForSeconds.seconds", () => {
        const waitForSeconds = new WaitForSeconds(1.0);

        expect(waitForSeconds.seconds).toBe(1.0);
    });

    it("WaitUntil.constructor()", () => {
        const waitUntil = new WaitUntil(() => true);

        expect(waitUntil).toBeDefined();
    });

    it("WaitUntil.predicate", () => {
        const waitUntil = new WaitUntil(() => true);

        expect(waitUntil.predicate()).toBe(true);
    });

    it("WaitWhile.constructor()", () => {
        const waitWhile = new WaitWhile(() => true);

        expect(waitWhile).toBeDefined();
    });

    it("WaitWhile.predicate", () => {
        const waitWhile = new WaitWhile(() => true);

        expect(waitWhile.predicate()).toBe(true);
    });
});
