import { CompactableCollection } from "./collection/CompactableCollection";
export function isUpdateableComponent(component) {
    return component.update !== undefined;
}
export class SceneProcessor {
    constructor() {
        this._componentExecutionOrderCompartor = (a, b) => a.executionOrder - b.executionOrder;
        this._startComponents = new CompactableCollection(this._componentExecutionOrderCompartor);
        this._updateComponents = new CompactableCollection(this._componentExecutionOrderCompartor);
        this._addStartComponentBuffer = [];
        this._addUpdateComponentBuffer = [];
    }
    //lazy evaluated function
    addStartComponent(...components) {
        this._addStartComponentBuffer.push(...components);
    }
    //lazy evaluated function
    addUpdateComponent(...components) {
        this._addUpdateComponentBuffer.push(...components);
    }
    removeStartComponent(component) {
        if (this._addStartComponentBuffer.indexOf(component) >= 0) {
            this._addStartComponentBuffer.splice(this._addStartComponentBuffer.indexOf(component), 1);
        }
        else {
            this._startComponents.remove(component);
        }
    }
    removeUpdateComponent(component) {
        if (this._addUpdateComponentBuffer.indexOf(component) >= 0) {
            this._addUpdateComponentBuffer.splice(this._addUpdateComponentBuffer.indexOf(component), 1);
        }
        else {
            this._updateComponents.remove(component);
        }
    }
    flushAddStartComponentBuffer() {
        this._startComponents.addItems(this._addStartComponentBuffer);
        //Compaction is guaranteed at this point
        this._addStartComponentBuffer.length = 0;
    }
    flushAddUpdateComponentBuffer() {
        this._updateComponents.addItems(this._addUpdateComponentBuffer);
        //Compaction is guaranteed at this point
        this._addUpdateComponentBuffer.length = 0;
    }
    processStart() {
        this._startComponents.forEach(component => component.unsafeTryCallStart());
        this._startComponents.clear();
    }
    processUpdate() {
        this._updateComponents.forEach(component => component.update());
    }
    init(initializeComponents) {
        initializeComponents.awakeComponents.forEach(component => component.unsafeTryCallAwake()); //depending on the unity implementation, awake order not guaranteed 
        //components.sort(this._componentExecutionOrderCompartor);
        initializeComponents.enableComponents.forEach(component => component.onEnable());
    }
    update() {
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
