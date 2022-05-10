import Queue, { QueueType } from "js-sdsl/dist/esm/Queue/Queue";
import { CoroutineIterator } from "@src/engine/coroutine/CoroutineIterator";
import { WaitForSeconds } from "@src/engine/coroutine/YieldInstruction";
import { Component } from "@src/engine/hierarchy_object/Component";
import { GameObject } from "@src/engine/hierarchy_object/GameObject";
import { PrefabConstructor } from "@src/engine/hierarchy_object/PrefabConstructor";

/** @internal */
export class Spawner extends Component {
    public prefabCtor: PrefabConstructor|null = null;
    public initSpawnCount = 0;
    private readonly _queue: QueueType<GameObject> = new Queue();
    private _objectCounter = 0;

    public awake(): void {
        this.engine.input.onKeyDown.addListener(this.onKeyDown);
        this.startCoroutine(this.spawninitObjects());
    }

    public onDestroy(): void {
        this.engine.input.onKeyDown.removeListener(this.onKeyDown);
    }

    public onKeyDown = (e: KeyboardEvent): void => {
        if (e.key === "e") {
            this._queue.push(this.gameObject.addChildFromBuilder(
                this.engine.instantiater.buildPrefab("spawned_object_" + this._objectCounter++, this.prefabCtor!).make()
            ));
        } else if (e.key === "d") {
            let front = this._queue.front();
            if (front) {
                while (!front.exists) {
                    this._queue.pop();
                    front = this._queue.front();
                    if (!front) break;
                }
                if (front) {
                    this._queue.pop();
                    front.destroy();
                }
            }
        }
    };

    private *spawninitObjects(): CoroutineIterator {
        for (let i = 0; i < this.initSpawnCount; i++) {
            this._queue.push(this.gameObject.addChildFromBuilder(
                this.engine.instantiater.buildPrefab("spawned_object_" + this._objectCounter++, this.prefabCtor!).make()
            ));
            yield new WaitForSeconds(1);
        }
    }
}
