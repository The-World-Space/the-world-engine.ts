/**
 * represents a color by its red, green, blue and alpha components in the range [0, 1]
 */
export declare class Color {
    private readonly _r;
    private readonly _g;
    private readonly _b;
    private readonly _a;
    constructor(r: number, g: number, b: number, a?: number);
    /**
     * get the red component of the color
     */
    get r(): number;
    /**
     * get the green component of the color
     */
    get g(): number;
    /**
     * get the blue component of the color
     */
    get b(): number;
    /**
     * get the alpha component of the color
     */
    get a(): number;
    /**
     * get the color as a string with the format rgba(r, g, b, a)
     * @returns
     */
    toString(): string;
    /**
     * get the color as a hex string with the format #rrggbb it loses alpha information
     * @returns
     */
    toHex(): string;
    /**
     * get the color as an array with the format [r, g, b, a]
     * @returns
     */
    toArray(): number[];
    /**
     * build a color from a hex string with the format #rrggbb alpha is set to 1
     * @param hex
     * @returns
     */
    static fromHex(hex: string): Color;
    /**
     * build a color from an array with the format [r, g, b, a]
     * @param array
     * @returns
     */
    static fromArray(array: number[]): Color;
    /**
     * build a color from a string with the format rgba(r, g, b, a)
     * @param str
     * @returns
     */
    static fromString(str: string): Color;
}
