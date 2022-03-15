import { BufferAttribute, Camera, Cylindrical, InterleavedBufferAttribute, Spherical, Vector3, Vector3Tuple } from "three/src/Three";
import { ReadonlyEuler } from "./ReadonlyEuler";
import { ReadonlyMatrix3 } from "./ReadonlyMatrix3";
import { ReadonlyMatrix4 } from "./ReadonlyMatrix4";
import { ReadonlyQuaternion } from "./ReadonlyQuaternion";
import { ReadonlyVector3 } from "./ReadonlyVector3";

export type WritableVector3 = {
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
    readonly isVector3: true;

    /**
     * Sets value of this vector.
     */
    set(x: number, y: number, z: number): WritableVector3;

    /**
     * Sets all values of this vector.
     */
    setScalar(scalar: number): WritableVector3;

    /**
     * Sets x value of this vector.
     */
    setX(x: number): WritableVector3;

    /**
     * Sets y value of this vector.
     */
    setY(y: number): WritableVector3;

    /**
     * Sets z value of this vector.
     */
    setZ(z: number): WritableVector3;

    setComponent(index: number, value: number): WritableVector3;

    getComponent(index: number): number;

    /**
     * Clones this vector.
     */
    clone(): Vector3;

    /**
     * Copies value of v to this vector.
     */
    copy(v: ReadonlyVector3): WritableVector3;

    /**
     * Adds v to this vector.
     */
    add(v: ReadonlyVector3): WritableVector3;

    addScalar(s: number): WritableVector3;

    addScaledVector(v: ReadonlyVector3, s: number): WritableVector3;

    /**
     * Sets this vector to a + b.
     */
    addVectors(a: ReadonlyVector3, b: ReadonlyVector3): WritableVector3;

    /**
     * Subtracts v from this vector.
     */
    sub(a: ReadonlyVector3): WritableVector3;

    subScalar(s: number): WritableVector3;

    /**
     * Sets this vector to a - b.
     */
    subVectors(a: ReadonlyVector3, b: ReadonlyVector3): WritableVector3;

    multiply(v: ReadonlyVector3): WritableVector3;

    /**
     * Multiplies this vector by scalar s.
     */
    multiplyScalar(s: number): WritableVector3;

    multiplyVectors(a: ReadonlyVector3, b: ReadonlyVector3): WritableVector3;

    applyEuler(euler: ReadonlyEuler): WritableVector3;

    applyAxisAngle(axis: ReadonlyVector3, angle: number): WritableVector3;

    applyMatrix3(m: ReadonlyMatrix3): WritableVector3;

    applyNormalMatrix(m: ReadonlyMatrix3): WritableVector3;

    applyMatrix4(m: ReadonlyMatrix4): WritableVector3;

    applyQuaternion(q: ReadonlyQuaternion): WritableVector3;

    project(camera: Camera): WritableVector3;

    unproject(camera: Camera): WritableVector3;

    transformDirection(m: ReadonlyMatrix4): WritableVector3;

    divide(v: ReadonlyVector3): WritableVector3;

    /**
     * Divides this vector by scalar s.
     * Set vector to ( 0, 0, 0 ) if s == 0.
     */
    divideScalar(s: number): WritableVector3;

    min(v: ReadonlyVector3): WritableVector3;

    max(v: ReadonlyVector3): WritableVector3;

    clamp(min: ReadonlyVector3, max: ReadonlyVector3): WritableVector3;

    clampScalar(min: number, max: number): WritableVector3;

    clampLength(min: number, max: number): WritableVector3;

    floor(): WritableVector3;

    ceil(): WritableVector3;

    round(): WritableVector3;

    roundToZero(): WritableVector3;

    /**
     * Inverts this vector.
     */
    negate(): WritableVector3;

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

    /**
     * Computes the Manhattan length of this vector.
     *
     * see {@link http://en.wikipedia.org/wiki/Taxicab_geometry|Wikipedia: Taxicab Geometry}
     */
    manhattanLength(): number;

    /**
     * Computes the Manhattan length (distance) from this vector to the given vector v
     *
     * see {@link http://en.wikipedia.org/wiki/Taxicab_geometry|Wikipedia: Taxicab Geometry}
     */
    manhattanDistanceTo(v: ReadonlyVector3): number;

    /**
     * Normalizes this vector.
     */
    normalize(): WritableVector3;

    /**
     * Normalizes this vector and multiplies it by l.
     */
    setLength(l: number): WritableVector3;
    lerp(v: ReadonlyVector3, alpha: number): WritableVector3;

    lerpVectors(v1: ReadonlyVector3, v2: ReadonlyVector3, alpha: number): WritableVector3;

    /**
     * Sets this vector to cross product of itself and v.
     */
    cross(a: ReadonlyVector3): WritableVector3;

    /**
     * Sets this vector to cross product of a and b.
     */
    crossVectors(a: ReadonlyVector3, b: ReadonlyVector3): WritableVector3;
    projectOnVector(v: ReadonlyVector3): WritableVector3;
    projectOnPlane(planeNormal: ReadonlyVector3): WritableVector3;
    reflect(vector: ReadonlyVector3): WritableVector3;
    angleTo(v: ReadonlyVector3): number;

    /**
     * Computes distance of this vector to v.
     */
    distanceTo(v: ReadonlyVector3): number;

    /**
     * Computes squared distance of this vector to v.
     */
    distanceToSquared(v: ReadonlyVector3): number;

    setFromSpherical(s: Spherical): WritableVector3;
    setFromSphericalCoords(r: number, phi: number, theta: number): WritableVector3;
    setFromCylindrical(s: Cylindrical): WritableVector3;
    setFromCylindricalCoords(radius: number, theta: number, y: number): WritableVector3;
    setFromMatrixPosition(m: ReadonlyMatrix4): WritableVector3;
    setFromMatrixScale(m: ReadonlyMatrix4): WritableVector3;
    setFromMatrixColumn(matrix: ReadonlyMatrix4, index: number): WritableVector3;
    setFromMatrix3Column(matrix: ReadonlyMatrix3, index: number): WritableVector3;

    /**
     * Sets this vector's {@link x}, {@link y} and {@link z} components from the x, y, and z components of the specified {@link Euler Euler Angle}.
     */
    setFromEuler(e: ReadonlyEuler): WritableVector3;

    /**
     * Checks for strict equality of this vector and v.
     */
    equals(v: ReadonlyVector3): boolean;

    /**
     * Sets this vector's x, y and z value from the provided array or array-like.
     * @param array the source array or array-like.
     * @param offset (optional) offset into the array. Default is 0.
     */
    fromArray(array: number[] | ArrayLike<number>, offset?: number): WritableVector3;

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

    fromBufferAttribute(attribute: BufferAttribute | InterleavedBufferAttribute, index: number): WritableVector3;

    /**
     * Sets this vector's x, y and z from Math.random
     */
    random(): WritableVector3;

    randomDirection(): WritableVector3;
};
