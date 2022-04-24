import { Transform } from "../../hierarchy_object/Transform";
import { CssRenderer } from "./CssRenderer";

export class CssHtmlElementRenderer extends CssRenderer<HTMLDivElement> {
    private _elementWidth = 1;
    private _elementHeight = 1;
    private _autoSize = false;
    private _initializeFunction: (() => void)|null = null;

    protected override renderInitialize(): void {
        this._initializeFunction?.call(this);
        if (!this.htmlElement) this.element = null;
    }

    protected override updateCenterOffset(updateTransform: boolean): void {
        if (!this.css3DObject) return;

        let width: number;
        let height: number;

        if (this._autoSize) {
            if (!this.css3DObject.element.parentElement) {
                const lastDisplayState = this.css3DObject.element.style.display;
                this.css3DObject.element.style.display = "";
                const lastTransformState = this.css3DObject.element.style.transform;
                this.css3DObject.element.style.transform = "translateX(1000000px)";
                document.body.appendChild(this.css3DObject.element);
                width = this.css3DObject.element.offsetWidth * this.viewScale;
                height = this.css3DObject.element.offsetHeight * this.viewScale;
                this.css3DObject.element.style.display = lastDisplayState;
                this.css3DObject.element.style.transform = lastTransformState;
                document.body.removeChild(this.css3DObject.element);
            } else {
                const lastDisplayState = this.css3DObject.element.style.display;
                this.css3DObject.element.style.display = "";
                width = this.css3DObject.element.offsetWidth * this.viewScale;
                height = this.css3DObject.element.offsetHeight * this.viewScale;
                this.css3DObject.element.style.display = lastDisplayState;
            }
        } else {
            width = this._elementWidth;
            height = this._elementHeight;
        }
        this.css3DObject.position.set(
            width * this.centerOffset.x,
            height * this.centerOffset.y, 0
        );
        
        if (updateTransform) {
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    protected override updateViewScale(updateTransform: boolean): void {
        if (!this.css3DObject) return;
        
        const value = this.viewScale;

        if (!this._autoSize) {
            this.css3DObject.element.style.width = (this._elementWidth / this.viewScale) + "px";
            this.css3DObject.element.style.height = (this._elementHeight / this.viewScale) + "px";
            this.css3DObject.scale.set(value, value, value);
        } else {
            this.css3DObject.scale.set(value, value, value);
            this.updateCenterOffset(false);
        }

        if (updateTransform) {
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    public get element(): HTMLDivElement|null {
        return this.htmlElement;
    }

    public set element(value: HTMLDivElement|null) {
        const element = this.htmlElement = value ?? document.createElement("div");

        if (!this.readyToDraw) {
            this._initializeFunction = (): void => this.setElementInternal(element);
            return;
        }
        
        this.setElementInternal(element);
    }

    private setElementInternal(htmlElement: HTMLDivElement): void {
        if (this._autoSize) {
            htmlElement.style.width = "auto";
            htmlElement.style.height = "auto";
        } else {
            htmlElement.style.width = (this._elementWidth / this.viewScale) + "px";
            htmlElement.style.height = (this._elementHeight / this.viewScale) + "px";
        }
        
        const css3DObject = this.initializeBaseComponents(true);
        Transform.updateRawObject3DWorldMatrixRecursively(css3DObject);
        this.transform.enqueueRenderAttachedObject3D(css3DObject);
    }

    public get elementWidth(): number {
        if (this._autoSize) {
            if (this.htmlElement) {
                const lastDisplayState = this.htmlElement.style.display;
                this.htmlElement.style.display = "";
                const ret = this.htmlElement.offsetWidth * this.viewScale;
                this.htmlElement.style.display = lastDisplayState;
                return ret;
            }
            return 0;
        }
        return this._elementWidth;
    }

    public set elementWidth(value: number) {
        if (this._autoSize) return;

        this._elementWidth = value;
        if (this.htmlElement) {
            this.htmlElement.style.width = (value / this.viewScale) + "px";
        }
        this.updateCenterOffset(true);
    }

    public get elementHeight(): number {
        if (this._autoSize) {
            if (this.htmlElement) {
                const lastDisplayState = this.htmlElement.style.display;
                this.htmlElement.style.display = "";
                const ret = this.htmlElement.offsetHeight * this.viewScale;
                this.htmlElement.style.display = lastDisplayState;
                return ret;
            }
            return 0;
        }
        return this._elementHeight;
    }

    public set elementHeight(value: number) {
        if (this._autoSize) return;

        this._elementHeight = value;
        if (this.htmlElement) {
            this.htmlElement.style.height = (value / this.viewScale) + "px";
        }
        this.updateCenterOffset(true);
    }

    public get autoSize(): boolean {
        return this._autoSize;
    }

    public set autoSize(value: boolean) {
        this._autoSize = value;
        if (this.htmlElement) {
            if (value) {
                this.htmlElement.style.width = "auto";
                this.htmlElement.style.height = "auto";
            } else {
                this.htmlElement.style.width = (this._elementWidth / this.viewScale) + "px";
                this.htmlElement.style.height = (this._elementHeight / this.viewScale) + "px";
            }
        }
    }
}
