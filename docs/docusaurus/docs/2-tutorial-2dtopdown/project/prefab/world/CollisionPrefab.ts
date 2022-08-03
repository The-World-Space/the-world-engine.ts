import { GameObjectBuilder, GridCollideMap, GridObjectCollideMap, Prefab, PrefabRef } from "the-world-engine";

export class CollisionPrefab extends Prefab {
    private _collideMap = new PrefabRef<GridCollideMap>();
    private _objectCollideMap = new PrefabRef<GridObjectCollideMap>();

    public getCollideMap(collideMap: PrefabRef<GridCollideMap>): this {
        this._collideMap = collideMap;
        return this;
    }

    public getObjectCollideMap(objectCollideMap: PrefabRef<GridObjectCollideMap>): this {
        this._objectCollideMap = objectCollideMap;
        return this;
    }

    public override make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(GridCollideMap, c => {
                c.showCollider = false;

                const range = 13;

                for (let i = -range; i <= range; i++) {
                    c.addCollider(range, i);
                    c.addCollider(i, range);
                    c.addCollider(-range, i);
                    c.addCollider(i, -range);
                }
            })
            .withComponent(GridObjectCollideMap, c => {
                c.showCollider = false;
            })
            .getComponent(GridCollideMap, this._collideMap)
            .getComponent(GridObjectCollideMap, this._objectCollideMap);
    }
}
