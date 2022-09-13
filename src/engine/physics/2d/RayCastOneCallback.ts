import type { Fixture } from "../../../box2d.ts/build/index";
import { RayCastCallback, Vec2 } from "../../../box2d.ts/build/index";
import type { ReadonlyVector2 } from "../../math/ReadonlyVector2";
import type { Collider2D } from "../../script/physics2d/collider/Collider2D";
import type { IPhysics2D } from "./IPhysics2D";
import type { IPhysicsObject2D } from "./PhysicsObject2D";
import type { RaycastHit2D } from "./RaycastHit2D";

/** @internal */
export class RayCastOneCallback extends RayCastCallback {
    private readonly _physics2d: IPhysics2D;
    private _hit = false;
    private _raycastHit2D: RaycastHit2D|null = null;
    private readonly _startPosition: Vec2 = new Vec2();
    private _layerMask = 0;
    private _minDepth = 0;
    private _maxDepth = 0;

    private static readonly _tempVec2: Vec2 = new Vec2();

    public constructor(physics2d: IPhysics2D) {
        super();
        this._physics2d = physics2d;
    }

    public setRaycastData(
        raycastHit2D: RaycastHit2D,
        origin: ReadonlyVector2,
        layerMask: number,
        minDepth: number,
        maxDepth: number
    ): void {
        this._hit = false;
        this._raycastHit2D = raycastHit2D;
        this._startPosition.Copy(origin);
        this._layerMask = layerMask;
        this._minDepth = minDepth;
        this._maxDepth = maxDepth;
    }

    public get hit(): boolean {
        return this._hit;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public override ReportFixture(
        fixture: Fixture,
        point: Vec2,
        normal: Vec2,
        fraction: number
    ): number {
        const collider = fixture.GetUserData() as Collider2D;
        if (!this._physics2d.queriesHitTriggers && collider.isTrigger) return -1;

        const distance = RayCastOneCallback._tempVec2
            .Copy(point)
            .SelfSub(this._startPosition!)
            .Length();

        if ((collider.getThisOrRigidBodyLayer() & this._layerMask) === 0) return -1;
        const transform = collider.transform;
        const depth = transform.position.z;
        if (depth < this._minDepth || this._maxDepth < depth) return -1;

        this._raycastHit2D!.setData(
            point,
            collider,
            distance,
            fraction,
            normal,
            point,
            (fixture.GetBody().GetUserData() as IPhysicsObject2D).rigidbody,
            transform
        );
        this._hit = true;
        return fraction;
    }

    // eslint-disable-next-line @typescript-eslint/naming-convention
    public override ReportParticle(
    // system: b2ParticleSystem,
    // index: number,
    // point: b2Vec2,
    // normal: b2Vec2,
    // fraction: number
    ): number {
        return -1; // ignore particles
    }
    
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public override ShouldQueryParticleSystem(
    // system: b2ParticleSystem
    ): boolean {
        return false; // ignore particles
    }
}
