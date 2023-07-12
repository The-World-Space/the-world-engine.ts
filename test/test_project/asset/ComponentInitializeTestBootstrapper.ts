import { Bootstrapper } from "@src/engine/bootstrap/Bootstrapper";
import type { SceneBuilder } from "@src/engine/bootstrap/SceneBuilder";
import { Camera, CameraType } from "@src/engine/script/render/Camera";
import * as TWE from "@src/index";
import { Vector3 } from "three/src/Three";

/** @internal */
class Component1 extends TWE.Component {
    public override readonly executionOrder = 1123;

    public start(): void {
        console.log("Component1.start");

        const component2Ref = new TWE.PrefabRef<Component2>();
        this.gameObject.addChildFromBuilder(
            this.engine.instantiater.buildGameObject("cursor")
                .withComponent(Component2)
                .getComponent(Component2, component2Ref)
        );
        const component2 = component2Ref.ref!;

        component2.enabled = false;

        setTimeout(() => {
            component2.enabled = true;
        }, 1000);
    }
}

/** @internal */
class Component2 extends TWE.Component {
    public override readonly executionOrder = 1124;

    public start(): void {
        console.log("Component2.start");
    }
}


/** @internal */
export class ComponentInitializeTestBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("test_object")
                .withComponent(Component1))

            .withChild(instantiater.buildGameObject("editor_camera", new Vector3(0, 0, 80))
                .withComponent(Camera, c => {
                    c.cameraType = CameraType.Orthographic;
                }))
        ;
    }
}
