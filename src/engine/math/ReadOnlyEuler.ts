import { Euler } from "three/src/math/Euler";

export type ReadonlyEuler = {
    /**
     * @default 0
     */
    readonly x: number;

    /**
     * @default 0
     */
    readonly y: number;

    /**
     * @default 0
     */
    readonly z: number;

    /**
     * @default THREE.Euler.DefaultOrder
     */
    readonly order: string;
    readonly isEuler: true;

    clone(): Euler;
    equals(euler: ReadonlyEuler): boolean;
    toArray(array?: any[], offset?: number): any[];
};
