import { CssDropShadow, ICssDropShadow } from "./CssDropShadow";

/**
 * css filter record for use in CssRenderer
 */
export class CssFilter {
    private readonly _onChange: (() => void)|null;
    
    private _blur = 0;
    private _brightness = 1;
    private _contrast = 1;
    private _dropShadow: CssDropShadow|null = null;
    private _grayscale = 0;
    private _hueRotate = 0;
    private _invert = 0;
    private _saturate = 1;
    private _sepia = 0;

    /**
     * 
     * @param onChange callback to call when filter changes. It's an internal function, so you don't need to use it
     */
    public constructor(onChange: (() => void)|null = null) {
        this._onChange = onChange;
    }

    /**
     * copy filter from another CssFilter
     * 
     * onChange callback will not be copied
     */
    public copy(other: CssFilter): void {
        this._blur = other._blur;
        this._brightness = other._brightness;
        this._contrast = other._contrast;
        if (!this._dropShadow && other._dropShadow) {
            this._dropShadow = new CssDropShadow(undefined, undefined, undefined, undefined, this._onChange);
            this._dropShadow.copy(other._dropShadow);
        } else if (this._dropShadow && other._dropShadow) {
            this._dropShadow.copy(other._dropShadow);
        }
        this._grayscale = other._grayscale;
        this._hueRotate = other._hueRotate;
        this._invert = other._invert;
        this._saturate = other._saturate;
        this._sepia = other._sepia;

        this._onChange?.();
    }

    /**
     * clone filter
     * 
     * onChange callback will not be cloned
     */
    public clone(): CssFilter {
        const filter = new CssFilter();
        filter.copy(this);
        return filter;
    }

    /**
     * blur filter in pixels (default: 0)
     */
    public get blur(): number {
        return this._blur;
    }

    /**
     * blur filter in pixels (default: 0)
     */
    public set blur(value: number) {
        this._blur = value;
        this._onChange?.();
    }

    /**
     * brightness filter in 0-1 range (default: 1)
     */
    public get brightness(): number {
        return this._brightness;
    }

    /**
     * brightness filter in 0-1 range (default: 1)
     */
    public set brightness(value: number) {
        this._brightness = value;
        this._onChange?.();
    }
    
    /**
     * contrast filter in 0-1 range (default: 1)
     */
    public get contrast(): number {
        return this._contrast;
    }

    /**
     * contrast filter in 0-1 range (default: 1)
     */
    public set contrast(value: number) {
        this._contrast = value;
        this._onChange?.();
    }

    /**
     * drop shadow filter (default: null)
     */
    public get dropShadow(): ICssDropShadow|null {
        return this._dropShadow;
    }

    /**
     * drop shadow filter (default: null)
     */
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
    
    /**
     * gray scale filter in 0-1 range (default: 0)
     */
    public get grayscale(): number {
        return this._grayscale;
    }

    /**
     * gray scale filter in 0-1 range (default: 0)
     */
    public set grayscale(value: number) {
        this._grayscale = value;
        this._onChange?.();
    }

    /**
     * hue rotate filter in 0-360deg range (default: 0)
     */
    public get hueRotate(): number {
        return this._hueRotate;
    }

    /**
     * hue rotate filter in 0-360deg range (default: 0)
     */
    public set hueRotate(value: number) {
        this._hueRotate = value;
        this._onChange?.();
    }

    /**
     * invert filter in 0-1 range (default: 0)
     */
    public get invert(): number {
        return this._invert;
    }

    /**
     * invert filter in 0-1 range (default: 0)
     */
    public set invert(value: number) {
        this._invert = value;
        this._onChange?.();
    }

    /**
     * saturate filter in 0-1 range (default: 1)
     */
    public get saturate(): number {
        return this._saturate;
    }

    /**
     * saturate filter in 0-1 range (default: 1)
     */
    public set saturate(value: number) {
        this._saturate = value;
        this._onChange?.();
    }

    /**
     * sepia filter in 0-1 range (default: 0)
     */
    public get sepia(): number {
        return this._sepia;
    }

    /**
     * sepia filter in 0-1 range (default: 0)
     */
    public set sepia(value: number) {
        this._sepia = value;
        this._onChange?.();
    }

    /**
     * converts this css filter to a css string
     * 
     * format: `blur(<blur>px) brightness(<brightness>) contrast(<contrast>) grayscale(<grayscale>) hue-rotate(<hue-rotate>deg) invert(<invert>) saturate(<saturate>) sepia(<sepia>) <drop-shadow>`
     * @returns 
     */
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
