import { Vector3, Vector3Tuple } from "three/src/Three";

export type ReadonlyVector3 = {
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
    readonly isVector3: true;

    getComponent(index: number): number;

    /**
     * Clones this vector.
     */
    clone(): Vector3;

    /**
     * Computes dot product of this vector and v.
     */
    dot(v: ReadonlyVector3): number;

    /**
     * Computes squared length of this vector.
     */
    lengthSq(): number;

    /**
     * Computes length of this vector.
     */
    length(): number;

    angleTo(v: ReadonlyVector3): number;

    /**
     * Computes distance of this vector to v.
     */
    distanceTo(v: ReadonlyVector3): number;

    /**
     * Computes squared distance of this vector to v.
     */
    distanceToSquared(v: ReadonlyVector3): number;

    /**
     * Checks for strict equality of this vector and v.
     */
    equals(v: ReadonlyVector3): boolean;

    /**
     * Returns an array [x, y, z], or copies x, y and z into the provided array.
     * @param array (optional) array to store the vector to. If this is not provided, a new array will be created.
     * @param offset (optional) optional offset into the array.
     * @return The created or provided array.
     */
    toArray(array?: number[], offset?: number): number[];
    toArray(array?: Vector3Tuple, offset?: 0): Vector3Tuple;

    /**
     * Copies x, y and z into the provided array-like.
     * @param array array-like to store the vector to.
     * @param offset (optional) optional offset into the array-like.
     * @return The provided array-like.
     */
    toArray(array: ArrayLike<number>, offset?: number): ArrayLike<number>;
};
