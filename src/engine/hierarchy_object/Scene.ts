import * as THREE from "three";
import { GameObjectBuilder } from "./GameObject";
import { Transform } from "./Transform";

/**
 * scene is a container for all game objects
 * do not drive this class
 */
export class Scene extends THREE.Scene {
    /** @internal */
    public constructor() {
        super();
        this.matrixAutoUpdate = false;
        this.autoUpdate = false;
    }

    private registerTransform(transform: Transform): void {
        this.add(transform.unsafeGetObject3D());
        const gameObject = transform.gameObject;

        //TODO: fix this traverseVisible
        if (gameObject.activeInHierarchy) {
            transform.unsafeGetObject3D().traverseVisible(item => {
                if (item.userData instanceof Transform) item.userData.gameObject.foreachComponent(c => {
                    if (c.enabled) c.eventInvoker.tryCallOnEnable();
                }); //tryEnableComponents
            });

            transform.unsafeGetObject3D().traverseVisible(item => {
                if (item.userData instanceof Transform) item.userData.gameObject.foreachComponent(c => {
                    if (c.enabled) c.eventInvoker.tryCallStart();
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
        this.registerTransform(gameObject.transform);
    }
}
