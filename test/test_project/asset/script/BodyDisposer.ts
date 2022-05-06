import { Component } from "@src/engine/hierarchy_object/Component";
import { Collider2D } from "@src/engine/script/physics2d/collider/Collider2D";
import { TestLayer } from "../TestLayer";

/** @internal */
export class BodyDisposer extends Component {
    public override readonly requiredComponents = [Collider2D];
    private _playerLayer = 0;
    
    public awake(): void {
        this._playerLayer = this.engine.physics.collisionLayerMask.nameToLayer<TestLayer>("player");
    }

    public onTriggerEnter2D(other: Collider2D): void {
        if (other.getThisOrRigidBodyLayer() === this._playerLayer) {
            other.gameObject.transform.position.x = 0;
            other.gameObject.transform.position.y = 0;
        } else {
            other.gameObject.destroy();
        }
    }
}
