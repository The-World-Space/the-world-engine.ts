import * as THREE from "three";
import { GameObjectBuilder } from "./GameObject";
/**
 * scene is a container for all game objects
 */
export declare class Scene extends THREE.Scene {
    private registerTransform;
    /**
     * add gameObject to scene
     * @param gameObjectBuilder
     */
    addChildFromBuilder(gameObjectBuilder: GameObjectBuilder): void;
}
