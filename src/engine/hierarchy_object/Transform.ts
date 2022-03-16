import { Euler, Matrix4, Object3D, Quaternion, Scene, Vector3 } from "three/src/Three";
import { GameObject } from "./GameObject";
import { ObservableVector3 } from "../math/ObservableVector3";
import { ObservableEuler } from "../math/ObservableEuler";
import { ObservableQuaternion } from "../math/ObservableQuaternion";
import { ReadonlyVector3 } from "../math/ReadonlyVector3";
import { WritableVector3 } from "../math/WritableVector3";
import { EngineGlobalObject } from "../EngineGlobalObject";

/**
 * transform that delegates Object3D
 * do not drive this class
 */
export class Transform {
    // #region fields

    private static readonly TransformObject3D = class extends Object3D {
        public override updateMatrix(): void {
            (this.userData as Transform).updateLocalMatrixFromOthers();
        }
    
        public override updateMatrixWorld(_force?: boolean): void {
            (this.userData as Transform).updateWorldMatrixFromLocalMatrixAndParentWorldMatrix();
        }
    
        public override updateWorldMatrix(_updateParents: boolean, updateChildren: boolean): void {
            (this.userData as Transform).updateWorldMatrixFromLocalMatrixAndParentWorldMatrix();
            if (updateChildren) {
                const children = this.children;
                for (let i = 0, l = children.length; i < l; i++) {
                    children[i].updateWorldMatrix(false, true);
                }
            }
        }
    };

    private readonly _object3D: Object3D;
    private readonly _gameObject: GameObject;
    private readonly _engineGlobalObject: EngineGlobalObject;
    private readonly _onParentChanged: (oldParent: Transform|null, newParent: Transform|null) => void;

    private readonly _worldPosition: ObservableVector3;
    private readonly _worldRotationEuler: ObservableEuler;
    private readonly _worldRotation: ObservableQuaternion;
    private readonly _worldScale: ObservableVector3;

    private _hasChanged = false;
    
    private _localMatrixNeedUpdate = false;
    private _worldMatrixNeedUpdate = false;
    private _worldPositionRotationScaleNeedUpdate = false;
    private _localPositionRotationScaleNeedUpdate = false;

    private readonly _onBeforeGetLocalBind = this.onBeforeGetLocal.bind(this);
    private readonly _onBeforeLocalChangeBind = this.onBeforeLocalChange.bind(this);
    private readonly _onLocalEulerRotationChangedBind = this.onLocalEulerRotationChanged.bind(this);
    private readonly _onLocalRotationChangedBind = this.onLocalRotationChanged.bind(this);

    private readonly _onBeforeGetWorldBind = this.onBeforeGetWorld.bind(this);
    private readonly _onBeforeWorldChangeBind = this.onBeforeWorldChange.bind(this);
    private readonly _onWorldEulerRotationChangedBind = this.onWorldEulerRotationChanged.bind(this);
    private readonly _onWorldRotationChangedBind = this.onWorldRotationChanged.bind(this);

    // #endregion

    /** @internal */
    public constructor(
        gameObject: GameObject,
        engineGlobalObject: EngineGlobalObject,
        _onParentChanged: (oldParent: Transform|null, newParent: Transform|null) => void
    ) {
        this._engineGlobalObject = engineGlobalObject;
        this._onParentChanged = _onParentChanged;

        this._object3D = new Transform.TransformObject3D();
        this._object3D.matrixAutoUpdate = true;
        this._object3D.userData = this;
        engineGlobalObject.scene.unsafeGetThreeScene().add(this._object3D);
        
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
        const onLocalChangeBind = this._onBeforeLocalChangeBind;

        const observablePosition = new ObservableVector3();
        observablePosition.onBeforeGetComponent(onBeforeGetLocalBind);
        observablePosition.onBeforeChange(onLocalChangeBind);
        (this._object3D.position as any) = observablePosition; //inject observable

        const observableRotation = new ObservableEuler();
        observableRotation.onBeforeGetComponent(onBeforeGetLocalBind);
        observableRotation.onBeforeChange(onLocalChangeBind);
        observableRotation._onChange(this._onLocalEulerRotationChangedBind);
        (this._object3D.rotation as any) = observableRotation; //inject observable

        const observableQuaternion = new ObservableQuaternion();
        observableQuaternion.onBeforeGetComponent(onBeforeGetLocalBind);
        observableQuaternion.onBeforeChange(onLocalChangeBind);
        observableQuaternion._onChange(this._onLocalRotationChangedBind);
        (this._object3D.quaternion as any) = observableQuaternion; //inject observable

        const observableScale = new ObservableVector3(1, 1, 1);
        observableScale.onBeforeGetComponent(onBeforeGetLocalBind);
        observableScale.onBeforeChange(onLocalChangeBind);
        (this._object3D.scale as any) = observableScale; //inject observable

        this._gameObject = gameObject;

        const onBeforeGetWorldBind = this._onBeforeGetWorldBind;
        const onWorldChangeBind = this._onBeforeWorldChangeBind;

        const observableWorldPosition = new ObservableVector3();
        observableWorldPosition.onBeforeGetComponent(onBeforeGetWorldBind);
        observableWorldPosition.onBeforeChange(onWorldChangeBind);
        this._worldPosition = observableWorldPosition;
        
        const observableWorldRotation = new ObservableEuler();
        observableWorldRotation.onBeforeGetComponent(onBeforeGetWorldBind);
        observableWorldRotation.onBeforeChange(onWorldChangeBind);
        observableWorldRotation._onChange(this._onWorldEulerRotationChangedBind);
        this._worldRotationEuler = observableWorldRotation;

        const observableWorldRotationQuaternion = new ObservableQuaternion();
        observableWorldRotationQuaternion.onBeforeGetComponent(onBeforeGetWorldBind);
        observableWorldRotationQuaternion.onBeforeChange(onWorldChangeBind);
        observableWorldRotationQuaternion._onChange(this._onWorldRotationChangedBind);
        this._worldRotation = observableWorldRotationQuaternion;

        const observableWorldScale = new ObservableVector3(1, 1, 1);
        observableWorldScale.onBeforeGetComponent(onBeforeGetWorldBind);
        observableWorldScale.onBeforeChange(onWorldChangeBind);
        this._worldScale = observableWorldScale;

        this.setWorldMatrixNeedUpdateRecursively();// for initialize render objects
    }

    // #region observable event

    private _ignoreObservableEvent = false;

    // #region local
    
    private onBeforeGetLocal(): void {
        if (this._ignoreObservableEvent) return;

        this.updateLocalPositionRotationScaleFromOthers();
    }

    private onBeforeLocalChange(): void {
        if (this._ignoreObservableEvent) return;

        this.updateChildrenLocalPositionRotationScaleFromOthersRecursively();
        this._localPositionRotationScaleNeedUpdate = false;
        this._localMatrixNeedUpdate = true;
        this.setWorldMatrixNeedUpdateRecursively();
        this.setWorldPositionRotationScaleNeedUpdateRecursively();
        this.setHasChangedRecursively();
    }

    private onLocalEulerRotationChanged() {
        if (this._ignoreObservableEvent) return;

        //for override Object3D.onRotationChange()
        this._object3D.quaternion.setFromEuler(this._object3D.rotation, false);
    }

    private onLocalRotationChanged() {
        if (this._ignoreObservableEvent) return;

        //for override Object3D.onQuaternionChange()
        this._object3D.rotation.setFromQuaternion(this._object3D.quaternion, undefined, false);
    }

    // #endregion

    // #region world

    private onBeforeGetWorld(): void {
        if (this._ignoreObservableEvent) return;
        
        this.updateWorldPositionRotationScaleFromOthers();
    }

    private onBeforeWorldChange(): void {
        if (this._ignoreObservableEvent) return;
        
        this.updateChildrenLocalPositionRotationScaleFromOthersRecursively();
        this._worldPositionRotationScaleNeedUpdate = false;
        this._localPositionRotationScaleNeedUpdate = true;
        this._localMatrixNeedUpdate = true;
        this.setWorldMatrixNeedUpdateRecursively();
        this.setChildrenWorldPositionRotationScaleNeedUpdateRecursively();
        this.setHasChangedRecursively();
    }
    
    private onWorldEulerRotationChanged(): void {
        if (this._ignoreObservableEvent) return;
        
        this._worldRotation.setFromEuler(this._worldRotationEuler, false);
    }

    private onWorldRotationChanged(): void {
        if (this._ignoreObservableEvent) return;
        
        this._worldRotationEuler.setFromQuaternion(this._worldRotation as unknown as Quaternion, undefined, false);
    }

    // #endregion

    // #endregion

    // #region matrix update function

    // #region set need update function

    private setWorldPositionRotationScaleNeedUpdateRecursively(): void {
        this._worldPositionRotationScaleNeedUpdate = true;
        const children = this._object3D.children;
        for (let i = 0, len = children.length; i < len; i++) {
            const child = children[i];
            if (child.userData instanceof Transform) {
                child.userData.setWorldPositionRotationScaleNeedUpdateRecursively();
            }
        }
    }

    private setChildrenWorldPositionRotationScaleNeedUpdateRecursively(): void {
        const children = this._object3D.children;
        for (let i = 0, len = children.length; i < len; i++) {
            const child = children[i];
            if (child.userData instanceof Transform) {
                child.userData.setWorldPositionRotationScaleNeedUpdateRecursively();
            }
        }
    }

    private setWorldMatrixNeedUpdateRecursively(): void {
        this._engineGlobalObject.transformMatrixProcessor.enqueueTransformToUpdate(this);
        this.setWorldMatrixNeedUpdateRecursivelyInternal();
    }

    private setWorldMatrixNeedUpdateRecursivelyInternal(): void {
        this._worldMatrixNeedUpdate = true;
        const children = this._object3D.children;
        for (let i = 0, len = children.length; i < len; i++) {
            const child = children[i];
            if (child.userData instanceof Transform) {
                child.userData.setWorldMatrixNeedUpdateRecursivelyInternal();
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

    // #endregion

    private static readonly _matrix4Buffer = new Matrix4();

    private updateLocalPositionRotationScaleFromOthers(): void {
        if (!this._localPositionRotationScaleNeedUpdate) return;

        if (this._localMatrixNeedUpdate) {
            if (this._worldMatrixNeedUpdate) {
                //update world matrix from world position, rotation, scale
                this._ignoreObservableEvent = true;

                this._object3D.matrixWorld.compose(
                    (this._worldPosition as unknown as Vector3),
                    (this._worldRotation as unknown as Quaternion),
                    (this._worldScale as unknown as Vector3)
                );

                this._ignoreObservableEvent = false;

                this._worldMatrixNeedUpdate = false;
                this._gameObject.gameObjectEventContainer.invokeOnWorldMatrixUpdated();
            }
            //update local matrix from world matrix and parent world matrix
            const parent = this.parent;
            if (parent) {
                parent.updateWorldMatrixFromLocalMatrixAndParentWorldMatrix();
                const worldToLocalMatrix = Transform._matrix4Buffer.copy(parent._object3D.matrixWorld).invert();
                this._object3D.matrix.multiplyMatrices(this._object3D.matrixWorld, worldToLocalMatrix);
            } else {
                this._object3D.matrix.copy(this._object3D.matrixWorld);
            }
            this._localMatrixNeedUpdate = false;
        }
        //update local position, rotation, scale from local matrix
        this._ignoreObservableEvent = true;

        this._object3D.matrix.decompose(this.localPosition, this.localRotation, this.localScale);

        this.localEulerAngles.setFromQuaternion(this.localRotation, undefined, false);
        this._ignoreObservableEvent = false;
        
        this._localPositionRotationScaleNeedUpdate = false;
    }

    private updateWorldPositionRotationScaleFromOthers(): void {
        if (!this._worldPositionRotationScaleNeedUpdate) return;

        this.updateWorldMatrixFromLocalMatrixAndParentWorldMatrix();

        //update world position, rotation, scale from world matrix
        this._ignoreObservableEvent = true;

        this._object3D.matrixWorld.decompose(
            this._worldPosition as unknown as Vector3,
            this._worldRotation as unknown as Quaternion,
            this._worldScale as unknown as Vector3
        );

        this._worldRotationEuler.setFromQuaternion(this._worldRotation as unknown as Quaternion, undefined, false);
        this._ignoreObservableEvent = false;

        this._worldPositionRotationScaleNeedUpdate = false;
    }

    private updateWorldMatrixFromLocalMatrixAndParentWorldMatrix(): void {
        if (!this._worldMatrixNeedUpdate) return;
        
        const localMatrix = this._object3D.matrix;
        
        if (!this._localMatrixNeedUpdate) {
            //update world matrix from local matrix and parent world matrix
            const parent = this.parent;
            if (parent) {
                parent.updateWorldMatrixFromLocalMatrixAndParentWorldMatrix();
                this._object3D.matrixWorld.multiplyMatrices(parent._object3D.matrixWorld, localMatrix);
            } else {
                this._object3D.matrixWorld.copy(localMatrix);
            }
        } else if (!this._localPositionRotationScaleNeedUpdate) {
            if (this._localMatrixNeedUpdate) {
                //update local matrix from local position, rotation, scale
                this._ignoreObservableEvent = true;
                
                localMatrix.compose(this.localPosition, this.localRotation, this.localScale);
                
                this._ignoreObservableEvent = false;

                this._localMatrixNeedUpdate = false;
            }
            //update world matrix from local matrix and parent world matrix
            const parent = this.parent;
            if (parent) {
                parent.updateWorldMatrixFromLocalMatrixAndParentWorldMatrix();
                this._object3D.matrixWorld.multiplyMatrices(parent._object3D.matrixWorld, localMatrix);
            } else {
                this._object3D.matrixWorld.copy(localMatrix);
            }
        } else /*if (!this._worldPositionRotationScaleNeedUpdate)*/ {
            //update world matrix from world position, rotation, scale
            this._ignoreObservableEvent = true;

            this._object3D.matrixWorld.compose(
                (this._worldPosition as unknown as Vector3),
                (this._worldRotation as unknown as Quaternion),
                (this._worldScale as unknown as Vector3)
            );

            this._ignoreObservableEvent = false;
        }
        this._worldMatrixNeedUpdate = false;
        this._gameObject.gameObjectEventContainer.invokeOnWorldMatrixUpdated();
    }

    private updateLocalMatrixFromOthers(): void {
        if (!this._localMatrixNeedUpdate) return;
        
        const localMatrix = this._object3D.matrix;
        
        if (!this._worldMatrixNeedUpdate) {
            //update local matrix from world matrix and parent world matrix
            const parent = this.parent;
            if (parent) {
                parent.updateWorldMatrixFromLocalMatrixAndParentWorldMatrix();
                const worldToLocalMatrix = Transform._matrix4Buffer.copy(parent._object3D.matrixWorld).invert();
                this._object3D.matrix.multiplyMatrices(this._object3D.matrixWorld, worldToLocalMatrix);
            } else {
                this._object3D.matrix.copy(this._object3D.matrixWorld);
            }
        } else if (!this._worldPositionRotationScaleNeedUpdate) {
            if (this._worldMatrixNeedUpdate) {
                //update world matrix from world position, rotation, scale
                this._ignoreObservableEvent = true;

                this._object3D.matrixWorld.compose(
                    (this._worldPosition as unknown as Vector3),
                    (this._worldRotation as unknown as Quaternion),
                    (this._worldScale as unknown as Vector3)
                );

                this._ignoreObservableEvent = false;
                
                this._worldMatrixNeedUpdate = false;
                this._gameObject.gameObjectEventContainer.invokeOnWorldMatrixUpdated();
            }
            //update local matrix from world matrix and parent world matrix
            const parent = this.parent;
            if (parent) {
                parent.updateWorldMatrixFromLocalMatrixAndParentWorldMatrix();
                const worldToLocalMatrix = Transform._matrix4Buffer.copy(parent._object3D.matrixWorld).invert();
                this._object3D.matrix.multiplyMatrices(this._object3D.matrixWorld, worldToLocalMatrix);
            } else {
                this._object3D.matrix.copy(this._object3D.matrixWorld);
            }
        } else /*if (!this._localPositionRotationScaleNeedUpdate)*/ {
            //update local matrix from local position, rotation, scale
            this._ignoreObservableEvent = true;
            
            localMatrix.compose(this.localPosition, this.localRotation, this.localScale);

            this._ignoreObservableEvent = false;
        }
        this._localMatrixNeedUpdate = false;
    }

    // private updateLocalMatrixFromOthersRecursively(): void {
    //     this.updateLocalMatrixFromOthers();
    //     const children = this._object3D.children;
    //     for (let i = 0, l = children.length; i < l; i++) {
    //         const child = children[i];
    //         if (child.userData instanceof Transform) {
    //             child.userData.updateLocalMatrixFromOthersRecursively();
    //         }
    //     }
    // }

    private updateLocalPositionRotationScaleFromOthersRecursively(): void {
        this.updateLocalPositionRotationScaleFromOthers();
        const children = this._object3D.children;
        for (let i = 0, l = children.length; i < l; i++) {
            const child = children[i];
            if (child.userData instanceof Transform) {
                child.userData.updateLocalPositionRotationScaleFromOthersRecursively();
            }
        }
    }

    private updateChildrenLocalPositionRotationScaleFromOthersRecursively(): void {
        const children = this._object3D.children;
        for (let i = 0, l = children.length; i < l; i++) {
            const child = children[i];
            if (child.userData instanceof Transform) {
                child.userData.updateLocalPositionRotationScaleFromOthers();
                child.userData.updateChildrenLocalPositionRotationScaleFromOthersRecursively();
            }
        }
    }

    // #region used by matrix processor 

    /** @internal */
    public isRegisteredToProcessor = false;

    /** @internal */
    public tryUpdateWorldMatrixRecursivelyFromThisToChildren(): boolean {
        if (!this._gameObject.exists) return false; //todo: check if this is correct
        return this.tryUpdateWorldMatrixRecursivelyFromThisToChildrenInternal();
    }

    private tryUpdateWorldMatrixRecursivelyFromThisToChildrenInternal(): boolean {
        this.updateWorldMatrixFromLocalMatrixAndParentWorldMatrix();

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

    // #endregion

    // #region transform methods

    /**
     * foreach children transform
     * 
     * you must not change length of children array while iterating
     * @param callback 
     */
    public foreachChild(callback: (transform: Transform) => void): void {
        const object3D_children = this._object3D.children;
        for (let i = 0, l = object3D_children.length; i < l; i++) {
            const child = object3D_children[i];
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
        const object3D_children = this._object3D.children;
        for (let i = 0, l = object3D_children.length; i < l; i++) {
            const child = object3D_children[i];
            if (child.userData instanceof Transform) {
                if (!callback(child.userData)) break;
            }
        }
    }

    /**
     * get parent. if parent is scene, returns null
     */
    public get parent(): Transform | null {
        if (this._object3D.parent instanceof Scene) return null;
        return this._object3D.parent!.userData as Transform;
    }

    /**
     * set parent, if value is null, set to scene
     * 
     * you can't set parent that in another engine instance
     */
    public set parent(value: Transform|null) {
        this.setParent(value);
    }

    public setParent(parent: Transform|null, worldPositionStays = true): void {
        if (parent) {
            const oldParent = this.parent;

            this.updateLocalPositionRotationScaleFromOthersRecursively();
            this.setWorldMatrixNeedUpdateRecursively();
            this.setWorldPositionRotationScaleNeedUpdateRecursively();

            if (worldPositionStays) {
                parent.getWorldToLocalMatrix(this._object3D.matrix).multiply(this._object3D.matrixWorld);
            }

            this._object3D.removeFromParent();
            parent._object3D.add(this._object3D);
            this._onParentChanged(oldParent, parent);
        } else {
            const oldParent = this.parent;

            this.updateLocalPositionRotationScaleFromOthersRecursively();
            this.setWorldMatrixNeedUpdateRecursively();
            this.setWorldPositionRotationScaleNeedUpdateRecursively();

            if (worldPositionStays) {
                this._object3D.matrix.copy(this._object3D.matrixWorld);
            }

            this._object3D.removeFromParent();
            this._engineGlobalObject.scene.unsafeGetThreeScene().add(this._object3D);
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
        this.updateWorldMatrixFromLocalMatrixAndParentWorldMatrix();
        const e = this._object3D.matrixWorld.elements;
        return target ? target.set(e[8], e[9], e[10]) : new Vector3(e[8], e[9], e[10]);
    }

    /**
     * set vector representing the blue axis of the transform in world space.
     */
    public setForward(value: ReadonlyVector3): void {
        this._engineGlobalObject.transformMatrixProcessor.enqueueTransformToUpdate(this);
        this.updateWorldMatrixFromLocalMatrixAndParentWorldMatrix();
        this.updateChildrenLocalPositionRotationScaleFromOthersRecursively();
        this._localMatrixNeedUpdate = true;
        this._localPositionRotationScaleNeedUpdate = true;
        this.setChildrenWorldPositionRotationScaleNeedUpdateRecursively();
        this.setWorldPositionRotationScaleNeedUpdateRecursively();
        this._worldPositionRotationScaleNeedUpdate = true;

        const e = this._object3D.matrixWorld.elements;
        const v = (Transform._vector3Buffer as WritableVector3).copy(value).normalize();
        e[8] = v.x;
        e[9] = v.y;
        e[10] = v.z;
    }

    /**
     * The red axis of the transform in world space.
     * @param target optional, target vector
     */
    public getRight(target?: Vector3): Vector3 {
        this.updateWorldMatrixFromLocalMatrixAndParentWorldMatrix();
        const e = this._object3D.matrixWorld.elements;
        return target ? target.set(e[0], e[1], e[2]) : new Vector3(e[0], e[1], e[2]);
    }

    /**
     * set vector representing the red axis of the transform in world space.
     */
    public setRight(value: ReadonlyVector3): void {
        this._engineGlobalObject.transformMatrixProcessor.enqueueTransformToUpdate(this);
        this.updateWorldMatrixFromLocalMatrixAndParentWorldMatrix();
        this.updateChildrenLocalPositionRotationScaleFromOthersRecursively();
        this._localMatrixNeedUpdate = true;
        this._localPositionRotationScaleNeedUpdate = true;
        this.setChildrenWorldPositionRotationScaleNeedUpdateRecursively();
        this.setWorldPositionRotationScaleNeedUpdateRecursively();
        this._worldPositionRotationScaleNeedUpdate = true;

        const e = this._object3D.matrixWorld.elements;
        const v = (Transform._vector3Buffer as WritableVector3).copy(value).normalize();
        e[0] = v.x;
        e[1] = v.y;
        e[2] = v.z;
    }

    /**
     * The green axis of the transform in world space.
     * @param target optional, target vector
     */
    public getUp(target?: Vector3): Vector3 {
        this.updateWorldMatrixFromLocalMatrixAndParentWorldMatrix();
        const e = this._object3D.matrixWorld.elements;
        return target ? target.set(e[4], e[5], e[6]) : new Vector3(e[4], e[5], e[6]);
    }

    /**
     * set vector representing the green axis of the transform in world space.
     */
    public setUp(value: ReadonlyVector3): void {
        this._engineGlobalObject.transformMatrixProcessor.enqueueTransformToUpdate(this);
        this.updateWorldMatrixFromLocalMatrixAndParentWorldMatrix();
        this.updateChildrenLocalPositionRotationScaleFromOthersRecursively();
        this._localMatrixNeedUpdate = true;
        this._localPositionRotationScaleNeedUpdate = true;
        this.setChildrenWorldPositionRotationScaleNeedUpdateRecursively();
        this.setWorldPositionRotationScaleNeedUpdateRecursively();
        this._worldPositionRotationScaleNeedUpdate = true;

        const e = this._object3D.matrixWorld.elements;
        const v = (Transform._vector3Buffer as WritableVector3).copy(value).normalize();
        e[4] = v.x;
        e[5] = v.y;
        e[6] = v.z;
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
    public get lossyScale(): ReadonlyVector3 {
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
        this.updateWorldMatrixFromLocalMatrixAndParentWorldMatrix();
        return target ? target.copy(this._object3D.matrixWorld).invert() : this._object3D.matrixWorld.clone().invert();
    }

    /**
     * local to world matrix
     * @param target optional, target matrix
     */
    public getLocalToWorldMatrix(target?: Matrix4): Matrix4 {
        this.updateWorldMatrixFromLocalMatrixAndParentWorldMatrix();
        return target ? target.copy(this._object3D.matrixWorld) : this._object3D.matrixWorld.clone();
    }
    
    /**
     * Transforms position from local space to world space.
     * @param position A local position.
     */
    public transformPoint(position: Vector3): Vector3 {
        this.updateWorldMatrixFromLocalMatrixAndParentWorldMatrix();
        return this._object3D.localToWorld(position);
    }

    /**
     * Transforms position from world space to local space.
     * @param position A world position.
     */
    public inverseTransformPoint(position: Vector3): Vector3 {
        this.updateWorldMatrixFromLocalMatrixAndParentWorldMatrix();
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

    // #endregion

    // #region Object3D methods

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

    public dequeueRenderAttachedObject3D(rerenderObject: Object3D): void {
        this._engineGlobalObject.transformMatrixProcessor.dequeueRenderObject(rerenderObject);
    }

    public static updateRawObject3DWorldMatrixRecursively(object3D: Object3D): void {
        if (object3D.matrixAutoUpdate) object3D.updateMatrix();
        if (object3D.parent) {
            object3D.matrixWorld.multiplyMatrices(object3D.parent!.matrixWorld, object3D.matrix);
        } else {
            object3D.matrixWorld.copy(object3D.matrix);
        }
        // update children
        const children = object3D.children;
        for (let i = 0, l = children.length; i < l; i++) {
            Transform.updateRawObject3DWorldMatrixRecursivelyInternal(children[i]);
        }
    }

    private static updateRawObject3DWorldMatrixRecursivelyInternal(object3D: Object3D): void {
        if (object3D.matrixAutoUpdate) object3D.updateMatrix();
        object3D.matrixWorld.multiplyMatrices(object3D.parent!.matrixWorld, object3D.matrix);
        // update children
        const children = object3D.children;
        for (let i = 0, l = children.length; i < l; i++) {
            Transform.updateRawObject3DWorldMatrixRecursivelyInternal(children[i]);
        }
    }

    // #endregion Object3D methods

    /** @internal */
    public toJSON(): any {
        return { }; //for pervent infinite recursion
    }
}
