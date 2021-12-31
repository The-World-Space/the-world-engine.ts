import { Object3D } from "three";
import { Scene } from "./Scene";
/**
 * unsafe way to get transform of GameObject (use only if you know what you are doing)
 */
export class Transform extends Object3D {
    constructor(gameObject) {
        super();
        this._gameObject = gameObject;
    }
    /**
     * foreach children transform
     * @param callback
     */
    foreachChild(callback) {
        for (const child of this.children) {
            if (child instanceof Transform) {
                callback(child);
            }
        }
    }
    /**
     * get parent. if parent is scene, returns null
     */
    get parentTransform() {
        if (this.parent instanceof Scene)
            return null;
        return this.parent;
    }
    /**
     * get children. it returns new instance of Array, so you can't change it
     */
    get childrenTransform() {
        return this.children.filter(child => child instanceof Transform);
    }
    /**
     * get gameObject of this transform
     */
    get gameObject() {
        return this._gameObject;
    }
}
