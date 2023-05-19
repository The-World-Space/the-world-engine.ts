import { jest } from "@jest/globals";
import { CoroutineProcessor } from "@src/engine/coroutine/CoroutineProcessor";
import type { EngineGlobalObject } from "@src/engine/EngineGlobalObject";
import { Component } from "@src/engine/hierarchy_object/Component";
import type { ComponentConstructor } from "@src/engine/hierarchy_object/ComponentConstructor";
import { ComponentEventContainer } from "@src/engine/hierarchy_object/ComponentEventContainer";
import { GameObject } from "@src/engine/hierarchy_object/GameObject";
import { Scene } from "@src/engine/hierarchy_object/Scene";
import { Instantiater } from "@src/engine/Instantiater";
import { Collision2D } from "@src/engine/physics/2d/Collision2D";
import { TransformMatrixProcessor } from "@src/engine/render/TransformMatrixProcessor";
import { SceneProcessor } from "@src/engine/SceneProcessor";
import { Collider2D } from "@src/engine/script/physics2d/collider/Collider2D";
import { Time } from "@src/engine/time/Time";

const engineGlobalObject = {
    instantiater: new Instantiater({} as EngineGlobalObject),
    scene: new Scene(),
    transformMatrixProcessor: new TransformMatrixProcessor(),
    coroutineProcessor: new CoroutineProcessor(new Time()),
    sceneProcessor: new SceneProcessor()
} as EngineGlobalObject;

const createGameObject = jest.fn<() => GameObject>(() => {
    return new GameObject(engineGlobalObject, "test");
});

const createComponent = jest.fn<(componentCtor: ComponentConstructor) => Component>(componentCtor => {
    const component = new componentCtor(createGameObject());
    component.engine_internal_constructAfterProcess();
    return component;
});

describe("ComponentEventContainer Test", () => {
    beforeEach(() => {
        (engineGlobalObject.instantiater as Instantiater) = new Instantiater({} as EngineGlobalObject);
        (engineGlobalObject.scene as Scene) = new Scene();
        (engineGlobalObject.transformMatrixProcessor as TransformMatrixProcessor) = new TransformMatrixProcessor();
        (engineGlobalObject.coroutineProcessor as CoroutineProcessor) = new CoroutineProcessor(new Time());
        (engineGlobalObject.sceneProcessor as SceneProcessor) = new SceneProcessor();
    });

    it("ComponentEventContainer.tryCallAwake()", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public awake(): void {
                result.push("awake called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryCallAwake();

        expect(result).toEqual(["awake called"]);
    });

    it("ComponentEventContainer.tryCallAwake() when awake is not defined", () => {
        const result: string[] = [];

        class TestComponent extends Component { }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryCallAwake();

        expect(result).toEqual([]);
    });

    it("ComponentEventContainer.tryCallAwake() guarantee that awake will be called once", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public awake(): void {
                result.push("awake called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryCallAwake();
        container.tryCallAwake();

        expect(result).toEqual(["awake called"]);
    });

    it("ComponentEventContainer.tryRegisterOnEnable()", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public onEnable(): void {
                result.push("onEnable called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryRegisterOnEnable();
        engineGlobalObject.sceneProcessor.tryStartProcessSyncedEvent();

        expect(result).toEqual(["onEnable called"]);
    });

    it("ComponentEventContainer.tryRegisterOnEnable() when onEnable is not defined", () => {
        const result: string[] = [];

        class TestComponent extends Component { }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryRegisterOnEnable();
        engineGlobalObject.sceneProcessor.tryStartProcessSyncedEvent();

        expect(result).toEqual([]);
    });

    it("ComponentEventContainer.tryRegisterOnEnable() guarantee that onEnable will be called once", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public onEnable(): void {
                result.push("onEnable called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryRegisterOnEnable();
        container.tryRegisterOnEnable();
        engineGlobalObject.sceneProcessor.tryStartProcessSyncedEvent();

        expect(result).toEqual(["onEnable called"]);
    });

    it("ComponentEventContainer.tryRegisterOnEnable() when component is destroyed", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public onEnable(): void {
                result.push("onEnable called");
            }
        }

        const component = createComponent(TestComponent);
        const container = new ComponentEventContainer(component);

        component.destroy();
        container.tryRegisterOnEnable();
        engineGlobalObject.sceneProcessor.tryStartProcessSyncedEvent();

        expect(result).toEqual([]);
    });

    it("ComponentEventContainer.tryRegisterOnDisable()", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public onDisable(): void {
                result.push("onDisable called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryRegisterOnEnable();
        container.tryRegisterOnDisable();
        engineGlobalObject.sceneProcessor.tryStartProcessSyncedEvent();

        expect(result).toEqual(["onDisable called"]);
    });

    it("ComponentEventContainer.tryRegisterOnDisable() when onDisable is not defined", () => {
        const result: string[] = [];

        class TestComponent extends Component { }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryRegisterOnEnable();
        container.tryRegisterOnDisable();
        engineGlobalObject.sceneProcessor.tryStartProcessSyncedEvent();

        expect(result).toEqual([]);
    });

    it("ComponentEventContainer.tryRegisterOnDisable() guarantee that onDisable will be called once", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public onDisable(): void {
                result.push("onDisable called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryRegisterOnEnable();
        container.tryRegisterOnDisable();
        container.tryRegisterOnDisable();
        engineGlobalObject.sceneProcessor.tryStartProcessSyncedEvent();

        expect(result).toEqual(["onDisable called"]);
    });

    it("ComponentEventContainer.tryRegisterOnDisable() when component is destroyed", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public onDisable(): void {
                result.push("onDisable called");
            }
        }

        const component = createComponent(TestComponent);
        const container = new ComponentEventContainer(component);

        component.destroy();
        container.tryRegisterOnEnable();
        container.tryRegisterOnDisable();
        engineGlobalObject.sceneProcessor.tryStartProcessSyncedEvent();

        expect(result).toEqual([]);
    });

    it("ComponentEventContainer.tryRegisterOnDestroy()", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public onDestroy(): void {
                result.push("onDestroy called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryRegisterOnDestroy();
        engineGlobalObject.sceneProcessor.tryStartProcessSyncedEvent();

        expect(result).toEqual(["onDestroy called"]);
    });

    it("ComponentEventContainer.tryRegisterOnDestroy() when onDestroy is not defined", () => {
        const result: string[] = [];

        class TestComponent extends Component { }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryRegisterOnDestroy();
        engineGlobalObject.sceneProcessor.tryStartProcessSyncedEvent();

        expect(result).toEqual([]);
    });

    it("ComponentEventContainer.tryRegisterOnDestroy() guarantee that onDestroy will be called once", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public onDestroy(): void {
                result.push("onDestroy called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryRegisterOnDestroy();
        container.tryRegisterOnDestroy();
        engineGlobalObject.sceneProcessor.tryStartProcessSyncedEvent();

        expect(result).toEqual(["onDestroy called"]);
    });

    it("ComponentEventContainer.tryRegisterStart()", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public start(): void {
                result.push("start called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryRegisterStart();
        engineGlobalObject.sceneProcessor.startProcessNonSyncedEvent();

        expect(result).toEqual(["start called"]);
    });

    it("ComponentEventContainer.tryRegisterStart() when start is not defined", () => {
        const result: string[] = [];

        class TestComponent extends Component { }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryRegisterStart();
        engineGlobalObject.sceneProcessor.startProcessNonSyncedEvent();

        expect(result).toEqual([]);
    });

    it("ComponentEventContainer.tryRegisterStart() guarantee that start will be called once", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public start(): void {
                result.push("start called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryRegisterStart();
        container.tryRegisterStart();
        engineGlobalObject.sceneProcessor.startProcessNonSyncedEvent();

        expect(result).toEqual(["start called"]);
    });

    it("ComponentEventContainer.tryRegisterStart() when component is destroyed", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public start(): void {
                result.push("start called");
            }
        }

        const component = createComponent(TestComponent);
        const container = new ComponentEventContainer(component);

        component.destroy();
        container.tryRegisterStart();
        engineGlobalObject.sceneProcessor.startProcessNonSyncedEvent();

        expect(result).toEqual([]);
    });

    it("ComponentEventContainer.tryRegisterStart() when start is already called", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public start(): void {
                result.push("start called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryRegisterStart();
        engineGlobalObject.sceneProcessor.startProcessNonSyncedEvent();
        container.tryRegisterStart();
        engineGlobalObject.sceneProcessor.startProcessNonSyncedEvent();

        expect(result).toEqual(["start called"]);
    });

    it("ComponentEventContainer.tryUnregisterStart()", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public start(): void {
                result.push("start called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryRegisterStart();
        container.tryUnregisterStart();
        engineGlobalObject.sceneProcessor.startProcessNonSyncedEvent();

        expect(result).toEqual([]);
    });

    it("ComponentEventContainer.tryRegisterUpdate()", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public update(): void {
                result.push("update called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryRegisterUpdate();
        engineGlobalObject.sceneProcessor.startProcessNonSyncedEvent();

        expect(result).toEqual(["update called"]);
    });

    it("ComponentEventContainer.tryRegisterUpdate() when update is not defined", () => {
        const result: string[] = [];

        class TestComponent extends Component { }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryRegisterUpdate();
        engineGlobalObject.sceneProcessor.startProcessNonSyncedEvent();

        expect(result).toEqual([]);
    });

    it("ComponentEventContainer.tryRegisterUpdate() guarantee that update will be called once", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public update(): void {
                result.push("update called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryRegisterUpdate();
        container.tryRegisterUpdate();
        engineGlobalObject.sceneProcessor.startProcessNonSyncedEvent();

        expect(result).toEqual(["update called"]);
    });

    it("ComponentEventContainer.tryRegisterUpdate() when component is destroyed", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public update(): void {
                result.push("update called");
            }
        }

        const component = createComponent(TestComponent);
        const container = new ComponentEventContainer(component);

        component.destroy();
        container.tryRegisterUpdate();
        engineGlobalObject.sceneProcessor.startProcessNonSyncedEvent();

        expect(result).toEqual([]);
    });

    it("ComponentEventContainer.tryUnregisterUpdate()", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public update(): void {
                result.push("update called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryRegisterUpdate();
        container.tryUnregisterUpdate();
        engineGlobalObject.sceneProcessor.startProcessNonSyncedEvent();

        expect(result).toEqual([]);
    });

    it("ComponentEventContainer.tryUnregisterUpdate() when update is not registered", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public update(): void {
                result.push("update called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.tryUnregisterUpdate();
        engineGlobalObject.sceneProcessor.startProcessNonSyncedEvent();

        expect(result).toEqual([]);
    });

    it("ComponentEventContainer.onCollisionEnter2D", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public onCollisionEnter2D(): void {
                result.push("onCollisionEnter2D called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.onCollisionEnter2D!.invoke(new Collision2D());
        expect(result).toEqual(["onCollisionEnter2D called"]);
    });

    it("ComponentEventContainer.onCollisionStay2D", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public onCollisionStay2D(): void {
                result.push("onCollisionStay2D called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.onCollisionStay2D!.invoke(new Collision2D());
        expect(result).toEqual(["onCollisionStay2D called"]);
    });

    it("ComponentEventContainer.onCollisionExit2D", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public onCollisionExit2D(): void {
                result.push("onCollisionExit2D called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.onCollisionExit2D!.invoke(new Collision2D());
        expect(result).toEqual(["onCollisionExit2D called"]);
    });

    it("ComponentEventContainer.onTriggerEnter2D", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public onTriggerEnter2D(): void {
                result.push("onTriggerEnter2D called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.onTriggerEnter2D!.invoke(new Collider2D(createGameObject()));
        expect(result).toEqual(["onTriggerEnter2D called"]);
    });

    it("ComponentEventContainer.onTriggerStay2D", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public onTriggerStay2D(): void {
                result.push("onTriggerStay2D called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.onTriggerStay2D!.invoke(new Collider2D(createGameObject()));
        expect(result).toEqual(["onTriggerStay2D called"]);
    });

    it("ComponentEventContainer.onTriggerExit2D", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public onTriggerExit2D(): void {
                result.push("onTriggerExit2D called");
            }
        }

        const container = new ComponentEventContainer(createComponent(TestComponent));

        container.onTriggerExit2D!.invoke(new Collider2D(createGameObject()));
        expect(result).toEqual(["onTriggerExit2D called"]);
    });
});
