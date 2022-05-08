import { jest } from "@jest/globals";
import { Bootstrapper } from "@src/engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "@src/engine/bootstrap/SceneBuilder";
import { EngineGlobalObject } from "@src/engine/EngineGlobalObject";

describe("Bootstrapper Test", () => {
    it("Bootstrapper.constructor()", () => {
        class TestBootstrapper extends Bootstrapper {
            public run(): SceneBuilder {
                return this.sceneBuilder;
            }
        }

        const engineGlobalObject = jest.fn<() => EngineGlobalObject>(() => {
            return {
                instantiater: { }
            } as EngineGlobalObject;
        })();
        const bootstrapper = new TestBootstrapper(engineGlobalObject);

        expect(bootstrapper.constructor).toEqual(TestBootstrapper);
    });
});
