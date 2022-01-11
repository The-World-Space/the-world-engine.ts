import { Object3D } from "three";
import { Transform } from "../hierarchy_object/Transform";

export class TransformMatrixProcessor {
    private readonly _transformsNeedToUpdate: Set<Transform>;
    private readonly _rerenderObjects: Object3D[];

    public constructor() {
        this._transformsNeedToUpdate = new Set();
        this._rerenderObjects = [];
    }

    public enqueueTransformToUpdate(transform: Transform): void {
        if (transform.isRegisteredToProcessor) return;
        transform.isRegisteredToProcessor = true;
        this._transformsNeedToUpdate.add(transform);
    }

    public update(): void {
        const rerenderObjects = this._rerenderObjects;
        rerenderObjects.length = 0;
        for (const transform of this._transformsNeedToUpdate) {
            transform.tryUpdateWorldMatrixRecursivelyFromThisToChildren(rerenderObjects);
            transform.isRegisteredToProcessor = false;
        }
        this._transformsNeedToUpdate.clear();
    }

    public get rerenderObjects(): readonly Object3D[] {
        return this._rerenderObjects;
    }
}
