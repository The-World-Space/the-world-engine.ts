import { Euler, Matrix4, Object3D, Quaternion, Vector3 } from "three";
import { GameObject } from "./GameObject";
import { Scene } from "./Scene";
import { ObservableVector3 } from "../math/ObservableVector3";
import { ObservableEuler } from "../math/ObservableEuler";
import { ObservableQuaternion } from "../math/ObservableQuaternion";
import { ReadOnlyVector3 } from "../math/ReadOnlyVector3";

/**
 * transform that delegates Object3D
 */
export class Transform {
    private _object3D: Object3D;
    private _gameObject: GameObject;

    private _worldPosition: ObservableVector3;
    private _worldRotationEuler: ObservableEuler;
    private _worldRotation: ObservableQuaternion;
    private _worldScale: ObservableVector3;

    // if this value is true, matrix computed from ancesstor to this local recursively, otherwise, matrix computed from world values
    private _coordinateAsOfLocal = true;
    private _localMatrixNeedUpdate = false;
    private _worldMatrixNeedUpdate = false;
    private _worldPositionRotationScaleNeedToUpdate = false;
    private _localPositionRotationScaleNeedToUpdate = false;

    private readonly _onBeforeGetLocalBind = this.onBeforeGetLocal.bind(this);
    private readonly _onLocalChangeBind = this.onLocalChange.bind(this);
    private readonly _onLocalEulerRotationChangeBind = this.onLocalEulerRotationChange.bind(this);
    private readonly _onLocalRotationChangeBind = this.onLocalRotationChange.bind(this);

    private readonly _onBeforeGetWorldBind = this.onBeforeGetWorld.bind(this);
    private readonly _onWorldChangeBind = this.onWorldChange.bind(this);
    private readonly _onWorldEulerRotationChangeBind = this.onWorldEulerRotationChange.bind(this);
    private readonly _onWorldRotationChangeBind = this.onWorldRotationChange.bind(this);

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

        const onBeforeGetLocalBind = this._onBeforeGetLocalBind;
        const onLocalChangeBind = this._onLocalChangeBind;

        const observablePosition = new ObservableVector3();
        observablePosition.onBeforeGetComponent(onBeforeGetLocalBind);
        observablePosition.onChange(onLocalChangeBind);
        (this._object3D.position as any) = observablePosition; //inject observable

        const observableRotation = new ObservableEuler();
        observableRotation.onBeforeGetComponent(onBeforeGetLocalBind);
        observableRotation._onChange(this._onLocalEulerRotationChangeBind);
        (this._object3D.rotation as any) = observableRotation; //inject observable

        const observableQuaternion = new ObservableQuaternion();
        observableQuaternion.onBeforeGetComponent(onBeforeGetLocalBind);
        observableQuaternion._onChange(this._onLocalRotationChangeBind);
        (this._object3D.quaternion as any) = observableQuaternion; //inject observable

        const observableScale = new ObservableVector3();
        observableScale.onBeforeGetComponent(onBeforeGetLocalBind);
        observableScale.onChange(onLocalChangeBind);
        (this._object3D.scale as any) = observableScale; //inject observable

        this._gameObject = gameObject;

        const onBeforeGetWorldBind = this._onBeforeGetWorldBind;
        const onWorldChangeBind = this._onWorldChangeBind;

        const observableWorldPosition = new ObservableVector3();
        observableWorldPosition.onBeforeGetComponent(onBeforeGetWorldBind);
        observableWorldPosition.onChange(onWorldChangeBind);
        this._worldPosition = observableWorldPosition;
        
        const observableWorldRotation = new ObservableEuler();
        observableWorldRotation.onBeforeGetComponent(onBeforeGetWorldBind);
        observableWorldRotation._onChange(this._onWorldEulerRotationChangeBind);
        this._worldRotationEuler = observableWorldRotation;

        const observableWorldRotationQuaternion = new ObservableQuaternion();
        observableWorldRotationQuaternion.onBeforeGetComponent(onBeforeGetWorldBind);
        observableWorldRotationQuaternion._onChange(this._onWorldRotationChangeBind);
        this._worldRotation = observableWorldRotationQuaternion;

        const observableWorldScale = new ObservableVector3();
        observableWorldScale.onBeforeGetComponent(onBeforeGetWorldBind);
        observableWorldScale.onChange(onWorldChangeBind);
        this._worldScale = observableWorldScale;
    }

    // #region observable event

    // #region local
    
    public onBeforeGetLocal(): void {
        if (!this._coordinateAsOfLocal) {
            this.updateMatrixRecursivelyFromAncestorToThis();
            this.updateLocalPositionRotationScale();
        }
    }

    private onLocalChange(): void {
        this._coordinateAsOfLocal = true;
        this.setMatrixNeedUpdateRecursively();
    }

    private onLocalEulerRotationChange() {
        //for override Object3D.onRotationChange()
        this._object3D.quaternion.setFromEuler(this._object3D.rotation, false);

        this._coordinateAsOfLocal = true;
        this.setMatrixNeedUpdateRecursively();
    }

    private onLocalRotationChange() {
        //for override Object3D.onQuaternionChange()
        this._object3D.rotation.setFromQuaternion(this._object3D.quaternion, undefined, false);

        this._coordinateAsOfLocal = true;
        this.setMatrixNeedUpdateRecursively();
    }

    // #endregion

    // #region world

    private onBeforeGetWorld(): void {
        if (this._coordinateAsOfLocal) {
            this.updateMatrixRecursivelyFromAncestorToThis();
            this.updateWorldPositionRotationScale();
        }
    }

    private onWorldChange(): void {
        this._coordinateAsOfLocal = false;
        this.setMatrixNeedUpdateRecursively();
    }
    
    private onWorldEulerRotationChange(): void {
        this._worldRotation.setFromEuler(this._worldRotationEuler, false);

        this._coordinateAsOfLocal = false;
        this.setMatrixNeedUpdateRecursively();
    }

    private onWorldRotationChange(): void {
        this._object3D.quaternion.setFromEuler(this._worldRotationEuler, false);

        this._coordinateAsOfLocal = false;
        this.setMatrixNeedUpdateRecursively();
    }

    // #endregion

    // #endregion

    private setMatrixNeedUpdateRecursively(): void {
        if (this._localMatrixNeedUpdate /*|| this.worldMatrixNeedUpdate*/) {
            return;
        }
        this._localMatrixNeedUpdate = true;
        this._worldMatrixNeedUpdate = true;
        for (const child of this._object3D.children) {
            if (child.userData instanceof Transform) {
                (child.userData as Transform).setMatrixNeedUpdateRecursively();
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private static readonly _emptyFunction = () => { };

    private updateMatrixRecursivelyFromAncestorToThis(): void {
        if (this._coordinateAsOfLocal) {
            if (!this._localMatrixNeedUpdate /*&& !this.worldMatrixNeedUpdate*/) return;
            const parent = this.parent;
            if (parent) parent.updateMatrixRecursivelyFromAncestorToThis();

            const localMatrix = this._object3D.matrix;

            const emptyFunction = Transform._emptyFunction;
            (this.localPosition as unknown as ObservableVector3).onBeforeGetComponent(emptyFunction);
            (this.localRotation as unknown as ObservableEuler).onBeforeGetComponent(emptyFunction);
            (this.localScale as unknown as ObservableVector3).onBeforeGetComponent(emptyFunction);
            
            localMatrix.compose(this.localPosition, this.localRotation, this.localScale);
            
            this.localEulerAngles.setFromQuaternion(this.localRotation, undefined, false);
            (this.localPosition as unknown as ObservableVector3).onBeforeGetComponent(this._onBeforeGetLocalBind);
            (this.localRotation as unknown as ObservableEuler).onBeforeGetComponent(this._onBeforeGetLocalBind);
            (this.localScale as unknown as ObservableVector3).onBeforeGetComponent(this._onBeforeGetLocalBind);
            
            if (parent) {
                this._object3D.matrixWorld.multiplyMatrices(parent._object3D.matrixWorld, localMatrix);
            } else {
                this._object3D.matrixWorld.copy(localMatrix);
            }
            
            this._localMatrixNeedUpdate = false;
            this._worldMatrixNeedUpdate = false;
            this._worldPositionRotationScaleNeedToUpdate = true;
        } else {
            if (!this._worldMatrixNeedUpdate) return;
            
            const emptyFunction = Transform._emptyFunction;
            this._worldPosition.onBeforeGetComponent(emptyFunction);
            this._worldRotation.onBeforeGetComponent(emptyFunction);
            this._worldScale.onBeforeGetComponent(emptyFunction);

            this._object3D.matrixWorld.compose(
                (this._worldPosition as unknown as Vector3),
                (this._worldRotation as unknown as Quaternion),
                (this._worldScale as unknown as Vector3)
            );

            this._worldPosition.onBeforeGetComponent(this._onBeforeGetWorldBind);
            this._worldRotation.onBeforeGetComponent(this._onBeforeGetWorldBind);
            this._worldScale.onBeforeGetComponent(this._onBeforeGetWorldBind);

            this._localMatrixNeedUpdate = true;
            this._worldMatrixNeedUpdate = false;
            this._localPositionRotationScaleNeedToUpdate = true;
        }
    }

    private updateWorldPositionRotationScale(): void {
        if (!this._worldPositionRotationScaleNeedToUpdate) return;
        this._worldPositionRotationScaleNeedToUpdate = false;

        const emptyFunction = Transform._emptyFunction;
        this._worldPosition.onChange(emptyFunction);
        this._worldRotationEuler._onChange(emptyFunction);
        this._worldRotation._onChange(emptyFunction);
        this._worldScale.onChange(emptyFunction);

        this._object3D.matrixWorld.decompose(
            this._worldPosition as unknown as Vector3,
            this._worldRotation as unknown as Quaternion,
            this._worldScale as unknown as Vector3
        );
        this._worldRotationEuler.setFromQuaternion(this._worldRotation as unknown as Quaternion, undefined, false);
        this._worldPosition.onChange(this._onWorldChangeBind);
        this._worldRotationEuler._onChange(this._onWorldEulerRotationChangeBind);
        this._worldRotation._onChange(this._onWorldRotationChangeBind);
        this._worldScale.onChange(this._onWorldChangeBind);
    }

    private static readonly _matrix4Buffer = new Matrix4();

    private updateLocalPositionRotationScale(): void {
        if (!this._localPositionRotationScaleNeedToUpdate) return;
        this._localPositionRotationScaleNeedToUpdate = false;

        if (this._localMatrixNeedUpdate) {
            if (this.parent) {
                const worldToLocalMatrix = Transform._matrix4Buffer.copy(this.parent._object3D.matrixWorld).invert();
                this._object3D.matrix.multiplyMatrices(this._object3D.matrixWorld, worldToLocalMatrix);
            } else {
                this._object3D.matrix.copy(this._object3D.matrixWorld);
            }
            this._localMatrixNeedUpdate = false;
        }

        const emptyFunction = Transform._emptyFunction;
        (this.localPosition as unknown as ObservableVector3).onChange(emptyFunction);
        (this.localRotation as unknown as ObservableQuaternion)._onChange(emptyFunction);
        (this.localScale as unknown as ObservableVector3).onChange(emptyFunction);

        this._object3D.matrix.decompose(this.localPosition, this.localRotation, this.localScale);

        this.localEulerAngles.setFromQuaternion(this.localRotation, undefined, false);
        (this.localPosition as unknown as ObservableVector3).onChange(this._onLocalChangeBind);
        (this.localRotation as unknown as ObservableQuaternion)._onChange(this._onLocalRotationChangeBind);
        (this.localScale as unknown as ObservableVector3).onChange(this._onLocalChangeBind);
    }

    // #endregion

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
        return this._worldPosition as unknown as Vector3;
    }

    /**
     * Object's world rotation (Euler angles), in radians.
     */
    public get eulerAngles(): Euler {
        return this._worldRotationEuler as unknown as Euler;
    }

    /**
     * Object's world rotation as a Quaternion.
     */
    public get rotation(): Quaternion {
        return this._worldRotation as unknown as Quaternion;
    }

    /**
     * Object's world scale.
     */
    public get lossyScale(): ReadOnlyVector3 {
        return this._worldScale as unknown as Vector3;
    }

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
