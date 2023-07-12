import { Bootstrapper } from "@src/engine/bootstrap/Bootstrapper";
import type { SceneBuilder } from "@src/engine/bootstrap/SceneBuilder";
import { Component } from "@src/engine/hierarchy_object/Component";
import { Camera } from "@src/engine/script/render/Camera";

// class Script1 extends Component {
//     public start(): void {
//         console.log("a");
//         this.gameObject.addComponent(Script2);
//         console.log("b");
//     }
// }

// class Script2 extends Component {
//     public start(): void {
//         console.log("script2 start");
//     }
//     public awake(): void {
//         console.log("script2 awake");
//     }
// }

// export class EventTestBootstrapper extends Bootstrapper {
//     public override run(): SceneBuilder {
//         return this.sceneBuilder
//             .withChild(this.instantiater.buildGameObject("camera")
//                 .withComponent(Camera))

//             .withChild(this.instantiater.buildGameObject("object1")
//                 .withComponent(Script1))
//         ;
//     }
// }

class ComponentA extends Component {
    public override readonly executionOrder = 1;
    public start(): void {
        console.log("ComponentA.start()");
    }
}

class ComponentB extends Component {
    public override readonly executionOrder = 3;
    public start(): void {
        console.log("ComponentB.start()");
    }
}

class ComponentC extends Component {
    public override readonly executionOrder = 2;
    public start(): void {
        console.log("ComponentC.start()");
    }
}

class ComponentD extends Component {
    public override readonly executionOrder = 4;
    public start(): void {
        console.log("ComponentD.start()");
    }
}

export class EventTestBootstrapper extends Bootstrapper {
    public override run(): SceneBuilder {
        return this.sceneBuilder
            .withChild(this.instantiater.buildGameObject("camera")
                .withComponent(Camera))

            .withChild(this.instantiater.buildGameObject("object1")
                .withComponent(ComponentA)
                .withComponent(ComponentB)
                .withComponent(ComponentC)
                .withComponent(ComponentD))
        ;
    }
}
