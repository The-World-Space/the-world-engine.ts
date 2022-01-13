//implimentation based on https://github.com/nalply/rbts/blob/master/tree.ts

class Node<T> {
    public value: T;
    public parent: Node<T> = Node.nilNode as Node<T>;
    public left: Node<T> = Node.nilNode as Node<T>;
    public right: Node<T> = Node.nilNode as Node<T>;
    public black: boolean = true;

    public get red() { return !this.black; }
    public set red(value: boolean) { this.black = !value; }

    /** Construct a new standalone Node with key and value */
    public constructor(value: T) { this.value = value; }

    /** The one and only nil Node */
    public static readonly nilNode: Node<any> = nilNode();

    /** True if node is nil */
    public get nil(): boolean { return this === Node.nilNode; }

    /** True if node is not nil */
    public get ok(): boolean { return this !== Node.nilNode; }
}

// Must be called only once because we should have only one nil Node!
function nilNode(): Node<any> {
    return Object.freeze(
        new class extends Node<unknown> {
            constructor() {
                super(Symbol('nilNode.value'));
                this.parent = this.left = this.right = this;
            }
        },
    )
}

type Less<K, N> = (key: K, node: N) => boolean;

export class Tree<T> {
    private _root: Node<T> = Node.nilNode;
    private _size: number = 0
    private readonly _less: Less<T, Node<T>>;
    private readonly _equal: (a: T, b: T) => boolean;

    public constructor(
        lessOp: (a: T, b: T) => boolean,
        equalOp: (a: T, b: T) => boolean,
    ) {
        this._less = (a, b) => lessOp(a, b.value);
        this._equal = equalOp;
    }

    /** @returns the number of entries in the tree, O(1) */
    public get size() {
        return this._size;
    }

    /** Set an entry, O(log n) */
    public insert(value: T): this {
        const node = this.findNode(value);
        node.ok ? node.value = value : this.insertNode(new Node(value));
        return this;
    }

    /** Delete an entry with the key from the tree, O(log n)
     * @returns true if there was a key
     */
    public delete(value: T): boolean {
        const node = this.findNode(value);
        const result = this.deleteNode(node);
        if (node.ok) node.parent = node.left = node.right = Node.nilNode;
        return result;
    }

    /** Clear the tree, same as `Map.clear()`, O(1) */
    public clear(): void {
        this._root = Node.nilNode;
        this._size = 0;
    }

    private firstNode(node: Node<T> = this._root): Node<T> {
        while (node.left.ok) node = node.left;
        return node;
    }

    private findNode(value: T): Node<T> {
        let node: Node<T> = this._root;
        while (node.ok && !this._equal(value, node.value)) {
            node = this._less(value, node) ? node.left : node.right;
        }
        return node
    }

    private insertNode(node: Node<T>): void {
        if (node.nil) return;

        node.parent = node.left = node.right = Node.nilNode;
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
                continue
            }
            if (grandp.left.red) {
                parent.black = grandp.left.black = grandp.red = true;
                node = grandp;
                continue
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

    private deleteNode(node: Node<T>): boolean {
        if (node.nil) return false;

        this._size -= 1;

        let child: Node<T>, parent: Node<T>, red: boolean;
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
                    this.leftRotate(parent)
                    brother = parent.right;
                }
                if (brother.left.black && brother.right.black) {
                    brother.red = true;
                    node = parent;
                    parent = node.parent;
                    continue
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
                break
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

    private leftRotate(node: Node<T>): void {
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

    private rightRotate(node: Node<T>): void {
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
