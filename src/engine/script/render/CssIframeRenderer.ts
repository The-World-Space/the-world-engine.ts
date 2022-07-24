import { Transform } from "../../hierarchy_object/Transform";
import { CssRenderer } from "./CssRenderer";

/**
 * css iframe renderer
 * 
 * you can use this renderer to render iframe tag
 */
export class CssIframeRenderer extends CssRenderer<HTMLIFrameElement> {
    private _width = 4;
    private _height = 4;
    private _iframeSource = "";
    private _allow = "";
    private _allowFullscreen = false;
    private _refferrerPolicy: ReferrerPolicy = "";

    protected override renderInitialize(): void {
        this.htmlElement = document.createElement("iframe") as HTMLIFrameElement;
        this.htmlElement.title = this.gameObject.name + "_iframe";
        this.htmlElement.width = (this._width / this.viewScale).toString();
        this.htmlElement.height = (this._height / this.viewScale).toString();
        this.htmlElement.src = this._iframeSource;
        this.htmlElement.allow = this._allow;
        this.htmlElement.allowFullscreen = this._allowFullscreen;
        this.htmlElement.referrerPolicy = this._refferrerPolicy;
        this.htmlElement.style.border = "none";
        const css3DObject = this.initializeBaseComponents(false);
        css3DObject.scale.set(this.viewScale, this.viewScale, this.viewScale);

        Transform.updateRawObject3DWorldMatrixRecursively(css3DObject);
        this.transform.enqueueRenderAttachedObject3D(css3DObject);
    }

    protected override updateCenterOffset(updateTransform: boolean): void {
        if (!this.css3DObject) return;

        this.css3DObject.position.set(
            this._width * this.centerOffset.x,
            this._height * this.centerOffset.y, 0
        );

        if (updateTransform) {
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    protected override updateViewScale(updateTransform: boolean): void {
        if (!this.css3DObject) return;

        const value = this.viewScale;
        this.htmlElement!.width = (this._width / this.viewScale).toString();
        this.htmlElement!.height = (this._height / this.viewScale).toString();
        this.css3DObject.scale.set(value, value, value);
        
        if (updateTransform) {
            Transform.updateRawObject3DWorldMatrixRecursively(this.css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this.css3DObject);
        }
    }

    /**
     * iframe width (default: 4)
     */
    public get width(): number {
        return this._width;
    }

    /**
     * iframe width (default: 4)
     */
    public set width(value: number) {
        this._width = value;

        if (this.htmlElement) {
            this.htmlElement.width = (value / this.viewScale).toString();
        }
        this.updateCenterOffset(true);
    }

    /**
     * iframe height (default: 4)
     */
    public get height(): number {
        return this._height;
    }

    /**
     * iframe height (default: 4)
     */
    public set height(value: number) {
        this._height = value;

        if (this.htmlElement) {
            this.htmlElement.height = (value / this.viewScale).toString();
        }
        this.updateCenterOffset(true);
    }

    /**
     * iframe src (default: "")
     */
    public get iframeSource(): string {
        return this._iframeSource;
    }

    /**
     * iframe src (default: "")
     */
    public set iframeSource(value: string) {
        this._iframeSource = value;

        if (this.htmlElement) {
            this.htmlElement.src = value;
        }
    }

    /**
     * iframe allow attribute (default: "")
     */
    public get allow(): string {
        return this._allow;
    }

    /**
     * iframe allow attribute (default: "")
     */
    public set allow(value: string) {
        this._allow = value;
        
        if (this.htmlElement) {
            this.htmlElement.allow = value;
        }
    }

    /**
     * iframe allow fullscreen attribute (default: false)
     */
    public get allowFullscreen(): boolean {
        return this._allowFullscreen;
    }

    /**
     * iframe allow fullscreen attribute (default: false)
     */
    public set allowFullscreen(value: boolean) {
        this._allowFullscreen = value;
    }

    
    /**
     * Retrieves the document object of the page or frame.
     */
    public get contentDocument(): Document | null {
        return this.htmlElement?.contentDocument ?? null;
    }

    /**
     * Retrieves the object of the specified.
     */
    public get contentWindow(): WindowProxy | null {
        return this.htmlElement?.contentWindow ?? null;
    }

    /**
     * iframe referrerPolicy attribute (default: "")
     */
    public get referrerPolicy(): ReferrerPolicy {
        return this._refferrerPolicy;
    }

    /**
     * iframe referrerPolicy attribute (default: "")
     */
    public set referrerPolicy(value: ReferrerPolicy) {
        this._refferrerPolicy = value;

        if (this.htmlElement) {
            this.htmlElement.referrerPolicy = value;
        }
    }
}
