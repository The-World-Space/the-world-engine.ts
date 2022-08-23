import { MutIteratableCollection } from "@src/engine/collection/MutIteratableCollection";

class TestItem {
    public itemData = 0;
    private static _idGenerator = 0;
    private readonly _id: number;
    private readonly _func: () => void;
    private readonly _executionOrder: number;

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

describe("MutIteratableCollection Test", () => {
    it("MutIteratableCollection.constructor()", () => {
        const collection = new MutIteratableCollection<TestItem>(TestItem.comparator);

        expect(collection).toBeDefined();
    });

    it("MutIteratableCollection.size()", () => {
        const collection = new MutIteratableCollection<TestItem>(TestItem.comparator);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const item1 = new TestItem((): void => { }, 1);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const item2 = new TestItem((): void => { }, 2);
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const item3 = new TestItem((): void => { }, 3);
        collection.insert(item1);
        collection.insert(item2);
        collection.insert(item3);

        expect(collection.size).toBe(3);
    });

    it("MutIteratableCollection Test1", () => {
        const result: number[] = [];
        const mutIteratableCollection = new MutIteratableCollection<TestItem>(TestItem.comparator);

        const item2 = new TestItem((): void => {
            result.push(2);
        }, 2);

        mutIteratableCollection.insert(new TestItem((): void => {
            result.push(1);
            mutIteratableCollection.insert(new TestItem((): void => {
                result.push(3);
            }, -1));
            mutIteratableCollection.insert(new TestItem((): void => {
                result.push(4);
            }, -2));
            mutIteratableCollection.delete(item2);
        }, 1));

        mutIteratableCollection.insert(item2);

        mutIteratableCollection.forEach(item => {
            item.execute();
        });

        expect(result).toEqual([1, 4, 3]);
    });

    it("MutIteratableCollection Test2", () => {
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

        expect((): void => {
            mutIteratableCollection.insert(item1);
            mutIteratableCollection.insert(item2);
            mutIteratableCollection.insert(item3);
            mutIteratableCollection.insert(item4);

            mutIteratableCollection.delete(item1);
            mutIteratableCollection.delete(item3);
        }).not.toThrow();
    });
});
