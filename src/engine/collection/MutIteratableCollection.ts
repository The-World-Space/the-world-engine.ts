export class MutIteratableCollection<T> {
    private _compartor: (a: T, b: T) => number;
    private _nullCompartor: (a: T|null, b: T|null) => number;
    private _list: (T|null)[];
    private _addItemBuffer: T[];
    private _count: number;
    private _iterating: boolean;

    public constructor(compartor: (a: T, b: T) => number) {
        this._compartor = compartor;
        this._nullCompartor = (a: T|null, b: T|null) => {
            //null is always bigger than any other value
            if (a === null) return 1;
            if (b === null) return -1;
            return this._compartor(a, b);
        };
        this._list = [];
        this._addItemBuffer = [];
        this._count = 0;
        this._iterating = false;
    }

    //if found is true then item can list[index] = item
    //if found is false then list must be spliced
    private binarySearchFindSpace(item: T): { index: number, found: boolean } {
        let low = 0;
        let high = this._list.length - 1;
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const comp = this._nullCompartor(this._list[mid], item);
            if (comp === 0) {
                return { index: mid, found: true };
            } else if (comp < 0) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return { index: low, found: false };
    }

    private binarySearchFindIndex(item: T): number {
        let low = 0;
        let high = this._list.length - 1;
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const comp = this._nullCompartor(this._list[mid], item);
            if (comp === 0) {
                return mid;
            } else if (comp < 0) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1;
    }

    public add(item: T): void {
        if (this._iterating) {
            this._addItemBuffer.push(item);
        } else {
            const searchResult = this.binarySearchFindSpace(item);
            if (searchResult.found) {
                this._list[searchResult.index] = item;
            } else {
                this._list.splice(searchResult.index, 0, item);
            }
            this._count += 1;
        }
    }

    //it can be called when iterating the list
    public remove(item: T): void {
        const index = this.binarySearchFindIndex(item);
        if (index >= 0) {
            this._list[index] = null;
            this._count -= 1;
        }
    }

    public clear(): void {
        this._list.length = 0;
        this._addItemBuffer.length = 0;
        this._count = 0;
    }

    private flushAddBuffer(): T[] {
        this._addItemBuffer.sort(this._compartor);
        this._list.push(...this._addItemBuffer);
        this._count += this._addItemBuffer.length;

        const ret = this._addItemBuffer;
        this._addItemBuffer = [];
        return ret;
    }

    public forEach(callback: (item: T) => void): void {
        this._iterating = true;
        
        for (let i = 0, len = this._list.length; i < len; i++) {
            const item = this._list[i];
            if (item) callback(item);
        }

        if (this._addItemBuffer.length > 0) {
            do {
                const foreachList: T[] = this.flushAddBuffer();
                for (let i = 0, len = foreachList.length; i < len; i++) {
                    const item = foreachList[i];
                    callback(item);
                }
            } while (this._addItemBuffer.length > 0);
            
            this._list.sort(this._nullCompartor);
            this._list.length = this._count;
        }
        this._iterating = false;
    }
}
