import { MutIteratableCollection } from "./MutIteratableCollection";

class TestItem {
    private static idGenerator = 0;
    private id: number;
    private func: () => void;

    public constructor(func: () => void) {
        this.id = TestItem.idGenerator += 1;
        this.func = func;
    }

    public execute(): void {
        this.func();
    }

    public static lessOp(a: TestItem, b: TestItem): boolean {
        return a.id < b.id;
    }
}

export function mutIteratableCollectionTest1(): void {
    const mutIteratableCollection = new MutIteratableCollection<TestItem>(TestItem.lessOp);

    mutIteratableCollection.insert(new TestItem(() => {
        console.log("item1");
    }));

    mutIteratableCollection.insert(new TestItem(() => {
        console.log("item2");
    }));

    mutIteratableCollection.forEach(item => {
        item.execute();
    });
}
