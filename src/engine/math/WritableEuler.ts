import { Euler, Vector3 } from "three";
import { ReadOnlyEuler } from "./ReadOnlyEuler";
import { ReadOnlyMatrix4 } from "./ReadOnlyMatrix4";
import { ReadOnlyQuaternion } from "./ReadOnlyQuaternion";
import { ReadOnlyVector3 } from "./ReadOnlyVector3";

export type WritableEuler = {
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

    /**
     * @default THREE.Euler.DefaultOrder
     */
    order: string;
    readonly isEuler: true;

    _onChangeCallback: () => void;

    set(x: number, y: number, z: number, order?: string): WritableEuler;
    clone(): Euler;
    copy(euler: ReadOnlyEuler): WritableEuler;
    setFromRotationMatrix(m: ReadOnlyMatrix4, order?: string, update?: boolean): WritableEuler;
    setFromQuaternion(q: ReadOnlyQuaternion, order?: string, update?: boolean): WritableEuler;
    setFromVector3(v: ReadOnlyVector3, order?: string): WritableEuler;
    reorder(newOrder: string): WritableEuler;
    equals(euler: ReadOnlyEuler): boolean;
    fromArray(xyzo: any[]): WritableEuler;
    toArray(array?: any[], offset?: number): any[];
    toVector3(optionalResult?: Vector3): Vector3;
    _onChange(callback: () => void): WritableEuler;
}
