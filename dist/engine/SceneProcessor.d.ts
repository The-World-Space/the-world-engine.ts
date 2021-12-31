import { Component } from "./hierarchy_object/Component";
export declare type UpdateableComponent = Component & {
    update(): void;
};
export declare function isUpdateableComponent(component: Component): component is UpdateableComponent;
export declare class SceneProcessor {
    private _componentExecutionOrderCompartor;
    private _startComponents;
    private _updateComponents;
    private _addStartComponentBuffer;
    private _addUpdateComponentBuffer;
    constructor();
    addStartComponent(...components: Component[]): void;
    addUpdateComponent(...components: UpdateableComponent[]): void;
    removeStartComponent(component: Component): void;
    removeUpdateComponent(component: UpdateableComponent): void;
    private flushAddStartComponentBuffer;
    private flushAddUpdateComponentBuffer;
    private processStart;
    private processUpdate;
    init(initializeComponents: {
        awakeComponents: Component[];
        enableComponents: Component[];
    }): void;
    update(): void;
}
