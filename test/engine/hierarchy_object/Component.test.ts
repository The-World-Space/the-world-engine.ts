import { jest } from "@jest/globals";
import { Bootstrapper } from "@src/engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "@src/engine/bootstrap/SceneBuilder";
import { Coroutine } from "@src/engine/coroutine/Coroutine";
import { CoroutineIterator } from "@src/engine/coroutine/CoroutineIterator";
import { CoroutineProcessor } from "@src/engine/coroutine/CoroutineProcessor";
import { EngineGlobalObject } from "@src/engine/EngineGlobalObject";
import { Game } from "@src/engine/Game";
import { Component } from "@src/engine/hierarchy_object/Component";
import { GameObject } from "@src/engine/hierarchy_object/GameObject";
import { PrefabRef } from "@src/engine/hierarchy_object/PrefabRef";
import { Scene } from "@src/engine/hierarchy_object/Scene";
import { Transform } from "@src/engine/hierarchy_object/Transform";
import { Instantiater } from "@src/engine/Instantiater";
import { TransformMatrixProcessor } from "@src/engine/render/TransformMatrixProcessor";
import { Camera } from "@src/engine/script/render/Camera";
import { Time } from "@src/engine/time/Time";

const engineGlobalObject = {
    instantiater: new Instantiater({} as EngineGlobalObject),
    scene: new Scene(),
    transformMatrixProcessor: new TransformMatrixProcessor(),
    coroutineProcessor: new CoroutineProcessor(new Time())
} as EngineGlobalObject;

const createGameObject = jest.fn<() => GameObject>(() => {
    return new GameObject(engineGlobalObject, "test");
});

let requestAnimationFrameCount = 1;

describe("Component Test", () => {
    beforeEach(() => {
        (engineGlobalObject.instantiater as Instantiater) = new Instantiater({} as EngineGlobalObject);
        (engineGlobalObject.scene as Scene) = new Scene();
        (engineGlobalObject.transformMatrixProcessor as TransformMatrixProcessor) = new TransformMatrixProcessor();
        (engineGlobalObject.coroutineProcessor as CoroutineProcessor) = new CoroutineProcessor(new Time());

        let requestAnimationFrameCallCount = 0;
        jest.spyOn(window, "requestAnimationFrame")
            .mockImplementation(
                (callback: FrameRequestCallback) => {
                    requestAnimationFrameCallCount += 1;
                    if (requestAnimationFrameCallCount === requestAnimationFrameCount) return 0;
                    callback(0);
                    return 0;
                }
            );
    });

    afterEach(() => {
        (window.requestAnimationFrame as jest.Mock).mockRestore();
    });

    it("override disallowMultipleComponent to true", () => {
        class TestComponent extends Component {
            public override readonly disallowMultipleComponent: boolean = true;
        }
        const component = new TestComponent(createGameObject());
        component.engine_internal_constructAfterProcess();

        expect(component.disallowMultipleComponent).toBe(true);
    });

    it("override disallowMultipleComponent to false", () => {
        class TestComponent extends Component {
            public override readonly disallowMultipleComponent: boolean = false;
        }
        const component = new TestComponent(createGameObject());
        component.engine_internal_constructAfterProcess();

        expect(component.disallowMultipleComponent).toBe(false);
    });

    it("override requiredComponents to [ComponentA, ComponentB]", () => {
        class ComponentA extends Component { }
        class ComponentB extends Component { }

        class TestComponent extends Component {
            public override readonly requiredComponents = [ComponentA, ComponentB];
        }
        const component = new TestComponent(createGameObject());
        component.engine_internal_constructAfterProcess();

        expect(component.requiredComponents).toEqual([ComponentA, ComponentB]);
    });

    it("override requiredComponents to [ComponentA]", () => {
        class ComponentA extends Component { }

        class TestComponent extends Component {
            public override readonly requiredComponents = [ComponentA];
        }
        const component = new TestComponent(createGameObject());
        component.engine_internal_constructAfterProcess();

        expect(component.requiredComponents).toEqual([ComponentA]);
    });

    it("default executionOrder", () => {
        class TestComponent extends Component { }
        const component = new TestComponent(createGameObject());
        component.engine_internal_constructAfterProcess();

        expect(component.executionOrder).toBe(0);
    });

    it("override executionOrder", () => {
        class TestComponent extends Component {
            public override readonly executionOrder = 1;
        }
        const component = new TestComponent(createGameObject());
        component.engine_internal_constructAfterProcess();

        expect(component.executionOrder).toBe(1);
    });

    it("Component.startCoroutine()", () => {
        const result: number[] = [];

        class TestComponent extends Component {
            private *testCoroutine(): CoroutineIterator {
                result.push(1);
                yield null;
                result.push(2);
            }

            public testRunCoroutine(): void {
                this.startCoroutine(this.testCoroutine());
            }
        }

        const component = new TestComponent(createGameObject());
        component.engine_internal_constructAfterProcess();

        component.testRunCoroutine();

        engineGlobalObject.coroutineProcessor.updateAfterProcess();
        engineGlobalObject.coroutineProcessor.endFrameAfterProcess();
        engineGlobalObject.coroutineProcessor.updateAfterProcess();
        engineGlobalObject.coroutineProcessor.endFrameAfterProcess();

        expect(result).toEqual([1, 2]);
    });

    it("Component.stopAllCoroutines()", () => {
        const result: number[] = [];

        class TestComponent extends Component {
            private *testCoroutine(): CoroutineIterator {
                result.push(1);
                yield null;
                result.push(2);
                yield null;
                result.push(3);
            }

            public testRunCoroutine(): void {
                this.startCoroutine(this.testCoroutine());
            }
        }

        const component = new TestComponent(createGameObject());
        component.engine_internal_constructAfterProcess();

        component.testRunCoroutine();

        engineGlobalObject.coroutineProcessor.updateAfterProcess();
        engineGlobalObject.coroutineProcessor.endFrameAfterProcess();

        component.stopAllCoroutines();

        engineGlobalObject.coroutineProcessor.updateAfterProcess();
        engineGlobalObject.coroutineProcessor.endFrameAfterProcess();

        expect(result).toEqual([1, 2]);
    });

    it("Component.stopCoroutine()", () => {
        const result: number[] = [];

        class TestComponent extends Component {
            private *testCoroutine(): CoroutineIterator {
                result.push(1);
                yield null;
                result.push(2);
                yield null;
                result.push(3);
            }

            public testRunCoroutine(): Coroutine {
                return this.startCoroutine(this.testCoroutine());
            }
        }

        const component = new TestComponent(createGameObject());
        component.engine_internal_constructAfterProcess();

        const coroutine = component.testRunCoroutine();

        engineGlobalObject.coroutineProcessor.updateAfterProcess();
        engineGlobalObject.coroutineProcessor.endFrameAfterProcess();

        component.stopCoroutine(coroutine);

        engineGlobalObject.coroutineProcessor.updateAfterProcess();
        engineGlobalObject.coroutineProcessor.endFrameAfterProcess();

        expect(result).toEqual([1, 2]);
    });

    it("Component.stopCoroutine() throw error", () => {
        class TestComponent extends Component {
            private *testCoroutine(): CoroutineIterator {
                yield null;
            }

            public testRunCoroutine(): Coroutine {
                return this.startCoroutine(this.testCoroutine());
            }
        }

        const component = new TestComponent(createGameObject());
        component.engine_internal_constructAfterProcess();

        const component2 = new TestComponent(createGameObject());
        component2.engine_internal_constructAfterProcess();

        const coroutine = component.testRunCoroutine();

        expect(() => {
            component2.stopCoroutine(coroutine);
        }).toThrowError("Coroutine is not owned by this component");
    });

    it("Component.enabled getter default value", () => {
        class TestComponent extends Component { }
        const component = new TestComponent(createGameObject());
        component.engine_internal_constructAfterProcess();
        
        expect(component.enabled).toBe(true);
    });

    it("Component.enabled getter", () => {
        class TestComponent extends Component { }
        const component = new TestComponent(createGameObject());
        component.engine_internal_constructAfterProcess();

        component.enabled = false;

        expect(component.enabled).toBe(false);
    });

    it("Component.enabled getter on engine", () => {
        requestAnimationFrameCount = 1;

        class TestComponent extends Component { }

        const interopObject = { testComponent: new PrefabRef<TestComponent>() };
        new Game(document.body).run(class extends Bootstrapper<typeof interopObject> {
            public run = (): SceneBuilder => this.sceneBuilder
                .withChild(this.instantiater.buildGameObject("camera")
                    .withComponent(Camera))
                
                .withChild(this.instantiater.buildGameObject("test")
                    .withComponent(TestComponent)
                    .getComponent(TestComponent, this.interopObject!.testComponent));
        }, interopObject);

        expect(interopObject.testComponent.ref!.enabled).toBe(true);
    });

    it("Component.enabled setter call on builder", () => {
        requestAnimationFrameCount = 1;

        class TestComponent extends Component { }

        const interopObject = { testComponent: new PrefabRef<TestComponent>() };
        new Game(document.body).run(class extends Bootstrapper<typeof interopObject> {
            public run = (): SceneBuilder => this.sceneBuilder
                .withChild(this.instantiater.buildGameObject("camera")
                    .withComponent(Camera))
                
                .withChild(this.instantiater.buildGameObject("test")
                    .withComponent(TestComponent, c => c.enabled = false)
                    .getComponent(TestComponent, this.interopObject!.testComponent));
        }, interopObject);

        expect(interopObject.testComponent.ref!.enabled).toBe(false);
    });

    it("Component.enabled setter call after built", () => {
        requestAnimationFrameCount = 1;

        class TestComponent extends Component { }

        const interopObject = { testComponent: new PrefabRef<TestComponent>() };
        new Game(document.body).run(class extends Bootstrapper<typeof interopObject> {
            public run = (): SceneBuilder => this.sceneBuilder
                .withChild(this.instantiater.buildGameObject("camera")
                    .withComponent(Camera))
                
                .withChild(this.instantiater.buildGameObject("test")
                    .withComponent(TestComponent)
                    .getComponent(TestComponent, this.interopObject!.testComponent));
        }, interopObject);

        interopObject.testComponent.ref!.enabled = false;
        expect(interopObject.testComponent.ref!.enabled).toBe(false);
    });

    it("Component.enabled setter call twice after built", () => {
        requestAnimationFrameCount = 1;

        class TestComponent extends Component { }

        const interopObject = { testComponent: new PrefabRef<TestComponent>() };
        new Game(document.body).run(class extends Bootstrapper<typeof interopObject> {
            public run = (): SceneBuilder => this.sceneBuilder
                .withChild(this.instantiater.buildGameObject("camera")
                    .withComponent(Camera))
                
                .withChild(this.instantiater.buildGameObject("test")
                    .withComponent(TestComponent)
                    .getComponent(TestComponent, this.interopObject!.testComponent));
        }, interopObject);

        interopObject.testComponent.ref!.enabled = false;
        interopObject.testComponent.ref!.enabled = false;
        expect(interopObject.testComponent.ref!.enabled).toBe(false);
    });

    it("Component.enabled setter call after built 2", () => {
        requestAnimationFrameCount = 1;

        class TestComponent extends Component { }

        const interopObject = { testComponent: new PrefabRef<TestComponent>() };
        new Game(document.body).run(class extends Bootstrapper<typeof interopObject> {
            public run = (): SceneBuilder => this.sceneBuilder
                .withChild(this.instantiater.buildGameObject("camera")
                    .withComponent(Camera))
                
                .withChild(this.instantiater.buildGameObject("test")
                    .withComponent(TestComponent)
                    .getComponent(TestComponent, this.interopObject!.testComponent));
        }, interopObject);

        interopObject.testComponent.ref!.enabled = false;
        interopObject.testComponent.ref!.enabled = true;
        expect(interopObject.testComponent.ref!.enabled).toBe(true);
    });

    it("Destroyed Component throws error when accessing", () => {
        requestAnimationFrameCount = 1;

        class TestComponent extends Component { }

        const interopObject = { testComponent: new PrefabRef<TestComponent>() };
        new Game(document.body).run(class extends Bootstrapper<typeof interopObject> {
            public run = (): SceneBuilder => this.sceneBuilder
                .withChild(this.instantiater.buildGameObject("camera")
                    .withComponent(Camera))
                
                .withChild(this.instantiater.buildGameObject("test")
                    .withComponent(TestComponent)
                    .getComponent(TestComponent, this.interopObject!.testComponent));
        }, interopObject);
        
        interopObject.testComponent.ref!.destroy();
        expect(() => {
            interopObject.testComponent.ref!.enabled = false;
        }).toThrowError("Component TestComponent is destroyed");
    });

    it("Component.gameObject getter", () => {
        class TestComponent extends Component { }
        const component = new TestComponent(createGameObject());
        component.engine_internal_constructAfterProcess();

        expect(component.gameObject).toBeInstanceOf(GameObject);
    });

    it("Component.transform getter", () => {
        class TestComponent extends Component { }
        const component = new TestComponent(createGameObject());
        component.engine_internal_constructAfterProcess();

        expect(component.transform).toBeInstanceOf(Transform);
    });

    it("Component.engine getter", () => {
        requestAnimationFrameCount = 1;

        class TestComponent extends Component { }

        const interopObject = { testComponent: new PrefabRef<TestComponent>() };

        new Game(document.body).run(class extends Bootstrapper<typeof interopObject> {
            public run = (): SceneBuilder => this.sceneBuilder
                .withChild(this.instantiater.buildGameObject("camera")
                    .withComponent(Camera))

                .withChild(this.instantiater.buildGameObject("test")
                    .withComponent(TestComponent)
                    .getComponent(TestComponent, this.interopObject!.testComponent));
        }, interopObject);

        expect(interopObject.testComponent.ref!.engine).toBeInstanceOf(EngineGlobalObject);
    });

    it("Component.instanceId getter", () => {
        class TestComponent extends Component { }
        const component = new TestComponent(createGameObject());
        component.engine_internal_constructAfterProcess();

        expect(component.instanceId).toBeGreaterThan(0);
    });

    it("Component.initialized getter when not initialized", () => {
        requestAnimationFrameCount = 1;

        class TestComponent extends Component { }

        new Game(document.body).run(class extends Bootstrapper {
            public run = (): SceneBuilder => this.sceneBuilder
                .withChild(this.instantiater.buildGameObject("camera")
                    .withComponent(Camera))

                .withChild(this.instantiater.buildGameObject("test")
                    .withComponent(TestComponent, c => {
                        expect(c.initialized).toBe(false);
                    }));
        });
    });
    
    it("Component.initialized getter when initialized", () => {
        requestAnimationFrameCount = 1;

        class TestComponent extends Component { }

        const interopObject = { testComponent: new PrefabRef<TestComponent>() };
        new Game(document.body).run(class extends Bootstrapper<typeof interopObject> {
            public run = (): SceneBuilder => this.sceneBuilder
                .withChild(this.instantiater.buildGameObject("camera")
                    .withComponent(Camera))

                .withChild(this.instantiater.buildGameObject("test")
                    .withComponent(TestComponent)
                    .getComponent(TestComponent, this.interopObject!.testComponent));
        }, interopObject);

        expect(interopObject.testComponent.ref!.initialized).toBe(true);
    });

    it("Component.exists getter when exists", () => {
        requestAnimationFrameCount = 1;

        class TestComponent extends Component { }

        const interopObject = { testComponent: new PrefabRef<TestComponent>() };
        new Game(document.body).run(class extends Bootstrapper<typeof interopObject> {
            public run = (): SceneBuilder => this.sceneBuilder
                .withChild(this.instantiater.buildGameObject("camera")
                    .withComponent(Camera))

                .withChild(this.instantiater.buildGameObject("test")
                    .withComponent(TestComponent)
                    .getComponent(TestComponent, this.interopObject!.testComponent));
        }, interopObject);

        expect(interopObject.testComponent.ref!.exists).toBe(true);
    });

    it("Component.exists getter when not exists", () => {
        requestAnimationFrameCount = 1;

        class TestComponent extends Component { }

        const interopObject = { testComponent: new PrefabRef<TestComponent>() };
        new Game(document.body).run(class extends Bootstrapper<typeof interopObject> {
            public run = (): SceneBuilder => this.sceneBuilder
                .withChild(this.instantiater.buildGameObject("camera")
                    .withComponent(Camera))

                .withChild(this.instantiater.buildGameObject("test")
                    .withComponent(TestComponent)
                    .getComponent(TestComponent, this.interopObject!.testComponent));
        }, interopObject);

        interopObject.testComponent.ref!.destroy();
        expect(interopObject.testComponent.ref!.exists).toBe(false);
    });

    it("Component.destroy()", () => {
        requestAnimationFrameCount = 1;

        class TestComponent extends Component { }
        
        const interopObject = { testComponent: new PrefabRef<TestComponent>() };
        new Game(document.body).run(class extends Bootstrapper<typeof interopObject> {
            public run = (): SceneBuilder => this.sceneBuilder
                .withChild(this.instantiater.buildGameObject("camera")
                    .withComponent(Camera))

                .withChild(this.instantiater.buildGameObject("test")
                    .withComponent(TestComponent)
                    .getComponent(TestComponent, this.interopObject!.testComponent));
        }, interopObject);

        expect(() => {
            interopObject.testComponent.ref!.destroy();
        }).not.toThrow();
    });

    it("Component.destroy() twice", () => {
        requestAnimationFrameCount = 1;

        class TestComponent extends Component { }
        
        const interopObject = { testComponent: new PrefabRef<TestComponent>() };
        new Game(document.body).run(class extends Bootstrapper<typeof interopObject> {
            public run = (): SceneBuilder => this.sceneBuilder
                .withChild(this.instantiater.buildGameObject("camera")
                    .withComponent(Camera))

                .withChild(this.instantiater.buildGameObject("test")
                    .withComponent(TestComponent)
                    .getComponent(TestComponent, this.interopObject!.testComponent));
        }, interopObject);

        expect(() => {
            interopObject.testComponent.ref!.destroy();
            interopObject.testComponent.ref!.destroy();
        }).not.toThrow();
    });
});
