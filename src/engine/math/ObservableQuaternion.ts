import { BufferAttribute, Euler, InterleavedBufferAttribute, MathUtils, Matrix4, Quaternion, Vector3 } from "three";

export class ObservableQuaternion {
    public readonly isQuaternion = true;
    
    private _x: number;
    private _y: number;
    private _z: number;
    private _w: number;
    public _onChangeCallback: () => void;
    private _onBeforeGetComponentCallback: () => void;

    public constructor(x = 0, y = 0, z = 0, w = 1) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;

        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this._onChangeCallback = () => { };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this._onBeforeGetComponentCallback = () => { };
    }

    public onBeforeGetComponent(callback: () => void) {
        this._onBeforeGetComponentCallback = callback;
    }

    public static slerp(qa: ObservableQuaternion, qb: ObservableQuaternion, qm: ObservableQuaternion, t: number): void { //TODO: pr to three-types
        console.warn('THREE.Quaternion: Static .slerp() has been deprecated. Use qm.slerpQuaternions( qa, qb, t ) instead.');
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

    public get x() {
        this._onBeforeGetComponentCallback();
        return this._x;
    }

    public set x(value: number) {
        this._x = value;
        this._onChangeCallback();
    }

    public get y() {
        this._onBeforeGetComponentCallback();
        return this._y;
    }

    public set y(value: number) {
        this._y = value;
        this._onChangeCallback();
    }

    public get z() {
        this._onBeforeGetComponentCallback();
        return this._z;
    }

    public set z(value: number) {
        this._z = value;
        this._onChangeCallback();
    }

    public get w() {
        this._onBeforeGetComponentCallback();
        return this._w;
    }

    public set w(value: number) {
        this._w = value;
        this._onChangeCallback();
    }

    public set(x: number, y: number, z: number, w: number): ObservableQuaternion {
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;
        this._onChangeCallback();
        return this;
    }

    public clone(): Quaternion {
        this._onBeforeGetComponentCallback();
        return new Quaternion(this._x, this._y, this._z, this._w);
    }

    public copy(quaternion: ObservableQuaternion): ObservableQuaternion {
        this._x = quaternion.x;
        this._y = quaternion.y;
        this._z = quaternion.z;
        this._w = quaternion.w;
        this._onChangeCallback();
        return this;
    }

    public setFromEuler(euler: Euler, update?: boolean): ObservableQuaternion {
        if (!(euler && euler.isEuler)) {
            throw new Error('THREE.Quaternion: .setFromEuler() now expects an Euler rotation rather than a Vector3 and order.');
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

        switch (order) {
        case 'XYZ':
            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;
            break;

        case 'YXZ':
            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;
            break;

        case 'ZXY':
            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;
            break;

        case 'ZYX':
            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;
            break;

        case 'YZX':
            this._x = s1 * c2 * c3 + c1 * s2 * s3;
            this._y = c1 * s2 * c3 + s1 * c2 * s3;
            this._z = c1 * c2 * s3 - s1 * s2 * c3;
            this._w = c1 * c2 * c3 - s1 * s2 * s3;
            break;

        case 'XZY':
            this._x = s1 * c2 * c3 - c1 * s2 * s3;
            this._y = c1 * s2 * c3 - s1 * c2 * s3;
            this._z = c1 * c2 * s3 + s1 * s2 * c3;
            this._w = c1 * c2 * c3 + s1 * s2 * s3;
            break;

        default:
            console.warn('THREE.Quaternion: .setFromEuler() encountered an unknown order: ' + order);
        }

        if (update !== false) this._onChangeCallback();
        return this;
    }

    public setFromAxisAngle(axis: Vector3, angle: number): ObservableQuaternion {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
        // assumes axis is normalized

        const halfAngle = angle / 2, s = Math.sin(halfAngle);

        this._x = axis.x * s;
        this._y = axis.y * s;
        this._z = axis.z * s;
        this._w = Math.cos(halfAngle);

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

        if (trace > 0) {
            const s = 0.5 / Math.sqrt(trace + 1.0);

            this._w = 0.25 / s;
            this._x = (m32 - m23) * s;
            this._y = (m13 - m31) * s;
            this._z = (m21 - m12) * s;
        } else if (m11 > m22 && m11 > m33) {
            const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

            this._w = (m32 - m23) / s;
            this._x = 0.25 * s;
            this._y = (m12 + m21) / s;
            this._z = (m13 + m31) / s;
        } else if (m22 > m33) {
            const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

            this._w = (m13 - m31) / s;
            this._x = (m12 + m21) / s;
            this._y = 0.25 * s;
            this._z = (m23 + m32) / s;
        } else {
            const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

            this._w = (m21 - m12) / s;
            this._x = (m13 + m31) / s;
            this._y = (m23 + m32) / s;
            this._z = 0.25 * s;
        }

        this._onChangeCallback();
        return this;
    }

    public setFromUnitVectors(vFrom: Vector3, vTo: Vector3): ObservableQuaternion {
        // assumes direction vectors vFrom and vTo are normalized
        let r = vFrom.dot(vTo) + 1;

        if (r < Number.EPSILON) {
            // vFrom and vTo point in opposite directions
            r = 0;
            if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
                this._x = - vFrom.y;
                this._y = vFrom.x;
                this._z = 0;
                this._w = r;
            } else {
                this._x = 0;
                this._y = - vFrom.z;
                this._z = vFrom.y;
                this._w = r;
            }
        } else {
            // crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3
            this._x = vFrom.y * vTo.z - vFrom.z * vTo.y;
            this._y = vFrom.z * vTo.x - vFrom.x * vTo.z;
            this._z = vFrom.x * vTo.y - vFrom.y * vTo.x;
            this._w = r;
        }

        return this.normalize();
    }

    public angleTo(q: ObservableQuaternion): number {
        return 2 * Math.acos(Math.abs(MathUtils.clamp(this.dot(q), -1, 1)));
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
        this._x *= -1;
        this._y *= -1;
        this._z *= -1;

        this._onChangeCallback();
        return this;
    }

    public dot(v: ObservableQuaternion): number {
        this._onBeforeGetComponentCallback();
        return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
    }

    public lengthSq(): number {
        this._onBeforeGetComponentCallback();
        return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
    }

    public length(): number {
        this._onBeforeGetComponentCallback();
        return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
    }

    public normalize(): ObservableQuaternion {
        let l = this.length();

        if ( l === 0 ) {
            this._x = 0;
            this._y = 0;
            this._z = 0;
            this._w = 1;
        } else {
            l = 1 / l;

            this._onBeforeGetComponentCallback();
            this._x = this._x * l;
            this._y = this._y * l;
            this._z = this._z * l;
            this._w = this._w * l;
        }

        this._onChangeCallback();
        return this;
    }

    public multiply(q: ObservableQuaternion, p?: ObservableQuaternion): ObservableQuaternion {
        if (p !== undefined) {
            console.warn("THREE.Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.");
            return this.multiplyQuaternions(q, p);
        }
        return this.multiplyQuaternions(this, q);
    }

    public premultiply(q: ObservableQuaternion): ObservableQuaternion {
        return this.multiplyQuaternions(q, this);
    }

    public multiplyQuaternions(a: ObservableQuaternion, b: ObservableQuaternion): ObservableQuaternion {
        // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
        const qax = a._x, qay = a._y, qaz = a._z, qaw = a._w;
        const qbx = b._x, qby = b._y, qbz = b._z, qbw = b._w;

        this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

        this._onChangeCallback();
        return this;
    }

    public slerp(qb: ObservableQuaternion, t: number): ObservableQuaternion {
        if (t === 0) return this;
        if (t === 1) return this.copy(qb);

        this._onBeforeGetComponentCallback();
        const x = this._x, y = this._y, z = this._z, w = this._w;

        // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
        let cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

        if (cosHalfTheta < 0) {
            this._w = - qb._w;
            this._x = - qb._x;
            this._y = - qb._y;
            this._z = - qb._z;

            cosHalfTheta = -cosHalfTheta;
        } else {
            this.copy(qb);
        }

        if (cosHalfTheta >= 1.0) {
            this._w = w;
            this._x = x;
            this._y = y;
            this._z = z;
            return this;
        }

        const sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

        if (sqrSinHalfTheta <= Number.EPSILON) {
            const s = 1 - t;
            this._w = s * w + t * this._w;
            this._x = s * x + t * this._x;
            this._y = s * y + t * this._y;
            this._z = s * z + t * this._z;

            this.normalize();
            this._onChangeCallback();
            return this;
        }

        const sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
        const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
        const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
            ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

        this._w = (w * ratioA + this._w * ratioB);
        this._x = (x * ratioA + this._x * ratioB);
        this._y = (y * ratioA + this._y * ratioB);
        this._z = (z * ratioA + this._z * ratioB);

        this._onChangeCallback();
        return this;
    }

    public slerpQuaternions(qa: ObservableQuaternion, qb: ObservableQuaternion, t: number): void { //TODO: pr to three-types
        this.copy(qa).slerp(qb, t);
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
        return (quaternion._x === this._x) && (quaternion._y === this._y) && (quaternion._z === this._z) && (quaternion._w === this._w);
    }

    public fromArray(array: number[]|ArrayLike<number>, offset = 0 ): ObservableQuaternion {
        this._x = array[offset];
        this._y = array[offset + 1];
        this._z = array[offset + 2];
        this._w = array[offset + 3];

        this._onChangeCallback();
        return this;
    }

    public toArray(array: number[] = [], offset = 0) {
        this._onBeforeGetComponentCallback();
        array[offset] = this._x;
        array[offset + 1] = this._y;
        array[offset + 2] = this._z;
        array[offset + 3] = this._w;
        return array;
    }

    public fromBufferAttribute(attribute: BufferAttribute|InterleavedBufferAttribute, index: number): ObservableQuaternion { //TODO: pr to three-types
        this._x = attribute.getX(index);
        this._y = attribute.getY(index);
        this._z = attribute.getZ(index);
        this._w = attribute.getW(index);
        return this;
    }

    _onChange(callback: () => void): ObservableQuaternion {
        this._onChangeCallback = callback;
        return this;
    }
}
