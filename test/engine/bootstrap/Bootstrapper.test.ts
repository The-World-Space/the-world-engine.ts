import { jest } from "@jest/globals";
import { Bootstrapper } from "@src/engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "@src/engine/bootstrap/SceneBuilder";
import { GameSetting } from "@src/engine/bootstrap/setting/GameSetting";
import { EngineGlobalObject } from "@src/engine/EngineGlobalObject";
import { Instantiater } from "@src/engine/Instantiater";
import { Physics2DLoader } from "@src/engine/physics/2d/Physics2DLoader";
import { PhysicsMaterial2D } from "@src/engine/physics/2d/PhysicsMaterial2D";
import { Vector2 } from "three/src/Three";

const createEngineGlobalObject = jest.fn<() => EngineGlobalObject>(() => {
    return {
        instantiater: new Instantiater({} as any)
    } as EngineGlobalObject;
});

describe("Bootstrapper Test", () => {
    it("Bootstrapper.constructor()", () => {
        class TestBootstrapper extends Bootstrapper {
            public run(): SceneBuilder {
                return this.sceneBuilder;
            }
        }

        const bootstrapper = new TestBootstrapper(createEngineGlobalObject());

        expect(bootstrapper).toBeInstanceOf(Bootstrapper);
    });

    it("Bootstrapper.getGameSettingObject()", () => {
        class TestBootstrapper extends Bootstrapper {
            public run(): SceneBuilder {
                this.setting.render
                    .useCss3DRenderer(true);

                this.setting.physics
                    .defaultMaterial(new PhysicsMaterial2D(12, 34))
                    .gravity(new Vector2(1, 2))
                    .layerCollisionMatrix<["default", "layer1", "layer2"]>({
                        default: { layer2: true, layer1: true, default: true },
                        layer1: { layer2: true, layer1: true },
                        layer2: { layer2: true }
                    })
                    .loader(Physics2DLoader)
                    .positionIterations(123)
                    .queriesHitTriggers(false)
                    .reuseCollisionCallbacks(true)
                    .velocityIterations(456);

                return this.sceneBuilder;
            }
        }

        const bootstrapper = new TestBootstrapper(createEngineGlobalObject());
        bootstrapper.run();
        const gameSetting = bootstrapper.getGameSettingObject();
        
        expect(gameSetting).toEqual({
            physics: {
                defaultMaterial: new PhysicsMaterial2D(12, 34),
                gravity: new Vector2(1, 2),
                collisionLayerMaskMatrix: {
                    default: {
                        layer2: true,
                        layer1: true,
                        default: true
                    },
                    layer1: {
                        layer2: true,
                        layer1: true
                    },
                    layer2: {
                        layer2: true
                    }
                },
                loader: Physics2DLoader,
                positionIterations: 123,
                queriesHitTriggers: false,
                reuseCollisionCallbacks: true,
                velocityIterations: 456
            },
            render: {
                useCss3DRenderer: true
            }
        });
    });

    it("Bootstrapper.run()", () => {
        class TestBootstrapper extends Bootstrapper {
            public run(): SceneBuilder {
                return this.sceneBuilder;
            }
        }

        const bootstrapper = new TestBootstrapper(createEngineGlobalObject());
        const sceneBuilder = bootstrapper.run();

        expect(sceneBuilder).toBeInstanceOf(SceneBuilder);
    });

    it("Bootstrapper.instantiater", () => {
        class TestBootstrapper extends Bootstrapper {
            public run(): SceneBuilder {
                return this.sceneBuilder;
            }

            public getInstantiater(): Instantiater {
                return this.instantiater;
            }
        }

        const bootstrapper = new TestBootstrapper(createEngineGlobalObject());
        expect(bootstrapper.getInstantiater()).toBeInstanceOf(Instantiater);
    });

    it("Bootstrapper.interopObject", () => {
        class TestBootstrapper extends Bootstrapper<{test: string}> {
            public run(): SceneBuilder {
                return this.sceneBuilder;
            }
            
            public getInteropObject(): {test: string} {
                return this.interopObject!;
            }
        }

        const bootstrapper = new TestBootstrapper(createEngineGlobalObject(), {test: "test"});
        expect(bootstrapper.getInteropObject()).toEqual({test: "test"});
    });

    it("Bootstrapper.sceneBuilder", () => {
        class TestBootstrapper extends Bootstrapper {
            public run(): SceneBuilder {
                return this.sceneBuilder;
            }

            public getSceneBuilder(): SceneBuilder {
                return this.sceneBuilder;
            }
        }

        const bootstrapper = new TestBootstrapper(createEngineGlobalObject());
        expect(bootstrapper.getSceneBuilder()).toBeInstanceOf(SceneBuilder);
    });

    it("Bootstrapper.setting", () => {
        class TestBootstrapper extends Bootstrapper {
            public run(): SceneBuilder {
                return this.sceneBuilder;
            }

            public getSetting(): GameSetting {
                return this.setting;
            }
        }

        const bootstrapper = new TestBootstrapper(createEngineGlobalObject());
        expect(bootstrapper.getSetting()).toBeInstanceOf(GameSetting);
    });
});
