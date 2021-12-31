import { Component } from "../hierarchy_object/Component";
import { GameObject, GameObjectBuilder } from "../hierarchy_object/GameObject";
import { Scene } from "../hierarchy_object/Scene";
import { Transform } from "../hierarchy_object/Transform";
import { isUpdateableComponent, SceneProcessor, UpdateableComponent } from "../SceneProcessor";

/**
 * an object that makes a scene
 */
export class SceneBuilder {
    private readonly _sceneProcessor: SceneProcessor;
    private readonly _scene: Scene;
    private readonly _children: GameObjectBuilder[];
    
    public constructor(sceneProcessor: SceneProcessor, scene: Scene) {
        this._sceneProcessor = sceneProcessor;
        this._scene = scene;
        this._children = [];
    }

    /**
     * add child game object from builder
     * @param child 
     * @returns 
     */
    public withChild(child: GameObjectBuilder): SceneBuilder {
        this._children.push(child);
        return this;
    }

    /**
     * link GameObjects transform, initialize components and add to scene processor
     * @returns components that need to awake and enable
     */
    public build(): { awakeComponents: Component[], enableComponents: Component[] } {
        for (const child of this._children) {
            this._scene.add(child.build().unsafeGetTransform()); //it"s safe because component initialize will be called by SceneProsessor
        }

        for (const child of this._children) child.initialize();

        const ComponentsInScene = this.getAllComponentsInScene();
        const activeComponentsInScene = ComponentsInScene.filter(c => {
            return c.gameObject.activeInHierarchy && c.enabled;
        });
        for (const component of activeComponentsInScene) {
            component.unsafeSetStartEnqueueState(true);
        }
        const updateableComponentsInScene = activeComponentsInScene.filter<UpdateableComponent>(isUpdateableComponent);
        for (const component of updateableComponentsInScene) {
            component.unsafeSetUpdateEnqueueState(true);
        }
        this._sceneProcessor.addStartComponent(...activeComponentsInScene);
        this._sceneProcessor.addUpdateComponent(...updateableComponentsInScene);

        return { awakeComponents: ComponentsInScene, enableComponents: activeComponentsInScene };
    }

    private getAllComponentsInScene(): Component[] {
        const components: Component[] = [];
        for (const child of this._scene.children as Transform[]) {
            this.getAllComponentsInGameObject(child.gameObject, components);
        }
        return components;
    }

    private getAllComponentsInGameObject(gameObject: GameObject, outArray: Component[]) {
        outArray.push(...gameObject.getComponents());
        for (const child of gameObject.transform.childrenTransform) {
            this.getAllComponentsInGameObject(child.gameObject, outArray);
        }
    }
}
