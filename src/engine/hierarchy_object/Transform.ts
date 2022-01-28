import { Euler, Matrix4, Object3D, Quaternion, Vector3 } from "three";
import { GameObject } from "./GameObject";
import { Scene } from "./Scene";
import { ObservableVector3 } from "../math/ObservableVector3";
import { ObservableEuler } from "../math/ObservableEuler";
import { ObservableQuaternion } from "../math/ObservableQuaternion";
import { ReadOnlyVector3 } from "../math/ReadOnlyVector3";
import { WritableVector3 } from "../math/WritableVector3";
import { EngineGlobalObject } from "../EngineGlobalObject";

/**
 * transform that delegates Object3D
 * do not drive this class
 */
export class Transform {
    private readonly _object3D: Object3D;
    private readonly _gameObject: GameObject;
    private readonly _engineGlobalObject: EngineGlobalObject;
    private readonly _onParentChanged: (oldParent: Transform|null, newParent: Transform|null) => void;

    private readonly _worldPosition: ObservableVector3;
    private readonly _worldRotationEuler: ObservableEuler;
    private readonly _worldRotation: ObservableQuaternion;
    private readonly _worldScale: ObservableVector3;
    private _hasChanged = false;

    // if this value is true, matrix computed from ancesstor to this local recursively, otherwise, matrix computed from world values
    private _coordinateAsOfLocal = true;
    private _localMatrixNeedUpdate = false;
    
    private get _worldMatrixNeedUpdate(): boolean {
        return this._object3D.matrixWorldNeedsUpdate;
    }
    private set _worldMatrixNeedUpdate(value: boolean) {
        this._object3D.matrixWorldNeedsUpdate = value;
    }

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

    /** @internal */
    public constructor(
        gameObject: GameObject,
        engineGlobalObject: EngineGlobalObject,
        _onParentChanged: (oldParent: Transform|null, newParent: Transform|null) => void
    ) {
        this._engineGlobalObject = engineGlobalObject;
        this._onParentChanged = _onParentChanged;

        this._object3D = new Object3D();
        this._object3D.matrixAutoUpdate = false;
        this._object3D.userData = this;
        this._object3D.parent = this._engineGlobalObject.rootScene;
        
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

        const observableScale = new ObservableVector3(1, 1, 1);
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

        const observableWorldScale = new ObservableVector3(1, 1, 1);
        observableWorldScale.onBeforeGetComponent(onBeforeGetWorldBind);
        observableWorldScale.onChange(onWorldChangeBind);
        this._worldScale = observableWorldScale;

        this.setMatrixNeedUpdateRecursively();// for initialize render objects
    }

    // #region observable event

    // #region local
    
    private onBeforeGetLocal(): void {
        if (!this._coordinateAsOfLocal) {
            this.updateMatrixRecursivelyFromAncestorToThis();
            this.updateLocalPositionRotationScale();
        }
    }

    private onLocalChange(): void {
        this._coordinateAsOfLocal = true;
        this.setMatrixNeedUpdateRecursively();
        this.setHasChangedRecursively();
    }

    private onLocalEulerRotationChange() {
        //for override Object3D.onRotationChange()
        this._object3D.quaternion.setFromEuler(this._object3D.rotation, false);

        this._coordinateAsOfLocal = true;
        this.setMatrixNeedUpdateRecursively();
        this.setHasChangedRecursively();
    }

    private onLocalRotationChange() {
        //for override Object3D.onQuaternionChange()
        this._object3D.rotation.setFromQuaternion(this._object3D.quaternion, undefined, false);

        this._coordinateAsOfLocal = true;
        this.setMatrixNeedUpdateRecursively();
        this.setHasChangedRecursively();
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
        this.setHasChangedRecursively();
    }
    
    private onWorldEulerRotationChange(): void {
        this._worldRotation.setFromEuler(this._worldRotationEuler, false);

        this._coordinateAsOfLocal = false;
        this.setMatrixNeedUpdateRecursively();
        this.setHasChangedRecursively();
    }

    private onWorldRotationChange(): void {
        this._object3D.quaternion.setFromEuler(this._worldRotationEuler, false);

        this._coordinateAsOfLocal = false;
        this.setMatrixNeedUpdateRecursively();
        this.setHasChangedRecursively();
    }

    // #endregion

    // #endregion

    private setMatrixNeedUpdateRecursively(): void {
        this._engineGlobalObject.transformMatrixProcessor.enqueueTransformToUpdate(this);
        this.setMatrixNeedUpdateRecursivelyInternal();
    }

    private setMatrixNeedUpdateRecursivelyInternal(): void {
        if (this._localMatrixNeedUpdate /*|| this.worldMatrixNeedUpdate*/) {
            return;
        }
        this._localMatrixNeedUpdate = true;
        this._worldMatrixNeedUpdate = true;
        const children = this._object3D.children;
        for (let i = 0, len = children.length; i < len; i++) {
            const child = children[i];
            if (child.userData instanceof Transform) {
                child.userData.setMatrixNeedUpdateRecursivelyInternal();
            }
        }
    }

    private setHasChangedRecursively(): void {
        this._hasChanged = true;
        const children = this._object3D.children;
        for (let i = 0, len = children.length; i < len; i++) {
            const child = children[i];
            if (child.userData instanceof Transform) {
                child.userData.setHasChangedRecursively();
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

    private updateLocalMatrixFromWorldMatrix(): void {
        if (!this._localMatrixNeedUpdate) return;
        this._localMatrixNeedUpdate = false;

        const parent = this.parent;
        if (parent) {
            const worldToLocalMatrix = Transform._matrix4Buffer.copy(parent._object3D.matrixWorld).invert();
            this._object3D.matrix.multiplyMatrices(this._object3D.matrixWorld, worldToLocalMatrix);
        } else {
            this._object3D.matrix.copy(this._object3D.matrixWorld);
        }
    }
        
    private updateLocalPositionRotationScale(): void {
        if (!this._localPositionRotationScaleNeedToUpdate) return;
        this._localPositionRotationScaleNeedToUpdate = false;

        this.updateLocalMatrixFromWorldMatrix();

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

    /** @internal */
    public isRegisteredToProcessor = false;

    /** @internal */
    public tryUpdateWorldMatrixRecursivelyFromThisToChildren(): boolean {
        const parent = this.parent;
        if (parent) if (parent._worldMatrixNeedUpdate) return false;
        return this.tryUpdateWorldMatrixRecursivelyFromThisToChildrenInternal();
    }

    private tryUpdateWorldMatrixRecursivelyFromThisToChildrenInternal(): boolean {
        if (this._coordinateAsOfLocal) {
            if (!this._localMatrixNeedUpdate /*&& !this.worldMatrixNeedUpdate*/) return true;
            const object3D_children = this._object3D.children;
            for (let i = 0, l = object3D_children.length; i < l; i++) {
                const child = object3D_children[i];
                if (!(child.userData instanceof Transform)) {
                    this.enqueueRenderAttachedObject3D(child);
                }
            }
            
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
            
            const parent = this.parent;
            if (parent) {
                this._object3D.matrixWorld.multiplyMatrices(parent._object3D.matrixWorld, localMatrix);
            } else {
                this._object3D.matrixWorld.copy(localMatrix);
            }
            
            this._localMatrixNeedUpdate = false;
            this._worldMatrixNeedUpdate = false;
            this._worldPositionRotationScaleNeedToUpdate = true;
        } else {
            if (!this._worldMatrixNeedUpdate) return true;
            const object3D_children = this._object3D.children;
            for (let i = 0, l = object3D_children.length; i < l; i++) {
                const child = object3D_children[i];
                if (!(child.userData instanceof Transform)) {
                    this.enqueueRenderAttachedObject3D(child);
                }
            }
            
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

        const object3D_children = this._object3D.children;
        for (let i = 0, l = object3D_children.length; i < l; i++) {
            const child = object3D_children[i];
            if (child.userData instanceof Transform) {
                child.userData.tryUpdateWorldMatrixRecursivelyFromThisToChildrenInternal();
            }
        }
        return true;
    }

    // #endregion

    /**
     * foreach children transform
     * @param callback 
     */
    public foreachChild(callback: (transform: Transform) => void): void {
        const object3D_children = this._object3D.children;
        for (let i = 0, l = object3D_children.length; i < l; i++) {
            const child = object3D_children[i];
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
        const object3D_children = this._object3D.children;
        for (let i = 0, l = object3D_children.length; i < l; i++) {
            const child = object3D_children[i];
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
     * set parent, if value is null, set to scene
     * 
     * you can't set parent that in another engine instance
     */
    public set parent(value: Transform | null) {
        if (value) {
            const oldParent = this.parent;
            this._object3D.removeFromParent();
            value._object3D.add(this._object3D);
            this.setMatrixNeedUpdateRecursively();
            this._onParentChanged(oldParent, value);
        } else {
            const oldParent = this.parent;
            this._object3D.removeFromParent();
            this._engineGlobalObject.rootScene.add(this._object3D);
            this.setMatrixNeedUpdateRecursively();
            this._onParentChanged(oldParent, null);
        }
    }


    /**
     * get children. it returns new instance of Array, so you can change it
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

    private static readonly _vector3Buffer = new Vector3();

    /**
     * Returns a normalized vector representing the blue axis of the transform in world space.
     * @param target optional, target vector
     */
    public getForward(target?: Vector3): Vector3 {
        this.updateMatrixRecursivelyFromAncestorToThis();
        const e = this._object3D.matrixWorld.elements;
        return target ? target.set(e[8], e[9], e[10]) : new Vector3(e[8], e[9], e[10]);
    }

    /**
     * set vector representing the blue axis of the transform in world space.
     */
    public setForward(value: ReadOnlyVector3): void {
        this.updateMatrixRecursivelyFromAncestorToThis();
        const e = this._object3D.matrixWorld.elements;
        const v = (Transform._vector3Buffer as WritableVector3).copy(value).normalize();
        e[8] = v.x;
        e[9] = v.y;
        e[10] = v.z;
        this._localMatrixNeedUpdate = true;
        this._localPositionRotationScaleNeedToUpdate = true;
        this._worldPositionRotationScaleNeedToUpdate = true;
    }

    /**
     * The red axis of the transform in world space.
     * @param target optional, target vector
     */
    public getRight(target?: Vector3): Vector3 {
        this.updateMatrixRecursivelyFromAncestorToThis();
        const e = this._object3D.matrixWorld.elements;
        return target ? target.set(e[0], e[1], e[2]) : new Vector3(e[0], e[1], e[2]);
    }

    /**
     * set vector representing the red axis of the transform in world space.
     */
    public setRight(value: ReadOnlyVector3): void {
        this.updateMatrixRecursivelyFromAncestorToThis();
        const e = this._object3D.matrixWorld.elements;
        const v = (Transform._vector3Buffer as WritableVector3).copy(value).normalize();
        e[0] = v.x;
        e[1] = v.y;
        e[2] = v.z;
        this._localMatrixNeedUpdate = true;
        this._localPositionRotationScaleNeedToUpdate = true;
        this._worldPositionRotationScaleNeedToUpdate = true;
    }

    /**
     * The green axis of the transform in world space.
     * @param target optional, target vector
     */
    public getUp(target?: Vector3): Vector3 {
        this.updateMatrixRecursivelyFromAncestorToThis();
        const e = this._object3D.matrixWorld.elements;
        return target ? target.set(e[4], e[5], e[6]) : new Vector3(e[4], e[5], e[6]);
    }

    /**
     * set vector representing the green axis of the transform in world space.
     */
    public setUp(value: ReadOnlyVector3): void {
        this.updateMatrixRecursivelyFromAncestorToThis();
        const e = this._object3D.matrixWorld.elements;
        const v = (Transform._vector3Buffer as WritableVector3).copy(value).normalize();
        e[4] = v.x;
        e[5] = v.y;
        e[6] = v.z;
        this._localMatrixNeedUpdate = true;
        this._localPositionRotationScaleNeedToUpdate = true;
        this._worldPositionRotationScaleNeedToUpdate = true;
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

    /**
     * Has the transform changed since the last time the flag was set to 'false'?
     */
    public get hasChanged(): boolean {
        return this._hasChanged;
    }

    /**
     * Has the transform changed since the last time the flag was set to 'false'?
     * @param value
     */
    public set hasChanged(value: boolean) {
        this._hasChanged = value;
    }

    /**
     * world to local matrix
     * @param target optional, target matrix
     */
    public getWorldToLocalMatrix(target?: Matrix4): Matrix4 {
        this.updateMatrixRecursivelyFromAncestorToThis();
        return target ? target.copy(this._object3D.matrixWorld).invert() : this._object3D.matrixWorld.clone().invert();
    }

    /**
     * local to world matrix
     * @param target optional, target matrix
     */
    public getLocalToWorldMatrix(target?: Matrix4): Matrix4 {
        this.updateMatrixRecursivelyFromAncestorToThis();
        return target ? target.copy(this._object3D.matrixWorld) : this._object3D.matrixWorld.clone();
    }
    
    /**
     * Transforms position from local space to world space.
     * @param position A local position.
     */
    public transformPoint(position: Vector3): Vector3 {
        this.updateMatrixRecursivelyFromAncestorToThis();
        return this._object3D.localToWorld(position);
    }

    /**
     * Transforms position from world space to local space.
     * @param position A world position.
     */
    public inverseTransformPoint(position: Vector3): Vector3 {
        this.updateMatrixRecursivelyFromAncestorToThis();
        return this._object3D.worldToLocal(position);
    }

    /**
     * Transforms direction from local space to world space.
     * This operation is not affected by scale or position of the transform. The returned vector has the same length as direction.
     * @param direction A local direction.
     */
    public transformDirection(direction: Vector3): Vector3 {
        const m = Transform._matrix4Buffer
            .copy(this._object3D.matrixWorld)
            .makeScale(1, 1, 1);
        return direction.transformDirection(m);
    }

    /**
     * Transforms direction from world space to local space.
     * This operation is unaffected by scale.
     * @param direction A world direction.
     */
    public inverseTransformDirection(direction: Vector3): Vector3 {
        const m = Transform._matrix4Buffer
            .copy(this._object3D.matrixWorld)
            .makeScale(1, 1, 1)
            .invert();
        return direction.transformDirection(m);
    }

    /**
     * Transforms vector from local space to world space.
     * This operation is not affected by position of the transform, but it is affected by scale. The returned vector may have a different length than vector.
     * @param vector A local vector.
     */
    public transformVector(vector: Vector3): Vector3 {
        return vector.transformDirection(this._object3D.matrixWorld);
    }

    /**
     * Transforms a vector from world space to local space. The opposite of Transform.TransformVector.
     * This operation is affected by scale.
     */
    public inverseTransformVector(vector: Vector3): Vector3 {
        return vector.transformDirection(Transform._matrix4Buffer.copy(this._object3D.matrixWorld).invert());
    }

    /**
     * Is this transform a child of parent?
     * @returns a boolean value that indicates whether the transform is a child of a given transform. true if this transform is a child, deep child (child of a child) or identical to this transform, otherwise false.
     */
    public isChildOf(parent: Transform): boolean {
        if (this === parent) return true;
        const this_parent = this.parent;
        if (this_parent) return this_parent.isChildOf(parent);
        return false;
    }

    private static readonly _quaternionBuffer = new Quaternion();

    /**
     * Rotates object to face point in space.
     * @param vector A world vector to look at.
     */
    public lookAt(vector: Vector3): void {
        const parent = this.parent;

        Transform._vector3Buffer.setFromMatrixPosition(this._object3D.matrixWorld);
        const m = Transform._matrix4Buffer.lookAt(Transform._vector3Buffer, vector, this._object3D.up);
        this._object3D.quaternion.setFromRotationMatrix(m);

        if (parent) {
            m.extractRotation(parent._object3D.matrixWorld);
            const q = Transform._quaternionBuffer.setFromRotationMatrix(m);
            this._object3D.quaternion.premultiply(q.invert());
        }
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

    public enqueueRenderAttachedObject3D(rerenderObject: Object3D): void {
        this._engineGlobalObject.transformMatrixProcessor.enqueueRenderObject(rerenderObject);
    }

    /** @internal */
    public toJSON(): any {
        return { }; //for pervent infinite recursion
    }
}
