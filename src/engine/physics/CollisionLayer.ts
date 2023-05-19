import type * as CollisionLayerConstType from "./CollisionLayerConstType";

export type CollisionLayer<l extends number = 32, acc extends string[] = [CollisionLayerConstType.DefaultLayerName]> =
    acc["length"] extends l
        ? acc
        : acc | CollisionLayer<l, [...acc, string]>;

export type CollisionLayerParm<T extends CollisionLayer, acc extends boolean[] = [], result extends string = CollisionLayerConstType.DefaultLayerName> =
    acc["length"] extends T["length"]
        ? result
        : result | CollisionLayerParm<T, [...acc, true], T[acc["length"]]>;
