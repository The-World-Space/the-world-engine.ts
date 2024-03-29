import { Transform } from "../../hierarchy_object/Transform";
import { Color } from "../../render/Color";
import type { ReadonlyColor } from "../../render/ReadonlyColor";
import { CssRenderer } from "./CssRenderer";

/**
 * css text align enum
 */
export enum TextAlign {
    Left = "left",
    Center = "center",
    Right = "right",
}

/**
 * css text weight enum
 */
export enum FontWeight {
    Normal = "normal",
    Bold = "bold",
}

/**
 * css text renderer
 */
export class CssTextRenderer extends CssRenderer<HTMLDivElement> {
    private _textWidth = 2;
    private _textHeight = 1;
    private _autoSize = false;
    private _fontSize = 8;
    private _fontWeight: FontWeight = FontWeight.Normal;
    private _fontFamily = "Arial";
    private _textalign: TextAlign = TextAlign.Left;
    private readonly _textColor: Color = new Color(1, 1, 1, 1);
    private _text: string | null = null;

    private _initializeFunction: (() => void) | null = null;

    private static readonly _defaultText: string = "Text";

    protected override renderInitialize(): void {
        this._initializeFunction?.call(this);
        if (!this.htmlElement) this.text = CssTextRenderer._defaultText;
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
            width = this._textWidth;
            height = this._textHeight;
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
            this.css3DObject.element.style.width = (this._textWidth / this.viewScale) + "px";
            this.css3DObject.element.style.height = (this._textHeight / this.viewScale) + "px";
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

    /**
     * text that is displayed (default: null)
     */
    public get text(): string | null {
        return this._text;
    }

    /**
     * text that is displayed (default: null)
     */
    public set text(value: string | null) {
        this._text = value;

        if (!this.readyToDraw) {
            this._initializeFunction = (): void => this.setTextInternal(value);
            return;
        }

        this.setTextInternal(value);
    }

    private setTextInternal(value: string | null): void {
        if (!this.htmlElement) this.htmlElement = document.createElement("div");
        this.htmlElement.textContent = value ?? "";

        if (this._autoSize) {
            this.htmlElement.style.width = "auto";
            this.htmlElement.style.height = "auto";
        } else {
            this.htmlElement.style.width = this._textWidth + "px";
            this.htmlElement.style.height = this._textHeight + "px";
        }

        this.htmlElement.style.fontSize = this._fontSize + "px";
        this.htmlElement.style.fontWeight = this._fontWeight;
        this.htmlElement.style.fontFamily = this._fontFamily;
        this.htmlElement.style.textAlign = this._textalign;
        this.htmlElement.style.color = this._textColor.toHex();
        this.htmlElement.style.opacity = this._textColor.a.toString();

        const css3DObject = this.initializeBaseComponents(false);
        Transform.updateRawObject3DWorldMatrixRecursively(css3DObject);
        this.transform.enqueueRenderAttachedObject3D(css3DObject);
    }

    /**
     * text render width (default: 2)
     *
     * this property is modifiable only when autoSize is false
     *
     * Outside of this range, css text will be overflowed
     */
    public get textWidth(): number {
        if (this._autoSize) {
            if (this.htmlElement) {
                const lastDisplayState = this.htmlElement.style.display;
                this.htmlElement.style.display = "";
                const ret = this.htmlElement.offsetWidth;
                this.htmlElement.style.display = lastDisplayState;
                return ret;
            }
            return 0;
        }
        return this._textWidth;
    }

    /**
     * text render width (default: 2)
     *
     * this property is modifiable only when autoSize is false
     *
     * Outside of this range, css text will be overflowed
     */
    public set textWidth(value: number) {
        if (this._autoSize) return;

        this._textWidth = value;
        if (this.htmlElement) {
            this.htmlElement.style.width = (value / this.viewScale) + "px";
        }
        this.updateCenterOffset(true);
    }

    /**
     * text render height (default: 1)
     *
     * this property is modifiable only when autoSize is false
     *
     * Outside of this range, css text will be overflowed
     */
    public get textHeight(): number {
        if (this._autoSize) {
            if (this.htmlElement) {
                const lastDisplayState = this.htmlElement.style.display;
                this.htmlElement.style.display = "";
                const ret = this.htmlElement.offsetHeight;
                this.htmlElement.style.display = lastDisplayState;
                return ret;
            }
            return 0;
        }
        return this._textHeight;
    }

    /**
     * text render height (default: 1)
     *
     * this property is modifiable only when autoSize is false
     *
     * Outside of this range, css text will be overflowed
     */
    public set textHeight(value: number) {
        if (this._autoSize) return;

        this._textHeight = value;
        if (this.htmlElement) {
            this.htmlElement.style.height = (value / this.viewScale) + "px";
        }
        this.updateCenterOffset(true);
    }

    /**
     * if this value is true, the textWidth and textHeight will be automatically calculated (default: false)
     */
    public get autoSize(): boolean {
        return this._autoSize;
    }

    /**
     * if this value is true, the textWidth and textHeight will be automatically calculated (default: false)
     */
    public set autoSize(value: boolean) {
        this._autoSize = value;
        if (this.htmlElement) {
            if (value) {
                this.htmlElement.style.width = "auto";
                this.htmlElement.style.height = "auto";
            } else {
                this.htmlElement.style.width = (this._textWidth / this.viewScale) + "px";
                this.htmlElement.style.height = (this._textHeight / this.viewScale) + "px";
            }
        }
    }

    /**
     * font size as pixel value (default: 8)
     */
    public get fontSize(): number {
        return this._fontSize;
    }

    /**
     * font size as pixel value (default: 8)
     */
    public set fontSize(value: number) {
        this._fontSize = value;
        if (this.htmlElement) {
            this.htmlElement.style.fontSize = value + "px";
        }
    }

    /**
     * font weight (default: `FontWeight.Normal`)
     */
    public get fontWeight(): FontWeight {
        return this._fontWeight;
    }

    /**
     * font weight (default: `FontWeight.Normal`)
     */
    public set fontWeight(value: FontWeight) {
        this._fontWeight = value;
        if (this.htmlElement) {
            this.htmlElement.style.fontWeight = value;
        }
    }

    /**
     * font family (default: "Arial")
     */
    public get fontFamily(): string {
        return this._fontFamily;
    }

    /**
     * font family (default: "Arial")
     */
    public set fontFamily(value: string) {
        this._fontFamily = value;
        if (this.htmlElement) {
            this.htmlElement.style.fontFamily = value;
        }
    }

    /**
     * text align (default: `TextAlign.Left`)
     */
    public get textAlign(): TextAlign {
        return this._textalign;
    }

    /**
     * text align (default: `TextAlign.Left`)
     */
    public set textAlign(value: TextAlign) {
        this._textalign = value;
        if (this.htmlElement) {
            this.htmlElement.style.textAlign = value;
        }
    }

    /**
     * text color (default: "black")
     */
    public get textColor(): ReadonlyColor {
        return this._textColor;
    }

    /**
     * text color (default: "black")
     */
    public set textColor(value: ReadonlyColor) {
        this._textColor.copy(value);
        if (this.htmlElement) {
            this.htmlElement.style.color = value.toHex();
            this.htmlElement.style.opacity = value.a.toString();
        }
    }
}
