import { Transform } from "./Transform";
/**
 * base class for all entities in scenes
 */
export class GameObject {
    constructor(engineGlobalObject, name) {
        this._activeInHierarchy = true;
        this._transform = new Transform(this);
        this._transform.visible = true;
        this._transform.name = name;
        this._activeSelf = true;
        this._components = [];
        this._engineGlobalObject = engineGlobalObject;
    }
    registerTransform(transform) {
        this._transform.add(transform);
        const gameObject = transform.gameObject;
        if (gameObject._activeSelf) {
            gameObject.activeInHierarchy = this._activeInHierarchy; // update child activeInHierarchy
        }
    }
    /**
     * add a child game object
     * @param gameObjectBuilder
     */
    addChildFromBuilder(gameObjectBuilder) {
        const gameObject = gameObjectBuilder.build();
        gameObjectBuilder.initialize();
        this.registerTransform(gameObject._transform);
        gameObject.foreachComponentInChildren(component => {
            component.unsafeTryCallAwake();
        });
        if (gameObject._activeInHierarchy) {
            gameObject.foreachComponentInChildren(component => {
                if (component.enabled) {
                    component.onEnable();
                    component.unsafeTryEnqueueStart();
                    component.unsafeTryEnqueueUpdate();
                }
            });
        }
    }
    /**
     * change parent of this game object
     * @param newParent new parent game object. you can't set parent that in another engine instance
     */
    changeParent(newParent) {
        if (this._engineGlobalObject !== newParent._engineGlobalObject) {
            throw new Error("can't change parent to another engine instance");
        }
        const prevActiveInHierarchy = this._activeInHierarchy;
        this._transform.removeFromParent();
        this.registerTransform(newParent._transform);
        if (!prevActiveInHierarchy) {
            if (this.activeInHierarchy) {
                this.foreachComponentInChildren(component => {
                    component.enabled = true;
                });
            }
        }
        else {
            if (!this.activeInHierarchy) {
                this.foreachComponentInChildren(component => {
                    component.onDisable();
                    component.unsafeTryDequeueUpdate();
                });
            }
        }
    }
    /**
     * add a component to this game object
     * it can be failed depending on the disallowMultipleComponent or requiredComponent option
     * @param componentCtor
     * @returns if success, return the component instance
     */
    addComponent(componentCtor) {
        const component = new componentCtor(this);
        if (component.disallowMultipleComponent) {
            const existingComponent = this.getComponent(componentCtor);
            if (existingComponent) {
                console.warn(`Component ${componentCtor.name} already exists on GameObject ${this.name}`);
                return null;
            }
        }
        for (const requiredComponentCtor of component.requiredComponents) {
            const requiredComponent = this.getComponent(requiredComponentCtor);
            if (!requiredComponent) {
                console.warn(`Component ${requiredComponentCtor.name} is required by Component ${componentCtor.name} on GameObject ${this.name}`);
                return null;
            }
        }
        this._components.push(component);
        component.unsafeTryCallAwake();
        if (this._activeInHierarchy) {
            if (component.enabled) {
                component.onEnable();
                component.unsafeTryEnqueueStart();
                component.unsafeTryEnqueueUpdate();
            }
        }
        return component;
    }
    /**
     * get component of componentCtor: ComponentConstructor<T> in the GameObject
     * @param componentCtor
     * @returns if success, return the component instance
     */
    getComponent(componentCtor) {
        for (const component of this._components) {
            if (component instanceof componentCtor)
                return component;
        }
        return null;
    }
    /**
     * get components of componentCtor: ComponentConstructor<T> in the GameObject
     * @param componentCtor
     * @returns
     */
    getComponents(componentCtor) {
        if (!componentCtor)
            return this._components.slice();
        const components = [];
        for (const component of this._components) {
            if (component instanceof componentCtor) {
                components.push(component);
            }
        }
        return components;
    }
    /**
     * returns the component of componentCtor: ComponentConstructor<T> in the GameObject or any of its children using depth first search
     * @param componentCtor
     * @returns
     */
    getComponentInChildren(componentCtor) {
        const components = this.getComponent(componentCtor);
        if (components)
            return components;
        this._transform.foreachChild(child => {
            if (child instanceof Transform) {
                const component = child.gameObject.getComponentInChildren(componentCtor);
                if (component)
                    return component;
            }
        });
        return null;
    }
    /**
     * returns all components of componentCtor: ComponentConstructor<T> in the GameObject or any of its children using depth first search
     * @param componentCtor
     * @returns
     */
    getComponentsInChildren(componentCtor) {
        if (!componentCtor) {
            const components = this.getComponents();
            this._transform.foreachChild(child => {
                components.push(...child.gameObject.getComponentsInChildren());
            });
            return components;
        }
        else {
            const components = this.getComponents(componentCtor);
            this._transform.foreachChild(child => {
                const childComponents = child.gameObject.getComponentsInChildren(componentCtor);
                components.push(...childComponents);
            });
            return components;
        }
    }
    /**
     * foreach component of componentCtor: ComponentConstructor<T> in the GameObject
     * @param callback
     * @param componentCtor
     */
    foreachComponent(callback, componentCtor) {
        if (!componentCtor) {
            for (const component of this._components) {
                callback(component);
            }
        }
        else {
            for (const component of this._components) {
                if (component instanceof componentCtor) {
                    callback(component);
                }
            }
        }
    }
    /**
     * foreach component of componentCtor: ComponentConstructor<T> in the GameObject or any of its children using depth first search
     * @param callback
     * @param componentCtor
     */
    foreachComponentInChildren(callback, componentCtor) {
        if (!componentCtor) {
            this.foreachComponent(callback);
            this._transform.foreachChild(child => {
                child.gameObject.foreachComponentInChildren(callback);
            });
        }
        else {
            this.foreachComponent(callback, componentCtor);
            this._transform.foreachChild(child => {
                child.gameObject.foreachComponentInChildren(callback, componentCtor);
            });
        }
    }
    /**
     * remove component from the GameObject
     * @param component
     */
    removeComponent(component) {
        for (let i = 0; i < this._components.length; i++) {
            if (this._components[i] === component) {
                component.enabled = false;
                component.stopAllCoroutines();
                component.onDestroy();
                this._components.splice(i, 1);
                break;
            }
        }
    }
    /**
     * destroy the GameObject
     */
    destroy() {
        for (const component of this._components) {
            component.enabled = false;
            component.stopAllCoroutines();
            component.onDestroy();
        }
        this._transform.childrenTransform.forEach(child => {
            if (child instanceof Transform)
                child.gameObject.destroy();
        });
        this._transform.removeFromParent();
        this._transform.parent = null;
    }
    /**
     * global engine object
     */
    get engine() {
        return this._engineGlobalObject;
    }
    /**
     * defines whether the GameObject is active in the Scene
     */
    get activeInHierarchy() {
        return this._activeInHierarchy;
    }
    set activeInHierarchy(value) {
        if (this._activeInHierarchy === value)
            return;
        this._activeInHierarchy = value;
        this._transform.visible = this._activeInHierarchy;
        if (this._activeInHierarchy) {
            //enable components
            for (const component of this._components) {
                if (component.enabled) {
                    component.onEnable();
                    component.unsafeTryEnqueueStart();
                    component.unsafeTryEnqueueUpdate();
                }
            }
        }
        else {
            for (const component of this._components) {
                if (component.enabled) {
                    //disable components
                    component.onDisable();
                    //dequeue update
                    component.unsafeTryDequeueUpdate();
                    component.stopAllCoroutines();
                }
            }
        }
        this._transform.foreachChild(child => {
            if (child instanceof Transform) {
                const gameObject = child.gameObject;
                if (this._activeInHierarchy) {
                    gameObject.activeInHierarchy = gameObject._activeSelf;
                }
                else {
                    gameObject.activeInHierarchy = false;
                }
            }
        });
    }
    /**
     * defines whether the GameObject is active in the Scene
     */
    get activeSelf() {
        return this._activeSelf;
    }
    /**
     * defines whether the GameObject is active in the Scene
     */
    set activeSelf(value) {
        if (this._activeSelf === value)
            return;
        this._activeSelf = value;
        if (this._transform.parent instanceof Transform) { // if parent is a gameobject
            if (this._transform.parent.gameObject._activeInHierarchy) {
                this.activeInHierarchy = this._activeSelf;
            }
            else {
                this.activeInHierarchy = false;
            }
        }
        else { // parent is root it means parent always active in hierarchy
            this.activeInHierarchy = this._activeSelf;
        }
    }
    /**
     * get transform of the GameObject
     * DO NOT cast this to Transform, instead use unsafeGetTransform
     */
    get transform() {
        return this._transform;
    }
    /**
     * get name of the GameObject
     */
    get name() {
        return this._transform.name;
    }
    /**
     * set name of the GameObject
     */
    set name(value) {
        this._transform.name = value;
    }
    /**
     * get uuid of the GameObject
     */
    get uuid() {
        return this._transform.uuid;
    }
    /**
     * get id of the GameObject
     */
    get id() {
        return this._transform.id;
    }
    /**
     * get Transform of the GameObject that drives the three.js Object3D. you can use this to add three.js Object3D to the scene
     * if you want to add a custom Object3D to the scene, you must manage the lifecycle of the Object3D yourself
     *
     * see also:
     * "Object3D.visible" property has same value as "GameObject.activeInHierarchy"
     * you must not change "Object3D.visible" directly, use "GameObject.activeInHierarchy" instead
     * "Object3D.add" method is not available for GameObject Transform it for other Object3D classes
     */
    unsafeGetTransform() {
        return this._transform;
    }
}
/**
 * builder for GameObject
 */
export class GameObjectBuilder {
    constructor(engineGlobalObject, name, localPosition, localRotation, localScale) {
        this._gameObject = new GameObject(engineGlobalObject, name);
        const transform = this._gameObject.transform;
        if (localPosition)
            transform.position.copy(localPosition);
        if (localRotation)
            transform.quaternion.copy(localRotation);
        if (localScale)
            transform.scale.copy(localScale);
        this._children = [];
        this._componentInitializeFuncList = [];
    }
    /**
     * set active in hierarchy
     * @param active
     * @returns
     */
    active(active) {
        this._gameObject.activeSelf = active;
        return this;
    }
    /**
     * get gameObject as call by reference
     * @param gameObjectRef
     * @returns
     */
    getGameObject(gameObjectRef) {
        gameObjectRef.ref = this._gameObject;
        return this;
    }
    /**
     * get component of componentCtor: ComponentConstructor<T> as call by reference
     * @param componentCtor
     * @param componentRef
     * @returns
     */
    getComponent(componentCtor, componentRef) {
        componentRef.ref = this._gameObject.getComponent(componentCtor);
        return this;
    }
    /**
     * get all components of componentCtor: ComponentConstructor<T> as call by reference
     * @param componentsRef
     * @param componentCtor
     * @returns
     * @returns
     */
    getComponents(componentsRef, componentCtor) {
        if (componentCtor) {
            componentsRef.ref = this._gameObject.getComponents(componentCtor);
        }
        else {
            componentsRef.ref = this._gameObject.getComponents();
        }
        return this;
    }
    /**
     * get component of componentCtor: ComponentConstructor<T> in GameObject or any of its children as call by reference
     * @param componentCtor
     * @param componentRef
     * @returns
     */
    getComponentInChildren(componentCtor, componentRef) {
        componentRef.ref = this._gameObject.getComponentInChildren(componentCtor);
        return this;
    }
    /**
     * get all components of componentCtor: ComponentConstructor<T> in GameObject or any of its children as call by reference
     * @param componentsRef
     * @param componentCtor
     * @returns
     */
    getComponentsInChildren(componentsRef, componentCtor) {
        if (componentCtor) {
            componentsRef.ref = this._gameObject.getComponentsInChildren(componentCtor);
        }
        else {
            componentsRef.ref = this._gameObject.getComponentsInChildren();
        }
        return this;
    }
    /**
     * add component of componentCtor: ComponentConstructor<T> to GameObject with initialize function
     * @param componentCtor
     * @param componentInitializeFunc
     * @returns
     */
    withComponent(componentCtor, componentInitializeFunc) {
        const component = new componentCtor(this._gameObject);
        if (component.disallowMultipleComponent) {
            const existingComponent = this._gameObject.getComponent(componentCtor);
            if (existingComponent) {
                console.warn(`Component ${componentCtor.name} already exists on GameObject ${this._gameObject.name}`);
                return this;
            }
        }
        this._gameObject._components.push(component);
        if (componentInitializeFunc) {
            this._componentInitializeFuncList.push(() => componentInitializeFunc(component));
        }
        return this;
    }
    /**
     * with child GameObject
     * @param child
     * @returns
     */
    withChild(child) {
        this._children.push(child);
        return this;
    }
    checkComponentRequirements(gameObject) {
        let componentRemoved = false;
        for (const component of gameObject._components) {
            if (component) {
                for (const requiredComponentCtor of component.requiredComponents) {
                    const requiredComponent = gameObject.getComponent(requiredComponentCtor);
                    if (!requiredComponent) {
                        console.warn(`Component ${requiredComponentCtor.name} is required by Component ${component.constructor.name} on GameObject ${gameObject.name}`);
                        gameObject.removeComponent(component);
                        componentRemoved = true;
                    }
                }
            }
        }
        if (componentRemoved)
            this.checkComponentRequirements(gameObject);
    }
    /**
     * build GameObject. check component requirements and link GameObjects tranform
     * @returns
     */
    build() {
        this.checkComponentRequirements(this._gameObject);
        for (const child of this._children)
            this._gameObject.registerTransform(child.build()._transform);
        return this._gameObject;
    }
    /**
     * execute initialize function of all components recursively for it's children GameObjects
     */
    initialize() {
        for (const componentInitializeFunc of this._componentInitializeFuncList) {
            componentInitializeFunc();
        }
        for (const child of this._children)
            child.initialize();
    }
}
