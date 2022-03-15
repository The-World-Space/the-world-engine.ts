import { Vector2, Vector2Tuple } from "three/src/Three";

export type ReadonlyVector2 = {
    /**
     * @default 0
     */
    readonly x: number;

    /**
     * @default 0
     */
    readonly y: number;
    readonly width: number;
    readonly height: number;
    readonly isVector2: true;

    /**
     * Gets a component of this vector.
     */
    getComponent(index: number): number;

    /**
     * Returns a new Vector2 instance with the same `x` and `y` values.
     */
    clone(): Vector2;

    /**
     * Computes dot product of this vector and v.
     */
    dot(v: ReadonlyVector2): number;

    /**
     * Computes cross product of this vector and v.
     */
    cross(v: ReadonlyVector2): number;

    /**
     * Computes squared length of this vector.
     */
    lengthSq(): number;

    /**
     * Computes length of this vector.
     */
    length(): number;

    /**
     * Computes the Manhattan length of this vector.
     *
     * see {@link http://en.wikipedia.org/wiki/Taxicab_geometry|Wikipedia: Taxicab Geometry}
     */
    manhattanLength(): number;

    /**
     * computes the angle in radians with respect to the positive x-axis
     */
    angle(): number;

    /**
     * Computes distance of this vector to v.
     */
    distanceTo(v: ReadonlyVector2): number;

    /**
     * Computes squared distance of this vector to v.
     */
    distanceToSquared(v: ReadonlyVector2): number;

    /**
     * Computes the Manhattan length (distance) from this vector to the given vector v
     *
     * see {@link http://en.wikipedia.org/wiki/Taxicab_geometry|Wikipedia: Taxicab Geometry}
     */
    manhattanDistanceTo(v: ReadonlyVector2): number;

    /**
     * Checks for strict equality of this vector and v.
     */
    equals(v: ReadonlyVector2): boolean;

    /**
     * Returns an array [x, y], or copies x and y into the provided array.
     * @param array (optional) array to store the vector to. If this is not provided, a new array will be created.
     * @param offset (optional) optional offset into the array.
     * @return The created or provided array.
     */
    toArray(array?: number[], offset?: number): number[];
    toArray(array?: Vector2Tuple, offset?: 0): Vector2Tuple;

    /**
     * Copies x and y into the provided array-like.
     * @param array array-like to store the vector to.
     * @param offset (optional) optional offset into the array.
     * @return The provided array-like.
     */
    toArray(array: ArrayLike<number>, offset?: number): ArrayLike<number>;
};
