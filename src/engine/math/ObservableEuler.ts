import { Euler, Matrix4, Quaternion, Vector3 } from "three/src/Three";
import { clamp } from "three/src/math/MathUtils";

/** @internal  */
export class ObservableEuler {
    public readonly isEuler = true;
    
    public static DefaultOrder = "XYZ";
    public static RotationOrders = [ "XYZ", "YZX", "ZXY", "XZY", "YXZ", "ZYX" ];
    
    private _internal_x: number;
    private _internal_y: number;
    private _internal_z: number;
    private _internal_order: string;

    public _onChangeCallback: () => void;
    private _onBeforeChangeCallback: () => void;
    private _onBeforeGetComponentCallback: () => void;

    public constructor(x = 0, y = 0, z = 0, order = ObservableEuler.DefaultOrder) {
        this._internal_x = x;
        this._internal_y = y;
        this._internal_z = z;
        this._internal_order = order;
        
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

    public get _x(): number { // this can't be private because it's used like public in three.js
        this._onBeforeGetComponentCallback();
        return this._internal_x;
    }

    public set _x(value: number) { // this can't be private because it's used like public in three.js
        this._internal_x = value;
    }

    public get _y(): number { // this can't be private because it's used like public in three.js
        this._onBeforeGetComponentCallback();
        return this._internal_y;
    }

    public set _y(value: number) { // this can't be private because it's used like public in three.js
        this._internal_y = value;
    }

    public get _z(): number { // this can't be private because it's used like public in three.js
        this._onBeforeGetComponentCallback();
        return this._internal_z;
    }

    public set _z(value: number) { // this can't be private because it's used like public in three.js
        this._internal_z = value;
    }

    public get _order(): string { // this can't be private because it's used like public in three.js
        this._onBeforeGetComponentCallback();
        return this._internal_order;
    }

    public set _order(value: string) { // this can't be private because it's used like public in three.js
        this._internal_order = value;
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

    public get order() {
        this._onBeforeGetComponentCallback();
        return this._internal_order;
    }

    public set order(value: string) {
        if (this._internal_order === value) return;
        this._onBeforeChangeCallback();
        this._internal_order = value;
        this._onChangeCallback();
    }

    public set(x: number, y: number, z: number, order?: string): ObservableEuler {
        if (x === this._internal_x && y === this._internal_y && z === this._internal_z && order === this._internal_order) return this;
        this._onBeforeChangeCallback();
        this._internal_x = x;
        this._internal_y = y;
        this._internal_z = z;
        if (order) {
            this._internal_order = order;
        }
        this._onChangeCallback();
        return this;
    }

    public clone(): Euler {
        this._onBeforeGetComponentCallback();
        return new Euler(this._internal_x, this._internal_y, this._internal_z, this._internal_order);
    }

    public copy(euler: ObservableEuler): ObservableEuler {
        if (this._internal_x === euler._internal_x && this._internal_y === euler._internal_y && this._internal_z === euler._internal_z && this._internal_order === euler._internal_order) return this;
        this._onBeforeChangeCallback();
        this._internal_x = euler._x;
        this._internal_y = euler._y;
        this._internal_z = euler._z;
        this._internal_order = euler._order;
        this._onChangeCallback();
        return this;
    }

    public setFromRotationMatrix(m: Matrix4, order?: string, update = true): ObservableEuler {
        this._onBeforeGetComponentCallback();

        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
        const te = m.elements;
        const m11 = te[0], m12 = te[4], m13 = te[8];
        const m21 = te[1], m22 = te[5], m23 = te[9];
        const m31 = te[2], m32 = te[6], m33 = te[10];

        if (!order) order = this._internal_order;

        this._onBeforeChangeCallback();
        switch (order) {
        case "XYZ":
            this._internal_y = Math.asin(clamp(m13, -1, 1));
            if (Math.abs(m13) < 0.9999999) {
                this._internal_x = Math.atan2(-m23, m33);
                this._internal_z = Math.atan2(-m12, m11);
            } else {
                this._internal_x = Math.atan2(m32, m22);
                this._internal_z = 0;
            }
            break;

        case "YXZ":
            this._internal_x = Math.asin(-clamp(m23, -1, 1));
            if ( Math.abs(m23) < 0.9999999) {
                this._internal_y = Math.atan2(m13, m33);
                this._internal_z = Math.atan2(m21, m22);
            } else {
                this._internal_y = Math.atan2(-m31, m11);
                this._internal_z = 0;
            }
            break;

        case "ZXY":
            this._internal_x = Math.asin(clamp(m32, -1, 1));
            if (Math.abs(m32) < 0.9999999) {
                this._internal_y = Math.atan2(-m31, m33);
                this._internal_z = Math.atan2(-m12, m22);
            } else {
                this._internal_y = 0;
                this._internal_z = Math.atan2(m21, m11);
            }
            break;

        case "ZYX":
            this._internal_y = Math.asin(-clamp(m31, -1, 1));
            if ( Math.abs(m31) < 0.9999999) {
                this._internal_x = Math.atan2(m32, m33);
                this._internal_z = Math.atan2(m21, m11);
            } else {
                this._internal_x = 0;
                this._internal_z = Math.atan2(-m12, m22);
            }
            break;

        case "YZX":
            this._internal_z = Math.asin(clamp(m21, -1, 1));
            if (Math.abs(m21) < 0.9999999) {
                this._internal_x = Math.atan2(-m23, m22);
                this._internal_y = Math.atan2(-m31, m11);
            } else {
                this._internal_x = 0;
                this._internal_y = Math.atan2(m13, m33);
            }
            break;

        case "XZY":
            this._internal_z = Math.asin(-clamp(m12, -1, 1));
            if (Math.abs(m12) < 0.9999999) {
                this._internal_x = Math.atan2(m32, m22);
                this._internal_y = Math.atan2(m13, m11);
            } else {
                this._internal_x = Math.atan2(-m23, m33);
                this._internal_y = 0;
            }
            break;

        default:
            console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + order);
        }
        this._internal_order = order;

        if (update === true) this._onChangeCallback();
        return this;
    }

    public setFromQuaternion(q: Quaternion, order?: string, update?: boolean): ObservableEuler {
        _matrix.makeRotationFromQuaternion(q);
        return this.setFromRotationMatrix(_matrix, order, update);
    }

    public setFromVector3(v: Vector3, order?: string): ObservableEuler {
        return this.set(v.x, v.y, v.z, order);
    }

    public reorder(newOrder: string): ObservableEuler {
        // WARNING: this discards revolution information -bhouston
        _quaternion.setFromEuler(this);
        return this.setFromQuaternion(_quaternion, newOrder);
    }

    public equals(euler: ObservableEuler): boolean {
        this._onBeforeGetComponentCallback();
        return (euler._x === this._internal_x) && (euler._y === this._internal_y) && (euler._z === this._internal_z) && (euler._order === this._internal_order);
    }

    public fromArray(array: any[]): ObservableEuler {
        if(this._internal_x === array[0] && this._internal_y === array[1] && this._internal_z === array[2] && this._internal_order === array[3]) return this;
        this._onBeforeChangeCallback();
        this._internal_x = array[0];
        this._internal_y = array[1];
        this._internal_z = array[2];
        if (array[3] !== undefined) this._internal_order = array[3];

        this._onChangeCallback();
        return this;
    }

    public toArray(array: any[] = [], offset = 0): any[] {
        this._onBeforeGetComponentCallback();
        array[offset] = this._internal_x;
        array[offset + 1] = this._internal_y;
        array[offset + 2] = this._internal_z;
        array[offset + 3] = this._internal_order;
        return array;
    }

    public _onChange(callback: () => void): ObservableEuler {
        this._onChangeCallback = callback;
        return this;
    }
}

const _matrix = /*@__PURE__*/ new Matrix4();
const _quaternion = /*@__PURE__*/ new Quaternion();
