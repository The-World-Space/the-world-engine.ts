import { CoroutineIterator } from "../../../engine/coroutine/CoroutineIterator";
import { WaitForSeconds } from "../../../engine/coroutine/YieldInstruction";
import { Component } from "../../../engine/hierarchy_object/Component";
import { GameObject } from "../../../engine/hierarchy_object/GameObject";

export class ChangeParentTest extends Component {
    public parent1: GameObject|null = null;
    public parent2: GameObject|null = null;

    public start() {
        this.startCorutine(this.changeParent());
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
