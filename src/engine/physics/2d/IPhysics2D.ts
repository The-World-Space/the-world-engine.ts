import { Vector2 } from "three";
import { CollisionLayerMask } from "../CollisionLayerMask";
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
    set maxLinearCorrection(value: number);

    get maxAngularCorrection(): number;
    set maxAngularCorrection(value: number);

    get maxTranslationSpeed(): number;
    set maxTranslationSpeed(value: number);

    get maxRotationSpeed(): number;
    set maxRotationSpeed(value: number);

    get baumgarteScale(): number;
    set baumgarteScale(value: number);

    get baumgarteTimeOfImpactScale(): number;
    set baumgarteTimeOfImpactScale(value: number);

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
    
    get autoSyncTransforms(): boolean;
    set autoSyncTransforms(value: boolean);

    get collisionLayerMask(): CollisionLayerMask;
}