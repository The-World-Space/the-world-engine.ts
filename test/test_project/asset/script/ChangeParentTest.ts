import type { CoroutineIterator } from "@src/engine/coroutine/CoroutineIterator";
import { WaitForSeconds } from "@src/engine/coroutine/YieldInstruction";
import { Component } from "@src/engine/hierarchy_object/Component";
import type { GameObject } from "@src/engine/hierarchy_object/GameObject";

/** @internal */
export class ChangeParentTest extends Component {
    public parent1: GameObject|null = null;
    public parent2: GameObject|null = null;

    public start(): void {
        this.startCoroutine(this.changeParent());
    }

    private *changeParent(): CoroutineIterator {
        for (; ;) {
            yield new WaitForSeconds(1);
            if (this.transform.parent === this.parent1!.transform) {
                this.transform.parent = this.parent2!.transform;
            } else {
                this.transform.parent = this.parent1!.transform;
            }
        }
    }
}
