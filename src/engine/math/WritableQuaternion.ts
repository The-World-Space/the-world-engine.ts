import { Quaternion } from "three";
import { ReadOnlyEuler } from "./ReadOnlyEuler";
import { ReadOnlyMatrix4 } from "./ReadOnlyMatrix4";
import { ReadOnlyQuaternion } from "./ReadOnlyQuaternion";
import { ReadOnlyVector3 } from "./ReadOnlyVector3";

export type WritableQuaternion = {
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
     * @default 1
     */
    w: number;
    readonly isQuaternion: true;

    /**
     * Sets values of this quaternion.
     */
    set(x: number, y: number, z: number, w: number): WritableQuaternion;

    /**
     * Clones this quaternion.
     */
    clone(): Quaternion;

    /**
     * Copies values of q to this quaternion.
     */
    copy(q: ReadOnlyQuaternion): WritableQuaternion;

    /**
     * Sets this quaternion from rotation specified by Euler angles.
     */
    setFromEuler(euler: ReadOnlyEuler, update?: boolean): WritableQuaternion;

    /**
     * Sets this quaternion from rotation specified by axis and angle.
     * Adapted from http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm.
     * Axis have to be normalized, angle is in radians.
     */
    setFromAxisAngle(axis: ReadOnlyVector3, angle: number): WritableQuaternion;

    /**
     * Sets this quaternion from rotation component of m. Adapted from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm.
     */
    setFromRotationMatrix(m: ReadOnlyMatrix4): WritableQuaternion;
    setFromUnitVectors(vFrom: ReadOnlyVector3, vTo: ReadOnlyVector3): WritableQuaternion;
    angleTo(q: ReadOnlyQuaternion): number;
    rotateTowards(q: ReadOnlyQuaternion, step: number): WritableQuaternion;

    identity(): WritableQuaternion;

    /**
     * Inverts this quaternion.
     */
    invert(): WritableQuaternion;

    conjugate(): WritableQuaternion;
    dot(v: ReadOnlyQuaternion): number;
    lengthSq(): number;

    /**
     * Computes length of this quaternion.
     */
    length(): number;

    /**
     * Normalizes this quaternion.
     */
    normalize(): WritableQuaternion;

    /**
     * Multiplies this quaternion by b.
     */
    multiply(q: ReadOnlyQuaternion): WritableQuaternion;
    premultiply(q: ReadOnlyQuaternion): WritableQuaternion;

    /**
     * Sets this quaternion to a x b
     * Adapted from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm.
     */
    multiplyQuaternions(a: ReadOnlyQuaternion, b: ReadOnlyQuaternion): WritableQuaternion;

    slerp(qb: ReadOnlyQuaternion, t: number): WritableQuaternion;
    slerpQuaternions(qa: ReadOnlyQuaternion, qb: ReadOnlyQuaternion, t: number): WritableQuaternion;
    equals(v: ReadOnlyQuaternion): boolean;

    /**
     * Sets this quaternion's x, y, z and w value from the provided array or array-like.
     * @param array the source array or array-like.
     * @param offset (optional) offset into the array. Default is 0.
     */
    fromArray(array: number[] | ArrayLike<number>, offset?: number): WritableQuaternion;

    /**
     * Returns an array [x, y, z, w], or copies x, y, z and w into the provided array.
     * @param array (optional) array to store the quaternion to. If this is not provided, a new array will be created.
     * @param offset (optional) optional offset into the array.
     * @return The created or provided array.
     */
    toArray(array?: number[], offset?: number): number[];

    /**
     * Copies x, y, z and w into the provided array-like.
     * @param array array-like to store the quaternion to.
     * @param offset (optional) optional offset into the array.
     * @return The provided array-like.
     */
    toArray(array: ArrayLike<number>, offset?: number): ArrayLike<number>;

    _onChange(callback: () => void): WritableQuaternion;
    _onChangeCallback: () => void;

    random(): WritableQuaternion;
};
