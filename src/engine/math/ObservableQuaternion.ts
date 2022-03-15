import { Euler } from "three/src/math/Euler";
import { Matrix4 } from "three/src/math/Matrix4";
import { Quaternion } from "three/src/math/Quaternion";
import { Vector3 } from "three/src/math/Vector3";
import { clamp } from "three/src/math/MathUtils";
import { BufferAttribute } from "three/src/core/BufferAttribute";
import { InterleavedBufferAttribute } from "three/src/core/InterleavedBufferAttribute";

/** @internal */
export class ObservableQuaternion {
    public readonly isQuaternion = true;
    
    private _internal_x: number;
    private _internal_y: number;
    private _internal_z: number;
    private _internal_w: number;
    public _onChangeCallback: () => void;
    private _onBeforeChangeCallback: () => void;
    private _onBeforeGetComponentCallback: () => void;

    public constructor(x = 0, y = 0, z = 0, w = 1) {
        this._internal_x = x;
        this._internal_y = y;
        this._internal_z = z;
        this._internal_w = w;

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this._onChangeCallback = () => { };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this._onBeforeChangeCallback = () => { };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this._onBeforeGetComponentCallback = () => { };
    }

    public onBeforeGetComponent(callback: () => void) {
        this._onBeforeGetComponentCallback = callback;
    }

    public onBeforeChange(callback: () => void) {
        this._onBeforeChangeCallback = callback;
    }

    public static slerp(qa: ObservableQuaternion, qb: ObservableQuaternion, qm: ObservableQuaternion, t: number): ObservableQuaternion {
        console.warn("THREE.Quaternion: Static .slerp() has been deprecated. Use qm.slerpQuaternions( qa, qb, t ) instead.");
        return qm.slerpQuaternions(qa, qb, t);
    }

    public static slerpFlat( //TODO: pr to three-types
        dst: number[],
        dstOffset: number,
        src0: number[],
        srcOffset0: number,
        src1: number[],
        srcOffset1: number,
        t: number,
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

        if ( t === 1 ) {
            dst[dstOffset + 0] = x1;
            dst[dstOffset + 1] = y1;
            dst[dstOffset + 2] = z1;
            dst[dstOffset + 3] = w1;
            return;
        }

        if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {
            let s = 1 - t;
            const cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,
                dir = ( cos >= 0 ? 1 : - 1 ),
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
        srcOffset1: number,
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

    private get _x(): number { // this can't be private because it's used like public in three.js
        this._onBeforeGetComponentCallback();
        return this._internal_x;
    }

    private set _x(value: number) { // this can't be private because it's used like public in three.js
        if (this._internal_x === value) return;
        this._internal_x = value;
    }

    private get _y(): number { // this can't be private because it's used like public in three.js
        this._onBeforeGetComponentCallback();
        return this._internal_y;
    }

    private set _y(value: number) { // this can't be private because it's used like public in three.js
        if (this._internal_y === value) return;
        this._internal_y = value;
    }

    private get _z(): number { // this can't be private because it's used like public in three.js
        this._onBeforeGetComponentCallback();
        return this._internal_z;
    }

    private set _z(value: number) { // this can't be private because it's used like public in three.js
        if (this._internal_z === value) return;
        this._internal_z = value;
    }

    private get _w(): number { // this can't be private because it's used like public in three.js
        this._onBeforeGetComponentCallback();
        return this._internal_w;
    }

    private set _w(value: number) { // this can't be private because it's used like public in three.js
        if (this._internal_w === value) return;
        this._internal_w = value;
    }

    public get x() {
        this._onBeforeGetComponentCallback();
        return this._internal_x;
    }

    public set x(value: number) {
        if (this._internal_x === value) return;
        this._onBeforeChangeCallback();
        this._internal_x = value;
        this._onChangeCallback();
    }

    public get y() {
        this._onBeforeGetComponentCallback();
        return this._internal_y;
    }

    public set y(value: number) {
        if (this._internal_y === value) return;
        this._onBeforeChangeCallback();
        this._internal_y = value;
        this._onChangeCallback();
    }

    public get z() {
        this._onBeforeGetComponentCallback();
        return this._internal_z;
    }

    public set z(value: number) {
        if (this._internal_z === value) return;
        this._onBeforeChangeCallback();
        this._internal_z = value;
        this._onChangeCallback();
    }

    public get w() {
        this._onBeforeGetComponentCallback();
        return this._internal_w;
    }

    public set w(value: number) {
        if (this._internal_w === value) return;
        this._onBeforeChangeCallback();
        this._internal_w = value;
        this._onChangeCallback();
    }

    public set(x: number, y: number, z: number, w: number): ObservableQuaternion {
        if (this._internal_x === x && this._internal_y === y && this._internal_z === z && this._internal_w === w) return this;
        this._onBeforeChangeCallback();
        this._internal_x = x;
        this._internal_y = y;
        this._internal_z = z;
        this._internal_w = w;
        this._onChangeCallback();
        return this;
    }

    public clone(): Quaternion {
        this._onBeforeGetComponentCallback();
        return new Quaternion(this._internal_x, this._internal_y, this._internal_z, this._internal_w);
    }

    public copy(quaternion: ObservableQuaternion): ObservableQuaternion {
        if (this._internal_x === quaternion.x && this._internal_y === quaternion.y && this._internal_z === quaternion.z && this._internal_w === quaternion.w) return this;
        this._onBeforeChangeCallback();
        this._internal_x = quaternion.x;
        this._internal_y = quaternion.y;
        this._internal_z = quaternion.z;
        this._internal_w = quaternion.w;
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
            this._internal_x = s1 * c2 * c3 + c1 * s2 * s3;
            this._internal_y = c1 * s2 * c3 - s1 * c2 * s3;
            this._internal_z = c1 * c2 * s3 + s1 * s2 * c3;
            this._internal_w = c1 * c2 * c3 - s1 * s2 * s3;
            break;

        case "YXZ":
            this._internal_x = s1 * c2 * c3 + c1 * s2 * s3;
            this._internal_y = c1 * s2 * c3 - s1 * c2 * s3;
            this._internal_z = c1 * c2 * s3 - s1 * s2 * c3;
            this._internal_w = c1 * c2 * c3 + s1 * s2 * s3;
            break;

        case "ZXY":
            this._internal_x = s1 * c2 * c3 - c1 * s2 * s3;
            this._internal_y = c1 * s2 * c3 + s1 * c2 * s3;
            this._internal_z = c1 * c2 * s3 + s1 * s2 * c3;
            this._internal_w = c1 * c2 * c3 - s1 * s2 * s3;
            break;

        case "ZYX":
            this._internal_x = s1 * c2 * c3 - c1 * s2 * s3;
            this._internal_y = c1 * s2 * c3 + s1 * c2 * s3;
            this._internal_z = c1 * c2 * s3 - s1 * s2 * c3;
            this._internal_w = c1 * c2 * c3 + s1 * s2 * s3;
            break;

        case "YZX":
            this._internal_x = s1 * c2 * c3 + c1 * s2 * s3;
            this._internal_y = c1 * s2 * c3 + s1 * c2 * s3;
            this._internal_z = c1 * c2 * s3 - s1 * s2 * c3;
            this._internal_w = c1 * c2 * c3 - s1 * s2 * s3;
            break;

        case "XZY":
            this._internal_x = s1 * c2 * c3 - c1 * s2 * s3;
            this._internal_y = c1 * s2 * c3 - s1 * c2 * s3;
            this._internal_z = c1 * c2 * s3 + s1 * s2 * c3;
            this._internal_w = c1 * c2 * c3 + s1 * s2 * s3;
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

        this._internal_x = axis.x * s;
        this._internal_y = axis.y * s;
        this._internal_z = axis.z * s;
        this._internal_w = Math.cos(halfAngle);

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

            this._internal_w = 0.25 / s;
            this._internal_x = (m32 - m23) * s;
            this._internal_y = (m13 - m31) * s;
            this._internal_z = (m21 - m12) * s;
        } else if (m11 > m22 && m11 > m33) {
            const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

            this._internal_w = (m32 - m23) / s;
            this._internal_x = 0.25 * s;
            this._internal_y = (m12 + m21) / s;
            this._internal_z = (m13 + m31) / s;
        } else if (m22 > m33) {
            const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

            this._internal_w = (m13 - m31) / s;
            this._internal_x = (m12 + m21) / s;
            this._internal_y = 0.25 * s;
            this._internal_z = (m23 + m32) / s;
        } else {
            const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

            this._internal_w = (m21 - m12) / s;
            this._internal_x = (m13 + m31) / s;
            this._internal_y = (m23 + m32) / s;
            this._internal_z = 0.25 * s;
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
                this._internal_x = - vFrom.y;
                this._internal_y = vFrom.x;
                this._internal_z = 0;
                this._internal_w = r;
            } else {
                this._internal_x = 0;
                this._internal_y = - vFrom.z;
                this._internal_z = vFrom.y;
                this._internal_w = r;
            }
        } else {
            // crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3
            this._internal_x = vFrom.y * vTo.z - vFrom.z * vTo.y;
            this._internal_y = vFrom.z * vTo.x - vFrom.x * vTo.z;
            this._internal_z = vFrom.x * vTo.y - vFrom.y * vTo.x;
            this._internal_w = r;
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
        this._internal_x *= -1;
        this._internal_y *= -1;
        this._internal_z *= -1;

        this._onChangeCallback();
        return this;
    }

    public dot(v: ObservableQuaternion): number {
        this._onBeforeGetComponentCallback();
        return this._internal_x * v._x + this._internal_y * v._y + this._internal_z * v._z + this._internal_w * v._w;
    }

    public lengthSq(): number {
        this._onBeforeGetComponentCallback();
        return this._internal_x * this._internal_x + this._internal_y * this._internal_y + this._internal_z * this._internal_z + this._internal_w * this._internal_w;
    }

    public length(): number {
        this._onBeforeGetComponentCallback();
        return Math.sqrt(this._internal_x * this._internal_x + this._internal_y * this._internal_y + this._internal_z * this._internal_z + this._internal_w * this._internal_w);
    }

    public normalize(): ObservableQuaternion {
        let l = this.length();

        if ( l === 0 ) {
            this._onBeforeChangeCallback();
            this._internal_x = 0;
            this._internal_y = 0;
            this._internal_z = 0;
            this._internal_w = 1;
        } else {
            l = 1 / l;

            this._onBeforeGetComponentCallback();
            this._onBeforeChangeCallback();
            this._internal_x = this._internal_x * l;
            this._internal_y = this._internal_y * l;
            this._internal_z = this._internal_z * l;
            this._internal_w = this._internal_w * l;
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

        this._internal_x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        this._internal_y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        this._internal_z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        this._internal_w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

        this._onChangeCallback();
        return this;
    }

    public slerp(qb: ObservableQuaternion, t: number): ObservableQuaternion {
        if (t === 0) return this;
        if (t === 1) return this.copy(qb);

        this._onBeforeGetComponentCallback();
        const x = this._internal_x, y = this._internal_y, z = this._internal_z, w = this._internal_w;

        // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
        let cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

        this._onBeforeChangeCallback();
        if (cosHalfTheta < 0) {
            this._internal_w = - qb._w;
            this._internal_x = - qb._x;
            this._internal_y = - qb._y;
            this._internal_z = - qb._z;

            cosHalfTheta = -cosHalfTheta;
        } else {
            this.copy(qb);
        }

        if (cosHalfTheta >= 1.0) {
            this._internal_w = w;
            this._internal_x = x;
            this._internal_y = y;
            this._internal_z = z;
            return this;
        }

        const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

        if (sqrSinHalfTheta <= Number.EPSILON) {
            const s = 1 - t;
            this._internal_w = s * w + t * this._internal_w;
            this._internal_x = s * x + t * this._internal_x;
            this._internal_y = s * y + t * this._internal_y;
            this._internal_z = s * z + t * this._internal_z;

            this.normalize();
            //this._onChangeCallback(); this is unnecessary
            return this;
        }

        const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
        const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
        const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
            ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

        this._internal_w = (w * ratioA + this._internal_w * ratioB);
        this._internal_x = (x * ratioA + this._internal_x * ratioB);
        this._internal_y = (y * ratioA + this._internal_y * ratioB);
        this._internal_z = (z * ratioA + this._internal_z * ratioB);

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
            sqrt1u1 * Math.sin(u2),
        );
    }

    public equals(quaternion: ObservableQuaternion): boolean {
        this._onBeforeGetComponentCallback();
        return (quaternion._x === this._internal_x) && (quaternion._y === this._internal_y) && (quaternion._z === this._internal_z) && (quaternion._w === this._internal_w);
    }

    public fromArray(array: number[]|ArrayLike<number>, offset = 0 ): ObservableQuaternion {
        if (this._internal_x === array[offset] && this._internal_y === array[offset + 1] && this._internal_z === array[offset + 2] && this._internal_w === array[offset + 3]) return this;
        this._onBeforeChangeCallback();
        
        this._internal_x = array[offset];
        this._internal_y = array[offset + 1];
        this._internal_z = array[offset + 2];
        this._internal_w = array[offset + 3];

        this._onChangeCallback();
        return this;
    }

    public toArray(array: number[] = [], offset = 0) {
        this._onBeforeGetComponentCallback();
        array[offset] = this._internal_x;
        array[offset + 1] = this._internal_y;
        array[offset + 2] = this._internal_z;
        array[offset + 3] = this._internal_w;
        return array;
    }

    public fromBufferAttribute(attribute: BufferAttribute|InterleavedBufferAttribute, index: number): ObservableQuaternion { //TODO: pr to three-types
        this._internal_x = attribute.getX(index);
        this._internal_y = attribute.getY(index);
        this._internal_z = attribute.getZ(index);
        this._internal_w = attribute.getW(index);
        return this;
    }

    public _onChange(callback: () => void): ObservableQuaternion {
        this._onChangeCallback = callback;
        return this;
    }

    /**
     * @deprecated Use {@link Vector#applyQuaternion vector.applyQuaternion( quaternion )} instead.
     */
    public multiplyVector3(_v: any): any { throw new Error("deprecated"); }

    /**
     * @deprecated Use {@link Quaternion#invert .invert()} instead.
     */
    public inverse(): Quaternion { throw new Error("deprecated"); }
}
