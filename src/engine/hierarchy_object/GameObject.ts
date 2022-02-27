import { Component } from "./Component";
import { ComponentConstructor } from "./ComponentConstructor";
import { EngineGlobalObject } from "../EngineGlobalObject";
import { Transform } from "./Transform";
import { GameObjectBuilder } from "./GameObjectBuilder";
import { GameObjectEventContainer } from "./GameObjectEventContainer";

/**
 * base class for all entities in scenes
 * do not drive this class
 */
export class GameObject {
    private readonly _engineGlobalObject: EngineGlobalObject;
    private readonly _instanceId: number;
    private _activeInHierarchy: boolean;
    private _activeSelf: boolean;
    private readonly _transform: Transform;
    
    /** @internal */
    public _initialized: boolean;
    /** @internal */
    public readonly components: Component[];
    /** @internal */
    public readonly gameObjectEventContainer: GameObjectEventContainer;

    /** @internal */
    public constructor(engineGlobalObject: EngineGlobalObject, name: string) {
        this._engineGlobalObject = engineGlobalObject;
        this._instanceId = engineGlobalObject.instantiater.generateId();
        this._activeInHierarchy = true;
        this._activeSelf = true;
        this._initialized = false;
        this.components = [];
        this.gameObjectEventContainer = new GameObjectEventContainer(engineGlobalObject.instantiater);
        this._transform = new Transform(this, engineGlobalObject, this.onChangeParent.bind(this));
        this._transform.unsafeGetObject3D().name = name;
    }

    /**
     * add a child game object
     * @param gameObjectBuilder 
     */
    public addChildFromBuilder(gameObjectBuilder: GameObjectBuilder): GameObject {
        this.checkGameObjectIsExist();
        const gameObject = gameObjectBuilder.build(this.transform);
        gameObjectBuilder.processEvent();
        return gameObject;
    }

    private onChangeParent(_oldParent: Transform|null, newParent: Transform|null): void {
        if (newParent && this._engineGlobalObject !== newParent.gameObject._engineGlobalObject) {
            throw new Error("can't change parent to another engine instance");
        }

        const gameObject = this.transform.gameObject;
        if (newParent) {
            if (gameObject._activeSelf) {
                gameObject.setActiveInHierarchyWithEvent(newParent.gameObject._activeInHierarchy); // update child activeInHierarchy
            }
        } else {
            gameObject.setActiveInHierarchyWithEvent(gameObject._activeSelf);
        }
    }

    /**
     * add a component to this game object
     * it can be failed depending on the disallowMultipleComponent or requiredComponent option
     * @param componentCtor
     * @returns if success, return the component instance
     */
    public addComponent<T extends Component>(componentCtor: ComponentConstructor<T>): T|null {
        this.checkGameObjectIsExist();
        const component = new componentCtor(this);
        component.engine_internal_constructAfterProcess();
        
        if (component.disallowMultipleComponent) {
            const existingComponent = this.getComponent(componentCtor);
            if (existingComponent) {
                console.warn(`Component ${componentCtor.name} already exists on GameObject ${this.name}`);
                return null;
            }
        }
        const requiredComponents = component.requiredComponents;
        for (let i = 0; i < requiredComponents.length; i++) {
            const requiredComponentCtor = requiredComponents[i];
            const requiredComponent = this.getComponent(requiredComponentCtor);
            if (!requiredComponent) {
                console.warn(`Component ${requiredComponentCtor.name} is required by Component ${componentCtor.name} on GameObject ${this.name}`);
                return null;
            }
        }
        this.components.push(component);
        this.gameObjectEventContainer.registerComponent(component);

        if (this._activeInHierarchy) {
            if (component.enabled) {
                component._engine_internal_componentEventContainer.tryCallAwake();
                component._engine_internal_componentEventContainer.tryRegisterOnEnable();
                component._engine_internal_componentEventContainer.tryRegisterStart();
                component._engine_internal_componentEventContainer.tryRegisterUpdate();
                this._engineGlobalObject.sceneProcessor.tryStartProcessSyncedEvent();
            }
        }
        return component;
    }

    // #region getComponent

    /**
     * get component of componentCtor: ComponentConstructor<T> in the GameObject
     * @param componentCtor 
     * @returns if success, return the component instance
     */
    public getComponent<T extends Component>(componentCtor: ComponentConstructor<T>): T | null {
        this.checkGameObjectIsExist();
        const components = this.components;
        for (let i = 0; i < components.length; i++) {
            const component = components[i];
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
        this.checkGameObjectIsExist();
        if (!componentCtor) return this.components.slice() as T[];
        const components = this.components;
        const result: T[] = [];
        for (let i = 0; i < components.length; i++) {
            const component = components[i];
            if (component instanceof componentCtor) {
                result.push(component);
            }
        }
        return result;
    }

    /**
     * returns the component of componentCtor: ComponentConstructor<T> in the GameObject or any of its children using depth first search
     * @param componentCtor 
     * @returns 
     */
    public getComponentInChildren<T extends Component>(componentCtor: ComponentConstructor<T>): T | null {
        this.checkGameObjectIsExist();
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
        this.checkGameObjectIsExist();
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

    // #endregion

    /**
     * foreach component in the GameObject
     * @param callback 
     * @internal
     */
    public foreachComponent(callback: (component: Component) => void): void;

    /**
     * foreach component of componentCtor: ComponentConstructor<T> in the GameObject
     * @param callback 
     * @param componentCtor 
     * @internal
     */
    public foreachComponent<T extends Component>(callback: (component: T) => void, componentCtor: ComponentConstructor<T>): void;

    /**
     * foreach component of componentCtor: ComponentConstructor<T> in the GameObject
     * @param callback 
     * @param componentCtor 
     * @internal
     */
    public foreachComponent<T extends Component>(callback: (component: T) => void, componentCtor?: ComponentConstructor<T>): void {
        this.checkGameObjectIsExist();
        const components = this.components;
        if (!componentCtor) {
            for (let i = 0; i < components.length; i++) {
                callback(components[i] as T);
            }
        } else {
            for (let i = 0; i < components.length; i++) {
                const component = components[i];
                if (component instanceof componentCtor) {
                    callback(component);
                }
            }
        }
    }

    /**
     * foreach component in the GameObject or any of its children using depth first search
     * @param callback 
     * @internal
     */
    public foreachComponentInChildren(callback: (component: Component) => void): void;

    /**
     * foreach component of componentCtor: ComponentConstructor<T> in the GameObject or any of its children using depth first search
     * @param callback 
     * @param componentCtor 
     * @internal
     */
    public foreachComponentInChildren<T extends Component>(callback: (component: T) => void, componentCtor: ComponentConstructor<T>): void;

    /**
     * foreach component of componentCtor: ComponentConstructor<T> in the GameObject or any of its children using depth first search
     * @param callback 
     * @param componentCtor 
     * @internal
     */
    public foreachComponentInChildren<T extends Component>(callback: (component: T) => void, componentCtor?: ComponentConstructor<T>): void {
        this.checkGameObjectIsExist();
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

    // /**
    //  * remove component from the GameObject
    //  * @param component 
    //  */
    // public removeComponent(component: Component): void {
    //     for (let i = 0; i < this._components.length; i++) {
    //         if (this._components[i] === component) {
    //             component.enabled = false;
    //             component.stopAllCoroutines();
    //             component.eventInvoker.tryCallOnDestroy();
    //             this._components.splice(i, 1);
    //             break;
    //         }
    //     }
    // }

    private _destroyed = false;

    /**
     * destroy the GameObject
     */
    public destroy(): void {
        if (this._destroyed) return;
        this._destroyed = true;
        this.destroyEventProcess();
        this._engineGlobalObject.sceneProcessor.tryStartProcessSyncedEvent();
        this._engineGlobalObject.sceneProcessor.addRemoveGameObject(this);
    }

    private destroyEventProcess(): void {
        const components = this.components;

        for (let i = 0; i < components.length; i++) {
            const component = components[i];
            if (component._engine_internal_destroyed) continue;
            if (component.enabled && this._activeInHierarchy) {
                component._engine_internal_componentEventContainer.tryRegisterOnDisable();
                component._engine_internal_componentEventContainer.tryUnregisterStart();
                component._engine_internal_componentEventContainer.tryUnregisterUpdate();
            }
            component.stopAllCoroutines();
            component._engine_internal_componentEventContainer.tryRegisterOnDestroy();

            component._engine_internal_destroyed = true;
        }
        this._transform.children.forEach(child => { // modified values in foreach but array is not modified
            if (child instanceof Transform) child.gameObject.destroyEventProcess();
        });
    }

    /** @internal */
    public removeFromParent() {
        this._transform.unsafeGetObject3D().removeFromParent();
    }

    /** @internal */
    public removeComponent(component: Component) {
        const index = this.components.indexOf(component);
        if (index >= 0) {
            this.components.splice(index, 1);
        }
        this.gameObjectEventContainer.unregisterComponent(component);
    }

    /**
     * global engine object
     */
    public get engine(): EngineGlobalObject {
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

        if (this._initialized) {
            const components = this.components;
            if (this._activeInHierarchy) {
                //enable components
                for (let i = 0; i < components.length; i++) {
                    const component = components[i];
                    if (component.enabled) {
                        component._engine_internal_componentEventContainer.tryCallAwake();
                        component._engine_internal_componentEventContainer.tryRegisterOnEnable();
                        component._engine_internal_componentEventContainer.tryRegisterStart();
                        component._engine_internal_componentEventContainer.tryRegisterUpdate();
                    }
                }
            } else {
                for (let i = 0; i < components.length; i++) {
                    const component = components[i];
                    if (component.enabled) {
                        //disable components
                        component._engine_internal_componentEventContainer.tryRegisterOnDisable();
                        //dequeue update
                        component._engine_internal_componentEventContainer.tryUnregisterUpdate();
                        
                        component.stopAllCoroutines();
                    }
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

    private setActiveInHierarchyWithEvent(value: boolean) {
        if (this._activeInHierarchy === value) return;
        this.activeInHierarchy = value;
        if (this._initialized) this._engineGlobalObject.sceneProcessor.tryStartProcessSyncedEvent();
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
        this.checkGameObjectIsExist();
        if (this._activeSelf === value) return;

        this._activeSelf = value;

        if (this._transform.parent instanceof Transform) { // if parent is a gameobject
            if (this._transform.parent.gameObject._activeInHierarchy) {
                this.setActiveInHierarchyWithEvent(this._activeSelf);
            } else {
                this.setActiveInHierarchyWithEvent(false);
            }
        } else { // parent is root it means parent always active in hierarchy
            this.setActiveInHierarchyWithEvent(this._activeSelf);
        }
    }

    /**
     * get transform of the GameObject
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
        this.checkGameObjectIsExist();
        this._transform.unsafeGetObject3D().name = value;
    }

    /**
     * get instance id of the GameObject
     */
    public get instanceId(): number {
        return this._instanceId;
    }

    /**
     * if instantiate process is finished, this will be true
     */
    public get initialized(): boolean {
        return this._initialized;
    }

    /**
     * does the gameobject exist?
     */
    public get exists(): boolean {
        return !this._destroyed;
    }

    private checkGameObjectIsExist(): void {
        if (this._destroyed) {
            throw new Error("GameObject " + this.name + " is destroyed");
        }
    }
}
