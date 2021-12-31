export class CompactableCollection<T> {
    private _compartor: (a: T, b: T) => number;
    private _nullCompartor: (a: T|null, b: T|null) => number;
    private _list: (T|null)[];
    private _count: number;
    private _isCompacted: boolean;

    public constructor(compartor: (a: T, b: T) => number) {
        this._compartor = compartor;
        this._nullCompartor = (a: T|null, b: T|null) => {
            //null is always bigger than any other value
            if (a === null) return 1;
            if (b === null) return -1;
            return this._compartor(a, b);
        };
        this._list = [];
        this._count = 0;
        this._isCompacted = true;
    }

    public compact(): void {
        if (this._isCompacted) return;
        
        let insertIndex = 0;
        for (let i = 0; i < this._list.length; i++) {
            if (this._list[i] === null) continue;
            this._list[insertIndex] = this._list[i];
            insertIndex += 1;
        }
        this._list.length = insertIndex;
        this._isCompacted = true;
    }

    //it must not be called when iterating the list
    public add(item: T): void {
        const index = this.binarySearch(item);
        this._list.splice(index, 0, item);
        this._count += 1;
    }

    //it must not be called when iterating the list
    //it also compact the list
    public addItems(items: T[]): void {
        this._list.push(...items);
        this._list.sort(this._nullCompartor);
        this._count += items.length;
        this._list.length = this._count;
        this._isCompacted = true;
    }

    //it can be called when iterating the list
    public remove(item: T): void {
        for (let i = 0; i < this._list.length; i++) {
            if (this._list[i] === item) {
                this._list[i] = null;
                this._count -= 1;
                this._isCompacted = false;
                return;
            }
        }
    }

    //this method should be called only when the list is compacted
    private binarySearch(item: T): number {
        if (!this._isCompacted) throw new Error("binarySearch should be called only when the list is compacted");
        let low = 0;
        let high = this._list.length - 1;
        while (low <= high) {
            const middle = Math.floor((low + high) / 2);
            const comp = this._compartor(item, this._list[middle]!);
            if (comp < 0) {
                high = middle - 1;
            } else if (comp > 0) {
                low = middle + 1;
            } else {
                return middle;
            }
        }
        return low;
    }

    public clear(): void {
        this._list.length = 0;
        this._count = 0;
        this._isCompacted = true;
    }

    public forEach(callback: (item: T) => void): void {
        for (const item of this._list) {
            if (item) callback(item);
        }
    }

    public get length(): number {
        return this._count;
    }

    public get nullCount(): number {
        return this._list.length - this._count;
    }
}
