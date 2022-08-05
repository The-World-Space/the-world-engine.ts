import { GameObjectBuilder, GridObjectCollideMap, Prefab, PrefabRef } from "the-world-engine";
import {
    Vector3
} from "three/src/Three";

import { CampfirePrefab } from "../object/CampfirePrefab";
import { House1Prefab } from "../object/House1Prefab";
import { House2Prefab } from "../object/House2Prefab";
import { Tree1Prefab } from "../object/Tree1Prefab";
import { Tree2Prefab } from "../object/Tree2Prefab";

export class ObjectsPrefab extends Prefab {
    private _objectCollideMap = new PrefabRef<GridObjectCollideMap>();

    public withObjectCollideMap(objectCollideMap: PrefabRef<GridObjectCollideMap>): this {
        this._objectCollideMap = objectCollideMap;
        return this;
    }

    public override make(): GameObjectBuilder {
        const instantiater = this.instantiater;

        return this.gameObjectBuilder
            .withChild(instantiater.buildPrefab("tree1", Tree1Prefab, new Vector3(0, 2, 0))
                .withObjectCollideMap(this._objectCollideMap).make())

            .withChild(instantiater.buildPrefab("tree1", Tree1Prefab, new Vector3(-5, 2, 0))
                .withObjectCollideMap(this._objectCollideMap).make())

            .withChild(instantiater.buildPrefab("tree1", Tree1Prefab, new Vector3(-7, 3, 0))
                .withObjectCollideMap(this._objectCollideMap).make())

            .withChild(instantiater.buildPrefab("tree2", Tree2Prefab, new Vector3(2, -1, 0))
                .withObjectCollideMap(this._objectCollideMap).make())

            .withChild(instantiater.buildPrefab("tree2", Tree2Prefab, new Vector3(9, 7, 0))
                .withObjectCollideMap(this._objectCollideMap).make())
            
            .withChild(instantiater.buildPrefab("tree2", Tree2Prefab, new Vector3(10, 6, 0))
                .withObjectCollideMap(this._objectCollideMap).make())

            .withChild(instantiater.buildPrefab("house1", House1Prefab, new Vector3(5, 6, 0))
                .withObjectCollideMap(this._objectCollideMap).make())

            .withChild(instantiater.buildPrefab("house2", House2Prefab, new Vector3(-5, -5, 0))
                .withObjectCollideMap(this._objectCollideMap).make())

            .withChild(instantiater.buildPrefab("campfire", CampfirePrefab, new Vector3(4, 1, 0))
                .withObjectCollideMap(this._objectCollideMap).make())
        ;
    }    
}
