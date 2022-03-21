import {
    angularSleepTolerance,
    baumgarte,
    linearSleepTolerance,
    maxAngularCorrection,
    maxLinearCorrection,
    maxRotation,
    maxTranslation,
    timeToSleep,
    toiBaumgarte,
    BodyType,
    BodyDef,
    ContactListener,
    FixtureDef,
    Filter,
    MassData,
    PolygonShape,
    WorldManifold,
    World,
    Vec2
} from "../../../box2d.ts/build/index";
import { CollisionLayerMaskConverter } from "../CollisionLayerMaskConverter";
import { Collision2DPool } from "./Collision2DPool";
import { Collision2D } from "./Collision2D";
import { PhysicsObject2D } from "./PhysicsObject2D";
import { CollisionEventPool, TriggerEventPool } from "./EventPool";
import { RaycastHit2D } from "./RaycastHit2D";
import { RayCastOneCallback } from "./RayCastOneCallback";

export class Physics2DLoader {
    /** @internal */
    public static readonly angularSleepTolerance: number = angularSleepTolerance;
    /** @internal */
    public static readonly baumgarte: number = baumgarte;
    /** @internal */
    public static readonly linearSleepTolerance: number = linearSleepTolerance;
    /** @internal */
    public static readonly maxAngularCorrection: number = maxAngularCorrection;
    /** @internal */
    public static readonly maxLinearCorrection: number = maxLinearCorrection;
    /** @internal */
    public static readonly maxRotation: number = maxRotation;
    /** @internal */
    public static readonly maxTranslation: number = maxTranslation;
    /** @internal */
    public static readonly timeToSleep: number = timeToSleep;
    /** @internal */
    public static readonly toiBaumgarte: number = toiBaumgarte;
    /** @internal */
    public static readonly BodyType: typeof BodyType = BodyType;
    /** @internal */
    public static readonly BodyDef: typeof BodyDef = BodyDef;
    /** @internal */
    public static readonly ContactListener: typeof ContactListener = ContactListener;
    /** @internal */
    public static readonly FixtureDef: typeof FixtureDef = FixtureDef;
    /** @internal */
    public static readonly Filter: typeof Filter = Filter;
    /** @internal */
    public static readonly MassData: typeof MassData = MassData;
    /** @internal */
    public static readonly PolygonShape: typeof PolygonShape = PolygonShape;
    /** @internal */
    public static readonly WorldManifold: typeof WorldManifold = WorldManifold;
    /** @internal */
    public static readonly World: typeof World = World;
    /** @internal */
    public static readonly Vec2: typeof Vec2 = Vec2;

    /** @internal */
    public static readonly Collision2DPool: typeof Collision2DPool = Collision2DPool;
    /** @internal */
    public static readonly Collision2D: typeof Collision2D = Collision2D;
    /** @internal */
    public static readonly CollisionLayerMaskConverter: typeof CollisionLayerMaskConverter = CollisionLayerMaskConverter;
    /** @internal */
    public static readonly PhysicsObject2D: typeof PhysicsObject2D = PhysicsObject2D;
    
    /** @internal */
    public static readonly TriggerEventPool: typeof TriggerEventPool = TriggerEventPool;
    /** @internal */
    public static readonly CollisionEventPool: typeof CollisionEventPool = CollisionEventPool;

    /** @internal */
    public static readonly RaycastHit2D: typeof RaycastHit2D = RaycastHit2D;
    /** @internal */
    public static readonly RayCastOneCallback: typeof RayCastOneCallback = RayCastOneCallback;
}
