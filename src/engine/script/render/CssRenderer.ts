import { Vector2 } from "three/src/Three";
//import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { CSS3DObject } from "../../render/CSS3DRenderer"; //use duck typed class for tree shaking
import { ReadonlyVector2 } from "../../../engine/math/ReadonlyVector2";
import { WritableVector2 } from "../../../engine/math/WritableVector2";
import { Component } from "../../hierarchy_object/Component";
import { Transform } from "../../hierarchy_object/Transform";
import { ZaxisInitializer } from "./ZaxisInitializer";

export const enum CssRendererConst {
    LengthUnitScalar = 0.1
}

export class CssRenderer<T extends HTMLElement> extends Component {
    protected css3DObject: CSS3DObject|null = null;
    protected htmlElement: T|null = null;

    private readonly _centerOffset = new Vector2();
    private _viewScale = CssRendererConst.LengthUnitScalar;
    private _pointerEvents = true;

    private _zindex = 0;
    private _readyToDraw = false;

    public start(): void {
        this._readyToDraw = true;
        this.renderInitialize();
        ZaxisInitializer.checkAncestorZaxisInitializer(this.gameObject, this.onSortByZaxis.bind(this));
    }

    public onDestroy(): void {
        if (this.css3DObject) {
            this.transform.dequeueRenderAttachedObject3D(this.css3DObject);
            this.transform.unsafeGetObject3D().remove(this.css3DObject); //it's safe because _css3DObject is not GameObject and remove is from onDestroy
            this.css3DObject = null;
            this.htmlElement = null;
        }
    }

    public onEnable(): void {
        if (this.css3DObject) {
            this.css3DObject.visible = true;
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    public onDisable(): void {
        if (this.css3DObject) {
            this.css3DObject.visible = false;
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    public onSortByZaxis(zaxis: number): void {
        this._zindex = zaxis / CssRendererConst.LengthUnitScalar;
        if (this.css3DObject) {
            this.css3DObject.element.style.zIndex = Math.floor(this._zindex).toString();
        }
    }
    
    public onWorldMatrixUpdated(): void {
        if (this.css3DObject) {
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    protected renderInitialize(): void {
        throw new Error("Yon can't Use CssRenderer Directly, use Derived Class e.g. CssSpriteRenderer");
    }

    protected initializeBaseComponents(reCreate: boolean): CSS3DObject {
        if (!this.htmlElement) throw new Error("htmlElement is null");

        let constructed = false;
        if (reCreate) {
            if (this.css3DObject) {
                this.transform.unsafeGetObject3D().remove(this.css3DObject);
            }
            this.css3DObject = new CSS3DObject(this.htmlElement);
            constructed = true;
        } else {
            if (this.css3DObject) {
                this.css3DObject.element = this.htmlElement;
            } else {
                this.css3DObject = new CSS3DObject(this.htmlElement);
                constructed = true;
            }
        }

        if (constructed) {
            //update pointerEvents
            this.htmlElement.style.pointerEvents = this.pointerEvents ? "auto" : "none";

            //update zindex
            this.htmlElement.style.zIndex = Math.floor(this._zindex).toString();

            //update visibility
            if (this.enabled && this.gameObject.activeInHierarchy) this.css3DObject.visible = true;
            else this.css3DObject.visible = false;
        }
 
        //update viewScale
        this.updateViewScale(false);
        
        //update centerOffset
        this.updateCenterOffset(false);

        this.transform.unsafeGetObject3D().add(this.css3DObject);
        return this.css3DObject;
    }
    
    protected updateCenterOffset(_updateTransform: boolean): void {
        throw new Error("Yon can't Use CssRenderer Directly, use Derived Class e.g. CssSpriteRenderer");
    }

    protected updateViewScale(_updateTransform: boolean): void {
        throw new Error("Yon can't Use CssRenderer Directly, use Derived Class e.g. CssSpriteRenderer");
    }

    public get centerOffset(): ReadonlyVector2 {
        return this._centerOffset;
    }

    public set centerOffset(value: ReadonlyVector2) {
        (this._centerOffset as WritableVector2).copy(value);
        this.updateCenterOffset(true);
    }

    public get viewScale(): number {
        return this._viewScale;
    }

    /**
     * element viewScale
     * 
     * note: if the viewScale is greater than 1, render will have different behaviour depending on the browser. In the case of firefox, normal operation is guaranteed.
     * @param value
     */
    public set viewScale(value: number) {
        this._viewScale = value;
        this.updateViewScale(true);
    }

    public get pointerEvents(): boolean {
        return this._pointerEvents;
    }

    public set pointerEvents(value: boolean) {
        this._pointerEvents = value;
        if (this.htmlElement) {
            this.htmlElement.style.pointerEvents = value ? "auto" : "none";
        }
    }

    protected get readyToDraw(): boolean {
        return this._readyToDraw;
    }
}
