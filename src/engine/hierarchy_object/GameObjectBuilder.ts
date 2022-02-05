import { Quaternion, Vector3 } from "three";
import { PrefabRef } from "./PrefabRef";
import { EngineGlobalObject } from "../EngineGlobalObject";
import { GameObject } from "./GameObject";
import { Component } from "./Component";
import { ComponentConstructor } from "./ComponentConstructor";
import { SceneProcessor } from "../SceneProcessor";
import { Transform } from "./Transform";

/**
 * builder for GameObject
 */
export class GameObjectBuilder {
    private readonly _gameObject: GameObject;
    private readonly _children: GameObjectBuilder[];
    private readonly _componentInitializeFuncList: (() => void)[];

    /** @internal */
    public constructor(engineGlobalObject: EngineGlobalObject, name: string, localPosition?: Vector3, localRotation?: Quaternion, localScale?: Vector3) {
        this._gameObject = new GameObject(engineGlobalObject, name);
        const transform = this._gameObject.transform;
        if (localPosition) transform.localPosition.copy(localPosition);
        if (localRotation) transform.localRotation.copy(localRotation);
        if (localScale) transform.localScale.copy(localScale);
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

    // #region getter

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

    // #endregion

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
        component.engine_internal_constructAfterProcess();

        if (component.disallowMultipleComponent) {
            const existingComponent = this._gameObject.getComponent(componentCtor);
            if (existingComponent) {
                console.warn(`Component ${componentCtor.name} already exists on GameObject ${this._gameObject.name}`);
                return this;
            }
        }
        this._gameObject._components.push(component);
        this._gameObject.tryAddMatrixUpdateComponent(component);
        
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
        const components: Component[] = gameObject._components;
        for (let i = 0; i < components.length; i++) {
            const component = components[i];
            const requiredComponents = component.requiredComponents;
            for (let j = 0; j < requiredComponents.length; j++) {
                const requiredComponentCtor = requiredComponents[j];
                const requiredComponent = gameObject.getComponent(requiredComponentCtor);
                if (!requiredComponent) {
                    console.warn(`Component ${requiredComponentCtor.name} is required by Component ${component.constructor.name} on GameObject ${gameObject.name}`);
                    gameObject.removeComponent(component);
                    componentRemoved = true;
                }
            }
        }
        if (componentRemoved) this.checkComponentRequirements(gameObject);
    }

    /** @internal */
    public build(parent: Transform|null): GameObject {
        this.registerTransform(parent);
        this.chackComponentRequirementsRecursive();
        this.componentInitialize();
        return this._gameObject;
    }

    private registerTransform(parent: Transform|null): void {
        this._gameObject.transform.parent = parent;

        const children = this._children;
        for (let i = 0; i < children.length; i++) {
            const child = children[i];
            child.registerTransform(this._gameObject.transform);
        }
    }

    private chackComponentRequirementsRecursive(): void {
        this.checkComponentRequirements(this._gameObject);
        const children = this._children;
        for (let i = 0; i < children.length; i++) {
            children[i].chackComponentRequirementsRecursive();
        }
    }

    private componentInitialize(): void {
        const componentInitializeFuncList = this._componentInitializeFuncList;
        for (let i = 0; i < componentInitializeFuncList.length; i++) {
            componentInitializeFuncList[i]();
        }
        const children = this._children;
        for (let i = 0; i < children.length; i++) {
            children[i].componentInitialize();
        }

        this._gameObject._initialized = true;
    }

    /** @internal */
    public processEvent(): void {
        GameObjectBuilder.processEventByGroup([this], this._gameObject.engine.sceneProcessor);
    }

    /** @internal */
    public static processEventByGroup(builders: GameObjectBuilder[], sceneProcessor: SceneProcessor): void {
        const components = [];
        for (let i = 0; i < builders.length; i++) {
            components.push(...builders[i]._gameObject.getComponentsInChildren());
        }

        //awake
        for (let i = 0; i < components.length; i++) {
            const component = components[i];
            if (component.gameObject.activeInHierarchy && component.enabled) {
                component._engine_internal_componentEventContainer.tryCallAwake();
            }
        }
        
        //onEnable start update
        for (let i = 0; i < components.length; i++) {
            const component = components[i];
            if (component._engine_internal_destroyed) continue;
            if (component.gameObject.activeInHierarchy && component.enabled) {
                component._engine_internal_componentEventContainer.tryRegisterOnEnable();
                component._engine_internal_componentEventContainer.tryRegisterStart();
                component._engine_internal_componentEventContainer.tryRegisterUpdate();
            }
        }

        sceneProcessor.tryStartProcessSyncedEvent();
    }
}
