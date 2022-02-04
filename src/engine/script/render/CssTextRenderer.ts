import { Vector2 } from "three";
import { CSS3DObject } from  "three/examples/jsm/renderers/CSS3DRenderer";
import { Component } from "../../hierarchy_object/Component";
import { Transform } from "../../hierarchy_object/Transform";
import { ZaxisInitializer } from "./ZaxisInitializer";

export enum TextAlign {
    Left = "left",
    Center = "center",
    Right = "right",
}

export enum FontWeight {
    Normal = "normal",
    Bold = "bold",
}

export class CssTextRenderer extends Component {
    public override readonly disallowMultipleComponent: boolean = true;

    private _css3DObject: CSS3DObject|null = null;
    private _htmlDivElement: HTMLDivElement|null = null;
    private readonly _textCenterOffset: Vector2 = new Vector2(0, 0);
    private _zindex = 0;
    private _textWidth = 32;
    private _textHeight = 16;
    private _fontSize = 8;
    private _fontWeight: FontWeight = FontWeight.Normal;
    private _fontFamily = "Arial";
    private _textalign: TextAlign = TextAlign.Left;
    private _opacity = 1;
    private _pointerEvents = true;

    private _initializeFunction: (() => void)|null = null;

    private static readonly _defaultText: string = "Text";

    public awake(): void {
        this._initializeFunction?.call(this);
        if (!this._htmlDivElement) {
            this.text = CssTextRenderer._defaultText;
        }
    }

    public start(): void {
        if (this._css3DObject) {
            if (this.enabled && this.gameObject.activeInHierarchy) this._css3DObject.visible = true;
            else this._css3DObject.visible = false;
        }
        ZaxisInitializer.checkAncestorZaxisInitializer(this.gameObject, this.onSortByZaxis.bind(this));
    }

    public onEnable(): void {
        if (this._css3DObject) {
            this._css3DObject.visible = true;
            this.transform.enqueueRenderAttachedObject3D(this._css3DObject);
        }
    }

    public onDisable(): void {
        if (this._css3DObject) {
            this._css3DObject.visible = false;
            this.transform.enqueueRenderAttachedObject3D(this._css3DObject);
        }
    }

    public onDestroy(): void {
        if (this._css3DObject) this.transform.unsafeGetObject3D().remove(this._css3DObject); //it's safe because _css3DObject is not GameObject and remove is from onDestroy
    }

    public onSortByZaxis(zaxis: number): void {
        this._zindex = zaxis;
        if (this._css3DObject) {
            this._css3DObject.element.style.zIndex = Math.floor(this._zindex).toString();
        }
    }
    
    public onWorldMatrixUpdated(): void {
        if (this._css3DObject) {
            Transform.updateRawObject3DWorldMatrixRecursively(this._css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this._css3DObject);
        }
    }

    public get text(): string|null {
        return this._htmlDivElement?.textContent || null;
    }

    public set text(value: string|null) {
        if (!this.initialized) {
            this._initializeFunction = () => {
                this.text = value;
            };
            return;
        }

        if (!value) value = CssTextRenderer._defaultText;

        if (!this._htmlDivElement) {
            this._htmlDivElement = document.createElement("div");
        }

        this._htmlDivElement.textContent = value;
        
        if (!this._css3DObject) {
            this._css3DObject = new CSS3DObject(this._htmlDivElement);
            if (this._textWidth === 0) this._textWidth = this._htmlDivElement.offsetWidth;
            if (this._textHeight === 0) this._textHeight = this._htmlDivElement.offsetHeight;
            this._htmlDivElement.style.width = this._textWidth + "px";
            this._htmlDivElement.style.height = this._textHeight + "px";
            this._htmlDivElement.style.fontSize = this._fontSize + "px";
            this._htmlDivElement.style.fontWeight = this._fontWeight;
            this._htmlDivElement.style.fontFamily = this._fontFamily;
            this._htmlDivElement.style.textAlign = this._textalign;
            this._htmlDivElement.style.opacity = this._opacity.toString();
            this._htmlDivElement.style.pointerEvents = this._pointerEvents ? "auto" : "none";
            
            this._htmlDivElement.style.zIndex = Math.floor(this._zindex).toString();
            this.updateCenterOffset();
            this.transform.unsafeGetObject3D().add(this._css3DObject); //it's safe because _css3DObject is not GameObject and remove is from onDestroy
            
            if (this.enabled && this.gameObject.activeInHierarchy) this._css3DObject.visible = true;
            else this._css3DObject.visible = false;
            
            Transform.updateRawObject3DWorldMatrixRecursively(this._css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this._css3DObject);
        }
    }

    private updateCenterOffset(): void {
        if (this._css3DObject) {
            this._css3DObject.position.set(
                this._htmlDivElement!.offsetWidth * this._textCenterOffset.x,
                this._htmlDivElement!.offsetHeight * this._textCenterOffset.y, 0
            );
            Transform.updateRawObject3DWorldMatrixRecursively(this._css3DObject);
            this.transform.enqueueRenderAttachedObject3D(this._css3DObject);
        }
    }
    
    public get textCenterOffset(): Vector2 {
        return this._textCenterOffset.clone();
    }

    public set textCenterOffset(value: Vector2) {
        this._textCenterOffset.copy(value);
        this.updateCenterOffset();
    }

    public get textWidth(): number {
        return this._textWidth;
    }

    public set textWidth(value: number) {
        this._textWidth = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.width = value + "px";
        }
        this.updateCenterOffset();
    }

    public get textHeight(): number {
        return this._textHeight;
    }

    public set textHeight(value: number) {
        this._textHeight = value;
        if (this._css3DObject) {
            this._css3DObject.element.style.height = value + "px";
        }
        this.updateCenterOffset();
    }

    public get fontSize(): number {
        return this._fontSize;
    }

    public set fontSize(value: number) {
        this._fontSize = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.fontSize = value + "px";
        }
    }

    public get fontWeight(): FontWeight {
        return this._fontWeight;
    }

    public set fontWeight(value: FontWeight) {
        this._fontWeight = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.fontWeight = value;
        }
    }

    public get fontFamily(): string {
        return this._fontFamily;
    }

    public set fontFamily(value: string) {
        this._fontFamily = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.fontFamily = value;
        }
    }

    public get textAlign(): TextAlign {
        return this._textalign;
    }

    public set textAlign(value: TextAlign) {
        this._textalign = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.textAlign = value;
        }
    }

    public get opacity(): number {
        return this._opacity;
    }

    public set opacity(value: number) {
        this._opacity = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.opacity = value.toString();
        }
    }

    public get pointerEvents(): boolean {
        return this._pointerEvents;
    }

    public set pointerEvents(value: boolean) {
        this._pointerEvents = value;
        if (this._htmlDivElement) {
            this._htmlDivElement.style.pointerEvents = value ? "auto" : "none";
        }
    }
}
