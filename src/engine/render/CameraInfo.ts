import { Color } from "./Color";

/**
 * camera info object
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
        backgroundColor: Color
    ) {
        this._priority = priority;
        this._backgroundColor = backgroundColor;
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
    public get backgroundColor(): Color {
        return this._backgroundColor;
    }

    /**
     * set camera background color
     */
    public set backgroundColor(value: Color) {
        this._backgroundColor = value;
    }
}
