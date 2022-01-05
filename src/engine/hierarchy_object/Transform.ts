import { Euler, Matrix3, Matrix4, Object3D, Quaternion, Vector3 } from "three";
import { GameObject } from "./GameObject";
import { Scene } from "./Scene";
import { ObservableVector3 } from "./ObservableVector3";

/**
 * transform that delegates Object3D
 */
export class Transform {
    private _object3D: Object3D;
    private _gameObject: GameObject;
    private _matrixNeedUpdate = true;

    public constructor(gameObject: GameObject) {
        this._object3D = new Object3D();
        this._object3D.matrixAutoUpdate = false;
        this._object3D.userData = this;

        this._object3D.rotation._onChange(this.onRotationChange.bind(this));
        this._object3D.quaternion._onChange(this.onQuaternionChange.bind(this));
        
        Object.defineProperties(this._object3D, {
            position: {
                writable: true
            },
            scale: {
                writable: true
            },
        });

        const observablePosition = new ObservableVector3();
        observablePosition.onChange(this.onPositionChange.bind(this));
        (this._object3D.position as any) = observablePosition; //inject observable

        const observableScale = new ObservableVector3();
        observableScale.onChange(this.onScaleChange.bind(this));
        (this._object3D.scale as any) = observableScale; //inject observable

        this._gameObject = gameObject;
    }

    private onRotationChange() {
        //for override Object3D.onRotationChange()
        this._object3D.quaternion.setFromEuler(this._object3D.rotation, false);
        this.setMatrixNeedUpdateRecursively();
    }

    private onQuaternionChange() {
        //for override Object3D.onQuaternionChange()
        this._object3D.rotation.setFromQuaternion(this._object3D.quaternion, undefined, false);
        this.setMatrixNeedUpdateRecursively();
    }

    private onPositionChange(): void {
        this.setMatrixNeedUpdateRecursively();
    }

    private onScaleChange(): void {
        this.setMatrixNeedUpdateRecursively();
    }

    /**
     * foreach children transform
     * @param callback 
     */
    public foreachChild(callback: (transform: Transform) => void): void {
        for (const child of this._object3D.children) {
            if (child.userData instanceof Transform) {
                callback(child.userData as Transform);
            }
        }
    }
    
    /**
     * iterate children transfrom
     * @param callback if return false, stop iteration
     */
    public iterateChild(callback: (transform: Transform) => boolean): void {
        for (const child of this._object3D.children) {
            if (child.userData instanceof Transform) {
                if (!callback(child.userData as Transform)) {
                    break;
                }
            }
        }
    }

    private setMatrixNeedUpdateRecursively(): void {
        if (this._matrixNeedUpdate) return;
        this._matrixNeedUpdate = true;
        for (const child of this._object3D.children) {
            if (child.userData instanceof Transform) {
                (child.userData as Transform).setMatrixNeedUpdateRecursively();
            }
        }
    }

    /**
     * get parent. if parent is scene, returns null
     */
    public get parent(): Transform | null {
        if (this._object3D.parent instanceof Scene) return null;
        return this._object3D.parent as Transform | null;
    }

    /**
     * get children. it returns new instance of Array, so you can't change it
     */
    public get children(): Transform[] {
        return this._object3D.children
            .filter(child => child.userData instanceof Transform)
            .map(child => child.userData as Transform);
    }
    
    /**
     * get gameObject of this transform
     */
    public get gameObject(): GameObject {
        return this._gameObject;
    }

    /**
	 * Up direction.
	 * @default THREE.Object3D.DefaultUp.clone()
	 */
    public get up(): Vector3 {
        return this._object3D.up;
    }

    /**
	 * Up direction.
	 * @default THREE.Object3D.DefaultUp.clone()
	 */
    public set up(value: Vector3) {
        this._object3D.up = value;
    }

    /**
     * Object"s local position.
     * @default new THREE.Vector3()
     */
    public get localPosition(): Vector3 {
        return this._object3D.position;
    }

    /**
     * Object"s local rotation (Euler angles), in radians.
     * @default new THREE.Euler()
     */
    public get localEulerAngles(): Euler {
        return this._object3D.rotation;
    }

    /**
     * Object"s local rotation as a Quaternion.
     * @default new THREE.Quaternion()
     */
    public get localRotation(): Quaternion {
        return this._object3D.quaternion;
    }

    /**
     * Object"s local scale.
     * @default new THREE.Vector3()
     */
    public get localScale(): Vector3 {
        return this._object3D.scale;
    }

    /**
     * @default new THREE.Matrix4()
     */
    public get modelViewMatrix(): Matrix4 {
        return this._object3D.modelViewMatrix;
    }

    /**
     * @default new THREE.Matrix3()
     */
    public get normalMatrix(): Matrix3 {
        return this._object3D.normalMatrix;
    }

    /**
     * Local transform.
     * @default new THREE.Matrix4()
     */
    public get matrix(): Matrix4 {
        return this._object3D.matrix;
    }

    /**
     * Local transform.
     * @default new THREE.Matrix4()
     */
    public set matrix(value: Matrix4) {
        this._object3D.matrix = value;
    }

    /**
     * The global transform of the object. If the Object3d has no parent, then it's identical to the local transform.
     * @default new THREE.Matrix4()
     */
    public get matrixWorld(): Matrix4 {
        return this._object3D.matrixWorld;
    }

    /**
     * The global transform of the object. If the Object3d has no parent, then it's identical to the local transform.
     * @default new THREE.Matrix4()
     */
    public set matrixWorld(value: Matrix4) {
        this._object3D.matrixWorld = value;
    }

    /**
     * This updates the position, rotation and scale with the matrix.
     */
    public applyMatrix4(matrix: Matrix4): void {
        this._object3D.applyMatrix4(matrix);
    }

    public applyQuaternion(quaternion: Quaternion): this {
        this._object3D.applyQuaternion(quaternion);
        return this;
    }

    public setRotationFromAxisAngle(axis: Vector3, angle: number): void {
        this._object3D.setRotationFromAxisAngle(axis, angle);
    }

    public setRotationFromEuler(euler: Euler): void {
        this._object3D.setRotationFromEuler(euler);
    }

    public setRotationFromMatrix(m: Matrix4): void {
        this._object3D.setRotationFromMatrix(m);
    }

    public setRotationFromQuaternion(q: Quaternion): void {
        this._object3D.setRotationFromQuaternion(q);
    }

    /**
     * Rotate an object along an axis in object space. The axis is assumed to be normalized.
     * @param axis    A normalized vector in object space.
     * @param angle    The angle in radians.
     */
    public rotateOnAxis(axis: Vector3, angle: number): this {
        this._object3D.rotateOnAxis(axis, angle);
        return this;
    }

    /**
     * Rotate an object along an axis in world space. The axis is assumed to be normalized. Method Assumes no rotated parent.
     * @param axis    A normalized vector in object space.
     * @param angle    The angle in radians.
     */
    public rotateOnWorldAxis(axis: Vector3, angle: number): this {
        this._object3D.rotateOnWorldAxis(axis, angle);
        return this;
    }

    /**
     *
     * @param angle
     */
    public rotateX(angle: number): this {
        this._object3D.rotateX(angle);
        return this;
    }

    /**
     *
     * @param angle
     */
    public rotateY(angle: number): this {
        this._object3D.rotateY(angle);
        return this;
    }

    /**
     *
     * @param angle
     */
    public rotateZ(angle: number): this {
        this._object3D.rotateZ(angle);
        return this;
    }

    /**
     * @param axis    A normalized vector in object space.
     * @param distance    The distance to translate.
     */
    public translateOnAxis(axis: Vector3, distance: number): this {
        this._object3D.translateOnAxis(axis, distance);
        return this;
    }

    /**
     * Translates object along x axis by distance.
     * @param distance Distance.
     */
    public translateX(distance: number): this {
        this._object3D.translateX(distance);
        return this;
    }

    /**
     * Translates object along y axis by distance.
     * @param distance Distance.
     */
    public translateY(distance: number): this {
        this._object3D.translateY(distance);
        return this;
    }

    /**
     * Translates object along z axis by distance.
     * @param distance Distance.
     */
    public translateZ(distance: number): this {
        this._object3D.translateZ(distance);
        return this;
    }

    /**
     * Updates the vector from local space to world space.
     * @param vector A local vector.
     */
    public localToWorld(vector: Vector3): Vector3 {
        return this._object3D.localToWorld(vector);
    }

    /**
     * Updates the vector from world space to local space.
     * @param vector A world vector.
     */
    public worldToLocal(vector: Vector3): Vector3 {
        return this._object3D.worldToLocal(vector);
    }

    /**
     * Rotates object to face point in space.
     * @param vector A world vector to look at.
     */
    public lookAt(vector: Vector3 | number, y?: number, z?: number): void {
        this._object3D.lookAt(vector, y, z);
    }

    public getWorldPosition(target: Vector3): Vector3 {
        return this._object3D.getWorldPosition(target);
    }

    public getWorldQuaternion(target: Quaternion): Quaternion {
        return this._object3D.getWorldQuaternion(target);
    }

    public getWorldScale(target: Vector3): Vector3 {
        return this._object3D.getWorldScale(target);
    }

    public getWorldDirection(target: Vector3): Vector3 {
        return this._object3D.getWorldDirection(target);
    }

    /**
     * get Object3D of the GameObject. you can use this to add three.js Object3D to the scene
     * if you want to add a custom Object3D to the scene, you must manage the lifecycle of the Object3D yourself
     * 
     * see also:
     * "Object3D.visible" property has same value as "GameObject.activeInHierarchy"
     * you must not change "Object3D.visible" directly, use "GameObject.activeInHierarchy" instead
     * "Object3D.add" method is not available for GameObject Transform it for other Object3D classes
     */
    public unsafeGetObject3D(): Object3D {
        return this._object3D;
    }
}
