import { Color } from "../../../render/Color";
import { ReadonlyColor } from "../../../render/ReadonlyColor";

export interface ICssDropShadow {
    offsetX: number;
    offsetY: number;
    blur: number;
    color: ReadonlyColor;
    clone(): CssDropShadow;
    toString(): string;
}

export class CssDropShadow implements ICssDropShadow {
    private _onChange: (() => void)|null;

    private _offsetX: number;
    private _offsetY: number;
    private _blur: number;
    private _color: Color;

    public constructor(offsetX?: number, offsetY?: number, blur?: number, color?: Color);

    /** @internal */
    public constructor(offsetX?: number, offsetY?: number, blur?: number, color?: ReadonlyColor, onChange?: (() => void)|null);

    public constructor(offsetX = 0, offsetY = 0, blur = 0, color: ReadonlyColor = new Color(), onChange: (() => void)|null = null) {
        this._offsetX = offsetX;
        this._offsetY = offsetY;
        this._blur = blur;
        this._color = new Color().copy(color);
        this._onChange = onChange;
    }

    /** @internal */
    public get onChange(): (() => void)|null {
        return this._onChange;
    }

    /** @internal */
    public set onChange(value: (() => void)|null) {
        this._onChange = value;
    }

    public get offsetX(): number {
        return this._offsetX;
    }

    public set offsetX(value: number) {
        this._offsetX = value;
        this._onChange?.();
    }

    public get offsetY(): number {
        return this._offsetY;
    }

    public set offsetY(value: number) {
        this._offsetY = value;
        this._onChange?.();
    }

    public get blur(): number {
        return this._blur;
    }

    public set blur(value: number) {
        this._blur = value;
        this._onChange?.();
    }

    public get color(): ReadonlyColor {
        return this._color;
    }

    public set color(value: ReadonlyColor) {
        this._color.copy(value);
        this._onChange?.();
    }

    public copy(value: ICssDropShadow): void {
        this._offsetX = value.offsetX;
        this._offsetY = value.offsetY;
        this._blur = value.blur;
        this._color.copy(value.color);
        this._onChange?.();
    }

    public clone(): CssDropShadow {
        return new CssDropShadow(this._offsetX, this._offsetY, this._blur, this._color.clone(), this._onChange);
    }

    public toString(): string {
        return "drop-shadow(" + this._offsetX + "px " + this._offsetY + "px " + this._blur + "px " + this._color.toString() + ")";
    }
}
