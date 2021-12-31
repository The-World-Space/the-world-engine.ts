/**
 * camera info object
 */
export class CameraInfo {
    /**
     *
     * @param priority
     * @param backgroundColor
     */
    constructor(priority, backgroundColor) {
        this._priority = priority;
        this._backgroundColor = backgroundColor;
    }
    /**
     * get camera priority
     */
    get priority() {
        return this._priority;
    }
    /**
     * set camera priority
     */
    set priority(value) {
        this._priority = value;
    }
    /**
     * get camera background color
     */
    get backgroundColor() {
        return this._backgroundColor;
    }
    /**
     * set camera background color
     */
    set backgroundColor(value) {
        this._backgroundColor = value;
    }
}
