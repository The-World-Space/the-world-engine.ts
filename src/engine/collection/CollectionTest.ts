import { MutIteratableCollection } from "./MutIteratableCollection";

class TestItem {
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

    public static lessOp(a: TestItem, b: TestItem): boolean {
        if (a._executionOrder === b._executionOrder) {
            return a._id < b._id;
        }
        return a._executionOrder < b._executionOrder;
    }
}

export function mutIteratableCollectionTest1(): void {
    const mutIteratableCollection = new MutIteratableCollection<TestItem>(TestItem.lessOp);

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
