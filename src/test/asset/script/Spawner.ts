import Queue, { QueueType } from "js-sdsl/dist/cjs/Queue/Queue";
import { CoroutineIterator } from "../../../engine/coroutine/CoroutineIterator";
import { WaitForSeconds } from "../../../engine/coroutine/YieldInstruction";
import { Component } from "../../../engine/hierarchy_object/Component";
import { GameObject } from "../../../engine/hierarchy_object/GameObject";
import { PrefabConstructor } from "../../../engine/hierarchy_object/PrefabConstructor";

export class Spawner extends Component {
    public prefabCtor: PrefabConstructor|null = null;
    public initSpawnCount = 0;
    private _queue: QueueType<GameObject> = new Queue();
    private _objectCounter = 0;

    public awake(): void {
        this.engine.input.addOnKeyDownEventListener(this.onKeyDown);
        this.startCorutine(this.spawninitObjects());
    }

    public onDestroy(): void {
        this.engine.input.removeOnKeyDownEventListener(this.onKeyDown);
    }

    public onKeyDown = (e: KeyboardEvent): void => {
        if (e.key === "e") {
            this._queue.push(this.gameObject.addChildFromBuilder(
                this.engine.instantiater.buildPrefab("spanwed_object_" + this._objectCounter++, this.prefabCtor!).make()
            ));
        } else if (e.key === "d") {
            this._queue.front()?.destroy();
            this._queue.pop();
        }
    };

    private *spawninitObjects() : CoroutineIterator {
        for (let i = 0; i < this.initSpawnCount; i++) {
            this._queue.push(this.gameObject.addChildFromBuilder(
                this.engine.instantiater.buildPrefab("spanwed_object_" + this._objectCounter++, this.prefabCtor!).make()
            ));
            yield new WaitForSeconds(1);
        }
    }
}
