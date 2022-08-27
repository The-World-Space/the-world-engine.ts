import { jest } from "@jest/globals";
import { Bootstrapper } from "@src/engine/bootstrap/Bootstrapper";
import { BootstrapperConstructor } from "@src/engine/bootstrap/BootstrapperConstructor";
import { SceneBuilder } from "@src/engine/bootstrap/SceneBuilder";
import { Game } from "@src/engine/Game";
import { Component } from "@src/engine/hierarchy_object/Component";
import { GameObject } from "@src/engine/hierarchy_object/GameObject";
import { PrefabRef } from "@src/engine/hierarchy_object/PrefabRef";
import { Physics2DLoader } from "@src/engine/physics/2d/Physics2DLoader";
import { BoxCollider2D } from "@src/engine/script/physics2d/collider/BoxCollider2D";
import { RigidBody2D } from "@src/engine/script/physics2d/RigidBody2D";
import { Camera } from "@src/engine/script/render/Camera";
import { CssHtmlElementRenderer } from "@src/engine/script/render/CssHtmlElementRenderer";
import { Mock } from "jest-mock";
import { Vector3 } from "three/src/Three";

import { NonPhysicsTestBootstrapper } from "./test_project/asset/NonPhysicsTestBootstrapper";
import { PhysicsTestBootstrapper } from "./test_project/asset/PhysicsTestBootstrapper";
import { TestBootstrapper } from "./test_project/asset/TestBootstrapper";
import { TransformTestBootstrapper } from "./test_project/asset/TransformTestBootstrapper";

let requestAnimationFrameCount = 1;

function createAndRunGame<T, U extends Bootstrapper<T>>(bootstrapper: BootstrapperConstructor<T, U>, interopObject?: T, runFrame = 1, afterRun?: (interopObject?: T) => void): void {
    requestAnimationFrameCount = runFrame;
    const game = new Game(document.body);
    game.run(bootstrapper, interopObject);
    afterRun?.(interopObject);
    game.dispose();
}

describe("GameCreate Test", () => {
    beforeEach(() => {
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
        (window.requestAnimationFrame as Mock).mockRestore();
    });

    it("Game Scene Test1", () => {
        createAndRunGame(class extends Bootstrapper {
            public run(): SceneBuilder {
                return this.sceneBuilder
                    .withChild(this.instantiater.buildGameObject("camera")
                        .withComponent(Camera));
            }
        });
    });

    it("Game Scene Test2", () => {
        const interopObject = {
            object1: new PrefabRef<GameObject>()
        };

        createAndRunGame(class extends Bootstrapper<typeof interopObject> {
            public run(): SceneBuilder {
                this.setting.render
                    .useCss3DRenderer(true);

                this.setting.physics
                    .loader(Physics2DLoader);

                return this.sceneBuilder
                    .withChild(this.instantiater.buildGameObject("camera")
                        .withComponent(Camera))

                    .withChild(this.instantiater.buildGameObject("object1", new Vector3(0, 0, 0))
                        .withComponent(CssHtmlElementRenderer, c => {
                            c.element = document.createElement("div");
                            c.element.style.backgroundColor = "red";
                            c.elementWidth = 1;
                            c.elementHeight = 1;
                        })
                        .withComponent(RigidBody2D)
                        .withComponent(BoxCollider2D)
                        .getGameObject(this.interopObject!.object1))
                ;
            }
        }, interopObject, 2, 
        (o?: typeof interopObject) => {
            expect(o!.object1.ref!.transform.position.y).toBeLessThan(0);
        }
        );
    });

    it("Game Scene Test3", () => {
        const result: string[] = [];

        class TestComponent extends Component {
            public awake(): void {
                result.push("TestComponent.awake");
            }

            public start(): void {
                result.push("TestComponent.start");
            }

            public update(): void {
                result.push("TestComponent.update");
            }

            public onEnable(): void {
                result.push("TestComponent.onEnable");
            }

            public onDisable(): void {
                result.push("TestComponent.onDisable");
            }

            public onDestroy(): void {
                result.push("TestComponent.onDestroy");
            }
        }

        createAndRunGame(class extends Bootstrapper {
            public run(): SceneBuilder {
                return this.sceneBuilder
                    .withChild(this.instantiater.buildGameObject("camera")
                        .withComponent(Camera))

                    .withChild(this.instantiater.buildGameObject("object1")
                        .withComponent(TestComponent))
                ;
            }
        }, undefined, 1);
        
        expect(result).toEqual([
            "TestComponent.awake",
            "TestComponent.onEnable",
            "TestComponent.start",
            "TestComponent.update",
            "TestComponent.onDisable",
            "TestComponent.onDestroy"
        ]);
    });

    it("Game Scene Test4", () => {
        createAndRunGame(NonPhysicsTestBootstrapper);
    });

    it("Game Scene Test5", () => {
        createAndRunGame(PhysicsTestBootstrapper);
    });

    it("Game Scene Test6", () => {
        createAndRunGame(TransformTestBootstrapper);
    });

    it("Game Scene Test7", () => {
        jest.spyOn(console, "clear");
        createAndRunGame(TestBootstrapper);
        (console.clear as Mock).mockRestore();
    });
});
