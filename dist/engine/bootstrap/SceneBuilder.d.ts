import { Component } from "../hierarchy_object/Component";
import { GameObjectBuilder } from "../hierarchy_object/GameObject";
import { Scene } from "../hierarchy_object/Scene";
import { SceneProcessor } from "../SceneProcessor";
/**
 * an object that makes a scene
 */
export declare class SceneBuilder {
    private readonly _sceneProcessor;
    private readonly _scene;
    private readonly _children;
    constructor(sceneProcessor: SceneProcessor, scene: Scene);
    /**
     * add child game object from builder
     * @param child
     * @returns
     */
    withChild(child: GameObjectBuilder): SceneBuilder;
    /**
     * link GameObjects transform, initialize components and add to scene processor
     * @returns components that need to awake and enable
     */
    build(): {
        awakeComponents: Component[];
        enableComponents: Component[];
    };
    private getAllComponentsInScene;
    private getAllComponentsInGameObject;
}
