import { MutIteratableCollection } from "./collection/MutIteratableCollection";
import { Component } from "./hierarchy_object/Component";

/** @internal */
export type UpdateableComponent = Component & {
    update(): void;
};

/** @internal */
export function isUpdateableComponent(component: Component): component is UpdateableComponent {
    return (component as UpdateableComponent).update !== undefined;
}

/** @internal */
export class SceneProcessor {
    private _startComponents: MutIteratableCollection<Component>;
    private _updateComponents: MutIteratableCollection<UpdateableComponent>;
    
    public constructor() {
        this._startComponents = new MutIteratableCollection(Component.lessOperation);
        this._updateComponents = new MutIteratableCollection<UpdateableComponent>(Component.lessOperation);
    }

    public addStartComponent(component: Component): void {
        this._startComponents.insert(component);
    }

    public addUpdateComponent(component: UpdateableComponent): void {
        this._updateComponents.insert(component);
    }

    public removeStartComponent(component: Component): void {
        this._startComponents.delete(component);
    }

    public removeUpdateComponent(component: UpdateableComponent): void {
        this._updateComponents.delete(component);
    }

    public init(initializeComponents: { awakeComponents: Component[], enableComponents: Component[] }): void {
        initializeComponents.awakeComponents.forEach(component => component.eventInvoker.tryCallAwake()); //depending on the unity implementation, awake order not guaranteed 
        //initializeComponents.enableComponents.sort(Component.lessOperation);
        initializeComponents.enableComponents.forEach(component => component.eventInvoker.tryCallOnEnable());
    }

    public update(): void {
        this._startComponents.forEach(component => component.eventInvoker.tryCallStart());
        this._updateComponents.forEach(component => component.update());
    }
}
