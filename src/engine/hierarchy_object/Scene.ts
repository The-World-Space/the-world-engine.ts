import { Scene as ThreeScene } from "three/src/Three";
import { GameObject } from "./GameObject";
import { GameObjectBuilder } from "./GameObjectBuilder";

/**
 * scene is a container for all game objects
 * do not drive this class
 */
export class Scene extends ThreeScene {
    /** @internal */
    public constructor() {
        super();
        this.matrixAutoUpdate = false;
        this.autoUpdate = false;
    }
    
    /**
     * add gameObject to scene
     * @param gameObjectBuilder
     */
    public addChildFromBuilder(gameObjectBuilder: GameObjectBuilder): GameObject {
        const gameObject = gameObjectBuilder.build(null);
        gameObjectBuilder.processEvent();
        return gameObject;
    }
}
