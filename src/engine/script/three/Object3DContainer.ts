import { Component } from "@src/engine/hierarchy_object/Component";
import { Transform } from "@src/engine/hierarchy_object/Transform";
import { Object3D } from "three/src/Three";

/**
 * Object3D wrapper for hierarchy object.
 * 
 * You can use this component to render any object that inherits Object3D.
 * 
 * The world matrix of Object3D is automatically updated when `gameObject.transform` is updated.
 * 
 * If you need to update the matrix even if the transform does not change (like animation), use `Object3DContainer.updateWorldMatrix()` method.
 */
export class Object3DContainer<T extends Object3D> extends Component {
    private _object3D: T|null = null;
    private _ready = false;

    public awake(): void {
        this._ready = true;
        const object3D = this._object3D;
        if (object3D) {
            this.transform.unsafeGetObject3D().add(object3D);
            Transform.updateRawObject3DWorldMatrixRecursively(object3D);
            this.transform.enqueueRenderAttachedObject3D(object3D);
        }
    }

    public onEnable(): void {
        const object3D = this._object3D;
        if (!object3D) return;
        this.setVisibleRecursively(object3D!, true);
        this.transform.enqueueRenderAttachedObject3D(object3D);
    }

    public onDisable(): void {
        const object3D = this._object3D;
        if (!object3D) return;
        this.setVisibleRecursively(object3D!, false);
        this.transform.enqueueRenderAttachedObject3D(object3D);
    }

    public onDestroy(): void {
        if (!this._object3D) return;
        this.transform.dequeueRenderAttachedObject3D(this._object3D);
        this.transform.unsafeGetObject3D().remove(this._object3D);
        this._object3D = null;
    }

    public onWorldMatrixUpdated(): void {
        const object3D = this._object3D;
        if (!object3D) return;
        if (!this.gameObject.activeInHierarchy || !this.enabled) return;
        Transform.updateRawObject3DWorldMatrixRecursively(object3D);
        this.transform.enqueueRenderAttachedObject3D(object3D);
    }

    private setVisibleRecursively(object3D: Object3D, visible: boolean): void {
        object3D.visible = visible;
        const children = object3D.children;
        for (let i = 0; i < children.length; ++i) {
            this.setVisibleRecursively(children[i], visible);
        }
    }

    /**
     * Object3D object to add to the hierarchy.
     */
    public get object3D(): T|null {
        return this._object3D;
    }

    /**
     * Object3D object to add to the hierarchy.
     */
    public set object3D(value: T|null) {
        if (this._ready) {
            if (this._object3D) this.transform.unsafeGetObject3D().remove(this._object3D);
            
            this._object3D = value;

            if (this._object3D) {
                this.transform.unsafeGetObject3D().add(this._object3D);
                Transform.updateRawObject3DWorldMatrixRecursively(this._object3D);
                this.transform.enqueueRenderAttachedObject3D(this._object3D);
            }
        } else {
            this._object3D = value;
        }
    }

    /**
     * if true, this component is finish to be initialized.
     * 
     * Do not modify the scene until the component is initialized.
     */
    protected get ready(): boolean {
        return this._ready;
    }

    /**
     * Update the world matrix of the object3D manually.
     */
    public updateWorldMatrix(): void {
        this.onWorldMatrixUpdated();
    }
}
