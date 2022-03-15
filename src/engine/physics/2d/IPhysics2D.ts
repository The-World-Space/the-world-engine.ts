import type { Vector2 } from "three/src/Three";
import type { CollisionLayerMaskConverter } from "../CollisionLayerMaskConverter";
import type { PhysicsMaterial2D } from "./PhysicsMaterial2D";

export interface IPhysics2D {
    get gravity(): Vector2;
    set gravity(value: Vector2);

    get defaultMaterial(): PhysicsMaterial2D|null;

    get velocityIterations(): number;
    set velocityIterations(value: number);

    get positionIterations(): number;
    set positionIterations(value: number);

    // get velocityThreshold(): number;
    // set velocityThreshold(value: number);

    get maxLinearCorrection(): number;

    get maxAngularCorrection(): number;

    get maxTranslationSpeed(): number;

    get maxRotationSpeed(): number;

    get baumgarteScale(): number;

    get baumgarteTimeOfImpactScale(): number;

    get timeToSleep(): number;

    get linearSleepTolerance(): number;

    get angularSleepTolerance(): number;

    // get defaultContactOffset(): number;
    // set defaultContactOffset(value: number);

    // get queriesHitTriggers(): boolean;
    // set queriesHitTriggers(value: boolean);

    // get queriesStartInColliders(): boolean;
    // set queriesStartInColliders(value: boolean);

    get reuseCollisionCallbacks(): boolean;
    set reuseCollisionCallbacks(value: boolean);

    get collisionLayerMask(): CollisionLayerMaskConverter;
}
