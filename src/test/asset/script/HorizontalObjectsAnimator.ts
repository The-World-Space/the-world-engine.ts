import { Vector3 } from "three/src/Three";
import { Component } from "../../../engine/hierarchy_object/Component";
import { GameObject } from "../../../engine/hierarchy_object/GameObject";
import { PrefabConstructor } from "../../../engine/hierarchy_object/PrefabConstructor";

export class HorizontalObjectsAnimator extends Component {
    private _prefab: PrefabConstructor|null = null;
    private _spawnCount = 0;
    private _padding = 1;
    private _spawnedObjects: GameObject[] = [];

    public awake(): void {
        this.updateSpawnedObjects(true);
    }

    private updateSpawnedObjects(rePosition: boolean, reSpawn = false): void {
        if (reSpawn) {
            for (let i = 0; i < this._spawnedObjects.length; i++) {
                this._spawnedObjects[i].destroy();
            }
            this._spawnedObjects.length = 0;
        }

        const spawnedObjects = this._spawnedObjects;
        if (spawnedObjects.length < this._spawnCount) {
            for (let i = spawnedObjects.length; i < this._spawnCount; i++) {
                this._spawnedObjects.push(this.gameObject.addChildFromBuilder(
                    this.engine.instantiater.buildPrefab(
                        "horizontal_animated_object_" + i,
                        this._prefab!,
                        new Vector3(i * this._padding, 0, 0),
                        undefined
                        //new Vector3()
                    ).make()
                ));
            }
        } else if (spawnedObjects.length > this._spawnCount) {
            for (let i = spawnedObjects.length - 1; i >= this._spawnCount; i--) {
                spawnedObjects[i].destroy();
            }
        }

        if (rePosition) {
            for (let i = 0; i < spawnedObjects.length; i++) {
                spawnedObjects[i].transform.position.x = i * this._padding;
            }
        }
    }

    public get prefab(): PrefabConstructor|null {
        return this._prefab;
    }

    public set prefab(value: PrefabConstructor|null) {
        this._prefab = value;
        if (0 < this._spawnedObjects.length) {
            this.updateSpawnedObjects(false, true);
        }
    }

    public get spawnCount(): number {
        return this._spawnCount;
    }

    public set spawnCount(value: number) {
        this._spawnCount = value;
        if (0 < this._spawnedObjects.length) {
            this.updateSpawnedObjects(false);
        }
    }

    public get padding(): number {
        return this._padding;
    }

    public set padding(value: number) {
        this._padding = value;

        if (0 < this._spawnedObjects.length) {
            this.updateSpawnedObjects(true);
        }
    }
}
