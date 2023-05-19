import { Color } from "./Color";
import type { ReadonlyColor } from "./ReadonlyColor";

/**
 * camera info object
 * @internal
 */
export class CameraInfo {
    private _priority: number;
    private _backgroundColor: null | Color | THREE.Texture;

    /**
     *
     * @param priority
     * @param backgroundColor
     */
    public constructor(
        priority: number,
        backgroundColor: null | ReadonlyColor | THREE.Texture
    ) {
        this._priority = priority;
        if (backgroundColor === null) {
            this._backgroundColor = null;
        } else if (backgroundColor instanceof Color) {
            this._backgroundColor = backgroundColor.clone();
        } else {
            this._backgroundColor = backgroundColor as THREE.Texture;
        }
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
    public get backgroundColor(): null | ReadonlyColor | THREE.Texture {
        return this._backgroundColor;
    }

    /**
     * set camera background color
     */
    public set backgroundColor(value: null | ReadonlyColor | THREE.Texture) {
        if (value === null) {
            this._backgroundColor = null;
        } else if (value instanceof Color) {
            if (this._backgroundColor instanceof Color) {
                this._backgroundColor.copy(value);
            } else {
                this._backgroundColor = value.clone();
            }
        } else {
            this._backgroundColor = value as THREE.Texture;
        }
    }
}
