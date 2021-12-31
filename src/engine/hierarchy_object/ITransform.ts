import { Euler, Matrix3, Matrix4, Quaternion, Vector3 } from "three";
import { GameObject } from "./GameObject";

/**
 * safe way to get transform of GameObject
 */
export interface ITransform {
	/**
     * Get gameObject of this transform.
     */
	gameObject: GameObject;

	/**
	 * Object"s parent in the scene graph.
	 * @default null
	 */
	parentTransform: ITransform | null;

	/**
	 * Array with object"s children.
	 * @default []
	 */
	childrenTransform: ITransform[];

	/**
	 * Up direction.
	 * @default THREE.Object3D.DefaultUp.clone()
	 */
	up: Vector3;

	/**
	 * Object"s local position.
	 * @default new THREE.Vector3()
	 */
	readonly position: Vector3;

	/**
	 * Object"s local rotation (Euler angles), in radians.
	 * @default new THREE.Euler()
	 */
	readonly rotation: Euler;

	/**
	 * Object"s local rotation as a Quaternion.
	 * @default new THREE.Quaternion()
	 */
	readonly quaternion: Quaternion;

	/**
	 * Object"s local scale.
	 * @default new THREE.Vector3()
	 */
	readonly scale: Vector3;

	/**
	 * @default new THREE.Matrix4()
	 */
	readonly modelViewMatrix: Matrix4;

	/**
	 * @default new THREE.Matrix3()
	 */
	readonly normalMatrix: Matrix3;

	/**
	 * Local transform.
	 * @default new THREE.Matrix4()
	 */
	matrix: Matrix4;

	/**
	 * The global transform of the object. If the Object3d has no parent, then it"s identical to the local transform.
	 * @default new THREE.Matrix4()
	 */
	matrixWorld: Matrix4;

	/**
	 * When this is set, it calculates the matrix of position, (rotation or quaternion) and scale every frame and also
	 * recalculates the matrixWorld property.
	 * @default THREE.Object3D.DefaultMatrixAutoUpdate
	 */
	matrixAutoUpdate: boolean;

	/**
	 * When this is set, it calculates the matrixWorld in that frame and resets this property to false.
	 * @default false
	 */
	matrixWorldNeedsUpdate: boolean;

	foreachChild(callback: (transform: ITransform) => void): void;

	/**
	 * This updates the position, rotation and scale with the matrix.
	 */
	applyMatrix4(matrix: Matrix4): void;

	applyQuaternion(quaternion: Quaternion): this;

	setRotationFromAxisAngle(axis: Vector3, angle: number): void;

	setRotationFromEuler(euler: Euler): void;

	setRotationFromMatrix(m: Matrix4): void;

	setRotationFromQuaternion(q: Quaternion): void;

	/**
	 * Rotate an object along an axis in object space. The axis is assumed to be normalized.
	 * @param axis	A normalized vector in object space.
	 * @param angle	The angle in radians.
	 */
	rotateOnAxis(axis: Vector3, angle: number): this;

	/**
	 * Rotate an object along an axis in world space. The axis is assumed to be normalized. Method Assumes no rotated parent.
	 * @param axis	A normalized vector in object space.
	 * @param angle	The angle in radians.
	 */
	rotateOnWorldAxis(axis: Vector3, angle: number): this;

	/**
	 *
	 * @param angle
	 */
	rotateX(angle: number): this;

	/**
	 *
	 * @param angle
	 */
	rotateY(angle: number): this;

	/**
	 *
	 * @param angle
	 */
	rotateZ(angle: number): this;

	/**
	 * @param axis	A normalized vector in object space.
	 * @param distance	The distance to translate.
	 */
	translateOnAxis(axis: Vector3, distance: number): this;

	/**
	 * Translates object along x axis by distance.
	 * @param distance Distance.
	 */
	translateX(distance: number): this;

	/**
	 * Translates object along y axis by distance.
	 * @param distance Distance.
	 */
	translateY(distance: number): this;

	/**
	 * Translates object along z axis by distance.
	 * @param distance Distance.
	 */
	translateZ(distance: number): this;

	/**
	 * Updates the vector from local space to world space.
	 * @param vector A local vector.
	 */
	localToWorld(vector: Vector3): Vector3;

	/**
	 * Updates the vector from world space to local space.
	 * @param vector A world vector.
	 */
	worldToLocal(vector: Vector3): Vector3;

	/**
	 * Rotates object to face point in space.
	 * @param vector A world vector to look at.
	 */
	lookAt(vector: Vector3 | number, y?: number, z?: number): void;

	getWorldPosition(target: Vector3): Vector3;
	getWorldQuaternion(target: Quaternion): Quaternion;
	getWorldScale(target: Vector3): Vector3;
	getWorldDirection(target: Vector3): Vector3;

	/**
	 * Updates local transform.
	 */
	updateMatrix(): void;

	/**
	 * Updates global transform of the object and its children.
	 */
	updateMatrixWorld(force?: boolean): void;

	updateWorldMatrix(updateParents: boolean, updateChildren: boolean): void;
}
