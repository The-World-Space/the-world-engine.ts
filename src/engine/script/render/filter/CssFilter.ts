import { CssDropShadow, ICssDropShadow } from "./CssDropShadow";

export class CssFilter {
    private _onChange: (() => void)|null;
    
    private _blur = 0;
    private _brightness = 1;
    private _contrast = 1;
    private _dropShadow: CssDropShadow|null = null;
    private _grayscale = 0;
    private _hueRotate = 0;
    private _invert = 0;
    private _saturate = 1;
    private _sepia = 0;

    public constructor(onChange: (() => void)|null = null) {
        this._onChange = onChange;
    }

    public get blur(): number {
        return this._blur;
    }

    public set blur(value: number) {
        this._blur = value;
        this._onChange?.();
    }

    public get brightness(): number {
        return this._brightness;
    }

    public set brightness(value: number) {
        this._brightness = value;
        this._onChange?.();
    }
    
    public get contrast(): number {
        return this._contrast;
    }

    public set contrast(value: number) {
        this._contrast = value;
        this._onChange?.();
    }

    public get dropShadow(): ICssDropShadow|null {
        return this._dropShadow;
    }

    public set dropShadow(value: ICssDropShadow|null) {
        if (value) {
            if (!this._dropShadow) {
                this._dropShadow = new CssDropShadow(undefined, undefined, undefined, undefined, this._onChange);
            }
            this._dropShadow.copy(value);
        } else {
            if (this._dropShadow) {
                this._dropShadow.onChange = null;
                this._dropShadow = null;
            }
        }
    }
    
    public get grayscale(): number {
        return this._grayscale;
    }

    public set grayscale(value: number) {
        this._grayscale = value;
        this._onChange?.();
    }

    public get hueRotate(): number {
        return this._hueRotate;
    }

    public set hueRotate(value: number) {
        this._hueRotate = value;
        this._onChange?.();
    }

    public get invert(): number {
        return this._invert;
    }

    public set invert(value: number) {
        this._invert = value;
        this._onChange?.();
    }

    public get saturate(): number {
        return this._saturate;
    }

    public set saturate(value: number) {
        this._saturate = value;
        this._onChange?.();
    }

    public get sepia(): number {
        return this._sepia;
    }

    public set sepia(value: number) {
        this._sepia = value;
        this._onChange?.();
    }

    public toString(): string {
        let result = "";
        if (0 !== this._blur) {
            result += "blur(" + this._blur + "px) ";
        }
        if (1 !== this._brightness) {
            result += "brightness(" + this._brightness + ") ";
        }
        if (1 !== this._contrast) {
            result += "contrast(" + this._contrast + ") ";
        }
        if (0 !== this._grayscale) {
            result += "grayscale(" + this._grayscale + ") ";
        }
        if (0 !== this._hueRotate) {
            result += "hue-rotate(" + this._hueRotate + "deg) ";
        }
        if (0 !== this._invert) {
            result += "invert(" + this._invert + ") ";
        }
        if (1 !== this._saturate) {
            result += "saturate(" + this._saturate + ") ";
        }
        if (0 !== this._sepia) {
            result += "sepia(" + this._sepia + ") ";
        }
        if (this._dropShadow) {
            result += this._dropShadow.toString();
        }
        return result;
    }
}
