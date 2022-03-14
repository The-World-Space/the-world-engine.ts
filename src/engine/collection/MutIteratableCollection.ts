import { Set } from "js-sdsl";
import { SetType } from "js-sdsl/dist/esm/Set/Set";

/** @internal */
export class MutIteratableCollection<T extends { isRemoved: boolean }> {
    private _iterateCollection: SetType<T>|null = null;
    private _collection: SetType<T>;

    private _insertBuffer: SetType<T>;
    private _insertBufferSwap: SetType<T>;
    private _deleteBuffer: SetType<T>;

    public constructor(comparator: (a: T, b: T) => number) {
        this._collection = new Set<T>(undefined, comparator);
        this._insertBuffer = new Set<T>(undefined, comparator);
        this._insertBufferSwap = new Set<T>(undefined, comparator);
        this._deleteBuffer = new Set<T>(undefined, comparator);
    }

    public get size(): number {
        return this._collection.size();
    }

    /** Set an entry, O(log n) */
    public insert(value: T): void {
        if (this._iterateCollection !== null) this._insertBuffer.insert(value);
        else this._collection.insert(value);
    }

    /** Delete an entry with the key from the tree, O(log n) 
     *  Error: if the key is not in the tree */
    public delete(value: T): void {
        if (this._iterateCollection !== null) {
            value.isRemoved = true;
            this._deleteBuffer.insert(value);
        } else this._collection.eraseElementByValue(value);
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
            if (!value.isRemoved) callback(value);
        });

        do {
            this._iterateCollection = this.flushBuffer();
            this._iterateCollection.forEach((value: T) => {
                if (!value.isRemoved) callback(value);
            });
        } while (0 < this._insertBuffer.size() || 0 < this._deleteBuffer.size());
        this._iterateCollection = null;
    }

    private flushBuffer(): SetType<T> {
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
