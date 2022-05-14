import { EngineGlobalObject } from "@src/engine/EngineGlobalObject";
import { ComponentEvent } from "@src/engine/hierarchy_object/ComponentEvent";
import { Instantiater } from "@src/engine/Instantiater";

describe("ComponentEvent Test", () => {
    it("ComponentEvent.createAwakeEvent", () => {
        const instantiater = new Instantiater({} as EngineGlobalObject);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const eventFunc = (): void => { };
        const event = ComponentEvent.createAwakeEvent(instantiater, eventFunc);

        expect(event).toBeInstanceOf(ComponentEvent);
    });

    it("ComponentEvent.createStartEvent", () => {
        const instantiater = new Instantiater({} as EngineGlobalObject);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const eventFunc = (): void => { };
        const event = ComponentEvent.createStartEvent(instantiater, eventFunc, 0);

        expect(event).toBeInstanceOf(ComponentEvent);
    });

    it("ComponentEvent.createUpdateEvent", () => {
        const instantiater = new Instantiater({} as EngineGlobalObject);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const eventFunc = (): void => { };
        const event = ComponentEvent.createUpdateEvent(instantiater, eventFunc, 0);

        expect(event).toBeInstanceOf(ComponentEvent);
    });

    it("ComponentEvent.createOnEnableEvent", () => {
        const instantiater = new Instantiater({} as EngineGlobalObject);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const eventFunc = (): void => { };
        const event = ComponentEvent.createOnEnableEvent(instantiater, eventFunc, 0);

        expect(event).toBeInstanceOf(ComponentEvent);
    });

    it("ComponentEvent.createOnDisableEvent", () => {
        const instantiater = new Instantiater({} as EngineGlobalObject);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const eventFunc = (): void => { };
        const event = ComponentEvent.createOnDisableEvent(instantiater, eventFunc, 0);

        expect(event).toBeInstanceOf(ComponentEvent);
    });

    it("ComponentEvent.createOnDestroyEvent", () => {
        const instantiater = new Instantiater({} as EngineGlobalObject);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const eventFunc = (): void => { };
        const event = ComponentEvent.createOnDestroyEvent(instantiater, eventFunc, 0);

        expect(event).toBeInstanceOf(ComponentEvent);
    });

    it("ComponentEvent.createOnCollisionEnter2DEvent", () => {
        const instantiater = new Instantiater({} as EngineGlobalObject);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const eventFunc = (): void => { };
        const event = ComponentEvent.createOnCollisionEnter2DEvent(instantiater, eventFunc, 0);

        expect(event).toBeInstanceOf(ComponentEvent);
    });

    it("ComponentEvent.createOnCollisionStay2DEvent", () => {
        const instantiater = new Instantiater({} as EngineGlobalObject);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const eventFunc = (): void => { };
        const event = ComponentEvent.createOnCollisionStay2DEvent(instantiater, eventFunc, 0);

        expect(event).toBeInstanceOf(ComponentEvent);
    });

    it("ComponentEvent.createOnCollisionExit2DEvent", () => {
        const instantiater = new Instantiater({} as EngineGlobalObject);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const eventFunc = (): void => { };
        const event = ComponentEvent.createOnCollisionExit2DEvent(instantiater, eventFunc, 0);

        expect(event).toBeInstanceOf(ComponentEvent);
    });

    it("ComponentEvent.createOnTriggerEnter2DEvent", () => {
        const instantiater = new Instantiater({} as EngineGlobalObject);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const eventFunc = (): void => { };
        const event = ComponentEvent.createOnTriggerEnter2DEvent(instantiater, eventFunc, 0);

        expect(event).toBeInstanceOf(ComponentEvent);
    });

    it("ComponentEvent.createOnTriggerStay2DEvent", () => {
        const instantiater = new Instantiater({} as EngineGlobalObject);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const eventFunc = (): void => { };
        const event = ComponentEvent.createOnTriggerStay2DEvent(instantiater, eventFunc, 0);

        expect(event).toBeInstanceOf(ComponentEvent);
    });

    it("ComponentEvent.createOnTriggerExit2DEvent", () => {
        const instantiater = new Instantiater({} as EngineGlobalObject);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const eventFunc = (): void => { };
        const event = ComponentEvent.createOnTriggerExit2DEvent(instantiater, eventFunc, 0);

        expect(event).toBeInstanceOf(ComponentEvent);
    });

    it("ComponentEvent.invoke", () => {
        const result: string[] = [];

        const instantiater = new Instantiater({} as EngineGlobalObject);
        const eventFunc = (): void => {
            result.push("eventFunc"); 
        };
        const event = ComponentEvent.createAwakeEvent(instantiater, eventFunc);

        event.invoke();

        expect(result).toEqual(["eventFunc"]);
    });

    it("ComponentEvent.comparator with different event types", () => {
        const instantiater = new Instantiater({} as EngineGlobalObject);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const eventFunc1 = (): void => { };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const eventFunc2 = (): void => { };
        const event1 = ComponentEvent.createAwakeEvent(instantiater, eventFunc1);
        const event2 = ComponentEvent.createStartEvent(instantiater, eventFunc2, 0);

        expect(ComponentEvent.comparator(event1, event2)).toBeLessThan(0);
    });

    it("ComponentEvent.comparator with same event types", () => {
        const instantiater = new Instantiater({} as EngineGlobalObject);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const eventFunc1 = (): void => { };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const eventFunc2 = (): void => { };
        const event1 = ComponentEvent.createAwakeEvent(instantiater, eventFunc1);
        const event2 = ComponentEvent.createAwakeEvent(instantiater, eventFunc2);

        expect(ComponentEvent.comparator(event1, event2)).toBeLessThan(0);
    });

    it("ComponentEvent.comparator with different execution order", () => {
        const instantiater = new Instantiater({} as EngineGlobalObject);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const eventFunc1 = (): void => { };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const eventFunc2 = (): void => { };
        const event1 = ComponentEvent.createOnEnableEvent(instantiater, eventFunc1, 0);
        const event2 = ComponentEvent.createOnEnableEvent(instantiater, eventFunc2, 1);

        expect(ComponentEvent.comparator(event1, event2)).toBeLessThan(0);
    });
});
