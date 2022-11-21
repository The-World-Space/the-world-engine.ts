/**
 * two dimensional string mapper
 *
 * It's used to construct things like tilemap.
 */
export class TwoDimensionalStringMapper {
    /**
     * map string to T
     *
     * it will throw error if the string is not in the map
     * @param array two dimensional string array
     * @param converter converter functions
     * @returns mapped array
     */
    public static map<T>(
        array: string[],
        converter: { [key: string]: (column: number, row: number) => T }
    ): T[][] {
        const result: T[][] = [];
        for (let row = 0; row < array.length; ++row) {
            const rowArray: T[] = [];

            const str = array[row];
            for (let column = 0; column < str.length; ++column) {
                const char = str[column];
                if (converter[char] === undefined) {
                    throw new Error(`conversion not found for ${char}`);
                }
                rowArray.push(converter[char](column, row));
            }
            result.push(rowArray);
        }
        return result;
    }
}
