import { CollisionLayer, CollisionLayerParm } from "./CollisionLayer";

export class CollisionLayerMaskConverter {
    private readonly _strCategory: Map<string, number>; //key: layerName value: layer
    private readonly _numCategory: Map<number, string>; //key: layer value: layerName
    private readonly _layerMasks: Map<number, number>; //key: layer value: layerMask

    //collisionMatrix must be checked by type system
    public constructor(collisionMatrix: object) {
        const entries = Object.entries(collisionMatrix) as [string, object][];

        entries.sort((a, b) => { //sort for consistency
            const aKey = Object.entries(a[1]).length;
            const bKey = Object.entries(b[1]).length;
            return bKey - aKey;
        });

        //check for duplicate layer names
        const layerNames = new Set<string>();
        for (const entry of entries) {
            if (layerNames.has(entry[0])) {
                throw new Error(`Duplicate layer name: ${entry[0]}`);
            }
            layerNames.add(entry[0]);
        }

        // register layer
        this._strCategory = new Map();
        this._numCategory = new Map();
        this._layerMasks = new Map();

        for (let i = 0, j = 0x0001; i < entries.length; i++, j <<= 1) {
            const layerName = entries[i][0];
            this._strCategory.set(layerName, j);
            this._numCategory.set(j, layerName);
            this._layerMasks.set(j, 0x0000);
        }

        // set collision matrix
        for (let i = 0; i < entries.length; ++i) {
            const item = entries[i];
            const layerName = item[0];
            const layerEntries = Object.entries(item[1]);
            for (let j = 0; j < layerEntries.length; ++j) {
                const matrixKey = layerEntries[j][0];
                const matrixValue = layerEntries[j][1] as boolean;

                const layerA = this._strCategory.get(layerName)!;
                const layerB = this._strCategory.get(matrixKey)!;

                const layerMaskA = this._layerMasks.get(layerA)!;
                const layerMaskB = this._layerMasks.get(layerB)!;

                if (matrixValue) {
                    this._layerMasks.set(layerA, layerMaskA | layerB);
                    this._layerMasks.set(layerB, layerMaskB | layerA);
                }
            }
        }
    }

    public nameToLayer<T extends CollisionLayer>(layerName: CollisionLayerParm<T>): number {
        const category = this._strCategory.get(layerName as string);
        if (category === undefined) {
            throw new Error("Layer not found");
        }
        return category;
    }

    public layerToName<T extends CollisionLayer>(layer: number): CollisionLayerParm<T> {
        const category = this._numCategory.get(layer);
        if (category === undefined) {
            throw new Error("Layer not found");
        }
        return category as CollisionLayerParm<T>;
    }

    public createMaskFromName<T extends CollisionLayer>(...layerNames: CollisionLayerParm<T>[]): number {
        let maskBit = 0x0000;
        for (let i = 0; i < layerNames.length; i++) {
            maskBit |= this.nameToLayer(layerNames[i]);
        }
        return maskBit;
    }

    public createMaskFromLayer(...layer: number[]): number {
        let maskBit = 0x0000;
        for (let i = 0; i < layer.length; i++) {
            maskBit |= layer[i];
        }
        return maskBit;
    }

    public getMaskFromName<T extends CollisionLayer>(layerName: CollisionLayerParm<T>): number {
        const category = this._strCategory.get(layerName as string);
        if (category === undefined) throw new Error("Layer not found");
        const mask = this._layerMasks.get(category);
        if (mask === undefined) throw new Error("Mask not found");
        return mask;
    }

    public getMaskFromLayer(layer: number): number {
        const mask = this._layerMasks.get(layer);
        if (mask === undefined) throw new Error("Mask not found");
        return mask;
    }

    /** @internal */
    public copy(other: CollisionLayerMaskConverter): void {
        this._strCategory.clear();
        this._numCategory.clear();
        this._layerMasks.clear();

        for (const [key, value] of other._strCategory) {
            this._strCategory.set(key, value);
        }

        for (const [key, value] of other._numCategory) {
            this._numCategory.set(key, value);
        }

        for (const [key, value] of other._layerMasks) {
            this._layerMasks.set(key, value);
        }
    }
    
    /** @internal */
    public clone(): CollisionLayerMaskConverter {
        const result = new CollisionLayerMaskConverter({});
        result.copy(this);
        return result;
    }
}
