import { Vector2 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../hierarchy_object/Component";
import { ZaxisInitializer } from "./ZaxisInitializer";

export class CssIframeRenderer extends Component {
    protected override readonly _disallowMultipleComponent: boolean = true;
    
    private _width = 128;
    private _height = 128;
    private _viewScale = 1;
    private _css3DObject: CSS3DObject|null = null;
    private _htmlIframeElement: HTMLIFrameElement|null = null;
    private readonly _iframeCenterOffset: Vector2 = new Vector2(0, 0);
    private _iframeSource = "";
    private _pointerEvents = true;
    private _zindex = 0;
    private _started = false;

    public start(): void { 
        this.drawIframe();
        ZaxisInitializer.checkAncestorZaxisInitializer(this.gameObject, this.onSortByZaxis.bind(this));
        this._started = true;
    }

    public onDestroy(): void {
        if (!this._started) return;
        if (this._css3DObject) this.transform.unsafeGetObject3D().remove(this._css3DObject); //it's safe because _css3DObject is not GameObject and remove is from onDestroy
    }

    public onEnable(): void {
        if (this._css3DObject) this._css3DObject.visible = true;
    }

    public onDisable(): void {
        if (this._css3DObject) this._css3DObject.visible = false;
    }

    public onSortByZaxis(zaxis: number): void {
        this._zindex = zaxis;
        if (this._css3DObject) {
            this._css3DObject.element.style.zIndex = Math.floor(this._zindex).toString();
        }
    }

    private drawIframe(): void {
        const iframeWidth: number = this._width;
        const iframeHeight: number = this._height;
        this._htmlIframeElement = document.createElement("iframe") as HTMLIFrameElement;
        this._htmlIframeElement.title = this.gameObject.name + "_iframe";
        this._htmlIframeElement.width = (iframeWidth / this.viewScale).toString();
        this._htmlIframeElement.height = (iframeHeight / this.viewScale).toString();
        this._htmlIframeElement.src = this._iframeSource;
        this._css3DObject = new CSS3DObject(this._htmlIframeElement);
        this.updateCenterOffset();
        this._css3DObject.scale.set(this.viewScale, this.viewScale, this.viewScale);
        this.transform.unsafeGetObject3D().add(this._css3DObject); //it's safe because _css3DObject is not GameObject and remove is from onDestroy
        this._htmlIframeElement.style.border = "none";
        this._htmlIframeElement.style.zIndex = Math.floor(this._zindex).toString();
        this._htmlIframeElement.style.pointerEvents = this._pointerEvents ? "auto" : "none";
    }

    private updateCenterOffset(): void {
        if (this._css3DObject) {
            this._css3DObject.position.set(
                this._width * this._iframeCenterOffset.x,
                this._height * this._iframeCenterOffset.y, 0
            );
        }
    }

    public get width(): number {
        return this._width;
    }

    public set width(value: number) {
        this._width = value;

        if (this._htmlIframeElement) {
            this._htmlIframeElement.width = value.toString();
        }
        this.updateCenterOffset();
    }

    public get height(): number {
        return this._height;
    }

    public set height(value: number) {
        this._height = value;

        if (this._htmlIframeElement) {
            this._htmlIframeElement.height = value.toString();
        }
        this.updateCenterOffset();
    }

    public get viewScale(): number {
        return this._viewScale;
    }

    public set viewScale(value: number) {
        this._viewScale = value;
        
        if (this._css3DObject) {
            this._htmlIframeElement!.width = (this._width / this.viewScale).toString();
            this._htmlIframeElement!.height = (this._height / this.viewScale).toString();
            this._css3DObject.scale.set(value, value, value);
        }
    }

    public get iframeSource(): string {
        return this._iframeSource;
    }

    public set iframeSource(value: string) {
        this._iframeSource = value;

        if (this._htmlIframeElement) {
            this._htmlIframeElement.src = value;
        }
    }

    public get pointerEvents(): boolean {
        return this._pointerEvents;
    }

    public set pointerEvents(value: boolean) {
        this._pointerEvents = value;
        
        if (this._htmlIframeElement) {
            this._htmlIframeElement.style.pointerEvents = value ? "auto" : "none";
        }
    }

    public get iframeCenterOffset(): Vector2 {
        return this._iframeCenterOffset.clone();
    }

    public set iframeCenterOffset(value: Vector2) {
        this._iframeCenterOffset.copy(value);
        this.updateCenterOffset();
    }

    public get htmlIframeElement(): HTMLIFrameElement {
        return this._htmlIframeElement!;
    }
}
