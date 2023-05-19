import type { Quaternion } from "three/src/Three";

export type ReadonlyQuaternion = {
    /**
     * @default 0
     */
    readonly x: number;

    /**
     * @default 0
     */
    readonly y: number;

    /**
     * @default 0
     */
    readonly z: number;

    /**
     * @default 1
     */
    readonly w: number;
    readonly isQuaternion: true;

    /**
     * Clones this quaternion.
     */
    clone(): Quaternion;

    angleTo(q: ReadonlyQuaternion): number;
    dot(v: ReadonlyQuaternion): number;
    lengthSq(): number;

    /**
     * Computes length of this quaternion.
     */
    length(): number;

    equals(v: ReadonlyQuaternion): boolean;

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
};
