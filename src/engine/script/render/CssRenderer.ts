import { Vector2 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { ReadOnlyVector2, WritableVector2 } from "../../..";
import { Component } from "../../hierarchy_object/Component";
import { Transform } from "../../hierarchy_object/Transform";
import { ZaxisInitializer } from "./ZaxisInitializer";

export class CssRenderer<T extends HTMLElement> extends Component {
    public override readonly disallowMultipleComponent: boolean = true;

    protected css3DObject: CSS3DObject|null = null;
    protected htmlElement: T|null = null;

    private readonly _centerOffset = new Vector2();
    private _viewScale = 1;
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
            this.transform.unsafeGetObject3D().remove(this.css3DObject); //it's safe because _css3DObject is not GameObject and remove is from onDestroy
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
        this._zindex = zaxis;
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

    protected initializeBaseComponents(): void {
        if (!this.css3DObject) throw new Error("css3DObject is null");
        if (!this.htmlElement) throw new Error("htmlElement is null");

        //update pointerEvents
        this.htmlElement.style.pointerEvents = this.pointerEvents ? "auto" : "none";

        //update zindex
        this.htmlElement.style.zIndex = Math.floor(this._zindex).toString();

        //update visibility
        if (this.enabled && this.gameObject.activeInHierarchy) this.css3DObject.visible = true;
        else this.css3DObject.visible = false;

        //update viewScale
        this.updateViewScale(false);
        
        //update centerOffset
        this.updateCenterOffset(true);
        
        this.transform.unsafeGetObject3D().add(this.css3DObject);
        this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
    }
    
    protected updateCenterOffset(_updateTransform = true): void {
        throw new Error("Yon can't Use CssRenderer Directly, use Derived Class e.g. CssSpriteRenderer");
    }

    protected updateViewScale(_updateTransform = true): void {
        throw new Error("Yon can't Use CssRenderer Directly, use Derived Class e.g. CssSpriteRenderer");
    }

    public get centerOffset(): ReadOnlyVector2 {
        return this._centerOffset;
    }

    public set centerOffset(value: ReadOnlyVector2) {
        (this._centerOffset as WritableVector2).copy(value);
        this.updateCenterOffset();
    }

    public get viewScale(): number {
        return this._viewScale;
    }

    public set viewScale(value: number) {
        this._viewScale = value;
        this.updateViewScale();
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
