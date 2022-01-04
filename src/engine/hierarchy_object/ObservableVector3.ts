import { BufferAttribute, Camera, Cylindrical, Euler, InterleavedBufferAttribute, MathUtils, Matrix3, Matrix4, Quaternion, Spherical } from "three";

//duck typed class of THREE.Vector3
export class ObservableVector3 {
    private _x: number;
    private _y: number;
    private _z: number;
    private _onChangeCallback: () => void;

    public constructor(x = 0, y = 0, z = 0) {
		this._x = x;
		this._y = y;
		this._z = z;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this._onChangeCallback = () => {};
	}

    public onChange(callback: () => void) {
        this._onChangeCallback = callback;
    }

    public get x(): number {
        return this._x;
    }

    public set x(value: number) {
        this._x = value;
        this._onChangeCallback();
    }
    
    public get y(): number {
        return this._y;
    }

    public set y(value: number) {
        this._y = value;
        this._onChangeCallback();
    }

    public get z(): number {
        return this._z;
    }

    public set z(value: number) {
        this._z = value;
        this._onChangeCallback();
    }

	public set(x: number, y: number, z: number): ObservableVector3 {
		if (z === undefined) z = this.z; // sprite.scale.set(x,y)
		this.x = x;
		this.y = y;
		this.z = z;
		return this;
	}

	public setScalar(scalar: number): ObservableVector3 {
		this.x = scalar;
		this.y = scalar;
		this.z = scalar;
		return this;
	}

	public setX(x: number): ObservableVector3 {
		this.x = x;
		return this;
	}

	public setY(y: number): ObservableVector3 {
		this.y = y;
		return this;
	}

	public setZ(z: number): ObservableVector3 {
		this.z = z;
		return this;
	}

	public setComponent(index: number, value: number): ObservableVector3 {
		switch (index) {
			case 0: this.x = value; break;
			case 1: this.y = value; break;
			case 2: this.z = value; break;
			default: throw new Error('index is out of range: ' + index);
		}
		return this;
	}

	public getComponent(index: number): number {
		switch (index) {
			case 0: return this.x;
			case 1: return this.y;
			case 2: return this.z;
			default: throw new Error('index is out of range: ' + index);
		}
	}

	public clone(): ObservableVector3 {
        return new ObservableVector3(this.x, this.y, this.z);
    }

	public copy(v: ObservableVector3): ObservableVector3 {
		this.x = v.x;
		this.y = v.y;
		this.z = v.z;
		return this;
	}

	public add(v: ObservableVector3, w: undefined) {
		if (w !== undefined) {
			console.warn( 'THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
			return this.addVectors(v, w);
		}
		this.x += v.x;
		this.y += v.y;
		this.z += v.z;
		return this;
	}

	public addScalar(s: number): ObservableVector3 {
		this.x += s;
		this.y += s;
		this.z += s;
		return this;
	}

	public addVectors(a: ObservableVector3, b: ObservableVector3): ObservableVector3 {
		this.x = a.x + b.x;
		this.y = a.y + b.y;
		this.z = a.z + b.z;
		return this;
	}

	public addScaledVector(v: ObservableVector3, s: number): ObservableVector3 {
		this.x += v.x * s;
		this.y += v.y * s;
		this.z += v.z * s;
		return this;
	}

	public sub(v: ObservableVector3, w?: ObservableVector3): ObservableVector3 {
		if (w !== undefined) {
			console.warn( 'THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
			return this.subVectors(v, w);
		}
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	}

	public subScalar(s: number): ObservableVector3 {
		this.x -= s;
		this.y -= s;
		this.z -= s;
		return this;
	}

	public subVectors(a: ObservableVector3, b: ObservableVector3): ObservableVector3 {
		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;
		return this;
	}

	public multiply(v: ObservableVector3, w?: ObservableVector3): ObservableVector3 {
		if (w !== undefined) {
			console.warn( 'THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
			return this.multiplyVectors(v, w);
		}
		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;
		return this;
	}

	public multiplyScalar(scalar: number): ObservableVector3 {
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		return this;
	}

	public multiplyVectors(a: ObservableVector3, b: ObservableVector3): ObservableVector3 {
		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;
		return this;
	}

	public applyEuler(euler: Euler): ObservableVector3 {
		if (!(euler && euler.isEuler)) {
			console.error( 'THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order.' );
		}
		return this.applyQuaternion(_quaternion.setFromEuler(euler));
	}

	public applyAxisAngle(axis: ObservableVector3, angle: number): ObservableVector3 {
		return this.applyQuaternion(_quaternion.setFromAxisAngle(axis as any, angle));
	}

	public applyMatrix3(m: Matrix3): ObservableVector3 {
		const x = this.x, y = this.y, z = this.z;
		const e = m.elements;

		this.x = e[0] * x + e[3] * y + e[6] * z;
		this.y = e[1] * x + e[4] * y + e[7] * z;
		this.z = e[2] * x + e[5] * y + e[8] * z;

		return this;
	}

	public applyNormalMatrix(m: Matrix3): ObservableVector3 {
		return this.applyMatrix3( m ).normalize();
	}

	public applyMatrix4(m: Matrix4): ObservableVector3 {
		const x = this.x, y = this.y, z = this.z;
		const e = m.elements;

		const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

		this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
		this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
		this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;

		return this;
	}

	public applyQuaternion(q: Quaternion): ObservableVector3 {
		const x = this.x, y = this.y, z = this.z;
		const qx = q.x, qy = q.y, qz = q.z, qw = q.w;

		// calculate quat * vector
		const ix = qw * x + qy * z - qz * y;
		const iy = qw * y + qz * x - qx * z;
		const iz = qw * z + qx * y - qy * x;
		const iw = - qx * x - qy * y - qz * z;

		// calculate result * inverse quat
		this.x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
		this.y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
		this.z = iz * qw + iw * - qz + ix * - qy - iy * - qx;

		return this;
	}

	public project(camera: Camera): ObservableVector3 {
		return this.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);
	}

	public unproject(camera: Camera): ObservableVector3 {
		return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.matrixWorld);
	}

	public transformDirection(m: Matrix4): ObservableVector3 {
		// input: THREE.Matrix4 affine matrix
		// vector interpreted as a direction

		const x = this.x, y = this.y, z = this.z;
		const e = m.elements;

		this.x = e[0] * x + e[4] * y + e[8] * z;
		this.y = e[1] * x + e[5] * y + e[9] * z;
		this.z = e[2] * x + e[6] * y + e[10] * z;

		return this.normalize();
	}

	public divide(v: ObservableVector3): ObservableVector3 {
		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;

		return this;
	}

	public divideScalar(scalar: number): ObservableVector3 {
		return this.multiplyScalar(1 / scalar);
	}

	public min(v: ObservableVector3): ObservableVector3 {
		this.x = Math.min(this.x, v.x);
		this.y = Math.min(this.y, v.y);
		this.z = Math.min(this.z, v.z);
		return this;
	}

	public max(v: ObservableVector3): ObservableVector3 {
		this.x = Math.max(this.x, v.x);
		this.y = Math.max(this.y, v.y);
		this.z = Math.max(this.z, v.z);
		return this;
	}

	public clamp(min: ObservableVector3, max: ObservableVector3): ObservableVector3 {
		// assumes min < max, componentwise
		this.x = Math.max(min.x, Math.min(max.x, this.x));
		this.y = Math.max(min.y, Math.min(max.y, this.y));
		this.z = Math.max(min.z, Math.min(max.z, this.z));
		return this;
	}

	public clampScalar(minVal: number, maxVal: number): ObservableVector3 {
		this.x = Math.max(minVal, Math.min(maxVal, this.x));
		this.y = Math.max(minVal, Math.min(maxVal, this.y));
		this.z = Math.max(minVal, Math.min(maxVal, this.z));
		return this;
	}

	public clampLength(min: number, max: number): ObservableVector3 {
		const length = this.length();
		return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
	}

	public floor(): ObservableVector3 {
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
		this.z = Math.floor(this.z);
		return this;
	}

	public ceil(): ObservableVector3 {
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
		this.z = Math.ceil(this.z);
		return this;
	}

	public round(): ObservableVector3 {
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
		this.z = Math.round(this.z);
		return this;
	}

	public roundToZero(): ObservableVector3 {
		this.x = (this.x < 0) ? Math.ceil(this.x) : Math.floor(this.x);
		this.y = (this.y < 0) ? Math.ceil(this.y) : Math.floor(this.y);
		this.z = (this.z < 0) ? Math.ceil(this.z) : Math.floor(this.z);
		return this;
	}

	public negate(): ObservableVector3 {
		this.x = - this.x;
		this.y = - this.y;
		this.z = - this.z;
		return this;
	}

	public dot(v: ObservableVector3): number {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}

	// TODO lengthSquared?

	public lengthSq(): number {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}

	public length(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	public manhattanLength(): number {
		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
	}

	public normalize(): ObservableVector3 {
		return this.divideScalar(this.length() || 1);
	}

	public setLength(length: number): ObservableVector3 {
		return this.normalize().multiplyScalar(length);
	}

	public lerp(v: ObservableVector3, alpha: number): ObservableVector3 {
		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;
		this.z += ( v.z - this.z ) * alpha;
		return this;
	}

	public lerpVectors(v1: ObservableVector3, v2: ObservableVector3, alpha: number) {
		this.x = v1.x + ( v2.x - v1.x ) * alpha;
		this.y = v1.y + ( v2.y - v1.y ) * alpha;
		this.z = v1.z + ( v2.z - v1.z ) * alpha;
		return this;
	}

	public cross(v: ObservableVector3, w?: ObservableVector3): ObservableVector3 {
		if ( w !== undefined ) {
			console.warn( 'THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.' );
			return this.crossVectors( v, w );
		}
		return this.crossVectors( this, v );
	}

	public crossVectors(a: ObservableVector3, b: ObservableVector3): ObservableVector3 {
		const ax = a.x, ay = a.y, az = a.z;
		const bx = b.x, by = b.y, bz = b.z;

		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;

		return this;
	}

	public projectOnVector(v: ObservableVector3): ObservableVector3 {
		const denominator = v.lengthSq();
		if ( denominator === 0 ) return this.set( 0, 0, 0 );
		const scalar = v.dot( this ) / denominator;
		return this.copy( v ).multiplyScalar( scalar );
	}

	public projectOnPlane(planeNormal: ObservableVector3): ObservableVector3 {
		_vector.copy( this ).projectOnVector( planeNormal );
		return this.sub( _vector );
	}

	public reflect(normal: ObservableVector3): ObservableVector3 {
		// reflect incident vector off plane orthogonal to normal
		// normal is assumed to have unit length
		return this.sub(_vector.copy(normal).multiplyScalar(2 * this.dot(normal)));
	}

	public angleTo(v: ObservableVector3): number {
		const denominator = Math.sqrt(this.lengthSq() * v.lengthSq());
		if (denominator === 0) return Math.PI / 2;
		const theta = this.dot(v) / denominator;

		// clamp, to handle numerical problems
		return Math.acos(MathUtils.clamp(theta, - 1, 1));
	}

	public distanceTo(v: ObservableVector3): number {
		return Math.sqrt(this.distanceToSquared(v));
	}

	public distanceToSquared(v: ObservableVector3): number {
		const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
		return dx * dx + dy * dy + dz * dz;
	}

	public manhattanDistanceTo(v: ObservableVector3): number {
		return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
	}

	public setFromSpherical(s: Spherical): ObservableVector3 {
		return this.setFromSphericalCoords( s.radius, s.phi, s.theta );
	}

	public setFromSphericalCoords(radius: number, phi: number, theta: number): ObservableVector3 {
		const sinPhiRadius = Math.sin(phi) * radius;

		this.x = sinPhiRadius * Math.sin(theta);
		this.y = Math.cos(phi) * radius;
		this.z = sinPhiRadius * Math.cos(theta);

		return this;
	}

	public setFromCylindrical(c: Cylindrical): ObservableVector3 {
		return this.setFromCylindricalCoords(c.radius, c.theta, c.y);
	}

	public setFromCylindricalCoords(radius: number, theta: number, y: number): ObservableVector3 {
		this.x = radius * Math.sin(theta);
		this.y = y;
		this.z = radius * Math.cos(theta);

		return this;
	}

	public setFromMatrixPosition(m: Matrix4): ObservableVector3 {
		const e = m.elements;

		this.x = e[12];
		this.y = e[13];
		this.z = e[14];

		return this;
	}

	public setFromMatrixScale(m: Matrix4): ObservableVector3 {
		const sx = this.setFromMatrixColumn(m, 0).length();
		const sy = this.setFromMatrixColumn(m, 1).length();
		const sz = this.setFromMatrixColumn(m, 2).length();

		this.x = sx;
		this.y = sy;
		this.z = sz;

		return this;
	}

	public setFromMatrixColumn(m: Matrix4, index: number): ObservableVector3 {
		return this.fromArray(m.elements, index * 4);
	}

	public setFromMatrix3Column(m: Matrix3, index: number): ObservableVector3 {
		return this.fromArray(m.elements, index * 3);
	}

	public equals(v: ObservableVector3): boolean {
		return ((v.x === this.x) && (v.y === this.y) && (v.z === this.z));
	}

	public fromArray(array: number[] | ArrayLike<number>, offset = 0): ObservableVector3 {
		this.x = array[offset];
		this.y = array[offset + 1];
		this.z = array[offset + 2];
		return this;
	}

	public toArray(array: number[] = [], offset = 0): number[] {
		array[offset] = this.x;
		array[offset + 1] = this.y;
		array[offset + 2] = this.z;
		return array;
	}

	public fromBufferAttribute(
        attribute: BufferAttribute | InterleavedBufferAttribute,
        index: number,
        offset: undefined
    ): ObservableVector3 {
		if (offset !== undefined) {
			console.warn('THREE.Vector3: offset has been removed from .fromBufferAttribute().');
		}
		this.x = attribute.getX(index);
		this.y = attribute.getY(index);
		this.z = attribute.getZ(index);
		return this;
	}

	public random(): ObservableVector3 {
		this.x = Math.random();
		this.y = Math.random();
		this.z = Math.random();
		return this;
	}

	public randomDirection(): ObservableVector3 {
		// Derived from https://mathworld.wolfram.com/SpherePointPicking.html
		const u = (Math.random() - 0.5) * 2;
		const t = Math.random() * Math.PI * 2;
		const f = Math.sqrt(1 - u ** 2);

		this.x = f * Math.cos(t);
		this.y = f * Math.sin(t);
		this.z = u;

		return this;
	}

	public *[Symbol.iterator](): IterableIterator<number> {
		yield this.x;
		yield this.y;
		yield this.z;
	}
}

(ObservableVector3.prototype as any).isVector3 = true;

const _vector = /*@__PURE__*/ new ObservableVector3();
const _quaternion = /*@__PURE__*/ new Quaternion();