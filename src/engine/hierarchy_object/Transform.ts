import { Euler, Matrix4, Object3D, Quaternion, Vector3 } from "three";
import { GameObject } from "./GameObject";
import { Scene } from "./Scene";
import { ObservableVector3 } from "../math/ObservableVector3";
import { ObservableEuler } from "../math/ObservableEuler";
import { ObservableQuaternion } from "../math/ObservableQuaternion";

/**
 * transform that delegates Object3D
 */
export class Transform {
    private _object3D: Object3D;
    private _gameObject: GameObject;
    private _matrixNeedUpdate = true;

    private _worldPosition: Vector3;
    private _worldRotationEuler: Euler;
    private _worldRotation: Quaternion;
    private _worldScale: Vector3;

    private _localPositionUpdated = true;
    private _localRotationUpdated = true;
    private _localScaleUpdated = true;

    private _worldPositionUpdated = true; //it can be false by default because builder get local position
    private _worldRotationUpdated = true; //it can be false by default because builder get local rotation
    private _worldScaleUpdated = true; //it can be false by default because builder get local scale

    public constructor(gameObject: GameObject) {
        this._object3D = new Object3D();
        this._object3D.matrixAutoUpdate = false;
        this._object3D.userData = this;
        
        Object.defineProperties(this._object3D, {
            position: {
                writable: true
            },
            rotation: {
                writable: true
            },
            quaternion: {
                writable: true
            },
            scale: {
                writable: true
            },
        });

        const observablePosition = new ObservableVector3();
        observablePosition.onBeforeGetComponent(this.onBeforeGetLocalPosition.bind(this));
        observablePosition.onChange(this.onLocalPositionChange.bind(this));
        (this._object3D.position as any) = observablePosition; //inject observable

        const observableRotation = new ObservableEuler();
        observableRotation.onBeforeGetComponent(this.onBeforeGetLocalRotation.bind(this));
        observableRotation._onChange(this.onLocalEulerRotationChange.bind(this));
        (this._object3D.rotation as any) = observableRotation; //inject observable

        const observableQuaternion = new ObservableQuaternion();
        observableQuaternion.onBeforeGetComponent(this.onBeforeGetLocalRotation.bind(this));
        observableQuaternion._onChange(this.onLocalRotationChange.bind(this));
        (this._object3D.quaternion as any) = observableQuaternion; //inject observable

        const observableScale = new ObservableVector3();
        observableScale.onBeforeGetComponent(this.onBeforeGetLocalScale.bind(this));
        observableScale.onChange(this.onLocalScaleChange.bind(this));
        (this._object3D.scale as any) = observableScale; //inject observable

        this._gameObject = gameObject;

        const observableWorldPosition = new ObservableVector3();
        observableWorldPosition.onBeforeGetComponent(this.onBeforeGetWorldPosition.bind(this));
        observableWorldPosition.onChange(this.onWorldPositionChange.bind(this));
        this._worldPosition = observableWorldPosition as unknown as Vector3; //inject observable
        
        const observableWorldRotation = new ObservableEuler();
        observableWorldRotation.onBeforeGetComponent(this.onBeforeGetWorldRotation.bind(this));
        observableWorldRotation._onChange(this.onWorldEulerRotationChange.bind(this));
        this._worldRotationEuler = observableWorldRotation as unknown as Euler; //inject observable

        const observableWorldRotationQuaternion = new ObservableQuaternion();
        observableWorldRotationQuaternion.onBeforeGetComponent(this.onBeforeGetWorldRotation.bind(this));
        observableWorldRotationQuaternion._onChange(this.onWorldRotationChange.bind(this));
        this._worldRotation = observableWorldRotationQuaternion as unknown as Quaternion; //inject observable

        const observableWorldScale = new ObservableVector3();
        observableWorldScale.onBeforeGetComponent(this.onBeforeGetWorldScale.bind(this));
        observableWorldScale.onChange(this.onWorldScaleChange.bind(this));
        this._worldScale = observableWorldScale as unknown as Vector3; //inject observable
    }

    //local position

    public onBeforeGetLocalPosition(): void {
        if (this._worldPositionUpdated) {
            //do something
            this._worldPositionUpdated = false;
        }
    }

    private onLocalPositionChange(): void {
        this.setMatrixNeedUpdateRecursively();
        this._localPositionUpdated = true;
    }

    //local rotation

    private onBeforeGetLocalRotation(): void {
        if (this._worldRotationUpdated) {
            //do something
            this._worldRotationUpdated = false;
        }
    }

    private onLocalEulerRotationChange() {
        //for override Object3D.onRotationChange()
        this._object3D.quaternion.setFromEuler(this._object3D.rotation, false);
        this.setMatrixNeedUpdateRecursively();
        this._localRotationUpdated = true;
    }

    private onLocalRotationChange() {
        //for override Object3D.onQuaternionChange()
        this._object3D.rotation.setFromQuaternion(this._object3D.quaternion, undefined, false);
        this.setMatrixNeedUpdateRecursively();
        this._localRotationUpdated = true;
    }

    //local scale

    private onBeforeGetLocalScale(): void {
        if (this._worldScaleUpdated) {
            //do something
            this._worldScaleUpdated = false;
        }
    }

    private onLocalScaleChange(): void {
        this.setMatrixNeedUpdateRecursively();
        this._localScaleUpdated = true;
    }

    //world position

    private onBeforeGetWorldPosition(): void {
        if (this._localPositionUpdated) {
            this.updateMatrixAndGlobalPositionRotationScaleRecursivelyFromAncestorToThis();
            this._localPositionUpdated = false;
        }
    }

    private onWorldPositionChange(): void {
        this.setMatrixNeedUpdateRecursively();
        this._worldPositionUpdated = true;
        throw new Error("Method not implemented.");
    }

    //world rotation

    private onBeforeGetWorldRotation(): void {
        if (this._localRotationUpdated) {
            this.updateMatrixAndGlobalPositionRotationScaleRecursivelyFromAncestorToThis();
            this._localRotationUpdated = false;
        }
    }
    
    private onWorldEulerRotationChange(): void {
        this._worldRotation.setFromEuler(this._worldRotationEuler, false);
        this.setMatrixNeedUpdateRecursively();
        this._worldRotationUpdated = true;
        throw new Error("Method not implemented.");
    }

    private onWorldRotationChange(): void {
        this._object3D.quaternion.setFromEuler(this._worldRotationEuler, false);
        this.setMatrixNeedUpdateRecursively();
        this._worldRotationUpdated = true;
        throw new Error("Method not implemented.");
    }

    //world scale

    private onBeforeGetWorldScale(): void {
        if (this._localScaleUpdated) {
            this.updateMatrixAndGlobalPositionRotationScaleRecursivelyFromAncestorToThis();
            this._localScaleUpdated = false;
        }
    }

    private onWorldScaleChange(): void {
        this.setMatrixNeedUpdateRecursively();
        this._worldScaleUpdated = true;
        throw new Error("Method not implemented.");
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
     * update local and world matrix from ancestor to this recursively
     * @returns 
     */
    private updateMatrixAndGlobalPositionRotationScaleRecursivelyFromAncestorToThis(): void {
        if (!this._matrixNeedUpdate) return;
        const parent = this.parent;
        if (parent) parent.updateMatrixAndGlobalPositionRotationScaleRecursivelyFromAncestorToThis();

        const localMatrix = this._object3D.matrix;
        localMatrix.compose(this.localPosition, this.localRotation, this.localScale);
        if (this.parent === null) {
            this._object3D.matrixWorld.copy(localMatrix);
        } else {
            this._object3D.matrixWorld.multiplyMatrices(this.parent._object3D.matrixWorld, localMatrix);
        }
        this._object3D.matrixWorld.decompose(this._worldPosition, this._worldRotation, this._worldScale);
        this._matrixNeedUpdate = false;
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
     * Returns a normalized vector representing the blue axis of the transform in world space.
     */
    public get forward(): Vector3 {
        return this._object3D.getWorldDirection(new Vector3());
    }

    /**
     * The red axis of the transform in world space.
     */
    public get right(): Vector3 {
        return this._object3D.getWorldDirection(new Vector3()).cross(new Vector3(0, 1, 0)).normalize();
    }

    /**
     * The green axis of the transform in world space.
     */
    public get up(): Vector3 {
        return this._object3D.getWorldDirection(new Vector3()).cross(new Vector3(1, 0, 0)).normalize();
    }

    /**
	 * Up direction.
	 * @default THREE.Object3D.DefaultUp.clone()
	 */
    public set up(value: Vector3) {
        this._object3D.up = value;
    }

    /**
     * Object's local position.
     * @default new THREE.Vector3()
     */
    public get localPosition(): Vector3 {
        return this._object3D.position;
    }

    /**
     * Object's local rotation (Euler angles), in radians.
     * @default new THREE.Euler()
     */
    public get localEulerAngles(): Euler {
        return this._object3D.rotation;
    }

    /**
     * Object's local rotation as a Quaternion.
     * @default new THREE.Quaternion()
     */
    public get localRotation(): Quaternion {
        return this._object3D.quaternion;
    }

    /**
     * Object's local scale.
     * @default new THREE.Vector3()
     */
    public get localScale(): Vector3 {
        return this._object3D.scale;
    }

    /**
     * Object's world position.
     */
    public get position(): Vector3 {
        return target.setFromMatrixPosition( this.matrixWorld );

    // InverseTransformDirection	Transforms a direction from world space to local space. The opposite of Transform.TransformDirection.
    // InverseTransformPoint	Transforms position from world space to local space.
    // InverseTransformVector	Transforms a vector from world space to local space. The opposite of Transform.TransformVector.
    // IsChildOf	Is this transform a child of parent?
    // LookAt	Rotates the transform so the forward vector points at /target/'s current position.
    // Rotate	Use Transform.Rotate to rotate GameObjects in a variety of ways. The rotation is often provided as an Euler angle and not a Quaternion.
    // RotateAround	Rotates the transform about axis passing through point in world coordinates by angle degrees.
    // SetAsFirstSibling	Move the transform to the start of the local transform list.
    // SetAsLastSibling	Move the transform to the end of the local transform list.
    // SetParent	Set the parent of the transform.
    // SetPositionAndRotation	Sets the world space position and rotation of the Transform component.
    // SetSiblingIndex	Sets the sibling index.
    // TransformDirection	Transforms direction from local space to world space.
    // TransformPoint	Transforms position from local space to world space.
    // TransformVector	Transforms vector from local space to world space.
    // Translate	Moves the transform in the direction and distance of translation.

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
