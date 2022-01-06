import { Euler, Matrix4, Quaternion, Vector3 } from "three";
import { clamp } from "three/src/math/MathUtils";

export class ObservableEuler {
    public readonly isEuler = true;
    
    public static DefaultOrder = "XYZ";
    public static RotationOrders = [ "XYZ", "YZX", "ZXY", "XZY", "YXZ", "ZYX" ];
	
    private _x: number;
    private _y: number;
    private _z: number;
    private _order: string;
    public _onChangeCallback: () => void;
    private _onBeforeGetComponentCallback: () => void;

    public constructor(x = 0, y = 0, z = 0, order = ObservableEuler.DefaultOrder) {
		this._x = x;
		this._y = y;
		this._z = z;
		this._order = order;
        
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this._onChangeCallback = () => { };
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this._onBeforeGetComponentCallback = () => { };
	}

    public onBeforeGetComponent(callback: () => void) {
        this._onBeforeGetComponentCallback = callback;
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

	public get order() {
        this._onBeforeGetComponentCallback();
		return this._order;
	}

	public set order(value: string) {
		this._order = value;
		this._onChangeCallback();
	}

	public set(x: number, y: number, z: number, order?: string): ObservableEuler {
        this._x = x;
        this._y = y;
        this._z = z;
        if (order) {
            this._order = order;
        } else {
            this._onBeforeGetComponentCallback();
            this._order = this._order;
        }
        this._onChangeCallback();
        return this;
    }

	public clone(): Euler {
        this._onBeforeGetComponentCallback();
		return new Euler(this._x, this._y, this._z, this._order);
	}

	public copy(euler: ObservableEuler): ObservableEuler {
		this._x = euler._x;
		this._y = euler._y;
		this._z = euler._z;
		this._order = euler._order;
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

        if (!order) order = this._order;

		switch (order) {
        case "XYZ":
            this._y = Math.asin(clamp(m13, -1, 1));
            if (Math.abs(m13) < 0.9999999) {
                this._x = Math.atan2(-m23, m33);
                this._z = Math.atan2(-m12, m11);
            } else {
                this._x = Math.atan2(m32, m22);
                this._z = 0;
            }
            break;

        case "YXZ":
            this._x = Math.asin(-clamp(m23, -1, 1));
            if ( Math.abs(m23) < 0.9999999) {
                this._y = Math.atan2(m13, m33);
                this._z = Math.atan2(m21, m22);
            } else {
                this._y = Math.atan2(-m31, m11);
                this._z = 0;
            }
            break;

        case "ZXY":
            this._x = Math.asin(clamp(m32, -1, 1));
            if (Math.abs(m32) < 0.9999999) {
                this._y = Math.atan2(-m31, m33);
                this._z = Math.atan2(-m12, m22);
            } else {
                this._y = 0;
                this._z = Math.atan2(m21, m11);
            }
            break;

        case "ZYX":
            this._y = Math.asin(-clamp(m31, -1, 1));
            if ( Math.abs(m31) < 0.9999999) {
                this._x = Math.atan2(m32, m33);
                this._z = Math.atan2(m21, m11);
            } else {
                this._x = 0;
                this._z = Math.atan2(-m12, m22);
            }
            break;

        case "YZX":
            this._z = Math.asin(clamp(m21, -1, 1));
            if (Math.abs(m21) < 0.9999999) {
                this._x = Math.atan2(-m23, m22);
                this._y = Math.atan2(-m31, m11);
            } else {
                this._x = 0;
                this._y = Math.atan2(m13, m33);
            }
            break;

        case "XZY":
            this._z = Math.asin(-clamp(m12, -1, 1));
            if (Math.abs(m12) < 0.9999999) {
                this._x = Math.atan2(m32, m22);
                this._y = Math.atan2(m13, m11);
            } else {
                this._x = Math.atan2(-m23, m33);
                this._y = 0;
            }
            break;

        default:
            console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + order);
		}
		this._order = order;

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
		return (euler._x === this._x) && (euler._y === this._y) && (euler._z === this._z) && (euler._order === this._order);
	}

	public fromArray(array: any[]): ObservableEuler {
		this._x = array[0];
		this._y = array[1];
		this._z = array[2];
		if (array[3] !== undefined) this._order = array[3];

		this._onChangeCallback();
		return this;
	}

	public toArray(array: any[] = [], offset = 0): number[] {
        this._onBeforeGetComponentCallback();
		array[offset] = this._x;
		array[offset + 1] = this._y;
		array[offset + 2] = this._z;
		array[offset + 3] = this._order;
		return array;
	}

	public toVector3(optionalResult?: Vector3): Vector3 {
        this._onBeforeGetComponentCallback();
		if (optionalResult) {
			return optionalResult.set(this._x, this._y, this._z);
		} else {
			return new Vector3(this._x, this._y, this._z);
		}
	}

	public _onChange(callback: () => void): ObservableEuler {
		this._onChangeCallback = callback;
		return this;
	}
}

const _matrix = /*@__PURE__*/ new Matrix4();
const _quaternion = /*@__PURE__*/ new Quaternion();
