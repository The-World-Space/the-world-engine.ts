import type { Quaternion } from "three/src/Three";

import type { ReadonlyEuler } from "./ReadonlyEuler";
import type { ReadonlyMatrix4 } from "./ReadonlyMatrix4";
import type { ReadonlyQuaternion } from "./ReadonlyQuaternion";
import type { ReadonlyVector3 } from "./ReadonlyVector3";

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
    copy(q: ReadonlyQuaternion): WritableQuaternion;

    /**
     * Sets this quaternion from rotation specified by Euler angles.
     */
    setFromEuler(euler: ReadonlyEuler, update?: boolean): WritableQuaternion;

    /**
     * Sets this quaternion from rotation specified by axis and angle.
     * Adapted from http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm.
     * Axis have to be normalized, angle is in radians.
     */
    setFromAxisAngle(axis: ReadonlyVector3, angle: number): WritableQuaternion;

    /**
     * Sets this quaternion from rotation component of m. Adapted from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm.
     */
    setFromRotationMatrix(m: ReadonlyMatrix4): WritableQuaternion;
    setFromUnitVectors(vFrom: ReadonlyVector3, vTo: ReadonlyVector3): WritableQuaternion;
    angleTo(q: ReadonlyQuaternion): number;
    rotateTowards(q: ReadonlyQuaternion, step: number): WritableQuaternion;

    identity(): WritableQuaternion;

    /**
     * Inverts this quaternion.
     */
    invert(): WritableQuaternion;

    conjugate(): WritableQuaternion;
    dot(v: ReadonlyQuaternion): number;
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
    multiply(q: ReadonlyQuaternion): WritableQuaternion;
    premultiply(q: ReadonlyQuaternion): WritableQuaternion;

    /**
     * Sets this quaternion to a x b
     * Adapted from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm.
     */
    multiplyQuaternions(a: ReadonlyQuaternion, b: ReadonlyQuaternion): WritableQuaternion;

    slerp(qb: ReadonlyQuaternion, t: number): WritableQuaternion;
    slerpQuaternions(qa: ReadonlyQuaternion, qb: ReadonlyQuaternion, t: number): WritableQuaternion;
    equals(v: ReadonlyQuaternion): boolean;

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
    
    /**
     * This method defines the serialization result of Quaternion.
     * @return The numerical elements of this quaternion in an array of format [x, y, z, w].
     */
    toJSON(): [number, number, number, number];

    // eslint-disable-next-line @typescript-eslint/naming-convention
    _onChange(callback: () => void): WritableQuaternion;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _onChangeCallback: () => void;

    random(): WritableQuaternion;
};
