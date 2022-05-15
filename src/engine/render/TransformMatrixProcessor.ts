import { Object3D } from "three/src/Three";

import { Transform } from "../hierarchy_object/Transform";

/** @internal */
export class TransformMatrixProcessor {
    private readonly _transformsNeedToUpdate: Transform[];
    private _rerenderObjectsReadBuffer: Set<Object3D>;
    private _rerenderObjectsWriteBuffer: Set<Object3D>;

    public constructor() {
        this._transformsNeedToUpdate = [];
        this._rerenderObjectsReadBuffer = new Set();
        this._rerenderObjectsWriteBuffer = new Set();
    }

    private switchBuffer(): void {
        const tmp = this._rerenderObjectsReadBuffer;
        this._rerenderObjectsReadBuffer = this._rerenderObjectsWriteBuffer;
        this._rerenderObjectsWriteBuffer = tmp;
    }

    public enqueueTransformToUpdate(transform: Transform): void {
        if (transform.isRegisteredToProcessor) return;
        transform.isRegisteredToProcessor = true;
        this._transformsNeedToUpdate.push(transform);
    }

    public enqueueRenderObject(object: Object3D): void {
        this._rerenderObjectsWriteBuffer.add(object);
    }

    public dequeueRenderObject(object: Object3D): void {
        this._rerenderObjectsWriteBuffer.delete(object);
    }

    public flush(): void {
        this._rerenderObjectsReadBuffer.clear();
    }

    public update(): Set<Object3D> {
        const transformsNeedToUpdate = this._transformsNeedToUpdate;
        for (let i = 0; i < transformsNeedToUpdate.length; i++) {
            const transform = transformsNeedToUpdate[i];
            transform.tryUpdateWorldMatrixRecursivelyFromThisToChildren();
            transform.isRegisteredToProcessor = false;
        }
        this._transformsNeedToUpdate.length = 0;

        this.switchBuffer();
        return this._rerenderObjectsReadBuffer;
    }
}
