class LinkedListNode<T> {
    public value: T;
    public next: LinkedListNode<T>|null = null;
    public prev: LinkedListNode<T>|null = null;

    public constructor(value: T) {
        this.value = value;
    }
}

class LinkedList<T> {
    private _head: LinkedListNode<T>|null;
    private _tail: LinkedListNode<T>|null;
    private _length: number;

    public constructor() {
        this._head = null;
        this._tail = null;
        this._length = 0;
    }

    public get length(): number {
        return this._length;
    }

    public add(value: T): void {
        const node = new LinkedListNode<T>(value);

        if (this._head === null) {
            this._head = node;
            this._tail = node;
        } else {
            this._tail!.next = node;
            node.prev = this._tail;
            this._tail = node;
        }

        this._length++;
    }

    private removeNode(node: LinkedListNode<T>): void {
        if (node.prev !== null) {
            node.prev!.next = node.next;
        } else {
            this._head = node.next;
        }

        if (node.next !== null) {
            node.next!.prev = node.prev;
        } else {
            this._tail = node.prev;
        }

        this._length--;
    }

    public remove(value: T): void {
        let current = this._head;

        while (current !== null) {
            if (current.value === value) {
                this.removeNode(current);
                return;
            }
            
            current = current.next;
        }
    }

    public removeAll(): void {
        this._head = null;
        this._tail = null;
        this._length = 0;
        this._terminateForEach = true;
    }

    private _terminateForEach = false;

    public forEach(callback: (value: T) => void): void {
        this._terminateForEach = false;
        let current = this._head;

        while (current !== null) {
            callback(current.value);
            if (this._terminateForEach) return;
            current = current.next;
        }
    }
}

export interface IEventContainer<T extends (...args: any[]) => void> {
    addListener(listener: T): void;
    removeListener(listener: T): void;
}

export class EventContainer<T extends (...args: any[]) => void> {
    private readonly _listeners: LinkedList<T>;

    public constructor() {
        this._listeners = new LinkedList<T>();
    }

    public addListener(listener: T): void {
        this._listeners.add(listener);
    }

    public removeListener(listener: T): void {
        this._listeners.remove(listener);
    }

    public removeAllListeners(): void {
        this._listeners.removeAll();
    }

    public invoke(...args: Parameters<T>): void {
        this._listeners.forEach((listener) => {
            listener(...args);
        });
    }
}
