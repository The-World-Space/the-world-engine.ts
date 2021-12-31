export declare class CompactableCollection<T> {
    private _compartor;
    private _nullCompartor;
    private _list;
    private _count;
    private _isCompacted;
    constructor(compartor: (a: T, b: T) => number);
    compact(): void;
    add(item: T): void;
    addItems(items: T[]): void;
    remove(item: T): void;
    private binarySearch;
    clear(): void;
    forEach(callback: (item: T) => void): void;
    get length(): number;
    get nullCount(): number;
}
