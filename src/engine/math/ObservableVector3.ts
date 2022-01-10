import { BufferAttribute, Camera, Cylindrical, Euler, InterleavedBufferAttribute, MathUtils, Matrix3, Matrix4, Quaternion, Spherical, Vector3 } from "three";

//duck typed class of THREE.Vector3
export class ObservableVector3 {
    public readonly isVector3 = true;
    private _x: number;
    private _y: number;
    private _z: number;
    private _onChangeCallback: () => void;
    private _onBeforeGetComponentCallback: () => void;

    public constructor(x = 0, y = 0, z = 0) {
        this._x = x;
        this._y = y;
        this._z = z;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this._onChangeCallback = () => { };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this._onBeforeGetComponentCallback = () => { };
    }

    public onChange(callback: () => void) {
        this._onChangeCallback = callback;
    }

    public onBeforeGetComponent(callback: () => void) {
        this._onBeforeGetComponentCallback = callback;
    }

    public get x(): number {
        this._onBeforeGetComponentCallback();
        return this._x;
    }

    public set x(value: number) {
        this._x = value;
        this._onChangeCallback();
    }
    
    public get y(): number {
        this._onBeforeGetComponentCallback();
        return this._y;
    }

    public set y(value: number) {
        this._y = value;
        this._onChangeCallback();
    }

    public get z(): number {
        this._onBeforeGetComponentCallback();
        return this._z;
    }

    public set z(value: number) {
        this._z = value;
        this._onChangeCallback();
    }

    public set(x: number, y: number, z: number): ObservableVector3 {
        if (z === undefined) {
            this._onBeforeGetComponentCallback();
            z = this._z; // sprite.scale.set(x,y)
        }
        this._x = x;
        this._y = y;
        this._z = z;
        this._onChangeCallback();
        return this;
    }

    public setScalar(scalar: number): ObservableVector3 {
        this._x = scalar;
        this._y = scalar;
        this._z = scalar;
        this._onChangeCallback();
        return this;
    }

    public setX(x: number): ObservableVector3 {
        this._x = x;
        this._onChangeCallback();
        return this;
    }

    public setY(y: number): ObservableVector3 {
        this._y = y;
        this._onChangeCallback();
        return this;
    }

    public setZ(z: number): ObservableVector3 {
        this._z = z;
        this._onChangeCallback();
        return this;
    }

    public setComponent(index: number, value: number): ObservableVector3 {
        switch (index) {
        case 0: this._x = value; break;
        case 1: this._y = value; break;
        case 2: this._z = value; break;
        default: throw new Error("index is out of range: " + index);
        }
        this._onChangeCallback();
        return this;
    }

    public getComponent(index: number): number {
        this._onBeforeGetComponentCallback();
        switch (index) {
        case 0: return this._x;
        case 1: return this._y;
        case 2: return this._z;
        default: throw new Error("index is out of range: " + index);
        }
    }

    public clone(): Vector3 {
        this._onBeforeGetComponentCallback();
        return new Vector3(this._x, this._y, this._z);
    }

    public copy(v: ObservableVector3): ObservableVector3 {
        this._x = v.x;
        this._y = v.y;
        this._z = v.z;
        this._onChangeCallback();
        return this;
    }

    public add(v: ObservableVector3, w: undefined) {
        if (w !== undefined) {
            console.warn( "THREE.Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead." );
            return this.addVectors(v, w);
        }
        this._onBeforeGetComponentCallback();
        this._x += v.x;
        this._y += v.y;
        this._z += v.z;
        this._onChangeCallback();
        return this;
    }

    public addScalar(s: number): ObservableVector3 {
        this._onBeforeGetComponentCallback();
        this._x += s;
        this._y += s;
        this._z += s;
        this._onChangeCallback();
        return this;
    }

    public addVectors(a: ObservableVector3, b: ObservableVector3): ObservableVector3 {
        this._x = a.x + b.x;
        this._y = a.y + b.y;
        this._z = a.z + b.z;
        this._onChangeCallback();
        return this;
    }

    public addScaledVector(v: ObservableVector3, s: number): ObservableVector3 {
        this._onBeforeGetComponentCallback();
        this._x += v.x * s;
        this._y += v.y * s;
        this._z += v.z * s;
        this._onChangeCallback();
        return this;
    }

    public sub(v: ObservableVector3, w?: ObservableVector3): ObservableVector3 {
        if (w !== undefined) {
            console.warn( "THREE.Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead." );
            return this.subVectors(v, w);
        }
        this._onBeforeGetComponentCallback();
        this._x -= v.x;
        this._y -= v.y;
        this._z -= v.z;
        this._onChangeCallback();
        return this;
    }

    public subScalar(s: number): ObservableVector3 {
        this._onBeforeGetComponentCallback();
        this._x -= s;
        this._y -= s;
        this._z -= s;
        this._onChangeCallback();
        return this;
    }

    public subVectors(a: ObservableVector3, b: ObservableVector3): ObservableVector3 {
        this._x = a.x - b.x;
        this._y = a.y - b.y;
        this._z = a.z - b.z;
        this._onChangeCallback();
        return this;
    }

    public multiply(v: ObservableVector3, w?: ObservableVector3): ObservableVector3 {
        if (w !== undefined) {
            console.warn( "THREE.Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead." );
            return this.multiplyVectors(v, w);
        }
        this._onBeforeGetComponentCallback();
        this._x *= v.x;
        this._y *= v.y;
        this._z *= v.z;
        this._onChangeCallback();
        return this;
    }

    public multiplyScalar(scalar: number): ObservableVector3 {
        this._onBeforeGetComponentCallback();
        this._x *= scalar;
        this._y *= scalar;
        this._z *= scalar;
        this._onChangeCallback();
        return this;
    }

    public multiplyVectors(a: ObservableVector3, b: ObservableVector3): ObservableVector3 {
        this._x = a.x * b.x;
        this._y = a.y * b.y;
        this._z = a.z * b.z;
        this._onChangeCallback();
        return this;
    }

    public applyEuler(euler: Euler): ObservableVector3 {
        if (!(euler && euler.isEuler)) {
            console.error( "THREE.Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order." );
        }
        return this.applyQuaternion(_quaternion.setFromEuler(euler));
    }

    public applyAxisAngle(axis: ObservableVector3, angle: number): ObservableVector3 {
        return this.applyQuaternion(_quaternion.setFromAxisAngle(axis as any, angle));
    }

    public applyMatrix3(m: Matrix3): ObservableVector3 {
        this._onBeforeGetComponentCallback();
        const x = this._x, y = this._y, z = this._z;
        const e = m.elements;

        this._x = e[0] * x + e[3] * y + e[6] * z;
        this._y = e[1] * x + e[4] * y + e[7] * z;
        this._z = e[2] * x + e[5] * y + e[8] * z;
        this._onChangeCallback();

        return this;
    }

    public applyNormalMatrix(m: Matrix3): ObservableVector3 {
        return this.applyMatrix3( m ).normalize();
    }

    public applyMatrix4(m: Matrix4): ObservableVector3 {
        this._onBeforeGetComponentCallback();
        const x = this._x, y = this._y, z = this._z;
        const e = m.elements;

        const w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);

        this._x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
        this._y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
        this._z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
        this._onChangeCallback();

        return this;
    }

    public applyQuaternion(q: Quaternion): ObservableVector3 {
        this._onBeforeGetComponentCallback();
        const x = this._x, y = this._y, z = this._z;
        const qx = q.x, qy = q.y, qz = q.z, qw = q.w;

        // calculate quat * vector
        const ix = qw * x + qy * z - qz * y;
        const iy = qw * y + qz * x - qx * z;
        const iz = qw * z + qx * y - qy * x;
        const iw = - qx * x - qy * y - qz * z;

        // calculate result * inverse quat
        this._x = ix * qw + iw * - qx + iy * - qz - iz * - qy;
        this._y = iy * qw + iw * - qy + iz * - qx - ix * - qz;
        this._z = iz * qw + iw * - qz + ix * - qy - iy * - qx;
        this._onChangeCallback();

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
        this._onBeforeGetComponentCallback();
        const x = this._x, y = this._y, z = this._z;
        const e = m.elements;

        this._x = e[0] * x + e[4] * y + e[8] * z;
        this._y = e[1] * x + e[5] * y + e[9] * z;
        this._z = e[2] * x + e[6] * y + e[10] * z;
        this._onChangeCallback();

        return this.normalize();
    }

    public divide(v: ObservableVector3): ObservableVector3 {
        this._onBeforeGetComponentCallback();
        this._x /= v.x;
        this._y /= v.y;
        this._z /= v.z;
        this._onChangeCallback();
        return this;
    }

    public divideScalar(scalar: number): ObservableVector3 {
        return this.multiplyScalar(1 / scalar);
    }

    public min(v: ObservableVector3): ObservableVector3 {
        this._onBeforeGetComponentCallback();
        this._x = Math.min(this._x, v.x);
        this._y = Math.min(this._y, v.y);
        this._z = Math.min(this._z, v.z);
        this._onChangeCallback();
        return this;
    }

    public max(v: ObservableVector3): ObservableVector3 {
        this._onBeforeGetComponentCallback();
        this._x = Math.max(this._x, v.x);
        this._y = Math.max(this._y, v.y);
        this._z = Math.max(this._z, v.z);
        this._onChangeCallback();
        return this;
    }

    public clamp(min: ObservableVector3, max: ObservableVector3): ObservableVector3 {
        this._onBeforeGetComponentCallback();
        // assumes min < max, componentwise
        this._x = Math.max(min.x, Math.min(max.x, this._x));
        this._y = Math.max(min.y, Math.min(max.y, this._y));
        this._z = Math.max(min.z, Math.min(max.z, this._z));
        this._onChangeCallback();
        return this;
    }

    public clampScalar(minVal: number, maxVal: number): ObservableVector3 {
        this._onBeforeGetComponentCallback();
        this._x = Math.max(minVal, Math.min(maxVal, this._x));
        this._y = Math.max(minVal, Math.min(maxVal, this._y));
        this._z = Math.max(minVal, Math.min(maxVal, this._z));
        this._onChangeCallback();
        return this;
    }

    public clampLength(min: number, max: number): ObservableVector3 {
        const length = this.length();
        return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
    }

    public floor(): ObservableVector3 {
        this._onBeforeGetComponentCallback();
        this._x = Math.floor(this._x);
        this._y = Math.floor(this._y);
        this._z = Math.floor(this._z);
        this._onChangeCallback();
        return this;
    }

    public ceil(): ObservableVector3 {
        this._onBeforeGetComponentCallback();
        this._x = Math.ceil(this._x);
        this._y = Math.ceil(this._y);
        this._z = Math.ceil(this._z);
        this._onChangeCallback();
        return this;
    }

    public round(): ObservableVector3 {
        this._onBeforeGetComponentCallback();
        this._x = Math.round(this._x);
        this._y = Math.round(this._y);
        this._z = Math.round(this._z);
        this._onChangeCallback();
        return this;
    }

    public roundToZero(): ObservableVector3 {
        this._onBeforeGetComponentCallback();
        this._x = (this._x < 0) ? Math.ceil(this._x) : Math.floor(this._x);
        this._y = (this._y < 0) ? Math.ceil(this._y) : Math.floor(this._y);
        this._z = (this._z < 0) ? Math.ceil(this._z) : Math.floor(this._z);
        this._onChangeCallback();
        return this;
    }

    public negate(): ObservableVector3 {
        this._onBeforeGetComponentCallback();
        this._x = - this._x;
        this._y = - this._y;
        this._z = - this._z;
        this._onChangeCallback();
        return this;
    }

    public dot(v: ObservableVector3): number {
        this._onBeforeGetComponentCallback();
        return this._x * v.x + this._y * v.y + this._z * v.z;
    }

    // TODO lengthSquared?

    public lengthSq(): number {
        this._onBeforeGetComponentCallback();
        return this._x * this._x + this._y * this._y + this._z * this._z;
    }

    public length(): number {
        this._onBeforeGetComponentCallback();
        return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
    }

    public manhattanLength(): number {
        this._onBeforeGetComponentCallback();
        return Math.abs(this._x) + Math.abs(this._y) + Math.abs(this._z);
    }

    public normalize(): ObservableVector3 {
        return this.divideScalar(this.length() || 1);
    }

    public setLength(length: number): ObservableVector3 {
        return this.normalize().multiplyScalar(length);
    }

    public lerp(v: ObservableVector3, alpha: number): ObservableVector3 {
        this._onBeforeGetComponentCallback();
        this._x += (v.x - this._x) * alpha;
        this._y += (v.y - this._y) * alpha;
        this._z += (v.z - this._z) * alpha;
        this._onChangeCallback();
        return this;
    }

    public lerpVectors(v1: ObservableVector3, v2: ObservableVector3, alpha: number) {
        this._x = v1.x + (v2.x - v1.x) * alpha;
        this._y = v1.y + (v2.y - v1.y) * alpha;
        this._z = v1.z + (v2.z - v1.z) * alpha;
        this._onChangeCallback();
        return this;
    }

    public cross(v: ObservableVector3, w?: ObservableVector3): ObservableVector3 {
        if (w !== undefined) {
            console.warn("THREE.Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.");
            return this.crossVectors(v, w);
        }
        return this.crossVectors(this, v);
    }

    public crossVectors(a: ObservableVector3, b: ObservableVector3): ObservableVector3 {
        const ax = a.x, ay = a.y, az = a.z;
        const bx = b.x, by = b.y, bz = b.z;

        this._x = ay * bz - az * by;
        this._y = az * bx - ax * bz;
        this._z = ax * by - ay * bx;
        this._onChangeCallback();
        return this;
    }

    public projectOnVector(v: ObservableVector3): ObservableVector3 {
        const denominator = v.lengthSq();
        if (denominator === 0) return this.set(0, 0, 0);
        const scalar = v.dot(this) / denominator;
        return this.copy(v).multiplyScalar(scalar);
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
        this._onBeforeGetComponentCallback();
        const dx = this._x - v.x, dy = this._y - v.y, dz = this._z - v.z;
        return dx * dx + dy * dy + dz * dz;
    }

    public manhattanDistanceTo(v: ObservableVector3): number {
        this._onBeforeGetComponentCallback();
        return Math.abs(this._x - v.x) + Math.abs(this._y - v.y) + Math.abs(this._z - v.z);
    }

    public setFromSpherical(s: Spherical): ObservableVector3 {
        return this.setFromSphericalCoords(s.radius, s.phi, s.theta);
    }

    public setFromSphericalCoords(radius: number, phi: number, theta: number): ObservableVector3 {
        const sinPhiRadius = Math.sin(phi) * radius;

        this._x = sinPhiRadius * Math.sin(theta);
        this._y = Math.cos(phi) * radius;
        this._z = sinPhiRadius * Math.cos(theta);
        this._onChangeCallback();

        return this;
    }

    public setFromCylindrical(c: Cylindrical): ObservableVector3 {
        return this.setFromCylindricalCoords(c.radius, c.theta, c.y);
    }

    public setFromCylindricalCoords(radius: number, theta: number, y: number): ObservableVector3 {
        this._x = radius * Math.sin(theta);
        this._y = y;
        this._z = radius * Math.cos(theta);
        this._onChangeCallback();
        return this;
    }

    public setFromMatrixPosition(m: Matrix4): ObservableVector3 {
        const e = m.elements;

        this._x = e[12];
        this._y = e[13];
        this._z = e[14];
        this._onChangeCallback();

        return this;
    }

    public setFromMatrixScale(m: Matrix4): ObservableVector3 {
        const sx = this.setFromMatrixColumn(m, 0).length();
        const sy = this.setFromMatrixColumn(m, 1).length();
        const sz = this.setFromMatrixColumn(m, 2).length();

        this._x = sx;
        this._y = sy;
        this._z = sz;
        this._onChangeCallback();

        return this;
    }

    public setFromMatrixColumn(m: Matrix4, index: number): ObservableVector3 {
        return this.fromArray(m.elements, index * 4);
    }

    public setFromMatrix3Column(m: Matrix3, index: number): ObservableVector3 {
        return this.fromArray(m.elements, index * 3);
    }

    public equals(v: ObservableVector3): boolean {
        this._onBeforeGetComponentCallback();
        return ((v.x === this._x) && (v.y === this._y) && (v.z === this._z));
    }

    public fromArray(array: number[]|ArrayLike<number>, offset = 0): ObservableVector3 {
        this._x = array[offset];
        this._y = array[offset + 1];
        this._z = array[offset + 2];
        this._onChangeCallback();
        return this;
    }

    public toArray(array: number[] = [], offset = 0): number[] {
        this._onBeforeGetComponentCallback();
        array[offset] = this._x;
        array[offset + 1] = this._y;
        array[offset + 2] = this._z;
        return array;
    }

    public fromBufferAttribute(
        attribute: BufferAttribute|InterleavedBufferAttribute,
        index: number,
        offset: undefined
    ): ObservableVector3 {
        if (offset !== undefined) {
            console.warn("THREE.Vector3: offset has been removed from .fromBufferAttribute().");
        }
        this._x = attribute.getX(index);
        this._y = attribute.getY(index);
        this._z = attribute.getZ(index);
        this._onChangeCallback();
        return this;
    }

    public random(): ObservableVector3 {
        this._x = Math.random();
        this._y = Math.random();
        this._z = Math.random();
        this._onChangeCallback();
        return this;
    }

    public randomDirection(): ObservableVector3 {
        // Derived from https://mathworld.wolfram.com/SpherePointPicking.html
        const u = (Math.random() - 0.5) * 2;
        const t = Math.random() * Math.PI * 2;
        const f = Math.sqrt(1 - u ** 2);

        this._x = f * Math.cos(t);
        this._y = f * Math.sin(t);
        this._z = u;
        this._onChangeCallback();

        return this;
    }

    public *[Symbol.iterator](): IterableIterator<number> {
        this._onBeforeGetComponentCallback();
        yield this._x;
        this._onBeforeGetComponentCallback();
        yield this._y;
        this._onBeforeGetComponentCallback();
        yield this._z;
    }

    /**
     * Computes Manhattan length of this vector.
     * http://en.wikipedia.org/wiki/Taxicab_geometry
     *
     * @deprecated Use {@link Vector3#manhattanLength .manhattanLength()} instead.
     */
    public lengthManhattan(): number { throw new Error("deprecated"); }

    /**
     * @deprecated Use {@link Vector3#manhattanDistanceTo .manhattanDistanceTo()} instead.
     */
    public distanceToManhattan(_v: ObservableVector3): number { throw new Error("deprecated"); }
}

const _vector = /*@__PURE__*/ new ObservableVector3();
const _quaternion = /*@__PURE__*/ new Quaternion();
