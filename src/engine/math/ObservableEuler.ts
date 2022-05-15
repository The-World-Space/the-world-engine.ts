import { clamp } from "three/src/math/MathUtils";
import { Euler, Matrix4, Quaternion, Vector3 } from "three/src/Three";

/** @internal  */
export class ObservableEuler {
    public readonly isEuler = true;
    
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static DefaultOrder = "XYZ";
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static RotationOrders = [ "XYZ", "YZX", "ZXY", "XZY", "YXZ", "ZYX" ];
    
    private _internalX: number;
    private _internalY: number;
    private _internalZ: number;
    private _internalOrder: string;

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public _onChangeCallback: () => void;
    private _onBeforeChangeCallback: () => void;
    private _onBeforeGetComponentCallback: () => void;

    public constructor(x = 0, y = 0, z = 0, order = ObservableEuler.DefaultOrder) {
        this._internalX = x;
        this._internalY = y;
        this._internalZ = z;
        this._internalOrder = order;
        
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
    public get _order(): string { // this can't be private because it's used like public in three.js
        this._onBeforeGetComponentCallback();
        return this._internalOrder;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public set _order(value: string) { // this can't be private because it's used like public in three.js
        this._internalOrder = value;
    }

    public get x(): number {
        this._onBeforeGetComponentCallback();
        return this._internalX;
    }

    public set x(value: number) {
        if (this._internalX === value) return;
        this._onBeforeChangeCallback();
        this._internalX = value;
        this._onChangeCallback();
    }

    public get y(): number {
        this._onBeforeGetComponentCallback();
        return this._internalY;
    }

    public set y(value: number) {
        if (this._internalY === value) return;
        this._onBeforeChangeCallback();
        this._internalY = value;
        this._onChangeCallback();
    }

    public get z(): number {
        this._onBeforeGetComponentCallback();
        return this._internalZ;
    }

    public set z(value: number) {
        if (this._internalZ === value) return;
        this._onBeforeChangeCallback();
        this._internalZ = value;
        this._onChangeCallback();
    }

    public get order(): string {
        this._onBeforeGetComponentCallback();
        return this._internalOrder;
    }

    public set order(value: string) {
        if (this._internalOrder === value) return;
        this._onBeforeChangeCallback();
        this._internalOrder = value;
        this._onChangeCallback();
    }

    public set(x: number, y: number, z: number, order?: string): ObservableEuler {
        if (x === this._internalX && y === this._internalY && z === this._internalZ && order === this._internalOrder) return this;
        this._onBeforeChangeCallback();
        this._internalX = x;
        this._internalY = y;
        this._internalZ = z;
        if (order) {
            this._internalOrder = order;
        }
        this._onChangeCallback();
        return this;
    }

    public clone(): Euler {
        this._onBeforeGetComponentCallback();
        return new Euler(this._internalX, this._internalY, this._internalZ, this._internalOrder);
    }

    public copy(euler: ObservableEuler): ObservableEuler {
        if (this._internalX === euler._internalX && this._internalY === euler._internalY && this._internalZ === euler._internalZ && this._internalOrder === euler._internalOrder) return this;
        this._onBeforeChangeCallback();
        this._internalX = euler._x;
        this._internalY = euler._y;
        this._internalZ = euler._z;
        this._internalOrder = euler._order;
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

        if (!order) order = this._internalOrder;

        this._onBeforeChangeCallback();
        switch (order) {
        case "XYZ":
            this._internalY = Math.asin(clamp(m13, -1, 1));
            if (Math.abs(m13) < 0.9999999) {
                this._internalX = Math.atan2(-m23, m33);
                this._internalZ = Math.atan2(-m12, m11);
            } else {
                this._internalX = Math.atan2(m32, m22);
                this._internalZ = 0;
            }
            break;

        case "YXZ":
            this._internalX = Math.asin(-clamp(m23, -1, 1));
            if ( Math.abs(m23) < 0.9999999) {
                this._internalY = Math.atan2(m13, m33);
                this._internalZ = Math.atan2(m21, m22);
            } else {
                this._internalY = Math.atan2(-m31, m11);
                this._internalZ = 0;
            }
            break;

        case "ZXY":
            this._internalX = Math.asin(clamp(m32, -1, 1));
            if (Math.abs(m32) < 0.9999999) {
                this._internalY = Math.atan2(-m31, m33);
                this._internalZ = Math.atan2(-m12, m22);
            } else {
                this._internalY = 0;
                this._internalZ = Math.atan2(m21, m11);
            }
            break;

        case "ZYX":
            this._internalY = Math.asin(-clamp(m31, -1, 1));
            if ( Math.abs(m31) < 0.9999999) {
                this._internalX = Math.atan2(m32, m33);
                this._internalZ = Math.atan2(m21, m11);
            } else {
                this._internalX = 0;
                this._internalZ = Math.atan2(-m12, m22);
            }
            break;

        case "YZX":
            this._internalZ = Math.asin(clamp(m21, -1, 1));
            if (Math.abs(m21) < 0.9999999) {
                this._internalX = Math.atan2(-m23, m22);
                this._internalY = Math.atan2(-m31, m11);
            } else {
                this._internalX = 0;
                this._internalY = Math.atan2(m13, m33);
            }
            break;

        case "XZY":
            this._internalZ = Math.asin(-clamp(m12, -1, 1));
            if (Math.abs(m12) < 0.9999999) {
                this._internalX = Math.atan2(m32, m22);
                this._internalY = Math.atan2(m13, m11);
            } else {
                this._internalX = Math.atan2(-m23, m33);
                this._internalY = 0;
            }
            break;

        default:
            console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: " + order);
        }
        this._internalOrder = order;

        if (update === true) this._onChangeCallback();
        return this;
    }

    public setFromQuaternion(q: Quaternion, order?: string, update?: boolean): ObservableEuler {
        tempMatrix.makeRotationFromQuaternion(q);
        return this.setFromRotationMatrix(tempMatrix, order, update);
    }

    public setFromVector3(v: Vector3, order?: string): ObservableEuler {
        return this.set(v.x, v.y, v.z, order);
    }

    public reorder(newOrder: string): ObservableEuler {
        // WARNING: this discards revolution information -bhouston
        tempQuaternion.setFromEuler(this);
        return this.setFromQuaternion(tempQuaternion, newOrder);
    }

    public equals(euler: ObservableEuler): boolean {
        this._onBeforeGetComponentCallback();
        return (euler._x === this._internalX) && (euler._y === this._internalY) && (euler._z === this._internalZ) && (euler._order === this._internalOrder);
    }

    public fromArray(array: any[]): ObservableEuler {
        if(this._internalX === array[0] && this._internalY === array[1] && this._internalZ === array[2] && this._internalOrder === array[3]) return this;
        this._onBeforeChangeCallback();
        this._internalX = array[0];
        this._internalY = array[1];
        this._internalZ = array[2];
        if (array[3] !== undefined) this._internalOrder = array[3];

        this._onChangeCallback();
        return this;
    }

    public toArray(array: any[] = [], offset = 0): any[] {
        this._onBeforeGetComponentCallback();
        array[offset] = this._internalX;
        array[offset + 1] = this._internalY;
        array[offset + 2] = this._internalZ;
        array[offset + 3] = this._internalOrder;
        return array;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public _onChange(callback: () => void): ObservableEuler {
        this._onChangeCallback = callback;
        return this;
    }

    public *[Symbol.iterator](): Generator<string | number, void> {
        this._onBeforeGetComponentCallback();
        yield this._internalX;
        this._onBeforeGetComponentCallback();
        yield this._internalY;
        this._onBeforeGetComponentCallback();
        yield this._internalZ;
        this._onBeforeGetComponentCallback();
        yield this._internalOrder;
    }
}

const tempMatrix = /*@__PURE__*/ new Matrix4();
const tempQuaternion = /*@__PURE__*/ new Quaternion();
