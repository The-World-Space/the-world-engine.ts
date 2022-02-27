import { Vector2 } from "three";
import { PhysicsMaterial2D } from "./PhysicsMaterial2D";
import * as b2 from "../../../box2d.ts/build/index";
import { CollisionLayerMaskConverter } from "../CollisionLayerMaskConverter";
import { PhysicsSettingObject } from "../../bootstrap/setting/GameSetting";

export class Physics2DProcessor {
    //configuration variables
    private _defaultMaterial: PhysicsMaterial2D|null = null;
    private _velocityIterations = 8;
    private _positionIterations = 3;
    // private _velocityThreshold: number = 1;
    // private _timeToSleep: number = 0.5;
    // private _linearSleepTolerance: number = 0.01;
    // private _angularSleepTolerance: number = 0.01;
    // private _defaultContactOffset: number = 0.01;
    // private _queriesHitTriggers: boolean = true;
    // private _queriesStartInColliders: boolean = true;
    // private _callbacksOnDisable: boolean = true;
    // private _reuseCollisionCallbacks: boolean = true;
    private _collisionLayerMaskConverter: CollisionLayerMaskConverter|null = null;

    //engine internal variables
    private readonly _world: b2.World = new b2.World(new b2.Vec2(0, -9.81));

    /** @internal */
    public applyPhysicsSettings(physicSetting: PhysicsSettingObject): void {
        this._collisionLayerMaskConverter = physicSetting.collisionLayerMask;
    }

    public update(deltaTime: number): void {
        this._world.Step(deltaTime, this._velocityIterations, this._positionIterations);
        this._world.ClearForces();

        let body = this._world.GetBodyList();

        while (body) {
            const entity = body.GetUserData();

            if (entity) {
                entity.transform.position.x = body.GetPosition().x;
                entity.transform.position.y = body.GetPosition().y;
                entity.transform.rotation = body.GetAngle();
            }

            body = body.GetNext();
        }
    }

    public get gravity(): Vector2 {
        const b2Vec2 = this._world.GetGravity();
        return new Vector2(b2Vec2.x, b2Vec2.y);
    }

    public set gravity(value: Vector2) {
        this._world.SetGravity(new b2.Vec2(value.x, value.y));
    }

    public get defaultMaterial(): PhysicsMaterial2D|null {
        return this._defaultMaterial;
    }

    public set defaultMaterial(value: PhysicsMaterial2D|null) {
        this._defaultMaterial = value;
    }

    public get velocityIterations(): number {
        return this._velocityIterations;
    }

    public set velocityIterations(value: number) {
        this._velocityIterations = value;
    }

    public get positionIterations(): number {
        return this._positionIterations;
    }

    public set positionIterations(value: number) {
        this._positionIterations = value;
    }

    public get velocityThreshold(): number {
        throw new Error("Method not implemented.");
    }

    public set velocityThreshold(_value: number) {
        throw new Error("Method not implemented.");
    }

    public get maxLinearCorrection(): number {
        return b2.maxLinearCorrection;
    }

    public get maxAngularCorrection(): number {
        return b2.maxAngularCorrection;
    }

    public get maxTranslationSpeed(): number {
        return b2.maxTranslation;
    }

    public get maxRotationSpeed(): number {
        return b2.maxRotation;
    }

    public get baumgarteScale(): number {
        return b2.baumgarte;
    }

    public get baumgarteTimeOfImpactScale(): number {
        return b2.toiBaumgarte;
    }
    
    public get collisionLayerMask(): CollisionLayerMaskConverter {
        return this._collisionLayerMaskConverter!;
    }
}
