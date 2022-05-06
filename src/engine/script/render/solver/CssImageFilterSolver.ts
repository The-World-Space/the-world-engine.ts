import { ReadonlyColor } from "../../../render/ReadonlyColor";
import { Color } from "../../../render/Color";

//code from https://stackoverflow.com/a/43960991

type FilterValue = [
    number, // invert
    number, // sepia
    number, // saturate
    number, // hueRotate
    number, // brightness
    number  // contrast
];

export class CssImageFilterSolver {
    private readonly _target: Color;
    private readonly _targetHSL: { h: number, s: number, l: number };
    private readonly _reusedColor: Color;

    public constructor(target: ReadonlyColor) {
        this._target = target.clone();
        this._targetHSL = target.hsl();
        this._reusedColor = new Color(0, 0, 0);
    }

    public solve(): { values: FilterValue, loss: number } {
        const result = this.solveNarrow(this.solveWide());
        return {
            values: result.values,
            loss: result.loss
        };
    }

    private solveWide(): { values: FilterValue, loss: number } {
        const aa = 5;
        const c = 15;
        const a: FilterValue = [60, 180, 18000, 600, 1.2, 1.2];

        let best: { values: FilterValue|null, loss: number } = { values: null, loss: Infinity };
        for (let i = 0; best.loss > 25 && i < 3; i++) {
            const initial: FilterValue = [50, 20, 3750, 50, 100, 100];
            const result = this.spsa(aa, a, c, initial, 1000);
            if (result.loss < best.loss) {
                best = result;
            }
        }
        return best as { values: FilterValue, loss: number };
    }

    private solveNarrow(wide: { loss: number, values: FilterValue }): {
        values: FilterValue;
        loss: number;
    } {
        const aa = wide.loss;
        const c = 2;
        const aa1 = aa + 1;
        const a: FilterValue = [0.25 * aa1, 0.25 * aa1, aa1, 0.25 * aa1, 0.2 * aa1, 0.2 * aa1];
        return this.spsa(aa, a, c, wide.values, 500);
    }

    private spsa(aa: number, a: FilterValue, c: number, values: FilterValue, iters: number): { values: FilterValue, loss: number } {
        const alpha = 1;
        const gamma = 0.16666666666666666;

        let best: FilterValue|null = null;
        let bestLoss = Infinity;
        const deltas: FilterValue = [0, 0, 0, 0, 0, 0];
        const highArgs: FilterValue = [0, 0, 0, 0, 0, 0];
        const lowArgs: FilterValue = [0, 0, 0, 0, 0, 0];

        for (let k = 0; k < iters; k++) {
            const ck = c / Math.pow(k + 1, gamma);
            for (let i = 0; i < 6; i++) {
                deltas[i] = Math.random() > 0.5 ? 1 : -1;
                highArgs[i] = values[i] + ck * deltas[i];
                lowArgs[i] = values[i] - ck * deltas[i];
            }

            const lossDiff = this.loss(highArgs) - this.loss(lowArgs);
            for (let i = 0; i < 6; i++) {
                const g = lossDiff / (2 * ck) * deltas[i];
                const ak = a[i] / Math.pow(aa + k + 1, alpha);
                values[i] = fix(values[i] - ak * g, i);
            }

            const loss = this.loss(values);
            if (loss < bestLoss) {
                best = values.slice() as FilterValue;
                bestLoss = loss;
            }
        }
        return { values: best!, loss: bestLoss };

        function fix(value: number, idx: number): number {
            let max = 100;
            if (idx === 2 /* saturate */) {
                max = 7500;
            } else if (idx === 4 /* brightness */ || idx === 5 /* contrast */) {
                max = 200;
            }

            if (idx === 3 /* hue-rotate */) {
                if (value > max) {
                    value %= max;
                } else if (value < 0) {
                    value = max + value % max;
                }
            } else if (value < 0) {
                value = 0;
            } else if (value > max) {
                value = max;
            }
            return value;
        }
    }

    private loss(filters: FilterValue): number {
        // Argument is array of percentages.
        const color = this._reusedColor;
        color.set(0, 0, 0);

        color.invert(filters[0] / 100);
        color.sepia(filters[1] / 100);
        color.saturate(filters[2] / 100);
        color.hueRotate(filters[3] * 3.6);
        color.brightness(filters[4] / 100);
        color.contrast(filters[5] / 100);

        const colorHSL = color.hsl();
        return (
            Math.abs(color.r - this._target.r) +
            Math.abs(color.g - this._target.g) +
            Math.abs(color.b - this._target.b) +
            Math.abs(colorHSL.h - this._targetHSL.h) +
            Math.abs(colorHSL.s - this._targetHSL.s) +
            Math.abs(colorHSL.l - this._targetHSL.l)
        );
    }
}
