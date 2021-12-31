import { CompactableCollection } from "./collection/CompactableCollection";
import { Component } from "./hierarchy_object/Component";

export type UpdateableComponent = Component & {
    update(): void;
};

export function isUpdateableComponent(component: Component): component is UpdateableComponent {
    return (component as UpdateableComponent).update !== undefined;
}

export class SceneProcessor {
    private _componentExecutionOrderCompartor: <T extends Component>(a: T, b: T) => number;
    private _startComponents: CompactableCollection<Component>;
    private _updateComponents: CompactableCollection<UpdateableComponent>;
    private _addStartComponentBuffer: Component[];
    private _addUpdateComponentBuffer: UpdateableComponent[];
    
    public constructor() {
        this._componentExecutionOrderCompartor = (a, b) => a.executionOrder - b.executionOrder;
        this._startComponents = new CompactableCollection(this._componentExecutionOrderCompartor);
        this._updateComponents = new CompactableCollection(this._componentExecutionOrderCompartor);
        this._addStartComponentBuffer = [];
        this._addUpdateComponentBuffer = [];
    }

    //lazy evaluated function
    public addStartComponent(...components: Component[]): void {
        this._addStartComponentBuffer.push(...components);
    }

    //lazy evaluated function
    public addUpdateComponent(...components: UpdateableComponent[]): void {
        this._addUpdateComponentBuffer.push(...components);
    }

    public removeStartComponent(component: Component): void {
        if (this._addStartComponentBuffer.indexOf(component) >= 0) {
            this._addStartComponentBuffer.splice(this._addStartComponentBuffer.indexOf(component), 1);
        } else {
            this._startComponents.remove(component);
        }
    }

    public removeUpdateComponent(component: UpdateableComponent): void {
        if (this._addUpdateComponentBuffer.indexOf(component) >= 0) {
            this._addUpdateComponentBuffer.splice(this._addUpdateComponentBuffer.indexOf(component), 1);
        } else {
            this._updateComponents.remove(component);
        }
    }

    private flushAddStartComponentBuffer(): void {
        this._startComponents.addItems(this._addStartComponentBuffer);
        //Compaction is guaranteed at this point
        this._addStartComponentBuffer.length = 0;
    }

    private flushAddUpdateComponentBuffer(): void {
        this._updateComponents.addItems(this._addUpdateComponentBuffer);
        //Compaction is guaranteed at this point
        this._addUpdateComponentBuffer.length = 0;
    }

    private processStart(): void {
        this._startComponents.forEach(component => component.unsafeTryCallStart());
        this._startComponents.clear();
    }

    private processUpdate(): void {
        this._updateComponents.forEach(component => component.update());
    }

    public init(initializeComponents: { awakeComponents: Component[], enableComponents: Component[] }): void {
        initializeComponents.awakeComponents.forEach(component => component.unsafeTryCallAwake()); //depending on the unity implementation, awake order not guaranteed 
        //components.sort(this._componentExecutionOrderCompartor);
        initializeComponents.enableComponents.forEach(component => component.onEnable());
    }

    public update(): void {
        this._startComponents.compact();
        this._updateComponents.compact();
        
        do {
            this.processStart();
            this.flushAddStartComponentBuffer();
        } while (0 < this._addStartComponentBuffer.length);
        this.processStart();
        
        do {
            this.processUpdate();
            this.flushAddUpdateComponentBuffer();
        } while (0 < this._addUpdateComponentBuffer.length);
        this.processUpdate();
    }
}
