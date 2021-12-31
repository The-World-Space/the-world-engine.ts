/**
 * represents a color by its red, green, blue and alpha components in the range [0, 1]
 */
export class Color {
    private readonly _r: number;
    private readonly _g: number;
    private readonly _b: number;
    private readonly _a: number;

    public constructor(r: number, g: number, b: number, a = 1) {
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }

    /**
     * get the red component of the color
     */
    public get r(): number {
        return this._r;
    }

    /**
     * get the green component of the color
     */
    public get g(): number {
        return this._g;
    }

    /**
     * get the blue component of the color
     */
    public get b(): number {
        return this._b;
    }

    /**
     * get the alpha component of the color
     */
    public get a(): number {
        return this._a;
    }

    /**
     * get the color as a string with the format rgba(r, g, b, a)
     * @returns 
     */
    public toString(): string {
        return `rgba(${this._r}, ${this._g}, ${this._b}, ${this._a})`;
    }

    /**
     * get the color as a hex string with the format #rrggbb it loses alpha information
     * @returns 
     */
    public toHex(): string {
        return `#${this._r.toString(16)}${this._g.toString(16)}${this._b.toString(16)}`;
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
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
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
}
