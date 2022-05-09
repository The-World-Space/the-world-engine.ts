import { jest } from "@jest/globals";
import { SceneBuilder } from "@src/engine/bootstrap/SceneBuilder";
import { EngineGlobalObject } from "@src/engine/EngineGlobalObject";
import { Scene } from "@src/engine/hierarchy_object/Scene";
import { Instantiater } from "@src/engine/Instantiater";
import { TransformMatrixProcessor } from "@src/engine/render/TransformMatrixProcessor";
import { SceneProcessor } from "@src/engine/SceneProcessor";

const createEngineGlobalObject = jest.fn<() => EngineGlobalObject>(() => {
    return {
        instantiater: new Instantiater({} as any),
        scene: new Scene(),
        transformMatrixProcessor: new TransformMatrixProcessor()
    } as EngineGlobalObject;
});

describe("SceneBuilder Test", () => {
    it("SceneBuilder.constructor()", () => {
        const builder = new SceneBuilder(new SceneProcessor());

        expect(builder).toBeInstanceOf(SceneBuilder);
    });

    it("SceneBuilder.withChild()", () => {
        const instantiater = new Instantiater(createEngineGlobalObject());
        const builder = new SceneBuilder(new SceneProcessor());

        builder.withChild(instantiater.buildGameObject("object1"));
    });

    it("SceneBuilder.withChild() chain", () => {
        const instantiater = new Instantiater(createEngineGlobalObject());
        const builder = new SceneBuilder(new SceneProcessor());

        builder
            .withChild(instantiater.buildGameObject("object1"))
            .withChild(instantiater.buildGameObject("object2"))
            .withChild(instantiater.buildGameObject("object3"));
    });
});
