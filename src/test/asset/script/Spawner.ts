import Queue, { QueueType } from "js-sdsl/dist/cjs/Queue/Queue";
import { Component } from "../../../engine/hierarchy_object/Component";
import { GameObject } from "../../../engine/hierarchy_object/GameObject";
import { PrefabConstructor } from "../../../engine/hierarchy_object/PrefabConstructor";

export class Spawner extends Component {
    public prefabCtor: PrefabConstructor|null = null;
    private _queue: QueueType<GameObject> = new Queue();

    public awake(): void {
        this.engine.input.addOnKeyDownEventListener(this.onKeyDown);
    }

    public onDestroy(): void {
        this.engine.input.removeOnKeyDownEventListener(this.onKeyDown);
    }

    public onKeyDown = (e: KeyboardEvent): void => {
        if (e.key === "e") {
            this._queue.push(this.gameObject.addChildFromBuilder(
                this.engine.instantiater.buildPrefab("spanwed object", this.prefabCtor!).make()
            ));
        } else if (e.key === "d") {
            this._queue.front()?.destroy();
            this._queue.pop();
        }
    };
}
