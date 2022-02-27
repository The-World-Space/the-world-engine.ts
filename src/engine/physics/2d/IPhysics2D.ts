import { Vector2 } from "three";
import { CollisionLayerMaskConverter } from "../CollisionLayerMaskConverter";
import { PhysicsMaterial2D } from "./PhysicsMaterial2D";

export interface IPhysics2D {
    get gravity(): Vector2;
    set gravity(value: Vector2);

    get defaultMaterial(): PhysicsMaterial2D|null;
    set defaultMaterial(value: PhysicsMaterial2D|null);

    get velocityIterations(): number;
    set velocityIterations(value: number);

    get positionIterations(): number;
    set positionIterations(value: number);

    get velocityThreshold(): number;
    set velocityThreshold(value: number);

    get maxLinearCorrection(): number;

    get maxAngularCorrection(): number;

    get maxTranslationSpeed(): number;

    get maxRotationSpeed(): number;

    get baumgarteScale(): number;

    get baumgarteTimeOfImpactScale(): number;

    get timeToSleep(): number;
    set timeToSleep(value: number);

    get linearSleepTolerance(): number;
    set linearSleepTolerance(value: number);

    get angularSleepTolerance(): number;
    set angularSleepTolerance(value: number);

    get defaultContactOffset(): number;
    set defaultContactOffset(value: number);

    get queriesHitTriggers(): boolean;
    set queriesHitTriggers(value: boolean);

    get queriesStartInColliders(): boolean;
    set queriesStartInColliders(value: boolean);

    get callbacksOnDisable(): boolean;
    set callbacksOnDisable(value: boolean);

    get reuseCollisionCallbacks(): boolean;
    set reuseCollisionCallbacks(value: boolean);

    get collisionLayerMask(): CollisionLayerMaskConverter;
}
