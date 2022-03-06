import { Vector2 } from "three";
import { PhysicsMaterial2D } from "./PhysicsMaterial2D";
import { CollisionLayerMaskConverter } from "../CollisionLayerMaskConverter";
import { PhysicsSettingObject } from "../../bootstrap/setting/PhysicsSetting";
import * as b2 from "../../../box2d.ts/build/index";
import { RigidBody2D } from "../../script/physics2d/RigidBody2D";

export class Physics2DProcessor {
    //configuration variables
    private _defaultMaterial: PhysicsMaterial2D|null = null;
    private _velocityIterations = 8;
    private _positionIterations = 3;
    // private _velocityThreshold: number = 1;
    // private _defaultContactOffset: number = 0.01;
    // private _queriesHitTriggers: boolean = true;
    // private _queriesStartInColliders: boolean = true;
    // private _callbacksOnDisable = true;
    // private _reuseCollisionCallbacks: boolean = true;
    private _collisionLayerMaskConverter = new CollisionLayerMaskConverter({
        default: { default: true },
    });

    //engine internal variables
    private readonly _world: b2.World = new b2.World(new b2.Vec2(0, -9.81));

    /** @internal */
    public constructor() {
        this._world.SetContactListener(
            new class extends b2.ContactListener {
                public override BeginContact(contact: b2.Contact<b2.Shape, b2.Shape>): void {
                    console.log(
                        "BeginContact",
                        (contact.GetFixtureA().GetBody().GetUserData() as RigidBody2D).gameObject.name,
                        (contact.GetFixtureB().GetBody().GetUserData() as RigidBody2D).gameObject.name);
                }

                public override EndContact(contact: b2.Contact<b2.Shape, b2.Shape>): void {
                    console.log(
                        "EndContact",
                        (contact.GetFixtureA().GetBody().GetUserData() as RigidBody2D).gameObject.name,
                        (contact.GetFixtureB().GetBody().GetUserData() as RigidBody2D).gameObject.name);
                }
            }
        );
    }

    /** @internal */
    public applyPhysicsSettings(physicSetting: PhysicsSettingObject): void {
        if (physicSetting.gravity) this._world.SetGravity(physicSetting.gravity);
        if (physicSetting.defaultMaterial) this._defaultMaterial = physicSetting.defaultMaterial;
        if (physicSetting.velocityIterations) this._velocityIterations = physicSetting.velocityIterations;
        if (physicSetting.positionIterations) this._positionIterations = physicSetting.positionIterations;
        // if (physicSetting.velocityThreshold) this._velocityThreshold = physicSetting.velocityThreshold;
        // if (physicSetting.defaultContactOffset) this._defaultContactOffset = physicSetting.defaultContactOffset;
        // if (physicSetting.queriesHitTriggers) this._queriesHitTriggers = physicSetting.queriesHitTriggers;
        // if (physicSetting.queriesStartInColliders) this._queriesStartInColliders = physicSetting.queriesStartInColliders;
        if (physicSetting.callbacksOnDisable) this.callbacksOnDisable = physicSetting.callbacksOnDisable;
        // if (physicSetting.reuseCollisionCallbacks) this._reuseCollisionCallbacks = physicSetting.reuseCollisionCallbacks;
        if (physicSetting.collisionLayerMaskConverter) this._collisionLayerMaskConverter = physicSetting.collisionLayerMaskConverter;
    }

    /** @internal */
    public update(deltaTime: number): void {
        this._world.Step(deltaTime, this._velocityIterations, this._positionIterations);
        this._world.ClearForces();

        let body = this._world.GetBodyList();

        while (body) {
            const currentBody = body;
            body = body.GetNext();

            const entity = currentBody.GetUserData() as RigidBody2D;
            entity.transform.position.x = currentBody.GetPosition().x;
            entity.transform.position.y = currentBody.GetPosition().y;
            entity.transform.eulerAngles.z = currentBody.GetAngle();
        }
    }

    /** @internal */
    public addRigidBody(bodyDef: b2.BodyDef): b2.Body {
        return this._world.CreateBody(bodyDef);
    }

    /** @internal */
    public removeRigidBody(body: b2.Body) {
        this._world.DestroyBody(body);
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

    public get timeToSleep(): number {
        return b2.timeToSleep;
    }

    public get linearSleepTolerance(): number {
        return b2.linearSleepTolerance;
    }

    public get angularSleepTolerance(): number {
        return b2.angularSleepTolerance;
    }

    // for performance reasons, we don't use this get set method

    // public get callbacksOnDisable(): boolean {
    //     return this._callbacksOnDisable;
    // }

    // public set callbacksOnDisable(value: boolean) {
    //     this._callbacksOnDisable = value;
    // }

    public callbacksOnDisable = true;
    
    public get collisionLayerMask(): CollisionLayerMaskConverter {
        return this._collisionLayerMaskConverter;
    }
}
