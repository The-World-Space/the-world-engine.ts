import { Scene as ThreeScene } from "three/src/Three";

import { GameObject } from "./GameObject";
import { GameObjectBuilder } from "./GameObjectBuilder";
import { Transform } from "./Transform";

/**
 * scene is a container for all game objects
 * do not drive this class
 */
export class Scene {
    private readonly _threeScene: ThreeScene;

    /** @internal */
    public constructor() {
        this._threeScene = new ThreeScene();
        this._threeScene.matrixAutoUpdate = false;
        this._threeScene.autoUpdate = false;
    }
    
    /**
     * add gameObject to scene
     * @param gameObjectBuilder
     */
    public addChildFromBuilder(gameObjectBuilder: GameObjectBuilder): GameObject {
        const gameObject = gameObjectBuilder.build(null);
        gameObjectBuilder.processEvent();
        return gameObject;
    }

    /**
     * foreach children transform
     * 
     * you must not change length of children array while iterating
     * @param callback 
     */
    public foreachChild(callback: (transform: Transform) => void): void {
        const object3DChildren = this._threeScene.children;
        for (let i = 0, l = object3DChildren.length; i < l; i++) {
            const child = object3DChildren[i];
            if (child.userData instanceof Transform) {
                callback(child.userData);
            }
        }
    }
    
    /**
     * iterate children transfrom
     * 
     * you must not change length of children array while iterating
     * @param callback if return false, stop iteration
     */
    public iterateChild(callback: (transform: Transform) => boolean): void {
        const object3DChildren = this._threeScene.children;
        for (let i = 0, l = object3DChildren.length; i < l; i++) {
            const child = object3DChildren[i];
            if (child.userData instanceof Transform) {
                if (!callback(child.userData)) break;
            }
        }
    }

    public get children(): Transform[] {
        return this._threeScene.children
            .filter(child => child.userData instanceof Transform)
            .map(child => child.userData as Transform);
    }

    public unsafeGetThreeScene(): ThreeScene {
        return this._threeScene;
    }
}
