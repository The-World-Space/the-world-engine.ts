import { GameObjectBuilder } from "../hierarchy_object/GameObjectBuilder";
import type { SceneProcessor } from "../SceneProcessor";

/**
 * an object that makes a scene
 * do not drive this class
 */
export class SceneBuilder {
    private readonly _sceneProcessor: SceneProcessor;
    private readonly _children: GameObjectBuilder[];

    /** @internal */
    public constructor(sceneProcessor: SceneProcessor) {
        this._sceneProcessor = sceneProcessor;
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
    public build(): void {
        const children = this._children;
        for (let i = 0; i < children.length; ++i) {
            children[i].build(null);
        }
        GameObjectBuilder.processEventByGroup(children, this._sceneProcessor);
    }
}
