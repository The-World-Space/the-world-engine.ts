import { Matrix3, Matrix3Tuple, Matrix4, Vector3 } from "three/src/Three";

import { ReadonlyMatrix3 } from "./ReadonlyMatrix3";
import { ReadonlyMatrix4 } from "./ReadonlyMatrix4";

export type WritableMatrix3 = {
    /**
     * Array with matrix values.
     * @default [1, 0, 0, 0, 1, 0, 0, 0, 1]
     */
    elements: number[];

    set(
        n11: number,
        n12: number,
        n13: number,
        n21: number,
        n22: number,
        n23: number,
        n31: number,
        n32: number,
        n33: number,
    ): WritableMatrix3;
    identity(): WritableMatrix3;
    clone(): Matrix3;
    copy(m: ReadonlyMatrix3): WritableMatrix3;
    extractBasis(xAxis: Vector3, yAxis: Vector3, zAxis: Vector3): WritableMatrix3;
    setFromMatrix4(m: ReadonlyMatrix4): WritableMatrix3;
    multiplyScalar(s: number): WritableMatrix3;
    determinant(): number;

    /**
     * Inverts this matrix in place.
     */
    invert(): WritableMatrix3;

    /**
     * Transposes this matrix in place.
     */
    transpose(): WritableMatrix3;
    getNormalMatrix(matrix4: Matrix4): WritableMatrix3;

    /**
     * Transposes this matrix into the supplied array r, and returns itself.
     */
    transposeIntoArray(r: number[]): WritableMatrix3;

    setUvTransform(tx: number, ty: number, sx: number, sy: number, rotation: number, cx: number, cy: number): WritableMatrix3;

    scale(sx: number, sy: number): WritableMatrix3;

    rotate(theta: number): WritableMatrix3;

    translate(tx: number, ty: number): WritableMatrix3;

    makeTranslation(x: number, y: number): WritableMatrix3;

    makeRotation(theta: number): WritableMatrix3;

    makeScale(x: number, y: number): WritableMatrix3;

    equals(matrix: ReadonlyMatrix3): boolean;

    /**
     * Sets the values of this matrix from the provided array or array-like.
     * @param array the source array or array-like.
     * @param offset (optional) offset into the array-like. Default is 0.
     */
    fromArray(array: number[] | ArrayLike<number>, offset?: number): WritableMatrix3;

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

    /**
     * Multiplies this matrix by m.
     */
    multiply(m: ReadonlyMatrix3): WritableMatrix3;

    premultiply(m: ReadonlyMatrix3): WritableMatrix3;

    /**
     * Sets this matrix to a x b.
     */
    multiplyMatrices(a: ReadonlyMatrix3, b: ReadonlyMatrix3): WritableMatrix3;
};
