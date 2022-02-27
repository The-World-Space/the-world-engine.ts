import { BufferAttribute, Vector2, Vector2Tuple } from "three";
import { ReadonlyMatrix3 } from "./ReadonlyMatrix3";
import { ReadonlyVector2 } from "./ReadonlyVector2";

export type WritableVector2 = {
    /**
     * @default 0
     */
    x: number;

    /**
     * @default 0
     */
    y: number;
    width: number;
    height: number;
    readonly isVector2: true;

    /**
     * Sets value of this vector.
     */
    set(x: number, y: number): WritableVector2;

    /**
     * Sets the x and y values of this vector both equal to scalar.
     */
    setScalar(scalar: number): WritableVector2;

    /**
     * Sets X component of this vector.
     */
    setX(x: number): WritableVector2;

    /**
     * Sets Y component of this vector.
     */
    setY(y: number): WritableVector2;

    /**
     * Sets a component of this vector.
     */
    setComponent(index: number, value: number): WritableVector2;

    /**
     * Gets a component of this vector.
     */
    getComponent(index: number): number;

    /**
     * Returns a new Vector2 instance with the same `x` and `y` values.
     */
    clone(): Vector2;

    /**
     * Copies value of v to this vector.
     */
    copy(v: ReadonlyVector2): WritableVector2;

    /**
     * Adds v to this vector.
     */
    add(v: ReadonlyVector2, w?: ReadonlyVector2): WritableVector2;

    /**
     * Adds the scalar value s to this vector's x and y values.
     */
    addScalar(s: number): WritableVector2;

    /**
     * Sets this vector to a + b.
     */
    addVectors(a: ReadonlyVector2, b: ReadonlyVector2): WritableVector2;

    /**
     * Adds the multiple of v and s to this vector.
     */
    addScaledVector(v: ReadonlyVector2, s: number): WritableVector2;

    /**
     * Subtracts v from this vector.
     */
    sub(v: ReadonlyVector2): WritableVector2;

    /**
     * Subtracts s from this vector's x and y components.
     */
    subScalar(s: number): WritableVector2;

    /**
     * Sets this vector to a - b.
     */
    subVectors(a: ReadonlyVector2, b: ReadonlyVector2): WritableVector2;

    /**
     * Multiplies this vector by v.
     */
    multiply(v: ReadonlyVector2): WritableVector2;

    /**
     * Multiplies this vector by scalar s.
     */
    multiplyScalar(scalar: number): WritableVector2;

    /**
     * Divides this vector by v.
     */
    divide(v: ReadonlyVector2): WritableVector2;

    /**
     * Divides this vector by scalar s.
     * Set vector to ( 0, 0 ) if s == 0.
     */
    divideScalar(s: number): WritableVector2;

    /**
     * Multiplies this vector (with an implicit 1 as the 3rd component) by m.
     */
    applyMatrix3(m: ReadonlyMatrix3): WritableVector2;

    /**
     * If this vector's x or y value is greater than v's x or y value, replace that value with the corresponding min value.
     */
    min(v: ReadonlyVector2): WritableVector2;

    /**
     * If this vector's x or y value is less than v's x or y value, replace that value with the corresponding max value.
     */
    max(v: ReadonlyVector2): WritableVector2;

    /**
     * If this vector's x or y value is greater than the max vector's x or y value, it is replaced by the corresponding value.
     * If this vector's x or y value is less than the min vector's x or y value, it is replaced by the corresponding value.
     * @param min the minimum x and y values.
     * @param max the maximum x and y values in the desired range.
     */
    clamp(min: ReadonlyVector2, max: ReadonlyVector2): WritableVector2;

    /**
     * If this vector's x or y values are greater than the max value, they are replaced by the max value.
     * If this vector's x or y values are less than the min value, they are replaced by the min value.
     * @param min the minimum value the components will be clamped to.
     * @param max the maximum value the components will be clamped to.
     */
    clampScalar(min: number, max: number): WritableVector2;

    /**
     * If this vector's length is greater than the max value, it is replaced by the max value.
     * If this vector's length is less than the min value, it is replaced by the min value.
     * @param min the minimum value the length will be clamped to.
     * @param max the maximum value the length will be clamped to.
     */
    clampLength(min: number, max: number): WritableVector2;

    /**
     * The components of the vector are rounded down to the nearest integer value.
     */
    floor(): WritableVector2;

    /**
     * The x and y components of the vector are rounded up to the nearest integer value.
     */
    ceil(): WritableVector2;

    /**
     * The components of the vector are rounded to the nearest integer value.
     */
    round(): WritableVector2;

    /**
     * The components of the vector are rounded towards zero (up if negative, down if positive) to an integer value.
     */
    roundToZero(): WritableVector2;

    /**
     * Inverts this vector.
     */
    negate(): WritableVector2;

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
     * @deprecated Use {@link Vector2#manhattanLength .manhattanLength()} instead.
     */
    lengthManhattan(): number;

    /**
     * Computes the Manhattan length of this vector.
     *
     * see {@link http://en.wikipedia.org/wiki/Taxicab_geometry|Wikipedia: Taxicab Geometry}
     */
    manhattanLength(): number;

    /**
     * Normalizes this vector.
     */
    normalize(): WritableVector2;

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
     * @deprecated Use {@link Vector2#manhattanDistanceTo .manhattanDistanceTo()} instead.
     */
    distanceToManhattan(v: ReadonlyVector2): number;

    /**
     * Computes the Manhattan length (distance) from this vector to the given vector v
     *
     * see {@link http://en.wikipedia.org/wiki/Taxicab_geometry|Wikipedia: Taxicab Geometry}
     */
    manhattanDistanceTo(v: ReadonlyVector2): number;

    /**
     * Normalizes this vector and multiplies it by l.
     */
    setLength(length: number): WritableVector2;

    /**
     * Linearly interpolates between this vector and v, where alpha is the distance along the line - alpha = 0 will be this vector, and alpha = 1 will be v.
     * @param v vector to interpolate towards.
     * @param alpha interpolation factor in the closed interval [0, 1].
     */
    lerp(v: ReadonlyVector2, alpha: number): WritableVector2;

    /**
     * Sets this vector to be the vector linearly interpolated between v1 and v2 where alpha is the distance along the line connecting the two vectors - alpha = 0 will be v1, and alpha = 1 will be v2.
     * @param v1 the starting vector.
     * @param v2 vector to interpolate towards.
     * @param alpha interpolation factor in the closed interval [0, 1].
     */
    lerpVectors(v1: ReadonlyVector2, v2: ReadonlyVector2, alpha: number): WritableVector2;

    /**
     * Checks for strict equality of this vector and v.
     */
    equals(v: ReadonlyVector2): boolean;

    /**
     * Sets this vector's x and y value from the provided array or array-like.
     * @param array the source array or array-like.
     * @param offset (optional) offset into the array. Default is 0.
     */
    fromArray(array: number[] | ArrayLike<number>, offset?: number): WritableVector2;

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

    /**
     * Sets this vector's x and y values from the attribute.
     * @param attribute the source attribute.
     * @param index index in the attribute.
     */
    fromBufferAttribute(attribute: BufferAttribute, index: number): WritableVector2;

    /**
     * Rotates the vector around center by angle radians.
     * @param center the point around which to rotate.
     * @param angle the angle to rotate, in radians.
     */
    rotateAround(center: ReadonlyVector2, angle: number): WritableVector2;

    /**
     * Sets this vector's x and y from Math.random
     */
    random(): WritableVector2;
};
