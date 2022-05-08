import { jest } from "@jest/globals";
import { Bootstrapper } from "@src/engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "@src/engine/bootstrap/SceneBuilder";
import { EngineGlobalObject } from "@src/engine/EngineGlobalObject";
import { Physics2DLoader } from "@src/engine/physics/2d/Physics2DLoader";
import { PhysicsMaterial2D } from "@src/engine/physics/2d/PhysicsMaterial2D";
import { Vector2 } from "three/src/Three";

const createEngineGlobalObject = jest.fn<() => EngineGlobalObject>(() => {
    return {
        instantiater: { }
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
});
