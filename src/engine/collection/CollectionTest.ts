import { MutIteratableCollection } from "./MutIteratableCollection";

class TestItem {
    public isRemoved = false;
    private static _idGenerator = 0;
    private _id: number;
    private _func: () => void;
    private _executionOrder: number;

    public constructor(func: () => void, executionOrder: number) {
        this._id = TestItem._idGenerator;
        TestItem._idGenerator += 1;
        this._func = func;
        this._executionOrder = executionOrder;
    }

    public get id(): number {
        return this._id;
    }

    public execute(): void {
        this._func();
    }

    public static comparator(a: TestItem, b: TestItem): number {
        if (a._executionOrder === b._executionOrder) {
            return a._id - b._id;
        }
        return a._executionOrder - b._executionOrder;
    }
}

/** @internal */
export function mutIteratableCollectionTest1(): void {
    const mutIteratableCollection = new MutIteratableCollection<TestItem>(TestItem.comparator);

    const item2 = new TestItem(() => {
        console.log("2");
    }, 2);

    mutIteratableCollection.insert(new TestItem(() => {
        console.log("1");
        mutIteratableCollection.insert(new TestItem(() => {
            console.log("3");
        }, -1));
        mutIteratableCollection.insert(new TestItem(() => {
            console.log("4");
        }, -2));
        mutIteratableCollection.delete(item2);
    }, 1));

    mutIteratableCollection.insert(item2);

    mutIteratableCollection.forEach(item => {
        item.execute();
    });
}

/** @internal */
export function mutIteratableCollectionTest2(): void {
    const mutIteratableCollection = new MutIteratableCollection<TestItem>(TestItem.comparator);

    const item1 = new TestItem(() => {
        console.log("1");
    }, 1);
    const item2 = new TestItem(() => {
        console.log("2");
    }, 2);
    const item3 = new TestItem(() => {
        console.log("3");
    }, 3);
    const item4 = new TestItem(() => {
        console.log("4");
    }, 4);

    mutIteratableCollection.insert(item1);
    mutIteratableCollection.insert(item2);
    mutIteratableCollection.insert(item3);
    mutIteratableCollection.insert(item4);

    mutIteratableCollection.delete(item1);
    mutIteratableCollection.delete(item3);
}
