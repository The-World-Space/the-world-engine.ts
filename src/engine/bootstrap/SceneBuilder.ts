import { Component } from "../hierarchy_object/Component";
import { GameObject } from "../hierarchy_object/GameObject";
import { GameObjectBuilder } from "../hierarchy_object/GameObjectBuilder";
import { Scene } from "../hierarchy_object/Scene";
import { Transform } from "../hierarchy_object/Transform";
import { isUpdateableComponent, SceneProcessor, UpdateableComponent } from "../SceneProcessor";

/**
 * an object that makes a scene
 * do not drive this class
 */
export class SceneBuilder {
    private readonly _sceneProcessor: SceneProcessor;
    private readonly _scene: Scene;
    private readonly _children: GameObjectBuilder[];
    
    /** @internal */
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
     * 
     * @internal
     */
    public build(): { awakeComponents: Component[], enableComponents: Component[] } {
        for (let i = 0; i < this._children.length; i++) {
            const child = this._children[i];
            child.build().transform.parent = null; //null is root
        }

        for (let i = 0; i < this._children.length; i++) {
            const child = this._children[i];
            child.initialize();
        }

        const ComponentsInScene = this.getAllComponentsInScene();
        const activeComponentsInScene = ComponentsInScene.filter(c => {
            return c.gameObject.activeInHierarchy && c.enabled;
        });
        for (let i = 0; i < activeComponentsInScene.length; i++) {
            const component = activeComponentsInScene[i];
            component.internalSetStartEnqueueState(true);
        }
        const updateableComponentsInScene = activeComponentsInScene.filter<UpdateableComponent>(isUpdateableComponent);
        for (let i = 0; i < updateableComponentsInScene.length; i++) {
            const component = updateableComponentsInScene[i];
            component.internalSetUpdateEnqueueState(true);
        }
        for (let i = 0; i < activeComponentsInScene.length; i++) {
            this._sceneProcessor.addStartComponent(activeComponentsInScene[i]);
        }
        for (let i = 0; i < updateableComponentsInScene.length; i++) {
            this._sceneProcessor.addUpdateComponent(updateableComponentsInScene[i]);
        }
        
        return { awakeComponents: ComponentsInScene, enableComponents: activeComponentsInScene };
    }

    private getAllComponentsInScene(): Component[] {
        const components: Component[] = [];
        const scene = this._scene;
        for (let i = 0; i < this._children.length; i++) {
            const child = scene.children[i];
            if (child.userData instanceof Transform) {
                this.getAllComponentsInGameObject(child.userData.gameObject, components);
            }
        }
        return components;
    }

    private getAllComponentsInGameObject(gameObject: GameObject, outArray: Component[]) {
        outArray.push(...gameObject.getComponents());
        const transform_children = gameObject.transform.children;
        for (let i = 0; i < transform_children.length; i++) {
            const child = transform_children[i];
            this.getAllComponentsInGameObject(child.gameObject, outArray);
        }
    }
}
