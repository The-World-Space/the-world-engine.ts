import { Vector2 } from "three/src/Three";

const topLeft = { i: 0 as const, a: 4 };
const topCenter = { i: 0 as const, a: 5 };
const topRight = { i: 0 as const, a: 7};
const left = { i: 0 as const, a: 22 };
//const pond = { i: 0 as const, a: 23 };
const right = { i: 0 as const, a: 25 };
const bottomLeft = { i: 0 as const, a: 40 };
const bottomCenter = { i: 0 as const, a: 41 };
const bottomRight = { i: 0 as const, a: 43 };

export class MakeIsland {
    public static make(
        width: number,
        height: number,
        topEntry: number|null,
        bottomEntry: number| null
    ): ({ i: 0; a: number; }|null)[][] {
        const array2d: ({ i: 0; a: number; }|null)[][] = Array(height);
        for (let i = 0; i < height; i++) {
            array2d[i] = Array(width);
            for (let j = 0; j < width; j++) {
                array2d[i][j] = null;
            }
        }

        array2d[0][0] = topLeft;
        for (let i = 1; i < width - 1; i++) {
            array2d[0][i] = topCenter;
        }
        array2d[0][width - 1] = topRight;
        for (let i = 1; i < height - 1; i++) {
            array2d[i][0] = left;
            array2d[i][width - 1] = right;
        }
        array2d[height - 1][0] = bottomLeft;
        for (let i = 1; i < width - 1; i++) {
            array2d[height - 1][i] = bottomCenter;
        }
        array2d[height - 1][width - 1] = bottomRight;

        if (topEntry !== null) {
            array2d[0][topEntry] = null;
        }

        if (bottomEntry !== null) {
            array2d[height - 1][bottomEntry] = null;
        }
        
        return array2d;
    }

    public static computeEntryPosition(
        height: number,
        topEntry: number|null,
        bottomEntry: number| null,
        x: number,
        y: number
    ): { top: Vector2|null, bottom: Vector2|null } {
        const top = topEntry !== null ? new Vector2(x + topEntry, y + height - 1) : null;
        const bottom = bottomEntry !== null ? new Vector2(x + bottomEntry, y) : null;
        return { top, bottom };
    }
}
