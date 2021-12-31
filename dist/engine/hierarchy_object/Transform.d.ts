import { Object3D } from "three";
import { GameObject } from "./GameObject";
import { ITransform } from "./ITransform";
/**
 * unsafe way to get transform of GameObject (use only if you know what you are doing)
 */
export declare class Transform extends Object3D implements ITransform {
    private _gameObject;
    constructor(gameObject: GameObject);
    /**
     * foreach children transform
     * @param callback
     */
    foreachChild(callback: (transform: ITransform) => void): void;
    /**
     * get parent. if parent is scene, returns null
     */
    get parentTransform(): ITransform | null;
    /**
     * get children. it returns new instance of Array, so you can't change it
     */
    get childrenTransform(): ITransform[];
    /**
     * get gameObject of this transform
     */
    get gameObject(): GameObject;
}
