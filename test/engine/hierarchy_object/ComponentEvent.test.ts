import { EngineGlobalObject } from "@src/engine/EngineGlobalObject";
import { ComponentEvent } from "@src/engine/hierarchy_object/ComponentEvent";
import { Instantiater } from "@src/engine/Instantiater";

describe("ComponentEvent Test", () => {
    it("ComponentEvent.createAwakeEvent", () => {
        const instantiater = new Instantiater({} as EngineGlobalObject);
        const eventFunc = () => { };
        const event = ComponentEvent.createAwakeEvent(instantiater, eventFunc);

        expect(event).toBeInstanceOf(ComponentEvent);
    });
});
