import { Matrix3 } from "three";

export class CssImageFilterSolver {

}

/**
 * represents a color by its red, green, blue and alpha components in the range [0, 1]
 */
class Color {
    private _r: number;
    private _g: number;
    private _b: number;
    private _a: number;

    public constructor(r: number, g: number, b: number, a = 1) {
        if (1 < r) r = 1;
        else if (0 > r) r = 0;
        
        if (1 < g) g = 1;
        else if (0 > g) g = 0;
        
        if (1 < b) b = 1;
        else if (0 > b) b = 0;
        
        if (1 < a) a = 1;
        else if (0 > a) a = 0;
        
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }

    /**
     * set the color
     * @param r red component
     * @param g green component
     * @param b blue component
     * @param a alpha component
     */
    public set(r: number, g: number, b: number, a = 1) {
        if (1 < r) r = 1;
        else if (0 > r) r = 0;
        
        if (1 < g) g = 1;
        else if (0 > g) g = 0;
        
        if (1 < b) b = 1;
        else if (0 > b) b = 0;
        
        if (1 < a) a = 1;
        else if (0 > a) a = 0;
        
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }

    /**
     * copy the color to this color
     * @param color colot that copy to this color
     */
    public copy(color: Color) {
        this._r = color._r;
        this._g = color._g;
        this._b = color._b;
        this._a = color._a;
    }

    /**
     * clone the color
     */
    public clone(): Color {
        return new Color(this._r, this._g, this._b, this._a);
    }

    //#region getters and setters

    /**
     * get the red component of the color
     */
    public get r(): number {
        return this._r;
    }

    /**
     * set the red component of the color
     * value will be clamped between 0 and 1
     */
    public set r(value: number) {
        if (1 < value) value = 1;
        else if (0 > value) value = 0;
        this._r = value;
    }

    /**
     * get the green component of the color
     */
    public get g(): number {
        return this._g;
    }

    /**
     * set the green component of the color
     * value will be clamped between 0 and 1
     */
    public set g(value: number) {
        if (1 < value) value = 1;
        else if (0 > value) value = 0;
        this._g = value;
    }

    /**
     * get the blue component of the color
     */
    public get b(): number {
        return this._b;
    }

    /**
     * set the blue component of the color
     * value will be clamped between 0 and 1
     */
    public set b(value: number) {
        if (1 < value) value = 1;
        else if (0 > value) value = 0;
        this._b = value;
    }

    /**
     * get the alpha component of the color
     */
    public get a(): number {
        return this._a;
    }

    /**
     * set the alpha component of the color
     * value will be clamped between 0 and 1
     */
    public set a(value: number) {
        if (1 < value) value = 1;
        else if (0 > value) value = 0;
        this._a = value;
    }

    //#endregion

    //#region from/to methods

    /**
     * get the color as a string with the format rgb(r, g, b)
     * @returns 
     */
    public toString(): string {
        return "rgb(" + this._r + ", " + this._g + ", " + this._b + ")";
    }

    /**
     * get the color as a string with the format rgba(r, g, b, a)
     * @returns 
     */
    public toStringWithAlpha(): string {
        return "rgba(" + this._r + ", " + this._g + ", " + this._b + ", " + this._a + ")";
    }

    /**
     * get the color as a hex string with the format #rrggbb it loses alpha information
     * @returns 
     */
    public toHex(): string {
        return "#" + (
            (Math.round(this._r * 255) << 8*2) +
            (Math.round(this._g * 255) << 8*1) +
            (Math.round(this._b * 255) << 8*0)
        ).toString(16).padStart(6, "0");
        // return "#" +
        //     (Math.round(this._r * 255)).toString(16).padStart(2, "0") +
        //     (Math.round(this._g * 255)).toString(16).padStart(2, "0") +
        //     (Math.round(this._b * 255)).toString(16).padStart(2, "0");
    }

    /**
     * get the color as a hex string with the format #rrggbbaa
     * @returns 
     */
    public toHexWithAlpha(): string {
        return "#" + (
            (Math.round(this._r * 255) << 8*2) +
            (Math.round(this._g * 255) << 8*1) +
            (Math.round(this._b * 255) << 8*0)
        ).toString(16).padStart(6, "0") +
            (Math.round(this._a * 255)).toString(16).padStart(2, "0");
        // return "#" +
        //     (Math.round(this._r * 255)).toString(16).padStart(2, "0") +
        //     (Math.round(this._g * 255)).toString(16).padStart(2, "0") +
        //     (Math.round(this._b * 255)).toString(16).padStart(2, "0") +
        //     (Math.round(this._a * 255)).toString(16).padStart(2, "0");
    }

    /**
     * get the color as an array with the format [r, g, b, a]
     * @returns 
     */
    public toArray(): number[] {
        return [this._r, this._g, this._b, this._a];
    }

    /**
     * build a color from a hex string with the format #rrggbb alpha is set to 1
     * @param hex 
     * @returns 
     */
    public static fromHex(hex: string): Color {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return new Color(r, g, b);
    }

    /**
     * build a color from an array with the format [r, g, b, a]
     * @param array 
     * @returns 
     */
    public static fromArray(array: number[]): Color {
        return new Color(array[0], array[1], array[2], array[3]);
    }

    /**
     * build a color from a string with the format rgba(r, g, b, a)
     * @param str 
     * @returns 
     */
    public static fromString(str: string): Color {
        const match = str.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*(\d*(?:\.\d+)?)\)$/);
        if (match) {
            return new Color(parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), parseFloat(match[4]));
        }
        return Color.fromHex(str);
    }

    //#endregion

    public hueRotate(angle = 0) {
        angle = angle / 180 * Math.PI;
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        this.multiplyMatrix(new Matrix3().set(
            0.213 + cos * 0.787 - sin * 0.213,
            0.715 - cos * 0.715 - sin * 0.715,
            0.072 - cos * 0.072 + sin * 0.928,
            0.213 - cos * 0.213 + sin * 0.143,
            0.715 + cos * 0.285 + sin * 0.140,
            0.072 - cos * 0.072 - sin * 0.283,
            0.213 - cos * 0.213 - sin * 0.787,
            0.715 - cos * 0.715 + sin * 0.715,
            0.072 + cos * 0.928 + sin * 0.072
        ));
    }

    public grayscale(value = 1) {
        this.multiplyMatrix(new Matrix3().set(
            0.2126 + 0.7874 * (1 - value),
            0.7152 - 0.7152 * (1 - value),
            0.0722 - 0.0722 * (1 - value),
            0.2126 - 0.2126 * (1 - value),
            0.7152 + 0.2848 * (1 - value),
            0.0722 - 0.0722 * (1 - value),
            0.2126 - 0.2126 * (1 - value),
            0.7152 - 0.7152 * (1 - value),
            0.0722 + 0.9278 * (1 - value)
        ));
    }

    public sepia(value = 1) {
        this.multiplyMatrix(new Matrix3().set(
            0.393 + 0.607 * (1 - value),
            0.769 - 0.769 * (1 - value),
            0.189 - 0.189 * (1 - value),
            0.349 - 0.349 * (1 - value),
            0.686 + 0.314 * (1 - value),
            0.168 - 0.168 * (1 - value),
            0.272 - 0.272 * (1 - value),
            0.534 - 0.534 * (1 - value),
            0.131 + 0.869 * (1 - value)
        ));
    }

    public saturate(value = 1) {
        this.multiplyMatrix(new Matrix3().set(
            0.213 + 0.787 * value,
            0.715 - 0.715 * value,
            0.072 - 0.072 * value,
            0.213 - 0.213 * value,
            0.715 + 0.285 * value,
            0.072 - 0.072 * value,
            0.213 - 0.213 * value,
            0.715 - 0.715 * value,
            0.072 + 0.928 * value
        ));
    }

    public multiplyMatrix(matrix: Matrix3) {
        const m = matrix.elements;

        let newR = this._r * m[0] + this._g * m[1] + this._b * m[2];
        let newG = this._r * m[3] + this._g * m[4] + this._b * m[5];
        let newB = this._r * m[6] + this._g * m[7] + this._b * m[8];

        if (1 < newR) newR = 1;
        else if (newR < 0) newR = 0;

        if (1 < newG) newG = 1;
        else if (newG < 0) newG = 0;

        if (1 < newB) newB = 1;
        else if (newB < 0) newB = 0;

        this._r = newR;
        this._g = newG;
        this._b = newB;
    }

    public brightness(value = 1) {
        this.linear(value);
    }

    public contrast(value = 1) {
        this.linear(value, -(0.5 * value) + 0.5);
    }

    public linear(slope = 1, intercept = 0) {
        this._r = this.clamp(this._r * slope + intercept);
        this._g = this.clamp(this._g * slope + intercept);
        this._b = this.clamp(this._b * slope + intercept);
    }

    public invert(value = 1) {
        this._r = this.clamp(value + this._r * (1 - 2 * value));
        this._g = this.clamp(value + this._g * (1 - 2 * value));
        this._b = this.clamp(value + this._b * (1 - 2 * value));
    }

    public hsl() : { h: number, s: number, l: number } {
        // Code taken from https://stackoverflow.com/a/9493060/2688027, licensed under CC BY-SA.
        const r = this._r / 255;
        const g = this._g / 255;
        const b = this._b / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;

                case g:
                    h = (b - r) / d + 2;
                    break;

                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return {
            h: h * 100,
            s: s * 100,
            l: l * 100,
        };
    }
}

class Solver {
    target: Color;
    targetHSL: { h: number, s: number, l: number };
    reusedColor: Color;

    constructor(target: Color) {
        this.target = target;
        this.targetHSL = target.hsl();
        this.reusedColor = new Color(0, 0, 0);
    }

    solve() {
        const result = this.solveNarrow(this.solveWide());
        return {
            values: result.values,
            loss: result.loss,
            filter: this.css(result.values),
        };
    }

    solveWide() {
        const A = 5;
        const c = 15;
        const a = [60, 180, 18000, 600, 1.2, 1.2];

        let best = { loss: Infinity };
        for (let i = 0; best.loss > 25 && i < 3; i++) {
            const initial = [50, 20, 3750, 50, 100, 100];
            const result = this.spsa(A, a, c, initial, 1000);
            if (result.loss < best.loss) {
                best = result;
            }
        }
        return best;
    }

    solveNarrow(wide) {
        const A = wide.loss;
        const c = 2;
        const A1 = A + 1;
        const a = [0.25 * A1, 0.25 * A1, A1, 0.25 * A1, 0.2 * A1, 0.2 * A1];
        return this.spsa(A, a, c, wide.values, 500);
    }

    spsa(A, a, c, values, iters) {
        const alpha = 1;
        const gamma = 0.16666666666666666;

        let best = null;
        let bestLoss = Infinity;
        const deltas = new Array(6);
        const highArgs = new Array(6);
        const lowArgs = new Array(6);

        for (let k = 0; k < iters; k++) {
            const ck = c / Math.pow(k + 1, gamma);
            for (let i = 0; i < 6; i++) {
                deltas[i] = Math.random() > 0.5 ? 1 : -1;
                highArgs[i] = values[i] + ck * deltas[i];
                lowArgs[i] = values[i] - ck * deltas[i];
            }

            const lossDiff = this.loss(highArgs) - this.loss(lowArgs);
            for (let i = 0; i < 6; i++) {
                const g = lossDiff / (2 * ck) * deltas[i];
                const ak = a[i] / Math.pow(A + k + 1, alpha);
                values[i] = fix(values[i] - ak * g, i);
            }

            const loss = this.loss(values);
            if (loss < bestLoss) {
                best = values.slice(0);
                bestLoss = loss;
            }
        }
        return { values: best, loss: bestLoss };

        function fix(value, idx) {
            let max = 100;
            if (idx === 2 /* saturate */) {
                max = 7500;
            } else if (idx === 4 /* brightness */ || idx === 5 /* contrast */) {
                max = 200;
            }

            if (idx === 3 /* hue-rotate */) {
                if (value > max) {
                    value %= max;
                } else if (value < 0) {
                    value = max + value % max;
                }
            } else if (value < 0) {
                value = 0;
            } else if (value > max) {
                value = max;
            }
            return value;
        }
    }

    loss(filters: number[]) {
        // Argument is array of percentages.
        const color = this.reusedColor;
        color.set(0, 0, 0);

        color.invert(filters[0] / 100);
        color.sepia(filters[1] / 100);
        color.saturate(filters[2] / 100);
        color.hueRotate(filters[3] * 3.6);
        color.brightness(filters[4] / 100);
        color.contrast(filters[5] / 100);

        const colorHSL = color.hsl();
        return (
            Math.abs(color.r - this.target.r) +
            Math.abs(color.g - this.target.g) +
            Math.abs(color.b - this.target.b) +
            Math.abs(colorHSL.h - this.targetHSL.h) +
            Math.abs(colorHSL.s - this.targetHSL.s) +
            Math.abs(colorHSL.l - this.targetHSL.l)
        );
    }

    css(filters) {
        function fmt(idx: number, multiplier = 1) {
            return Math.round(filters[idx] * multiplier);
        }
        return `filter: invert(${fmt(0)}%) sepia(${fmt(1)}%) saturate(${fmt(2)}%) hue-rotate(${fmt(3, 3.6)}deg) brightness(${fmt(4)}%) contrast(${fmt(5)}%);`;
    }
}
