import { EventContainer } from "@src/engine/collection/EventContainer";

describe("EventContainer Test", () => {
    it("EventContainer.constructor()", () => {
        const eventContainer = new EventContainer<() => void>();

        expect(eventContainer).toBeDefined();
    });

    it("EventContainer.addListener()", () => {
        const eventContainer = new EventContainer<() => void>();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const listener = (): void => { };
        eventContainer.addListener(listener);

        expect(eventContainer.length).toBe(1);
    });

    it("EventContainer.addListener() same listener", () => {
        const eventContainer = new EventContainer<() => void>();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const listener = (): void => { };
        eventContainer.addListener(listener);
        eventContainer.addListener(listener);

        expect(eventContainer.length).toBe(2);
    });

    it("EventContainer.removeListener()", () => {
        const eventContainer = new EventContainer<() => void>();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const listener = (): void => { };
        eventContainer.addListener(listener);
        eventContainer.removeListener(listener);
        expect(eventContainer.length).toBe(0);
    });

    it("EventContainer.removeListener() 2", () => {
        const eventContainer = new EventContainer<() => void>();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const listener = (): void => { };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const listener2 = (): void => { };
        eventContainer.addListener(listener);
        eventContainer.addListener(listener2);
        eventContainer.removeListener(listener);
        expect(eventContainer.length).toBe(1);
    });

    it("EventContainer.removelistener() with not existing listener", () => {
        const eventContainer = new EventContainer<() => void>();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const listener = (): void => { };

        expect(() => {
            eventContainer.removeListener(listener);
        }).not.toThrow();
    });

    it("EventContainer.removeAllListeners()", () => {
        const eventContainer = new EventContainer<() => void>();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const listener = (): void => { };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const listener2 = (): void => { };
        eventContainer.addListener(listener);
        eventContainer.addListener(listener2);
        eventContainer.removeAllListeners();

        expect(eventContainer.length).toBe(0);
    });

    it("EventContainer.invoke()", () => {
        const result: string[] = [];
        const eventContainer = new EventContainer<() => void>();

        const f2 = (): void => {
            result.push("f2");
        };

        const f3 = (): void => {
            result.push("f3");
        };

        const f1 = (): void => {
            result.push("f1");
            eventContainer.removeListener(f2);
            eventContainer.addListener(f3);
        };

        eventContainer.addListener(f1);
        eventContainer.addListener(f2);

        eventContainer.invoke();

        expect(result).toEqual(["f1", "f3"]);
    });

    it("EventContainer.invoke() with empty container", () => {
        const eventContainer = new EventContainer<() => void>();

        expect(() => {
            eventContainer.invoke();
        }).not.toThrow();
    });

    it("EventContainer.invoke() removeAllListeners while invoking", () => {
        const result: string[] = [];
        const eventContainer = new EventContainer<() => void>();

        const f2 = (): void => {
            result.push("f2");
        };

        const f3 = (): void => {
            result.push("f3");
        };

        const f1 = (): void => {
            result.push("f1");
            eventContainer.removeAllListeners();
            eventContainer.addListener(f3);
        };

        eventContainer.addListener(f1);
        eventContainer.addListener(f2);

        eventContainer.invoke();

        expect(result).toEqual(["f1", "f3"]);
    });

    it("EventContainer.invoke() removeAllListeners while invoking 2", () => {
        const result: string[] = [];
        const eventContainer = new EventContainer<() => void>();

        const f2 = (): void => {
            result.push("f2");
        };

        const f1 = (): void => {
            result.push("f1");
            eventContainer.removeAllListeners();
        };

        eventContainer.addListener(f1);
        eventContainer.addListener(f2);

        eventContainer.invoke();

        expect(result).toEqual(["f1"]);
    });

    it("EventContainer.length", () => {
        const eventContainer = new EventContainer<() => void>();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const listener = (): void => { };
        eventContainer.addListener(listener);
        expect(eventContainer.length).toBe(1);
    });
});
