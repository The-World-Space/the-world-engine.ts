import { clamp } from "three/src/math/MathUtils";
import { BufferAttribute, Euler, InterleavedBufferAttribute, Matrix4, Quaternion, Vector3 } from "three/src/Three";

/** @internal */
export class ObservableQuaternion {
    public readonly isQuaternion = true;

    private _internalX: number;
    private _internalY: number;
    private _internalZ: number;
    private _internalW: number;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public _onChangeCallback: () => void;
    private _onBeforeChangeCallback: () => void;
    private _onBeforeGetComponentCallback: () => void;

    public constructor(x = 0, y = 0, z = 0, w = 1) {
        this._internalX = x;
        this._internalY = y;
        this._internalZ = z;
        this._internalW = w;

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this._onChangeCallback = (): void => { };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this._onBeforeChangeCallback = (): void => { };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this._onBeforeGetComponentCallback = (): void => { };
    }

    public onBeforeGetComponent(callback: () => void): void {
        this._onBeforeGetComponentCallback = callback;
    }

    public onBeforeChange(callback: () => void): void {
        this._onBeforeChangeCallback = callback;
    }

    public static slerp(qa: ObservableQuaternion, qb: ObservableQuaternion, qm: ObservableQuaternion, t: number): ObservableQuaternion {
        console.warn("THREE.Quaternion: Static .slerp() has been deprecated. Use qm.slerpQuaternions( qa, qb, t ) instead.");
        return qm.slerpQuaternions(qa, qb, t);
    }

    public static slerpFlat(
        dst: number[],
        dstOffset: number,
        src0: number[],
        srcOffset0: number,
        src1: number[],
        srcOffset1: number,
        t: number
    ): void {
        // fuzz-free, array-based Quaternion SLERP operation
        let x0 = src0[srcOffset0 + 0],
            y0 = src0[srcOffset0 + 1],
            z0 = src0[srcOffset0 + 2],
            w0 = src0[srcOffset0 + 3];

        const x1 = src1[srcOffset1 + 0],
            y1 = src1[srcOffset1 + 1],
            z1 = src1[srcOffset1 + 2],
            w1 = src1[srcOffset1 + 3];

        if (t === 0) {
            dst[dstOffset + 0] = x0;
            dst[dstOffset + 1] = y0;
            dst[dstOffset + 2] = z0;
            dst[dstOffset + 3] = w0;
            return;
        }

        if (t === 1) {
            dst[dstOffset + 0] = x1;
            dst[dstOffset + 1] = y1;
            dst[dstOffset + 2] = z1;
            dst[dstOffset + 3] = w1;
            return;
        }

        if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {
            let s = 1 - t;
            const cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,
                dir = (cos >= 0 ? 1 : -1),
                sqrSin = 1 - cos * cos;

            // Skip the Slerp for tiny steps to avoid numeric problems:
            if (sqrSin > Number.EPSILON) {
                const sin = Math.sqrt(sqrSin), len = Math.atan2(sin, cos * dir);

                s = Math.sin(s * len) / sin;
                t = Math.sin(t * len) / sin;
            }

            const tDir = t * dir;

            x0 = x0 * s + x1 * tDir;
            y0 = y0 * s + y1 * tDir;
            z0 = z0 * s + z1 * tDir;
            w0 = w0 * s + w1 * tDir;

            // Normalize in case we just did a lerp:
            if (s === 1 - t) {
                const f = 1 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);
                x0 *= f;
                y0 *= f;
                z0 *= f;
                w0 *= f;
            }
        }

        dst[dstOffset] = x0;
        dst[dstOffset + 1] = y0;
        dst[dstOffset + 2] = z0;
        dst[dstOffset + 3] = w0;
    }

    public static multiplyQuaternionsFlat(
        dst: number[],
        dstOffset: number,
        src0: number[],
        srcOffset0: number,
        src1: number[],
        srcOffset1: number
    ): number[] {
        const x0 = src0[srcOffset0];
        const y0 = src0[srcOffset0 + 1];
        const z0 = src0[srcOffset0 + 2];
        const w0 = src0[srcOffset0 + 3];

        const x1 = src1[srcOffset1];
        const y1 = src1[srcOffset1 + 1];
        const z1 = src1[srcOffset1 + 2];
        const w1 = src1[srcOffset1 + 3];

        dst[dstOffset] = x0 * w1 + w0 * x1 + y0 * z1 - z0 * y1;
        dst[dstOffset + 1] = y0 * w1 + w0 * y1 + z0 * x1 - x0 * z1;
        dst[dstOffset + 2] = z0 * w1 + w0 * z1 + x0 * y1 - y0 * x1;
        dst[dstOffset + 3] = w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1;

        return dst;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public get _x(): number { // this can't be private because it's used like public in three.js
        this._onBeforeGetComponentCallback();
        return this._internalX;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public set _x(value: number) { // this can't be private because it's used like public in three.js
        this._internalX = value;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public get _y(): number { // this can't be private because it's used like public in three.js
        this._onBeforeGetComponentCallback();
        return this._internalY;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public set _y(value: number) { // this can't be private because it's used like public in three.js
        this._internalY = value;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public get _z(): number { // this can't be private because it's used like public in three.js
        this._onBeforeGetComponentCallback();
        return this._internalZ;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public set _z(value: number) { // this can't be private because it's used like public in three.js
        this._internalZ = value;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public get _w(): number { // this can't be private because it's used like public in three.js
        this._onBeforeGetComponentCallback();
        return this._internalW;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public set _w(value: number) { // this can't be private because it's used like public in three.js
        this._internalW = value;
    }

    public get x(): number {
        this._onBeforeGetComponentCallback();
        return this._internalX;
    }

    public set x(value: number) {
        // if (this._internalX === value) return;
        this._onBeforeChangeCallback();
        this._internalX = value;
        this._onChangeCallback();
    }

    public get y(): number {
        this._onBeforeGetComponentCallback();
        return this._internalY;
    }

    public set y(value: number) {
        // if (this._internalY === value) return;
        this._onBeforeChangeCallback();
        this._internalY = value;
        this._onChangeCallback();
    }

    public get z(): number {
        this._onBeforeGetComponentCallback();
        return this._internalZ;
    }

    public set z(value: number) {
        // if (this._internalZ === value) return;
        this._onBeforeChangeCallback();
        this._internalZ = value;
        this._onChangeCallback();
    }

    public get w(): number {
        this._onBeforeGetComponentCallback();
        return this._internalW;
    }

    public set w(value: number) {
        // if (this._internalW === value) return;
        this._onBeforeChangeCallback();
        this._internalW = value;
        this._onChangeCallback();
    }

    public set(x: number, y: number, z: number, w: number): ObservableQuaternion {
        // if (this._internalX === x && this._internalY === y && this._internalZ === z && this._internalW === w) return this;
        this._onBeforeChangeCallback();
        this._internalX = x;
        this._internalY = y;
        this._internalZ = z;
        this._internalW = w;
        this._onChangeCallback();
        return this;
    }

    public clone(): Quaternion {
        this._onBeforeGetComponentCallback();
        return new Quaternion(this._internalX, this._internalY, this._internalZ, this._internalW);
    }

    public copy(quaternion: ObservableQuaternion): ObservableQuaternion {
        // if (this._internalX === quaternion.x && this._internalY === quaternion.y && this._internalZ === quaternion.z && this._internalW === quaternion.w) return this;
        this._onBeforeChangeCallback();
        this._internalX = quaternion.x;
        this._internalY = quaternion.y;
        this._internalZ = quaternion.z;
        this._internalW = quaternion.w;
        this._onChangeCallback();
        return this;
    }

    public setFromEuler(euler: Euler, update?: boolean): ObservableQuaternion {
        if (!(euler && euler.isEuler)) {
            throw new Error("THREE.Quaternion: .setFromEuler() now expects an Euler rotation rather than a Vector3 and order.");
        }

        const x = (euler as any)._x, y = (euler as any)._y, z = (euler as any)._z, order = (euler as any)._order;

        // http://www.mathworks.com/matlabcentral/fileexchange/
        //     20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
        //    content/SpinCalc.m

        const cos = Math.cos;
        const sin = Math.sin;

        const c1 = cos(x / 2);
        const c2 = cos(y / 2);
        const c3 = cos(z / 2);

        const s1 = sin(x / 2);
        const s2 = sin(y / 2);
        const s3 = sin(z / 2);

        this._onBeforeChangeCallback();
        switch (order) {
        case "XYZ":
            this._internalX = s1 * c2 * c3 + c1 * s2 * s3;
            this._internalY = c1 * s2 * c3 - s1 * c2 * s3;
            this._internalZ = c1 * c2 * s3 + s1 * s2 * c3;
            this._internalW = c1 * c2 * c3 - s1 * s2 * s3;
            break;

        case "YXZ":
            this._internalX = s1 * c2 * c3 + c1 * s2 * s3;
            this._internalY = c1 * s2 * c3 - s1 * c2 * s3;
            this._internalZ = c1 * c2 * s3 - s1 * s2 * c3;
            this._internalW = c1 * c2 * c3 + s1 * s2 * s3;
            break;

        case "ZXY":
            this._internalX = s1 * c2 * c3 - c1 * s2 * s3;
            this._internalY = c1 * s2 * c3 + s1 * c2 * s3;
            this._internalZ = c1 * c2 * s3 + s1 * s2 * c3;
            this._internalW = c1 * c2 * c3 - s1 * s2 * s3;
            break;

        case "ZYX":
            this._internalX = s1 * c2 * c3 - c1 * s2 * s3;
            this._internalY = c1 * s2 * c3 + s1 * c2 * s3;
            this._internalZ = c1 * c2 * s3 - s1 * s2 * c3;
            this._internalW = c1 * c2 * c3 + s1 * s2 * s3;
            break;

        case "YZX":
            this._internalX = s1 * c2 * c3 + c1 * s2 * s3;
            this._internalY = c1 * s2 * c3 + s1 * c2 * s3;
            this._internalZ = c1 * c2 * s3 - s1 * s2 * c3;
            this._internalW = c1 * c2 * c3 - s1 * s2 * s3;
            break;

        case "XZY":
            this._internalX = s1 * c2 * c3 - c1 * s2 * s3;
            this._internalY = c1 * s2 * c3 - s1 * c2 * s3;
            this._internalZ = c1 * c2 * s3 + s1 * s2 * c3;
            this._internalW = c1 * c2 * c3 + s1 * s2 * s3;
            break;

        default:
            console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: " + order);
        }

        if (update !== false) this._onChangeCallback();
        return this;
    }

    public setFromAxisAngle(axis: Vector3, angle: number): ObservableQuaternion {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
        // assumes axis is normalized

        const halfAngle = angle / 2, s = Math.sin(halfAngle);

        this._onBeforeChangeCallback();

        this._internalX = axis.x * s;
        this._internalY = axis.y * s;
        this._internalZ = axis.z * s;
        this._internalW = Math.cos(halfAngle);

        this._onChangeCallback();
        return this;
    }

    public setFromRotationMatrix(m: Matrix4): ObservableQuaternion {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

        const te = m.elements,
            m11 = te[0], m12 = te[4], m13 = te[8],
            m21 = te[1], m22 = te[5], m23 = te[9],
            m31 = te[2], m32 = te[6], m33 = te[10],
            trace = m11 + m22 + m33;

        this._onBeforeChangeCallback();

        if (trace > 0) {
            const s = 0.5 / Math.sqrt(trace + 1.0);

            this._internalW = 0.25 / s;
            this._internalX = (m32 - m23) * s;
            this._internalY = (m13 - m31) * s;
            this._internalZ = (m21 - m12) * s;
        } else if (m11 > m22 && m11 > m33) {
            const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

            this._internalW = (m32 - m23) / s;
            this._internalX = 0.25 * s;
            this._internalY = (m12 + m21) / s;
            this._internalZ = (m13 + m31) / s;
        } else if (m22 > m33) {
            const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

            this._internalW = (m13 - m31) / s;
            this._internalX = (m12 + m21) / s;
            this._internalY = 0.25 * s;
            this._internalZ = (m23 + m32) / s;
        } else {
            const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

            this._internalW = (m21 - m12) / s;
            this._internalX = (m13 + m31) / s;
            this._internalY = (m23 + m32) / s;
            this._internalZ = 0.25 * s;
        }

        this._onChangeCallback();
        return this;
    }

    public setFromUnitVectors(vFrom: Vector3, vTo: Vector3): ObservableQuaternion {
        // assumes direction vectors vFrom and vTo are normalized
        let r = vFrom.dot(vTo) + 1;

        this._onBeforeChangeCallback();
        if (r < Number.EPSILON) {
            // vFrom and vTo point in opposite directions
            r = 0;
            if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
                this._internalX = -vFrom.y;
                this._internalY = vFrom.x;
                this._internalZ = 0;
                this._internalW = r;
            } else {
                this._internalX = 0;
                this._internalY = -vFrom.z;
                this._internalZ = vFrom.y;
                this._internalW = r;
            }
        } else {
            // crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3
            this._internalX = vFrom.y * vTo.z - vFrom.z * vTo.y;
            this._internalY = vFrom.z * vTo.x - vFrom.x * vTo.z;
            this._internalZ = vFrom.x * vTo.y - vFrom.y * vTo.x;
            this._internalW = r;
        }

        return this.normalize();
    }

    public angleTo(q: ObservableQuaternion): number {
        return 2 * Math.acos(Math.abs(clamp(this.dot(q), -1, 1)));
    }

    public rotateTowards(q: ObservableQuaternion, step: number): ObservableQuaternion {
        const angle = this.angleTo(q);
        if (angle === 0) return this;
        const t = Math.min(1, step / angle);
        this.slerp(q, t);
        return this;
    }

    public identity(): ObservableQuaternion {
        return this.set(0, 0, 0, 1);
    }

    public invert(): ObservableQuaternion {
        // quaternion is assumed to have unit length
        return this.conjugate();
    }

    public conjugate(): ObservableQuaternion {
        this._onBeforeGetComponentCallback();
        this._onBeforeChangeCallback();
        this._internalX *= -1;
        this._internalY *= -1;
        this._internalZ *= -1;

        this._onChangeCallback();
        return this;
    }

    public dot(v: ObservableQuaternion): number {
        this._onBeforeGetComponentCallback();
        return this._internalX * v._x + this._internalY * v._y + this._internalZ * v._z + this._internalW * v._w;
    }

    public lengthSq(): number {
        this._onBeforeGetComponentCallback();
        return this._internalX * this._internalX + this._internalY * this._internalY + this._internalZ * this._internalZ + this._internalW * this._internalW;
    }

    public length(): number {
        this._onBeforeGetComponentCallback();
        return Math.sqrt(this._internalX * this._internalX + this._internalY * this._internalY + this._internalZ * this._internalZ + this._internalW * this._internalW);
    }

    public normalize(): ObservableQuaternion {
        let l = this.length();

        if (l === 0) {
            this._onBeforeChangeCallback();
            this._internalX = 0;
            this._internalY = 0;
            this._internalZ = 0;
            this._internalW = 1;
        } else {
            l = 1 / l;

            this._onBeforeGetComponentCallback();
            this._onBeforeChangeCallback();
            this._internalX = this._internalX * l;
            this._internalY = this._internalY * l;
            this._internalZ = this._internalZ * l;
            this._internalW = this._internalW * l;
        }

        this._onChangeCallback();
        return this;
    }

    public multiply(q: ObservableQuaternion, p?: ObservableQuaternion): ObservableQuaternion {
        if (p !== undefined) {
            console.warn("THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.");
            return this.multiplyQuaternions(q, p);
        }

        if (q._x === 0 && q._y === 0 && q._z === 0 && q._w === 1) return this;
        return this.multiplyQuaternions(this, q);
    }

    public premultiply(q: ObservableQuaternion): ObservableQuaternion {
        return this.multiplyQuaternions(q, this);
    }

    public multiplyQuaternions(a: ObservableQuaternion, b: ObservableQuaternion): ObservableQuaternion {
        // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
        const qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
        const qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

        this._onBeforeChangeCallback();

        this._internalX = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        this._internalY = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        this._internalZ = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        this._internalW = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

        this._onChangeCallback();
        return this;
    }

    public slerp(qb: ObservableQuaternion, t: number): ObservableQuaternion {
        if (t === 0) return this;
        if (t === 1) return this.copy(qb);

        this._onBeforeGetComponentCallback();
        const x = this._internalX, y = this._internalY, z = this._internalZ, w = this._internalW;

        // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
        let cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

        this._onBeforeChangeCallback();
        if (cosHalfTheta < 0) {
            this._internalW = -qb._w;
            this._internalX = -qb._x;
            this._internalY = -qb._y;
            this._internalZ = -qb._z;

            cosHalfTheta = -cosHalfTheta;
        } else {
            this.copy(qb);
        }

        if (cosHalfTheta >= 1.0) {
            this._internalW = w;
            this._internalX = x;
            this._internalY = y;
            this._internalZ = z;
            return this;
        }

        const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

        if (sqrSinHalfTheta <= Number.EPSILON) {
            const s = 1 - t;
            this._internalW = s * w + t * this._internalW;
            this._internalX = s * x + t * this._internalX;
            this._internalY = s * y + t * this._internalY;
            this._internalZ = s * z + t * this._internalZ;

            this.normalize();
            //this._onChangeCallback(); this is unnecessary
            return this;
        }

        const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
        const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
        const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
            ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

        this._internalW = (w * ratioA + this._internalW * ratioB);
        this._internalX = (x * ratioA + this._internalX * ratioB);
        this._internalY = (y * ratioA + this._internalY * ratioB);
        this._internalZ = (z * ratioA + this._internalZ * ratioB);

        this._onChangeCallback();
        return this;
    }

    public slerpQuaternions(qa: ObservableQuaternion, qb: ObservableQuaternion, t: number): ObservableQuaternion {
        return this.copy(qa).slerp(qb, t);
    }

    public random(): ObservableQuaternion {
        // Derived from http://planning.cs.uiuc.edu/node198.html
        // Note, this source uses w, x, y, z ordering,
        // so we swap the order below.

        const u1 = Math.random();
        const sqrt1u1 = Math.sqrt(1 - u1);
        const sqrtu1 = Math.sqrt(u1);
        const u2 = 2 * Math.PI * Math.random();
        const u3 = 2 * Math.PI * Math.random();

        return this.set(
            sqrt1u1 * Math.cos(u2),
            sqrtu1 * Math.sin(u3),
            sqrtu1 * Math.cos(u3),
            sqrt1u1 * Math.sin(u2)
        );
    }

    public equals(quaternion: ObservableQuaternion): boolean {
        this._onBeforeGetComponentCallback();
        return (quaternion._x === this._internalX) && (quaternion._y === this._internalY) && (quaternion._z === this._internalZ) && (quaternion._w === this._internalW);
    }

    public fromArray(array: number[]|ArrayLike<number>, offset = 0): ObservableQuaternion {
        if (this._internalX === array[offset] && this._internalY === array[offset + 1] && this._internalZ === array[offset + 2] && this._internalW === array[offset + 3]) return this;
        this._onBeforeChangeCallback();

        this._internalX = array[offset];
        this._internalY = array[offset + 1];
        this._internalZ = array[offset + 2];
        this._internalW = array[offset + 3];

        this._onChangeCallback();
        return this;
    }

    public toArray(array: number[] = [], offset = 0): number[] {
        this._onBeforeGetComponentCallback();
        array[offset] = this._internalX;
        array[offset + 1] = this._internalY;
        array[offset + 2] = this._internalZ;
        array[offset + 3] = this._internalW;
        return array;
    }

    public fromBufferAttribute(attribute: BufferAttribute|InterleavedBufferAttribute, index: number): ObservableQuaternion {
        this._internalX = attribute.getX(index);
        this._internalY = attribute.getY(index);
        this._internalZ = attribute.getZ(index);
        this._internalW = attribute.getW(index);
        return this;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public _onChange(callback: () => void): ObservableQuaternion {
        this._onChangeCallback = callback;
        return this;
    }

    public *[Symbol.iterator](): Generator<number, void> {
        this._onBeforeGetComponentCallback();
        yield this._internalX;
        this._onBeforeGetComponentCallback();
        yield this._internalY;
        this._onBeforeGetComponentCallback();
        yield this._internalZ;
        this._onBeforeGetComponentCallback();
        yield this._internalW;
    }
}
