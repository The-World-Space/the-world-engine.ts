import { Vector2 } from "three/src/Three";

import { ReadonlyVector2 } from "../../../engine/math/ReadonlyVector2";
import { WritableVector2 } from "../../../engine/math/WritableVector2";
import { Component } from "../../hierarchy_object/Component";
import { Transform } from "../../hierarchy_object/Transform";
//import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { CSS3DObject } from "../../render/CSS3DRenderer"; //use duck typed class for tree shaking
import { CssFilter } from "./filter/CssFilter";

/**
 * Options for rendering css objects of unknown size.
 */
export interface IUnknownSizeCssRenderOption {
    /**
     * element viewScale
     * 
     * value to scaling html element. the smaller value, the higher resolution of element.
     * 
     * note: if the viewScale is greater than 1, render will have different behaviour depending on the browser. In the case of firefox, normal operation is guaranteed.
     * @param value
     */
    viewScale: number;

    /**
     * if true, pointerEvents is auto that means is receive pointerEvent like onClick.
     * otherwise, pointerEvents is none.
     */
    pointerEvents: boolean;

    /**
     * css filter
     */
    filter: CssFilter;
}

/**
 * Options used on most css objects with finite size.
 */
export interface ICssRenderOption extends IUnknownSizeCssRenderOption {
    /**
     * centerOffset is offset from center of object.
     * 
     * if centerOffset is (0.5, 0), object center is left center.
     * if centerOffset is (0.5, 0.5), object center is top left center.
     */
    centerOffset: ReadonlyVector2;
}

/**
 * precision problems occur when css space and actual game space are 1:1
 * 
 * This constant specifies the ratio of css space to match the game space
 * 
 * The default value is 0.1, and the css space and game space correspond to 10:1
 * 
 * This value is not designed to be changed by default. However, if an engine bug occurs in the future, the value may change.
 */
export const enum CssRendererConst {
    LengthUnitScalar = 0.1
}

/**
 * css renderer base class
 * 
 * you can't use this class directly, but you can use its subclasses e.g. `CssSpriteRenderer`, `CssTextRenderer`
 */
export class CssRenderer<T extends HTMLElement> extends Component implements ICssRenderOption {
    protected css3DObject: CSS3DObject|null = null;
    protected htmlElement: T|null = null;

    private readonly _centerOffset = new Vector2();
    private _viewScale = CssRendererConst.LengthUnitScalar;
    private _pointerEvents = true;

    private readonly onFilterUpdate = (): void => {
        if (this.htmlElement) {
            this.htmlElement.style.filter = this._filter.toString();
        }
    };

    private readonly _filter: CssFilter = new CssFilter(this.onFilterUpdate);
    
    private _readyToDraw = false;

    /**
     * start method will initialize css3DObject and add it to scene.
     * 
     * process:
     * 1. set `readyToDraw` to true.
     * 2. call `renderInitialize()` method.
     */
    public start(): void {
        this._readyToDraw = true;
        this.renderInitialize();
    }

    /**
     * when object is destroyed, this method will be called.
     * 
     * process:
     * 1. enqueue css3DObject to render queue for update viewport
     * 2. remove css3DObject from scene
     * 3. set `css3DObject` and `htmlElement` to null
     */
    public onDestroy(): void {
        if (this.css3DObject) {
            this.transform.dequeueRenderAttachedObject3D(this.css3DObject);
            this.transform.unsafeGetObject3D().remove(this.css3DObject); //it's safe because _css3DObject is not GameObject and remove is from onDestroy
            this.css3DObject = null;
            this.htmlElement = null;
        }
    }

    /**
     * when object is enabled, this method will be called.
     * 
     * process:
     * 1. show css3DObject
     * 2. enqueue css3DObject to render queue for update viewport
     */
    public onEnable(): void {
        if (this.css3DObject) {
            this.css3DObject.visible = true;
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    /**
     * when object is disabled, this method will be called.
     * 
     * process:
     * 1. hide css3DObject
     * 2. enqueue css3DObject to render queue for update viewport
     */
    public onDisable(): void {
        if (this.css3DObject) {
            this.css3DObject.visible = false;
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }
    
    /**
     * when world matrix is updated, this method will be called
     * 
     * process:
     * 1. enqueue css3DObject to render queue for update viewport
     * 2. update raw Three.js object's matrix recursively
     */
    public onWorldMatrixUpdated(): void {
        if (this.css3DObject) {
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    /**
     * initialize css3DObject. you must implement this method in derived class.
     * 
     * this method is called when start() message is invoked.
     * 
     * this method must set `css3DObject` and `htmlElement` to non-null value.
     */
    protected renderInitialize(): void {
        throw new Error("Yon can't Use CssRenderer Directly, use Derived Class e.g. CssSpriteRenderer");
    }

    /**
     * create css3DObject with basic properties
     * you must call this method in renderInitialize() for create css3DObject
     * 
     * @param reCreate if true, recreate css3DObject else use existing css3DObject
     * @returns css3DObject
     */
    protected initializeBaseComponents(reCreate: boolean): CSS3DObject {
        const htmlElement = this.htmlElement;
        if (!htmlElement) throw new Error("htmlElement is null");

        let constructed = false;
        if (reCreate) {
            if (this.css3DObject) {
                this.transform.unsafeGetObject3D().remove(this.css3DObject);
            }
            this.css3DObject = new CSS3DObject(htmlElement);
            constructed = true;
        } else {
            if (this.css3DObject) {
                this.css3DObject.element = htmlElement;
            } else {
                this.css3DObject = new CSS3DObject(htmlElement);
                constructed = true;
            }
        }

        if (constructed) {
            //update pointerEvents
            htmlElement.style.pointerEvents = this.pointerEvents ? "auto" : "none";

            //update filter
            htmlElement.style.filter = this._filter.toString();

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
    
    /**
     * update centerOffset. you must implement this method in derived class.
     * @param _updateTransform if true, matrix will be updated and render will be enqueued
     */
    protected updateCenterOffset(_updateTransform: boolean): void {
        throw new Error("Yon can't Use CssRenderer Directly, use Derived Class e.g. CssSpriteRenderer");
    }

    /**
     * update viewScale. you must implement this method in derived class.
     * @param _updateTransform if true, matrix will be updated and render will be enqueued
     */
    protected updateViewScale(_updateTransform: boolean): void {
        throw new Error("Yon can't Use CssRenderer Directly, use Derived Class e.g. CssSpriteRenderer");
    }

    /**
     * centerOffset is offset from center of object.
     * 
     * if centerOffset is (0.5, 0), object center is left center.
     * if centerOffset is (0.5, 0.5), object center is top left center.
     */
    public get centerOffset(): ReadonlyVector2 {
        return this._centerOffset;
    }

    /**
     * centerOffset is offset from center of object.
     * 
     * if centerOffset is (0.5, 0), object center is left center.
     * if centerOffset is (0.5, 0.5), object center is top left center.
     */
    public set centerOffset(value: ReadonlyVector2) {
        (this._centerOffset as WritableVector2).copy(value);
        this.updateCenterOffset(true);
    }

    /**
     * element viewScale
     * 
     * value to scaling html element. the smaller value, the higher resolution of element.
     * 
     * note: if the viewScale is greater than 1, render will have different behaviour depending on the browser. In the case of firefox, normal operation is guaranteed.
     * @param value
     */
    public get viewScale(): number {
        return this._viewScale;
    }

    /**
     * element viewScale
     * 
     * value to scaling html element. the smaller value, the higher resolution of element.
     * 
     * note: if the viewScale is greater than 1, render will have different behaviour depending on the browser. In the case of firefox, normal operation is guaranteed.
     * @param value
     */
    public set viewScale(value: number) {
        this._viewScale = value;
        this.updateViewScale(true);
    }

    /**
     * if true, pointerEvents is auto that means is receive pointerEvent like onClick.
     * otherwise, pointerEvents is none.
     */
    public get pointerEvents(): boolean {
        return this._pointerEvents;
    }

    /**
     * if true, pointerEvents is auto that means is receive pointerEvent like onClick.
     * otherwise, pointerEvents is none.
     */
    public set pointerEvents(value: boolean) {
        this._pointerEvents = value;
        if (this.htmlElement) {
            this.htmlElement.style.pointerEvents = value ? "auto" : "none";
        }
    }

    /**
     * css filter
     */
    public get filter(): CssFilter {
        return this._filter;
    }

    /**
     * on start() message is invoked, this value will be set to true.
     */
    protected get readyToDraw(): boolean {
        return this._readyToDraw;
    }

    /**
     * html element events
     */
    public get htmlElementEventHandler(): GlobalEventHandlers|null {
        return this.htmlElement;
    }
}
