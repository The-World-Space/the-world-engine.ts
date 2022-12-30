import { Color } from "./Color";

export interface ReadonlyColor {
    /**
     * clone the color
     */
    clone(): Color;

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
     * get the color as a string with the format rgb(r, g, b)
     * @returns
     */
    toString(): string;

    /**
     * get the color as a string with the format rgba(r, g, b, a)
     * @returns
     */
    toStringWithAlpha(): string;

    /**
     * get the color as a hex string with the format #rrggbb it loses alpha information
     * @returns
     */
    toHex(): string;

    /**
     * get the color as a hex string with the format #rrggbbaa
     * @returns
     */
    toHexWithAlpha(): string;

    /**
     * get the color as an array with the format [r, g, b, a]
     * @returns
     */
    toArray(): number[];

    hsl(): { h: number, s: number, l: number };
}
