import { Matrix4, Matrix4Tuple } from "three/src/math/Matrix4";
import { Quaternion } from "three/src/math/Quaternion";
import { Vector3 } from "three/src/math/Vector3";
import { ReadonlyEuler } from "./ReadonlyEuler";
import { ReadonlyMatrix3 } from "./ReadonlyMatrix3";
import { ReadonlyMatrix4 } from "./ReadonlyMatrix4";
import { ReadonlyQuaternion } from "./ReadonlyQuaternion";
import { ReadonlyVector3 } from "./ReadonlyVector3";

export type WritableMatrix4 = {
    /**
     * Array with matrix values.
     * @default [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]
     */
    elements: number[];

    /**
     * Sets all fields of this matrix.
     */
    set(
        n11: number,
        n12: number,
        n13: number,
        n14: number,
        n21: number,
        n22: number,
        n23: number,
        n24: number,
        n31: number,
        n32: number,
        n33: number,
        n34: number,
        n41: number,
        n42: number,
        n43: number,
        n44: number,
    ): WritableMatrix4;

    /**
     * Resets this matrix to identity.
     */
    identity(): WritableMatrix4;
    clone(): Matrix4;
    copy(m: Matrix4): WritableMatrix4;
    copyPosition(m: Matrix4): WritableMatrix4;
    extractBasis(xAxis: Vector3, yAxis: Vector3, zAxis: Vector3): WritableMatrix4;
    makeBasis(xAxis: ReadonlyVector3, yAxis: ReadonlyVector3, zAxis: ReadonlyVector3): WritableMatrix4;

    /**
     * Copies the rotation component of the supplied matrix m into this matrix rotation component.
     */
    extractRotation(m: Matrix4): WritableMatrix4;
    makeRotationFromEuler(euler: ReadonlyEuler): WritableMatrix4;
    makeRotationFromQuaternion(q: ReadonlyQuaternion): WritableMatrix4;
    /**
     * Constructs a rotation matrix, looking from eye towards center with defined up vector.
     */
    lookAt(eye: ReadonlyVector3, target: ReadonlyVector3, up: ReadonlyVector3): WritableMatrix4;

    /**
     * Multiplies this matrix by m.
     */
    multiply(m: ReadonlyMatrix4): WritableMatrix4;

    premultiply(m: ReadonlyMatrix4): WritableMatrix4;

    /**
     * Sets this matrix to a x b.
     */
    multiplyMatrices(a: ReadonlyMatrix4, b: ReadonlyMatrix4): WritableMatrix4;

    /**
     * Multiplies this matrix by s.
     */
    multiplyScalar(s: number): WritableMatrix4;

    /**
     * Computes determinant of this matrix.
     * Based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
     */
    determinant(): number;

    /**
     * Transposes this matrix.
     */
    transpose(): WritableMatrix4;

    /**
     * Sets the position component for this matrix from vector v.
     */
    setPosition(v: ReadonlyVector3 | number, y?: number, z?: number): WritableMatrix4;

    /**
     * Inverts this matrix.
     */
    invert(): WritableMatrix4;

    /**
     * Multiplies the columns of this matrix by vector v.
     */
    scale(v: ReadonlyVector3): WritableMatrix4;

    getMaxScaleOnAxis(): number;
    /**
     * Sets this matrix as translation transform.
     */
    makeTranslation(x: number, y: number, z: number): WritableMatrix4;

    /**
     * Sets this matrix as rotation transform around x axis by theta radians.
     *
     * @param theta Rotation angle in radians.
     */
    makeRotationX(theta: number): WritableMatrix4;

    /**
     * Sets this matrix as rotation transform around y axis by theta radians.
     *
     * @param theta Rotation angle in radians.
     */
    makeRotationY(theta: number): WritableMatrix4;

    /**
     * Sets this matrix as rotation transform around z axis by theta radians.
     *
     * @param theta Rotation angle in radians.
     */
    makeRotationZ(theta: number): WritableMatrix4;

    /**
     * Sets this matrix as rotation transform around axis by angle radians.
     * Based on http://www.gamedev.net/reference/articles/article1199.asp.
     *
     * @param axis Rotation axis.
     * @param theta Rotation angle in radians.
     */
    makeRotationAxis(axis: ReadonlyVector3, angle: number): WritableMatrix4;

    /**
     * Sets this matrix as scale transform.
     */
    makeScale(x: number, y: number, z: number): WritableMatrix4;

    /**
     * Sets this matrix as shear transform.
     */
    makeShear(xy: number, xz: number, yx: number, yz: number, zx: number, zy: number): WritableMatrix4;

    /**
     * Sets this matrix to the transformation composed of translation, rotation and scale.
     */
    compose(translation: ReadonlyVector3, rotation: ReadonlyQuaternion, scale: ReadonlyVector3): WritableMatrix4;

    /**
     * Decomposes this matrix into it's position, quaternion and scale components.
     */
    decompose(translation: Vector3, rotation: Quaternion, scale: Vector3): WritableMatrix4;

    /**
     * Creates a frustum matrix.
     */
    makePerspective(left: number, right: number, bottom: number, top: number, near: number, far: number): WritableMatrix4;

    /**
     * Creates a perspective projection matrix.
     */
    makePerspective(fov: number, aspect: number, near: number, far: number): WritableMatrix4;

    /**
     * Creates an orthographic projection matrix.
     */
    makeOrthographic(left: number, right: number, top: number, bottom: number, near: number, far: number): WritableMatrix4;
    equals(matrix: ReadonlyMatrix4): boolean;

    /**
     * Sets the values of this matrix from the provided array or array-like.
     * @param array the source array or array-like.
     * @param offset (optional) offset into the array-like. Default is 0.
     */
    fromArray(array: number[] | ArrayLike<number>, offset?: number): WritableMatrix4;

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

    /**
     * Set the upper 3x3 elements of this matrix to the values of the Matrix3 m.
     */
    setFromMatrix3(m: ReadonlyMatrix3): WritableMatrix4;
};
