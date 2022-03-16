import { EngineGlobalObject } from "../../EngineGlobalObject";
import { GameObject } from "../../hierarchy_object/GameObject";
import { Transform } from "../../hierarchy_object/Transform";

const debugObjectName = "physics_debug_object";

/** @internal */
export function getOrCreatePhysicsDebugRenderObject(engine: EngineGlobalObject): GameObject {
    let debugRenderobject: GameObject|null = null;
    engine.scene.iterateChild((transform: Transform) => {
        if (transform.gameObject.name === debugObjectName) {
            debugRenderobject = transform.gameObject;
            return false;
        }
        return true;
    });
    if (!debugRenderobject) {
        debugRenderobject = engine.scene.addChildFromBuilder(engine.instantiater.buildGameObject(debugObjectName));
    }
    return debugRenderobject;
}
