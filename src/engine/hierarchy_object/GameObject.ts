import { Quaternion, Vector3 } from "three";
import { Component } from "./Component";
import { ComponentConstructor } from "./ComponentConstructor";
import { EngineGlobalObject } from "../EngineGlobalObject";
import { PrefabRef } from "./PrefabRef";
import { Transform } from "./Transform";
import { IEngine } from "../IEngine";

/**
 * base class for all entities in scenes
 */
export class GameObject {
    private _transform: Transform;
    private _activeInHierarchy: boolean;
    private _activeSelf: boolean;
    private _components: Component[];
    private _engineGlobalObject: EngineGlobalObject;

    public constructor(engineGlobalObject: EngineGlobalObject, name: string) {
        this._activeInHierarchy = true;
        this._transform = new Transform(this);
        this._transform.unsafeGetObject3D().visible = true;
        this._transform.unsafeGetObject3D().name = name;
        this._activeSelf = true;
        this._components = [];
        this._engineGlobalObject = engineGlobalObject;
    }

    private registerTransform(transform: Transform): void {
        this._transform.unsafeGetObject3D().add(transform.unsafeGetObject3D());
        const gameObject = transform.gameObject;

        if (gameObject._activeSelf) {
            gameObject.activeInHierarchy = this._activeInHierarchy; // update child activeInHierarchy
        }
    }

    /**
     * add a child game object
     * @param gameObjectBuilder 
     */
    public addChildFromBuilder(gameObjectBuilder: GameObjectBuilder): void {
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
    public changeParent(newParent: GameObject): void {
        if (this._engineGlobalObject !== newParent._engineGlobalObject) {
            throw new Error("can't change parent to another engine instance");
        }
        const prevActiveInHierarchy = this._activeInHierarchy;
        this._transform.unsafeGetObject3D().removeFromParent();
        this.registerTransform(newParent._transform);
        if (!prevActiveInHierarchy) {
            if (this.activeInHierarchy) {
                this.foreachComponentInChildren(component => {
                    component.enabled = true;
                });
            }
        } else {
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
    public addComponent<T extends Component>(componentCtor: ComponentConstructor<T>): T|null {
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
    public getComponent<T extends Component>(componentCtor: ComponentConstructor<T>): T | null {
        for (const component of this._components) {
            if (component instanceof componentCtor) return component;
        }
        return null;
    }

    /**
     * get all components in the GameObject
     */
    public getComponents(): Component[];

    /**
     * get components of componentCtor: ComponentConstructor<T> in the GameObject
     * @param componentCtor 
     * @returns 
     */
    public getComponents<T extends Component>(componentCtor: ComponentConstructor<T>): T[];

    /**
     * get components of componentCtor: ComponentConstructor<T> in the GameObject
     * @param componentCtor 
     * @returns 
     */
    public getComponents<T extends Component>(componentCtor?: ComponentConstructor<T>): T[] {
        if (!componentCtor) return this._components.slice() as T[];
        const components: T[] = [];
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
    public getComponentInChildren<T extends Component>(componentCtor: ComponentConstructor<T>): T | null {
        const components = this.getComponent(componentCtor);
        if (components) return components;
        let findComponent: T | null = null;
        this._transform.iterateChild(child => {
            const component = child.gameObject.getComponentInChildren(componentCtor);
            if (component) {
                findComponent = component;
                return false;
            }
            return true;
        });
        return findComponent;
    }

    /**
     * returns all components in the GameObject or any of its children using depth first search
     */
    public getComponentsInChildren(): Component[];

    /**
     * returns all components of componentCtor: ComponentConstructor<T> in the GameObject or any of its children using depth first search
     * @param componentCtor 
     */
    public getComponentsInChildren<T extends Component>(componentCtor: ComponentConstructor<T>): T[];

    /**
     * returns all components of componentCtor: ComponentConstructor<T> in the GameObject or any of its children using depth first search
     * @param componentCtor 
     * @returns 
     */
    public getComponentsInChildren<T extends Component>(componentCtor?: ComponentConstructor<T>): T[] {
        if (!componentCtor) {
            const components = this.getComponents();
            this._transform.foreachChild(child => {
                components.push(...child.gameObject.getComponentsInChildren());
            });
            return components as T[];
        }
        else {
            const components: T[] = this.getComponents(componentCtor);
            this._transform.foreachChild(child => {
                const childComponents = child.gameObject.getComponentsInChildren(componentCtor);
                components.push(...childComponents);
            });
            return components;
        }
    }

    /**
     * foreach component in the GameObject
     * @param callback 
     */
    public foreachComponent(callback: (component: Component) => void): void;

    /**
     * foreach component of componentCtor: ComponentConstructor<T> in the GameObject
     * @param callback 
     * @param componentCtor 
     */
    public foreachComponent<T extends Component>(callback: (component: T) => void, componentCtor: ComponentConstructor<T>): void;

    /**
     * foreach component of componentCtor: ComponentConstructor<T> in the GameObject
     * @param callback 
     * @param componentCtor 
     */
    public foreachComponent<T extends Component>(callback: (component: T) => void, componentCtor?: ComponentConstructor<T>): void {
        if (!componentCtor) {
            for (const component of this._components) {
                callback(component as T);
            }
        } else {
            for (const component of this._components) {
                if (component instanceof componentCtor) {
                    callback(component);
                }
            }
        }
    }

    /**
     * foreach component in the GameObject or any of its children using depth first search
     * @param callback 
     */
    public foreachComponentInChildren(callback: (component: Component) => void): void;

    /**
     * foreach component of componentCtor: ComponentConstructor<T> in the GameObject or any of its children using depth first search
     * @param callback 
     * @param componentCtor 
     */
    public foreachComponentInChildren<T extends Component>(callback: (component: T) => void, componentCtor: ComponentConstructor<T>): void;

    /**
     * foreach component of componentCtor: ComponentConstructor<T> in the GameObject or any of its children using depth first search
     * @param callback 
     * @param componentCtor 
     */
    public foreachComponentInChildren<T extends Component>(callback: (component: T) => void, componentCtor?: ComponentConstructor<T>): void {
        if (!componentCtor) {
            this.foreachComponent(callback as (component: Component) => void);
            this._transform.foreachChild(child => {
                child.gameObject.foreachComponentInChildren(callback as (component: Component) => void);
            });
        } else {
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
    public removeComponent(component: Component): void {
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
    public destroy(): void {
        for (const component of this._components) {
            component.enabled = false;
            component.stopAllCoroutines();
            component.onDestroy();
        }
        this._transform.children.forEach(child => { // modified values in foreach but array is not modified
            if (child instanceof Transform) child.gameObject.destroy();
        });
        this._transform.unsafeGetObject3D().removeFromParent();
        this._transform.unsafeGetObject3D().parent = null;
    }

    /**
     * global engine object
     */
    public get engine(): IEngine {
        return this._engineGlobalObject;
    }

    /**
     * defines whether the GameObject is active in the Scene
     */
    public get activeInHierarchy(): boolean {
        return this._activeInHierarchy;
    }

    private set activeInHierarchy(value: boolean) {
        if (this._activeInHierarchy === value) return;

        this._activeInHierarchy = value;
        this._transform.unsafeGetObject3D().visible = this._activeInHierarchy;

        if (this._activeInHierarchy) {
            //enable components
            for (const component of this._components) {
                if (component.enabled) {
                    component.onEnable();
                    component.unsafeTryEnqueueStart();
                    component.unsafeTryEnqueueUpdate();
                }
            }
        } else {
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
            const gameObject = child.gameObject;
            if (this._activeInHierarchy) {
                gameObject.activeInHierarchy = gameObject._activeSelf;
            } else {
                gameObject.activeInHierarchy = false;
            }
        });
    }

    /**
     * defines whether the GameObject is active in the Scene
     */
    public get activeSelf(): boolean {
        return this._activeSelf;
    }

    /**
     * defines whether the GameObject is active in the Scene
     */
    public set activeSelf(value: boolean) {
        if (this._activeSelf === value) return;

        this._activeSelf = value;
        if (this._transform.parent instanceof Transform) { // if parent is a gameobject
            if (this._transform.parent.gameObject._activeInHierarchy) {
                this.activeInHierarchy = this._activeSelf;
            } else {
                this.activeInHierarchy = false;
            }
        } else { // parent is root it means parent always active in hierarchy
            this.activeInHierarchy = this._activeSelf;
        }
    }

    /**
     * get transform of the GameObject
     * DO NOT cast this to Transform, instead use unsafeGetTransform
     */
    public get transform(): Transform {
        return this._transform;
    }

    /**
     * get name of the GameObject
     */
    public get name(): string {
        return this._transform.unsafeGetObject3D().name;
    }

    /**
     * set name of the GameObject
     */
    public set name(value: string) {
        this._transform.unsafeGetObject3D().name = value;
    }

    /**
     * get uuid of the GameObject
     */
    public get uuid(): string {
        return this._transform.unsafeGetObject3D().uuid;
    }

    /**
     * get id of the GameObject
     */
    public get id(): number {
        return this._transform.unsafeGetObject3D().id;
    }
}

/**
 * builder for GameObject
 */
export class GameObjectBuilder {
    private readonly _gameObject: GameObject;
    private readonly _children: GameObjectBuilder[];
    private readonly _componentInitializeFuncList: (() => void)[];

    public constructor(engineGlobalObject: EngineGlobalObject, name: string, localPosition?: Vector3, localRotation?: Quaternion, localScale?: Vector3) {
        this._gameObject = new GameObject(engineGlobalObject, name);
        const transform = this._gameObject.transform;
        if (localPosition) transform.position.copy(localPosition);
        if (localRotation) transform.quaternion.copy(localRotation);
        if (localScale) transform.scale.copy(localScale);
        this._children = [];
        this._componentInitializeFuncList = [];
    }

    /**
     * set active in hierarchy
     * @param active 
     * @returns 
     */
    public active(active: boolean): GameObjectBuilder {
        this._gameObject.activeSelf = active;
        return this;
    }

    /**
     * get gameObject as call by reference
     * @param gameObjectRef 
     * @returns 
     */
    public getGameObject(gameObjectRef: PrefabRef<GameObject>): GameObjectBuilder {
        gameObjectRef.ref = this._gameObject;
        return this;
    }

    /**
     * get component of componentCtor: ComponentConstructor<T> as call by reference
     * @param componentCtor 
     * @param componentRef 
     * @returns 
     */
    public getComponent<T extends Component>(componentCtor: ComponentConstructor<T>, componentRef: PrefabRef<T>): GameObjectBuilder {
        componentRef.ref = this._gameObject.getComponent(componentCtor);
        return this;
    }

    /**
     * get all components as call by reference
     * @param componentsRef 
     * @returns
     */
    public getComponents(componentsRef: PrefabRef<Component[]>): GameObjectBuilder;

    /**
     * get all components of componentCtor: ComponentConstructor<T> as call by reference
     * @param componentsRef 
     * @param componentCtor 
     * @returns
     */
    public getComponents<T extends Component>(componentsRef: PrefabRef<T[]>, componentCtor: ComponentConstructor<T>): GameObjectBuilder;

    /**
     * get all components of componentCtor: ComponentConstructor<T> as call by reference
     * @param componentsRef 
     * @param componentCtor 
     * @returns
     * @returns 
     */
    public getComponents<T extends Component>(componentsRef: PrefabRef<T[]>, componentCtor?: ComponentConstructor<T>): GameObjectBuilder {
        if (componentCtor) {
            componentsRef.ref = this._gameObject.getComponents(componentCtor);
        }
        else {
            componentsRef.ref = this._gameObject.getComponents() as T[];
        }
        return this;
    }

    /**
     * get component of componentCtor: ComponentConstructor<T> in GameObject or any of its children as call by reference
     * @param componentCtor 
     * @param componentRef 
     * @returns 
     */
    public getComponentInChildren<T extends Component>(componentCtor: ComponentConstructor<T>, componentRef: PrefabRef<T>): GameObjectBuilder {
        componentRef.ref = this._gameObject.getComponentInChildren(componentCtor);
        return this;
    }

    /**
     * get all components in GameObject or any of its children as call by reference
     * @param componentsRef 
     * @returns
     */
    public getComponentsInChildren(componentsRef: PrefabRef<Component[]>): GameObjectBuilder;

    /**
     * get all components of componentCtor: ComponentConstructor<T> in GameObject or any of its children as call by reference
     * @param componentsRef 
     * @param componentCtor 
     * @returns
     */
    public getComponentsInChildren<T extends Component>(componentsRef: PrefabRef<T[]>, componentCtor: ComponentConstructor<T>): GameObjectBuilder;

    /**
     * get all components of componentCtor: ComponentConstructor<T> in GameObject or any of its children as call by reference
     * @param componentsRef
     * @param componentCtor
     * @returns
     */
    public getComponentsInChildren<T extends Component>(componentsRef: PrefabRef<T[]>, componentCtor?: ComponentConstructor<T>): GameObjectBuilder {
        if (componentCtor) {
            componentsRef.ref = this._gameObject.getComponentsInChildren(componentCtor);
        }
        else {
            componentsRef.ref = this._gameObject.getComponentsInChildren() as T[];
        }
        return this;
    }

    /**
     * add component of componentCtor: ComponentConstructor<T> to GameObject
     * @param componentCtor 
     * @returns
     */
    public withComponent<T extends Component>(componentCtor: ComponentConstructor<T>): GameObjectBuilder;

    /**
     * add component of componentCtor: ComponentConstructor<T> to GameObject with initialize function
     * @param componentCtor 
     * @param componentInitializeFunc 
     * @returns
     */
    public withComponent<T extends Component>(
        componentCtor: ComponentConstructor<T>,
        componentInitializeFunc?: (component: T) => void
    ): GameObjectBuilder;
    
    /**
     * add component of componentCtor: ComponentConstructor<T> to GameObject with initialize function
     * @param componentCtor 
     * @param componentInitializeFunc 
     * @returns
     */
    public withComponent<T extends Component>(
        componentCtor: ComponentConstructor<T>,
        componentInitializeFunc?: (component: T) => void
    ): GameObjectBuilder {
        const component = new componentCtor(this._gameObject);
        if (component.disallowMultipleComponent) {
            const existingComponent = this._gameObject.getComponent(componentCtor);
            if (existingComponent) {
                console.warn(`Component ${componentCtor.name} already exists on GameObject ${this._gameObject.name}`);
                return this;
            }
        }
        (this._gameObject as any)._components.push(component);
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
    public withChild(child: GameObjectBuilder): GameObjectBuilder {
        this._children.push(child);
        return this;
    }

    private checkComponentRequirements(gameObject: GameObject): void {
        let componentRemoved = false;
        for (const component of (gameObject as any)._components) {
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
        if (componentRemoved) this.checkComponentRequirements(gameObject);
    }

    /**
     * build GameObject. check component requirements and link GameObjects tranform
     * @returns 
     */
    public build(): GameObject {
        this.checkComponentRequirements(this._gameObject);
        for (const child of this._children) (this._gameObject as any).registerTransform((child.build() as any)._transform);
        return this._gameObject;
    }

    /**
     * execute initialize function of all components recursively for it's children GameObjects
     */
    public initialize(): void {
        for (const componentInitializeFunc of this._componentInitializeFuncList) {
            componentInitializeFunc();
        }
        for (const child of this._children) child.initialize();
    }
}
