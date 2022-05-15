import { Euler, Vector3 } from "three/src/Three";

import { ReadonlyEuler } from "./ReadonlyEuler";
import { ReadonlyMatrix4 } from "./ReadonlyMatrix4";
import { ReadonlyQuaternion } from "./ReadonlyQuaternion";
import { ReadonlyVector3 } from "./ReadonlyVector3";

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

    // eslint-disable-next-line @typescript-eslint/naming-convention
    _onChangeCallback: () => void;

    set(x: number, y: number, z: number, order?: string): WritableEuler;
    clone(): Euler;
    copy(euler: ReadonlyEuler): WritableEuler;
    setFromRotationMatrix(m: ReadonlyMatrix4, order?: string, update?: boolean): WritableEuler;
    setFromQuaternion(q: ReadonlyQuaternion, order?: string, update?: boolean): WritableEuler;
    setFromVector3(v: ReadonlyVector3, order?: string): WritableEuler;
    reorder(newOrder: string): WritableEuler;
    equals(euler: ReadonlyEuler): boolean;
    fromArray(xyzo: any[]): WritableEuler;
    toArray(array?: any[], offset?: number): any[];
    toVector3(optionalResult?: Vector3): Vector3;
    // eslint-disable-next-line @typescript-eslint/naming-convention
    _onChange(callback: () => void): WritableEuler;
}
