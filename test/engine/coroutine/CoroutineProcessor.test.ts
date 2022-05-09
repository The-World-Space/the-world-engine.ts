import { CoroutineProcessor } from "@src/engine/coroutine/CoroutineProcessor";
import { Time } from "@src/engine/time/Time";

describe("CoroutineProcessor Test", () => {
    it("CoroutineProcessor.constructor()", () => {
        const coroutineProcessor = new CoroutineProcessor(new Time());

        expect(coroutineProcessor).toBeDefined();
    });
});
