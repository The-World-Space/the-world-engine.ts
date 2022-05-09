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
        const engineGlobalObject = createEngineGlobalObject();
        const instantiater = new Instantiater(engineGlobalObject);
        const builder = new SceneBuilder(new SceneProcessor());

        builder.withChild(instantiater.buildGameObject("object1"));

        expect(engineGlobalObject.scene.children.length).toBe(1);
    });

    it("SceneBuilder.withChild() chain", () => {
        const engineGlobalObject = createEngineGlobalObject();
        const instantiater = new Instantiater(engineGlobalObject);
        const builder = new SceneBuilder(new SceneProcessor());

        builder
            .withChild(instantiater.buildGameObject("object1"))
            .withChild(instantiater.buildGameObject("object2"))
            .withChild(instantiater.buildGameObject("object3"));

        expect(engineGlobalObject.scene.children.length).toBe(3);
    });

    it("SceneBuilder.build()", () => {
        const engineGlobalObject = createEngineGlobalObject();
        const instantiater = new Instantiater(engineGlobalObject);
        const builder = new SceneBuilder(new SceneProcessor());

        builder
            .withChild(instantiater.buildGameObject("object1"))
            .withChild(instantiater.buildGameObject("object2"))
            .withChild(instantiater.buildGameObject("object3"));

        builder.build();
    });

    it("SceneBuilder.build() same object multiple times", () => {
        const engineGlobalObject = createEngineGlobalObject();
        const instantiater = new Instantiater(engineGlobalObject);
        const builder = new SceneBuilder(new SceneProcessor());

        const gameObjectBuilder = instantiater.buildGameObject("object1");

        builder
            .withChild(gameObjectBuilder)
            .withChild(gameObjectBuilder)
            .withChild(gameObjectBuilder);

        expect(() => {
            builder.build();
        }).toThrowError("GameObjectBuilder is already built");
    });
});
