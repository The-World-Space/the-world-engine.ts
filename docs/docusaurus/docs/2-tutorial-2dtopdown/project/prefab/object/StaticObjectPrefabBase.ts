import {
    CssSpriteAtlasRenderer,
    GameObjectBuilder,
    GridCollider,
    GridObjectCollideMap,
    Prefab,
    PrefabRef,
    ZaxisSorter
} from "the-world-engine";

export abstract class StaticObjectPrefabBase extends Prefab {
    protected abstract rendererInitializer(c: CssSpriteAtlasRenderer): void;
    protected abstract colliderInitializer(c: GridCollider): void;

    private _objectCollideMap = new PrefabRef<GridObjectCollideMap>();

    public withObjectCollideMap(objectCollideMap: PrefabRef<GridObjectCollideMap>): this {
        this._objectCollideMap = objectCollideMap;
        return this;
    }

    public override make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(ZaxisSorter)
            .withComponent(CssSpriteAtlasRenderer, c => {
                c.viewScale = 1;
                this.rendererInitializer(c);
            })
            .withComponent(GridCollider, c => {
                if (this._objectCollideMap.ref) c.gridObjectCollideMap = this._objectCollideMap.ref;

                this.colliderInitializer(c);
            })
        ;
    }
}
