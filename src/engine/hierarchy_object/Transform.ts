import { Object3D } from "three";
import { GameObject } from "./GameObject";
import { ITransform } from "./ITransform";
import { Scene } from "./Scene";

/**
 * unsafe way to get transform of GameObject (use only if you know what you are doing)
 */
export class Transform extends Object3D implements ITransform {
    private _gameObject: GameObject;

    public constructor(gameObject: GameObject) {
        super();
        this._gameObject = gameObject;
    }

    /**
     * foreach children transform
     * @param callback 
     */
    public foreachChild(callback: (transform: ITransform) => void): void {
        for (const child of this.children) {
            if (child instanceof Transform) {
                callback(child);
            }
        }
    }

    /**
     * get parent. if parent is scene, returns null
     */
    public get parentTransform(): ITransform | null {
        if (this.parent instanceof Scene) return null;
        return this.parent as ITransform | null;
    }

    /**
     * get children. it returns new instance of Array, so you can't change it
     */
    public get childrenTransform(): ITransform[] {
        return this.children.filter(child => child instanceof Transform) as Transform[];
    }

    /**
     * get gameObject of this transform
     */
    public get gameObject(): GameObject {
        return this._gameObject;
    }
}
