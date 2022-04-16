import { Color } from "./Color";
import { ReadonlyColor } from "./ReadonlyColor";

/**
 * camera info object
 * @internal
 */
export class CameraInfo {
    private _priority: number;
    private _backgroundColor: Color;

    /**
     * 
     * @param priority 
     * @param backgroundColor 
     */
    public constructor(
        priority: number,
        backgroundColor: ReadonlyColor
    ) {
        this._priority = priority;
        this._backgroundColor = new Color().copy(backgroundColor);
    }

    /**
     * get camera priority
     */
    public get priority(): number {
        return this._priority;
    }

    /**
     * set camera priority
     */
    public set priority(value: number) {
        this._priority = value;
    }

    /**
     * get camera background color
     */
    public get backgroundColor(): ReadonlyColor {
        return this._backgroundColor;
    }

    /**
     * set camera background color
     */
    public set backgroundColor(value: ReadonlyColor) {
        this._backgroundColor.copy(value);
    }
}
