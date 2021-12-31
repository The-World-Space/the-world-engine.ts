import { Quaternion, Vector3 } from "three";
import { Component } from "./Component";
import { ComponentConstructor } from "./ComponentConstructor";
import { EngineGlobalObject } from "../EngineGlobalObject";
import { PrefabRef } from "./PrefabRef";
import { Transform } from "./Transform";
import { ITransform } from "./ITransform";
import { IEngine } from "../IEngine";
/**
 * base class for all entities in scenes
 */
export declare class GameObject {
    private _transform;
    private _activeInHierarchy;
    private _activeSelf;
    private _components;
    private _engineGlobalObject;
    constructor(engineGlobalObject: EngineGlobalObject, name: string);
    private registerTransform;
    /**
     * add a child game object
     * @param gameObjectBuilder
     */
    addChildFromBuilder(gameObjectBuilder: GameObjectBuilder): void;
    /**
     * change parent of this game object
     * @param newParent new parent game object. you can't set parent that in another engine instance
     */
    changeParent(newParent: GameObject): void;
    /**
     * add a component to this game object
     * it can be failed depending on the disallowMultipleComponent or requiredComponent option
     * @param componentCtor
     * @returns if success, return the component instance
     */
    addComponent<T extends Component>(componentCtor: ComponentConstructor<T>): T | null;
    /**
     * get component of componentCtor: ComponentConstructor<T> in the GameObject
     * @param componentCtor
     * @returns if success, return the component instance
     */
    getComponent<T extends Component>(componentCtor: ComponentConstructor<T>): T | null;
    /**
     * get all components in the GameObject
     */
    getComponents(): Component[];
    /**
     * get components of componentCtor: ComponentConstructor<T> in the GameObject
     * @param componentCtor
     * @returns
     */
    getComponents<T extends Component>(componentCtor: ComponentConstructor<T>): T[];
    /**
     * returns the component of componentCtor: ComponentConstructor<T> in the GameObject or any of its children using depth first search
     * @param componentCtor
     * @returns
     */
    getComponentInChildren<T extends Component>(componentCtor: ComponentConstructor<T>): T | null;
    /**
     * returns all components in the GameObject or any of its children using depth first search
     */
    getComponentsInChildren(): Component[];
    /**
     * returns all components of componentCtor: ComponentConstructor<T> in the GameObject or any of its children using depth first search
     * @param componentCtor
     */
    getComponentsInChildren<T extends Component>(componentCtor: ComponentConstructor<T>): T[];
    /**
     * foreach component in the GameObject
     * @param callback
     */
    foreachComponent(callback: (component: Component) => void): void;
    /**
     * foreach component of componentCtor: ComponentConstructor<T> in the GameObject
     * @param callback
     * @param componentCtor
     */
    foreachComponent<T extends Component>(callback: (component: T) => void, componentCtor: ComponentConstructor<T>): void;
    /**
     * foreach component in the GameObject or any of its children using depth first search
     * @param callback
     */
    foreachComponentInChildren(callback: (component: Component) => void): void;
    /**
     * foreach component of componentCtor: ComponentConstructor<T> in the GameObject or any of its children using depth first search
     * @param callback
     * @param componentCtor
     */
    foreachComponentInChildren<T extends Component>(callback: (component: T) => void, componentCtor: ComponentConstructor<T>): void;
    /**
     * remove component from the GameObject
     * @param component
     */
    removeComponent(component: Component): void;
    /**
     * destroy the GameObject
     */
    destroy(): void;
    /**
     * global engine object
     */
    get engine(): IEngine;
    /**
     * defines whether the GameObject is active in the Scene
     */
    get activeInHierarchy(): boolean;
    private set activeInHierarchy(value);
    /**
     * defines whether the GameObject is active in the Scene
     */
    get activeSelf(): boolean;
    /**
     * defines whether the GameObject is active in the Scene
     */
    set activeSelf(value: boolean);
    /**
     * get transform of the GameObject
     * DO NOT cast this to Transform, instead use unsafeGetTransform
     */
    get transform(): ITransform;
    /**
     * get name of the GameObject
     */
    get name(): string;
    /**
     * set name of the GameObject
     */
    set name(value: string);
    /**
     * get uuid of the GameObject
     */
    get uuid(): string;
    /**
     * get id of the GameObject
     */
    get id(): number;
    /**
     * get Transform of the GameObject that drives the three.js Object3D. you can use this to add three.js Object3D to the scene
     * if you want to add a custom Object3D to the scene, you must manage the lifecycle of the Object3D yourself
     *
     * see also:
     * "Object3D.visible" property has same value as "GameObject.activeInHierarchy"
     * you must not change "Object3D.visible" directly, use "GameObject.activeInHierarchy" instead
     * "Object3D.add" method is not available for GameObject Transform it for other Object3D classes
     */
    unsafeGetTransform(): Transform;
}
/**
 * builder for GameObject
 */
export declare class GameObjectBuilder {
    private readonly _gameObject;
    private readonly _children;
    private readonly _componentInitializeFuncList;
    constructor(engineGlobalObject: EngineGlobalObject, name: string, localPosition?: Vector3, localRotation?: Quaternion, localScale?: Vector3);
    /**
     * set active in hierarchy
     * @param active
     * @returns
     */
    active(active: boolean): GameObjectBuilder;
    /**
     * get gameObject as call by reference
     * @param gameObjectRef
     * @returns
     */
    getGameObject(gameObjectRef: PrefabRef<GameObject>): GameObjectBuilder;
    /**
     * get component of componentCtor: ComponentConstructor<T> as call by reference
     * @param componentCtor
     * @param componentRef
     * @returns
     */
    getComponent<T extends Component>(componentCtor: ComponentConstructor<T>, componentRef: PrefabRef<T>): GameObjectBuilder;
    /**
     * get all components as call by reference
     * @param componentsRef
     * @returns
     */
    getComponents(componentsRef: PrefabRef<Component[]>): GameObjectBuilder;
    /**
     * get all components of componentCtor: ComponentConstructor<T> as call by reference
     * @param componentsRef
     * @param componentCtor
     * @returns
     */
    getComponents<T extends Component>(componentsRef: PrefabRef<T[]>, componentCtor: ComponentConstructor<T>): GameObjectBuilder;
    /**
     * get component of componentCtor: ComponentConstructor<T> in GameObject or any of its children as call by reference
     * @param componentCtor
     * @param componentRef
     * @returns
     */
    getComponentInChildren<T extends Component>(componentCtor: ComponentConstructor<T>, componentRef: PrefabRef<T>): GameObjectBuilder;
    /**
     * get all components in GameObject or any of its children as call by reference
     * @param componentsRef
     * @returns
     */
    getComponentsInChildren(componentsRef: PrefabRef<Component[]>): GameObjectBuilder;
    /**
     * get all components of componentCtor: ComponentConstructor<T> in GameObject or any of its children as call by reference
     * @param componentsRef
     * @param componentCtor
     * @returns
     */
    getComponentsInChildren<T extends Component>(componentsRef: PrefabRef<T[]>, componentCtor: ComponentConstructor<T>): GameObjectBuilder;
    /**
     * add component of componentCtor: ComponentConstructor<T> to GameObject
     * @param componentCtor
     * @returns
     */
    withComponent<T extends Component>(componentCtor: ComponentConstructor<T>): GameObjectBuilder;
    /**
     * add component of componentCtor: ComponentConstructor<T> to GameObject with initialize function
     * @param componentCtor
     * @param componentInitializeFunc
     * @returns
     */
    withComponent<T extends Component>(componentCtor: ComponentConstructor<T>, componentInitializeFunc?: (component: T) => void): GameObjectBuilder;
    /**
     * with child GameObject
     * @param child
     * @returns
     */
    withChild(child: GameObjectBuilder): GameObjectBuilder;
    private checkComponentRequirements;
    /**
     * build GameObject. check component requirements and link GameObjects tranform
     * @returns
     */
    build(): GameObject;
    /**
     * execute initialize function of all components recursively for it's children GameObjects
     */
    initialize(): void;
}
