import { RayCastCallback, Vec2 } from "../../../box2d.ts/build";
import type { b2Fixture } from "../../../box2d.ts/build/box2d";
import type { ReadonlyVector2 } from "../../math/ReadonlyVector2";
import type { Collider2D } from "../../script/physics2d/collider/Collider2D";
import type { ContactFilter2D } from "./ContactFilter2D";
import type { IPhysicsObject2D } from "./PhysicsObject2D";
import { RaycastHit2D } from "./RaycastHit2D";

/** @internal */
export class RayCastFilterCallback extends RayCastCallback {
    private _hitCount = 0;
    private _raycastHit2DList: RaycastHit2D[]|null = null;
    private readonly _startPosition: Vec2 = new Vec2();
    private _filter: ContactFilter2D|null = null;

    private static readonly _tempVec2: Vec2 = new Vec2();

    public setRaycastData(
        raycastHit2DList: RaycastHit2D[],
        origin: ReadonlyVector2,
        filter: ContactFilter2D
    ): void {
        this._hitCount = 0;
        this._raycastHit2DList = raycastHit2DList;
        this._startPosition.Copy(origin);
        this._filter = filter;
    }

    public get hitCount(): number {
        return this._hitCount;
    }

    public override ReportFixture(
        fixture: b2Fixture,
        point: Vec2,
        normal: Vec2,
        fraction: number
    ): number {
        const collider = fixture.GetUserData() as Collider2D;
        if (!this._filter!.useTriggers && collider.isTrigger) return -1;

        const distance = RayCastFilterCallback._tempVec2
            .Copy(point)
            .SelfSub(this._startPosition!)
            .Length();

        if (this._filter!.useLayerMask) {
            if ((collider.getThisOrRigidBodyLayer() & this._filter!.layerMask) === 0) return -1;
        }

        const transform = collider.transform;

        if (this._filter!.useDepth) {
            const depth = transform.position.z;
            const filterFlag = depth < this._filter!.minDepth || this._filter!.maxDepth < depth;
            if (this._filter!.useOutsideDepth ? !filterFlag : filterFlag) return -1;
        }

        if (this._filter!.useNormalAngle) {
            const angle = Math.atan2(-normal.y, normal.x) + Math.PI;
            const filterFlag = angle < this._filter!.minNormalAngle || this._filter!.maxNormalAngle < angle;
            if (this._filter!.useOutsideNormalAngle ? !filterFlag : filterFlag) return -1;
        }

        if (!this._raycastHit2DList![this.hitCount]) {
            this._raycastHit2DList![this.hitCount] = new RaycastHit2D();
        }
        this._raycastHit2DList![this.hitCount].setData(
            point,
            collider,
            distance,
            fraction,
            normal,
            point,
            (fixture.GetBody().GetUserData() as IPhysicsObject2D).rigidbody,
            transform
        );
        this._hitCount += 1;
        return 1;
    }

    public override ReportParticle(
    // system: b2ParticleSystem,
    // index: number,
    // point: b2Vec2,
    // normal: b2Vec2,
    // fraction: number
    ): number {
        return -1; // ignore particles
    }
    public override ShouldQueryParticleSystem(
    // system: b2ParticleSystem
    ): boolean {
        return false; // ignore particles
    }
}
