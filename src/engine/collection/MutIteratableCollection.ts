import OrderedSet from "js-sdsl/dist/esm/container/TreeContainer/OrderedSet";

/** @internal */
export class MutIteratableCollection<T extends { isRemoved: boolean }> {
    private _iterateCollection: OrderedSet<T>|null = null;
    private readonly _collection: OrderedSet<T>;

    private _insertBuffer: OrderedSet<T>;
    private _insertBufferSwap: OrderedSet<T>;
    private readonly _deleteBuffer: OrderedSet<T>;

    public constructor(comparator: (a: T, b: T) => number) {
        this._collection = new OrderedSet<T>(undefined, comparator);
        this._insertBuffer = new OrderedSet<T>(undefined, comparator);
        this._insertBufferSwap = new OrderedSet<T>(undefined, comparator);
        this._deleteBuffer = new OrderedSet<T>(undefined, comparator);
    }

    public get size(): number {
        return this._collection.size();
    }
    
    /** Set an entry, O(log n) */
    public insert(value: T): void {
        value.isRemoved = false;
        if (this._iterateCollection !== null) this._insertBuffer.insert(value);
        else this._collection.insert(value);
    }

    /**
     * Delete an entry with the key from the tree, O(log n) 
     * if the entry is not found, nothing happens
     */
    public delete(value: T): void {
        if (this._iterateCollection !== null) {
            value.isRemoved = true;
            this._deleteBuffer.insert(value);
        } else this._collection.eraseElementByKey(value);
    }

    /** Clear the tree, same as `Map.clear()`, O(1) 
     * UB: you don't call this when iterating the tree */
    public clear(): void {
        this._collection.clear();
        this._insertBuffer.clear();
        this._deleteBuffer.clear();
    }

    public forEach(callback: (value: T) => void): void {
        this._iterateCollection = this._collection;
        this._iterateCollection.forEach((value: T) => {
            //if the entry is not removed, call the callback
            if (!value.isRemoved) callback(value);
        });

        do {
            this._iterateCollection = this.flushBuffer();
            this._iterateCollection.forEach((value: T) => {
                //if the entry is not removed, call the callback
                if (!value.isRemoved) callback(value);
            });
        } while (0 < this._insertBuffer.size() || 0 < this._deleteBuffer.size());
        this._iterateCollection = null;
    }

    private flushBuffer(): OrderedSet<T> {
        this._iterateCollection = null;
        this._deleteBuffer.forEach((value: T) => this.delete(value));
        this._insertBuffer.forEach((value: T) => this.insert(value));
        
        const insertBuffer = this._insertBuffer;
        this._insertBuffer = this._insertBufferSwap;
        this._insertBufferSwap = insertBuffer;

        this._insertBuffer.clear();
        this._deleteBuffer.clear();

        return insertBuffer;
    }
}
