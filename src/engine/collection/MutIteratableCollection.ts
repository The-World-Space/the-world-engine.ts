//implimentation based on https://github.com/nalply/rbts/blob/master/tree.ts

class RbNode<T> {
    public value: T;
    public parent: RbNode<T> = RbNode.nilNode as RbNode<T>;
    public left: RbNode<T> = RbNode.nilNode as RbNode<T>;
    public right: RbNode<T> = RbNode.nilNode as RbNode<T>;
    public black = true;

    public get red() { return !this.black; }
    public set red(value: boolean) { this.black = !value; }

    /** Construct a new standalone Node with key and value */
    public constructor(value: T) { this.value = value; }

    /** The one and only nil Node */
    public static readonly nilNode: RbNode<any> = nilNode();

    /** True if node is nil */
    public get nil(): boolean { return this === RbNode.nilNode; }

    /** True if node is not nil */
    public get ok(): boolean { return this !== RbNode.nilNode; }
}

// Must be called only once because we should have only one nil Node!
function nilNode(): RbNode<any> {
    return Object.freeze(
        new class extends RbNode<unknown> {
            public constructor() {
                super(Symbol("nilNode.value"));
                this.parent = this.left = this.right = this;
            }
        },
    );
}

type Less<K, N> = (key: K, node: N) => boolean;

class IteratableCollection<T> {
    private _root: RbNode<T> = RbNode.nilNode;
    private _size = 0;
    private readonly _less: Less<T, RbNode<T>>;
    //private readonly _equal: (a: T, b: T) => boolean; // for performance reasons we don't use this

    public constructor(
        lessOp: (a: T, b: T) => boolean,
        //equalOp: (a: T, b: T) => boolean,
    ) {
        this._less = (a, b) => lessOp(a, b.value);
        //this._equal = equalOp;
    }

    /** @returns the number of entries in the tree, O(1) */
    public get size() {
        return this._size;
    }

    /** Set an entry, O(log n) */
    public insert(value: T): void {
        const node = this.findNode(value);
        node.ok ? node.value = value : this.insertNode(new RbNode(value));
    }

    /** Delete an entry with the key from the tree, O(log n)
     * @returns true if there was a key
     */
    public delete(value: T): boolean {
        const node = this.findNode(value);
        const result = this.deleteNode(node);
        if (node.ok) node.parent = node.left = node.right = RbNode.nilNode;
        return result;
    }

    /** Clear the tree, same as `Map.clear()`, O(1) */
    public clear(): void {
        this._root = RbNode.nilNode;
        this._size = 0;
    }

    public forEach(callback: (value: T) => void): void {
        let started = false;
        let node: RbNode<T> = RbNode.nilNode as RbNode<T>;
        const end: RbNode<T> = RbNode.nilNode as RbNode<T>;

        for (; ;) {
            if (node.nil) node = this.firstNode();
            if (started) node = this.nextNode(node);
            started = true;

            const done = node.nil || node === end;
            if (done) return;
            callback(node.value);
        }
    }

    private firstNode(node: RbNode<T> = this._root): RbNode<T> {
        while (node.left.ok) node = node.left;
        return node;
    }

    private nextNode(node: RbNode<T>): RbNode<T> {
        if (node.nil) return node;
        if (node.right.ok) return this.firstNode(node.right);
        let parent = node.parent;
        while (parent.ok && node === parent.right) {
            node = parent;
            parent = parent.parent;
        }
        return parent;
    }

    private findNode(value: T): RbNode<T> {
        let node: RbNode<T> = this._root;
        //while (node.ok && !this._equal(value, node.value)) {
        while (node.ok && value !== node.value) {
            node = this._less(value, node) ? node.left : node.right;
        }
        return node;
    }

    private insertNode(node: RbNode<T>): void {
        if (node.nil) return;

        node.parent = node.left = node.right = RbNode.nilNode;
        this._size += 1;
        if (this._root.nil) {
            this._root = node;
            return;
        }

        let parent, n;
        parent = n = this._root;
        while (n.ok) {
            parent = n;
            n = this._less(node.value, n) ? n.left : n.right;
        }
        node.parent = parent;

        if (this._less(node.value, parent)) parent.left = node;
        else parent.right = node;
        node.red = true;

        while (node.parent.red) {
            parent = node.parent;
            const grandp = parent.parent;
            if (parent === grandp.left) {
                if (grandp.right.red) {
                    parent.black = grandp.right.black = grandp.red = true;
                    node = grandp;
                    continue;
                }
                if (node === parent.right) {
                    this.leftRotate(parent);
                    [parent, node] = [node, parent];
                }
                parent.black = grandp.red = true;
                this.rightRotate(grandp);
                continue;
            }
            if (grandp.left.red) {
                parent.black = grandp.left.black = grandp.red = true;
                node = grandp;
                continue;
            }
            if (node === parent.left) {
                this.rightRotate(parent);
                [parent, node] = [node, parent];
            }
            parent.black = grandp.red = true;
            this.leftRotate(grandp);
        }
        this._root.black = true;
        return;
    }

    private deleteNode(node: RbNode<T>): boolean {
        if (node.nil) return false;

        this._size -= 1;

        let child: RbNode<T>, parent: RbNode<T>, red: boolean;
        if (node.left.ok && node.right.ok) {
            const next = this.firstNode(node.right);
            if (node === this._root) this._root = next;
            else {
                node === node.parent.left
                    ? node.parent.left = next
                    : node.parent.right = next;
            }
            child = next.right, parent = next.parent, red = next.red;
            if (node === parent) parent = next;
            else {
                if (child.ok) child.parent = parent;
                parent.left = child;
                next.right = node.right;
                node.right.parent = next;
            }
            next.parent = node.parent;
            next.black = node.black;
            node.left.parent = next;
            if (red) return true;
        }
        else {
            node.left.ok ? child = node.left : child = node.right;
            parent = node.parent, red = node.red;
            if (child.ok) child.parent = parent;
            if (node === this._root) this._root = child;
            else parent.left === node ? parent.left = child : parent.right = child;
            if (red) return true;
        }

        // Reinstate the red-black tree invariants after the delete
        node = child;
        while (node !== this._root && node.black) {
            if (node === parent.left) {
                let brother = parent.right;
                if (brother.red) {
                    brother.black = parent.red = true;
                    this.leftRotate(parent);
                    brother = parent.right;
                }
                if (brother.left.black && brother.right.black) {
                    brother.red = true;
                    node = parent;
                    parent = node.parent;
                    continue;
                }
                if (brother.right.black) {
                    brother.left.black = brother.red = true;
                    this.rightRotate(brother);
                    brother = parent.right;
                }
                brother.black = parent.black;
                parent.black = brother.right.black = true;
                this.leftRotate(parent);
                node = this._root;
                break;
            }
            else {
                let brother = parent.left;
                if (brother.red) {
                    brother.black = parent.red = true;
                    this.rightRotate(parent);
                    brother = parent.left;
                }
                if (brother.left.black && brother.right.black) {
                    brother.red = true;
                    node = parent;
                    parent = node.parent;
                    continue;
                }
                if (brother.left.black) {
                    brother.right.black = brother.red = true;
                    this.leftRotate(brother);
                    brother = parent.left;
                }
                brother.black = parent.black;
                parent.black = brother.left.black = true;
                this.rightRotate(parent);
                node = this._root;
                break;
            }
        }
        if (node.ok) node.black = true;
        return true;
    }

    private leftRotate(node: RbNode<T>): void {
        const child = node.right;
        node.right = child.left;
        if (child.left.ok) child.left.parent = node;
        child.parent = node.parent;
        if (node === this._root) this._root = child;
        else if (node === node.parent.left) node.parent.left = child;
        else node.parent.right = child;
        node.parent = child;
        child.left = node;
    }

    private rightRotate(node: RbNode<T>): void {
        const child = node.left;
        node.left = child.right;
        if (child.right.ok) child.right.parent = node;
        child.parent = node.parent;
        if (node === this._root) this._root = child;
        else if (node === node.parent.left) node.parent.left = child;
        else node.parent.right = child;
        node.parent = child;
        child.right = node;
    }
}

/** @internal */
export class MutIteratableCollection<T> {
    private _iterateCollection: IteratableCollection<T>|null = null;
    private _currentItem: T|null = null;
    private _collection: IteratableCollection<T>;

    private _insertBuffer: IteratableCollection<T>;
    private _insertBufferSwap: IteratableCollection<T>;
    private _deleteBuffer: IteratableCollection<T>;

    public constructor(lessOp: (a: T, b: T) => boolean) {
        this._collection = new IteratableCollection<T>(lessOp);
        this._insertBuffer = new IteratableCollection<T>(lessOp);
        this._insertBufferSwap = new IteratableCollection<T>(lessOp);
        this._deleteBuffer = new IteratableCollection<T>(lessOp);
    }

    public get size(): number {
        return this._collection.size;
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
            if (this._currentItem === value) {
                this._deleteBuffer.insert(value);
            } else if (!this._iterateCollection.delete(value)) {
                if (!this._insertBuffer.delete(value)) throw new Error("Value not found");
            }
        }
        else if (!this._collection.delete(value)) throw new Error("Value not found");
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
            this._currentItem = value;
            callback(value);
        });
        this._currentItem = null;

        if (0 < this._insertBuffer.size) {
            do {
                this._iterateCollection = this.flushBuffer();
                this._iterateCollection.forEach((value: T) => {
                    this._currentItem = value;
                    callback(value);
                });
            } while (0 < this._insertBuffer.size);
        }
        this._iterateCollection = null;
    }

    private flushBuffer(): IteratableCollection<T> {
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
