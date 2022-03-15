import { Matrix4, Matrix4Tuple, Quaternion, Vector3 } from "three";

export type ReadonlyMatrix4 = {
    /**
     * Array with matrix values.
     * @default [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
     */
    readonly elements: readonly number[];

    clone(): Matrix4;
    
    /**
     * Copies the rotation component of the supplied matrix m into this matrix rotation component.
     */
    extractRotation(m: Matrix4): Matrix4;

    /**
     * Computes determinant of this matrix.
     * Based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
     */
    determinant(): number;

    getMaxScaleOnAxis(): number;

    /**
     * Decomposes this matrix into it's position, quaternion and scale components.
     */
    decompose(translation: Vector3, rotation: Quaternion, scale: Vector3): Matrix4;

    equals(matrix: ReadonlyMatrix4): boolean;

    /**
     * Returns an array with the values of this matrix, or copies them into the provided array.
     * @param array (optional) array to store the matrix to. If this is not provided, a new array will be created.
     * @param offset (optional) optional offset into the array.
     * @return The created or provided array.
     */
    toArray(array?: number[], offset?: number): number[];
    toArray(array?: Matrix4Tuple, offset?: 0): Matrix4Tuple;

    /**
     * Copies he values of this matrix into the provided array-like.
     * @param array array-like to store the matrix to.
     * @param offset (optional) optional offset into the array-like.
     * @return The provided array-like.
     */
    toArray(array?: ArrayLike<number>, offset?: number): ArrayLike<number>;
};
