import { jest } from "@jest/globals";
import { Coroutine } from "@src/engine/coroutine/Coroutine";
import { CoroutineIterator } from "@src/engine/coroutine/CoroutineIterator";
import { CoroutineProcessor } from "@src/engine/coroutine/CoroutineProcessor";
import { EngineGlobalObject } from "@src/engine/EngineGlobalObject";
import { Component } from "@src/engine/hierarchy_object/Component";
import { GameObject } from "@src/engine/hierarchy_object/GameObject";
import { Scene } from "@src/engine/hierarchy_object/Scene";
import { Instantiater } from "@src/engine/Instantiater";
import { TransformMatrixProcessor } from "@src/engine/render/TransformMatrixProcessor";
import { Time } from "@src/engine/time/Time";

const engineGlobalObject = {
    instantiater: new Instantiater({} as EngineGlobalObject),
    scene: new Scene(),
    transformMatrixProcessor: new TransformMatrixProcessor(),
    coroutineProcessor: new CoroutineProcessor(new Time()),
} as EngineGlobalObject;

const createGameObject = jest.fn<() => GameObject>(() => {
    return new GameObject(engineGlobalObject, "test");
});

describe("Component Test", () => {
    beforeEach(() => {
        (engineGlobalObject.instantiater as Instantiater) = new Instantiater({} as EngineGlobalObject);
        (engineGlobalObject.scene as Scene) = new Scene();
        (engineGlobalObject.transformMatrixProcessor as TransformMatrixProcessor) = new TransformMatrixProcessor();
        (engineGlobalObject.coroutineProcessor as CoroutineProcessor) = new CoroutineProcessor(new Time());
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
            private *_testCoroutine(): CoroutineIterator {
                result.push(1);
                yield null;
                result.push(2);
            }

            public testRunCoroutine(): void {
                this.startCoroutine(this._testCoroutine());
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
            private *_testCoroutine(): CoroutineIterator {
                result.push(1);
                yield null;
                result.push(2);
                yield null;
                result.push(3);
            }

            public testRunCoroutine(): void {
                this.startCoroutine(this._testCoroutine());
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
            private *_testCoroutine(): CoroutineIterator {
                result.push(1);
                yield null;
                result.push(2);
                yield null;
                result.push(3);
            }

            public testRunCoroutine(): Coroutine {
                return this.startCoroutine(this._testCoroutine());
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
            private *_testCoroutine(): CoroutineIterator {
                yield null;
            }

            public testRunCoroutine(): Coroutine {
                return this.startCoroutine(this._testCoroutine());
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
});
