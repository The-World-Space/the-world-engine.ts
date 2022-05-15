import {
    angularSleepTolerance,
    baumgarte,
    BodyDef,
    BodyType,
    ContactListener,
    Filter,
    FixtureDef,
    linearSleepTolerance,
    MassData,
    maxAngularCorrection,
    maxLinearCorrection,
    maxRotation,
    maxTranslation,
    PolygonShape,
    timeToSleep,
    toiBaumgarte,
    Vec2,
    World,
    WorldManifold} from "../../../box2d.ts/build/index";
import { CollisionLayerMaskConverter } from "../CollisionLayerMaskConverter";
import { Collision2D } from "./Collision2D";
import { Collision2DPool } from "./Collision2DPool";
import { CollisionEventPool, TriggerEventPool } from "./EventPool";
import { PhysicsObject2D } from "./PhysicsObject2D";
import { RayCastFilterCallback } from "./RayCastFilterCallback";
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
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly BodyType: typeof BodyType = BodyType;
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly BodyDef: typeof BodyDef = BodyDef;
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly ContactListener: typeof ContactListener = ContactListener;
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly FixtureDef: typeof FixtureDef = FixtureDef;
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly Filter: typeof Filter = Filter;
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly MassData: typeof MassData = MassData;
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly PolygonShape: typeof PolygonShape = PolygonShape;
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly WorldManifold: typeof WorldManifold = WorldManifold;
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly World: typeof World = World;
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly Vec2: typeof Vec2 = Vec2;

    /** @internal */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly Collision2DPool: typeof Collision2DPool = Collision2DPool;
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly Collision2D: typeof Collision2D = Collision2D;
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly CollisionLayerMaskConverter: typeof CollisionLayerMaskConverter = CollisionLayerMaskConverter;
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly PhysicsObject2D: typeof PhysicsObject2D = PhysicsObject2D;
    
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly TriggerEventPool: typeof TriggerEventPool = TriggerEventPool;
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly CollisionEventPool: typeof CollisionEventPool = CollisionEventPool;

    /** @internal */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly RaycastHit2D: typeof RaycastHit2D = RaycastHit2D;
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly RayCastOneCallback: typeof RayCastOneCallback = RayCastOneCallback;
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly RayCastFilterCallback: typeof RayCastFilterCallback = RayCastFilterCallback;
}
