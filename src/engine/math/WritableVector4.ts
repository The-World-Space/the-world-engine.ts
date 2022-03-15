import { BufferAttribute, Vector4, Vector4Tuple } from "three/src/Three";
import { ReadonlyMatrix4 } from "./ReadonlyMatrix4";
import { ReadonlyQuaternion } from "./ReadonlyQuaternion";
import { ReadonlyVector4 } from "./ReadonlyVector4";

export type WritableVector4 = {
    /**
     * @default 0
     */
    x: number;

    /**
     * @default 0
     */
    y: number;

    /**
     * @default 0
     */
    z: number;

    /**
     * @default 0
     */
    w: number;

    width: number;
    height: number;
    readonly isVector4: true;

    /**
     * Sets value of this vector.
     */
    set(x: number, y: number, z: number, w: number): WritableVector4;

    /**
     * Sets all values of this vector.
     */
    setScalar(scalar: number): WritableVector4;

    /**
     * Sets X component of this vector.
     */
    setX(x: number): WritableVector4;

    /**
     * Sets Y component of this vector.
     */
    setY(y: number): WritableVector4;

    /**
     * Sets Z component of this vector.
     */
    setZ(z: number): WritableVector4;

    /**
     * Sets w component of this vector.
     */
    setW(w: number): WritableVector4;

    setComponent(index: number, value: number): WritableVector4;

    getComponent(index: number): number;

    /**
     * Clones this vector.
     */
    clone(): Vector4;

    /**
     * Copies value of v to this vector.
     */
    copy(v: ReadonlyVector4): WritableVector4;

    /**
     * Adds v to this vector.
     */
    add(v: ReadonlyVector4): WritableVector4;

    addScalar(scalar: number): WritableVector4;

    /**
     * Sets this vector to a + b.
     */
    addVectors(a: ReadonlyVector4, b: ReadonlyVector4): WritableVector4;

    addScaledVector(v: ReadonlyVector4, s: number): WritableVector4;
    /**
     * Subtracts v from this vector.
     */
    sub(v: ReadonlyVector4): WritableVector4;

    subScalar(s: number): WritableVector4;

    /**
     * Sets this vector to a - b.
     */
    subVectors(a: ReadonlyVector4, b: ReadonlyVector4): WritableVector4;

    multiply(v: ReadonlyVector4): WritableVector4;

    /**
     * Multiplies this vector by scalar s.
     */
    multiplyScalar(s: number): WritableVector4;

    applyMatrix4(m: ReadonlyMatrix4): WritableVector4;

    /**
     * Divides this vector by scalar s.
     * Set vector to ( 0, 0, 0 ) if s == 0.
     */
    divideScalar(s: number): WritableVector4;

    /**
     * http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm
     * @param q is assumed to be normalized
     */
    setAxisAngleFromQuaternion(q: ReadonlyQuaternion): WritableVector4;

    /**
     * http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm
     * @param m assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
     */
    setAxisAngleFromRotationMatrix(m: ReadonlyMatrix4): WritableVector4;

    min(v: ReadonlyMatrix4): WritableVector4;
    max(v: ReadonlyMatrix4): WritableVector4;
    clamp(min: ReadonlyMatrix4, max: ReadonlyMatrix4): WritableVector4;
    clampScalar(min: number, max: number): WritableVector4;
    floor(): WritableVector4;
    ceil(): WritableVector4;
    round(): WritableVector4;
    roundToZero(): WritableVector4;

    /**
     * Inverts this vector.
     */
    negate(): WritableVector4;

    /**
     * Computes dot product of this vector and v.
     */
    dot(v: ReadonlyMatrix4): number;

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
     * Normalizes this vector.
     */
    normalize(): WritableVector4;
    /**
     * Normalizes this vector and multiplies it by l.
     */
    setLength(length: number): WritableVector4;

    /**
     * Linearly interpolate between this vector and v with alpha factor.
     */
    lerp(v: ReadonlyMatrix4, alpha: number): WritableVector4;

    lerpVectors(v1: ReadonlyMatrix4, v2: ReadonlyMatrix4, alpha: number): WritableVector4;

    /**
     * Checks for strict equality of this vector and v.
     */
    equals(v: ReadonlyMatrix4): boolean;

    /**
     * Sets this vector's x, y, z and w value from the provided array or array-like.
     * @param array the source array or array-like.
     * @param offset (optional) offset into the array. Default is 0.
     */
    fromArray(array: number[] | ArrayLike<number>, offset?: number): WritableVector4;

    /**
     * Returns an array [x, y, z, w], or copies x, y, z and w into the provided array.
     * @param array (optional) array to store the vector to. If this is not provided, a new array will be created.
     * @param offset (optional) optional offset into the array.
     * @return The created or provided array.
     */
    toArray(array?: number[], offset?: number): number[];
    toArray(array?: Vector4Tuple, offset?: 0): Vector4Tuple;

    /**
     * Copies x, y, z and w into the provided array-like.
     * @param array array-like to store the vector to.
     * @param offset (optional) optional offset into the array-like.
     * @return The provided array-like.
     */
    toArray(array: ArrayLike<number>, offset?: number): ArrayLike<number>;

    fromBufferAttribute(attribute: BufferAttribute, index: number): WritableVector4;

    /**
     * Sets this vector's x, y, z and w from Math.random
     */
    random(): WritableVector4;
};
