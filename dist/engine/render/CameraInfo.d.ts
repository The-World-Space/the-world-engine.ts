import { Color } from "./Color";
/**
 * camera info object
 */
export declare class CameraInfo {
    private _priority;
    private _backgroundColor;
    /**
     *
     * @param priority
     * @param backgroundColor
     */
    constructor(priority: number, backgroundColor: Color);
    /**
     * get camera priority
     */
    get priority(): number;
    /**
     * set camera priority
     */
    set priority(value: number);
    /**
     * get camera background color
     */
    get backgroundColor(): Color;
    /**
     * set camera background color
     */
    set backgroundColor(value: Color);
}
