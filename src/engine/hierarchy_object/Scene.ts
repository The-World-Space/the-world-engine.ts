import * as THREE from "three";
import { GameObjectBuilder } from "./GameObject";
import { Transform } from "./Transform";

/**
 * scene is a container for all game objects
 */
export class Scene extends THREE.Scene {
    private registerTransform(transform: Transform): void {
        this.add(transform);
        const gameObject = transform.gameObject;

        if (gameObject.activeInHierarchy) {
            transform.traverseVisible(item => {
                if (item instanceof Transform) item.gameObject.foreachComponent(c => {
                    if (c.enabled) c.onEnable();
                }); //tryEnableComponents
            });

            transform.traverseVisible(item => {
                if (item instanceof Transform) item.gameObject.foreachComponent(c => {
                    if (c.enabled) c.unsafeTryCallStart();
                }); //tryStartComponents
            });
        }
    }
    
    /**
     * add gameObject to scene
     * @param gameObjectBuilder
     */
    public addChildFromBuilder(gameObjectBuilder: GameObjectBuilder): void {
        const gameObject = gameObjectBuilder.build();
        gameObjectBuilder.initialize();
        if (gameObject.unsafeGetTransform() instanceof Transform) {
            this.registerTransform(gameObject.unsafeGetTransform() as Transform); //it"s safe because it use same logic as GameObject.registerTransform()
        } else {
            throw new Error("unreachable");
        }
    }
}
