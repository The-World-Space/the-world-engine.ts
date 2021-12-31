import { isUpdateableComponent } from "../SceneProcessor";
/**
 * an object that makes a scene
 */
export class SceneBuilder {
    constructor(sceneProcessor, scene) {
        this._sceneProcessor = sceneProcessor;
        this._scene = scene;
        this._children = [];
    }
    /**
     * add child game object from builder
     * @param child
     * @returns
     */
    withChild(child) {
        this._children.push(child);
        return this;
    }
    /**
     * link GameObjects transform, initialize components and add to scene processor
     * @returns components that need to awake and enable
     */
    build() {
        for (const child of this._children) {
            this._scene.add(child.build().unsafeGetTransform()); //it"s safe because component initialize will be called by SceneProsessor
        }
        for (const child of this._children)
            child.initialize();
        const ComponentsInScene = this.getAllComponentsInScene();
        const activeComponentsInScene = ComponentsInScene.filter(c => {
            return c.gameObject.activeInHierarchy && c.enabled;
        });
        for (const component of activeComponentsInScene) {
            component.unsafeSetStartEnqueueState(true);
        }
        const updateableComponentsInScene = activeComponentsInScene.filter(isUpdateableComponent);
        for (const component of updateableComponentsInScene) {
            component.unsafeSetUpdateEnqueueState(true);
        }
        this._sceneProcessor.addStartComponent(...activeComponentsInScene);
        this._sceneProcessor.addUpdateComponent(...updateableComponentsInScene);
        return { awakeComponents: ComponentsInScene, enableComponents: activeComponentsInScene };
    }
    getAllComponentsInScene() {
        const components = [];
        for (const child of this._scene.children) {
            this.getAllComponentsInGameObject(child.gameObject, components);
        }
        return components;
    }
    getAllComponentsInGameObject(gameObject, outArray) {
        outArray.push(...gameObject.getComponents());
        for (const child of gameObject.transform.childrenTransform) {
            this.getAllComponentsInGameObject(child.gameObject, outArray);
        }
    }
}
