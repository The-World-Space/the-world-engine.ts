import { Matrix3, Matrix3Tuple, Vector3 } from "three/src/Three";

export type ReadonlyMatrix3 = {
    /**
     * Array with matrix values.
     * @default [1, 0, 0, 0, 1, 0, 0, 0, 1]
     */
    readonly elements: readonly number[];

    clone(): Matrix3;
    extractBasis(xAxis: Vector3, yAxis: Vector3, zAxis: Vector3): Matrix3;
    determinant(): number;
    equals(matrix: ReadonlyMatrix3): boolean;
    
    /**
     * Returns an array with the values of this matrix, or copies them into the provided array.
     * @param array (optional) array to store the matrix to. If this is not provided, a new array will be created.
     * @param offset (optional) optional offset into the array.
     * @return The created or provided array.
     */
    toArray(array?: number[], offset?: number): number[];
    toArray(array?: Matrix3Tuple, offset?: 0): Matrix3Tuple;

    /**
     * Copies he values of this matrix into the provided array-like.
     * @param array array-like to store the matrix to.
     * @param offset (optional) optional offset into the array-like.
     * @return The provided array-like.
     */
    toArray(array?: ArrayLike<number>, offset?: number): ArrayLike<number>;
};
