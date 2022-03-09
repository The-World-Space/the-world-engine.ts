import * as b2 from "../../../box2d.ts/build/index";
import { Vector2 } from "three";
import { PhysicsMaterial2D } from "./PhysicsMaterial2D";
import { CollisionLayerMaskConverter } from "../CollisionLayerMaskConverter";
import { PhysicsSettingObject } from "../../bootstrap/setting/PhysicsSetting";
import { RigidBody2D } from "../../script/physics2d/RigidBody2D";
import { IPhysics2D } from "./IPhysics2D";
import { DeepReadonly } from "../../type/DeepReadonly";
import { GameObject } from "../../hierarchy_object/GameObject";
import { IPhysicsObject2D, PhysicsObject2D } from "./PhysicsObject2D";
import { Collider2D } from "../../script/physics2d/collider/Collider2D";

export class ContactListener extends b2.ContactListener {
    public override BeginContact(contact: b2.Contact<b2.Shape, b2.Shape>): void {
        const collider2dA = contact.GetFixtureA().GetUserData() as Collider2D;
        const collider2dB = contact.GetFixtureB().GetUserData() as Collider2D;
        //todo: pooling collision data
        collider2dA.gameObject.gameObjectEventContainer.invokeOnCollisionEnter2D(collider2dB as any);
        collider2dB.gameObject.gameObjectEventContainer.invokeOnCollisionEnter2D(collider2dA as any);
    }

    public override EndContact(contact: b2.Contact<b2.Shape, b2.Shape>): void {
        const collider2dA = contact.GetFixtureA().GetUserData() as Collider2D;
        const collider2dB = contact.GetFixtureB().GetUserData() as Collider2D;
        collider2dA.gameObject.gameObjectEventContainer.invokeOnCollisionExit2D(collider2dB as any);
        collider2dB.gameObject.gameObjectEventContainer.invokeOnCollisionExit2D(collider2dA as any);
    }
}

export class Physics2DProcessor implements IPhysics2D {
    //configuration variables
    private _defaultMaterial: PhysicsMaterial2D|null = null;
    private _velocityIterations = 8;
    private _positionIterations = 3;
    
    // private _velocityThreshold: number = 1;
    // private _defaultContactOffset: number = 0.01;

    // private _queriesHitTriggers: boolean = true;
    // private _queriesStartInColliders: boolean = true;
    // private _reuseCollisionCallbacks = true;
    private _collisionLayerMaskConverter = new CollisionLayerMaskConverter({
        default: { default: true },
    });

    //engine internal variables
    private readonly _world: b2.World = new b2.World(new b2.Vec2(0, -9.81));
    private readonly _gameObjectToBodyMap = new Map<GameObject, PhysicsObject2D>();

    /** @internal */
    public constructor() {
        this._world.SetContactListener(new ContactListener());
    }

    /** @internal */
    public applyPhysicsSettings(physicSetting: DeepReadonly<PhysicsSettingObject>): void {
        if (physicSetting.gravity) this._world.SetGravity(physicSetting.gravity);
        if (physicSetting.defaultMaterial) this._defaultMaterial = physicSetting.defaultMaterial.clone();
        if (physicSetting.velocityIterations) this._velocityIterations = physicSetting.velocityIterations;
        if (physicSetting.positionIterations) this._positionIterations = physicSetting.positionIterations;
        // if (physicSetting.velocityThreshold) this._velocityThreshold = physicSetting.velocityThreshold;
        // if (physicSetting.defaultContactOffset) this._defaultContactOffset = physicSetting.defaultContactOffset;
        // if (physicSetting.queriesHitTriggers) this._queriesHitTriggers = physicSetting.queriesHitTriggers;
        // if (physicSetting.queriesStartInColliders) this._queriesStartInColliders = physicSetting.queriesStartInColliders;
        if (physicSetting.reuseCollisionCallbacks) this.reuseCollisionCallbacks = physicSetting.reuseCollisionCallbacks;
        if (physicSetting.collisionLayerMaskConverter) this._collisionLayerMaskConverter = physicSetting.collisionLayerMaskConverter.clone();
    }

    /** @internal */
    public update(deltaTime: number): void {
        { //synchronize physics world with game world
            let body = this._world.GetBodyList();

            while (body) {
                const currentBody = body;
                body = body.GetNext();

                const entity = currentBody.GetUserData() as PhysicsObject2D;
                if (entity.destroyed) {
                    this._world.DestroyBody(currentBody);
                    continue;
                }

                const transform = entity.gameObject.transform;
                const gamePosition = transform.position;
                const gameRotation = transform.eulerAngles;

                const b2Position = currentBody.GetPosition();
                const b2Rotation = currentBody.GetAngle();

                if (gamePosition.x !== b2Position.x || gamePosition.y !== b2Position.y) {
                    currentBody.SetPosition(gamePosition);
                    currentBody.SetAwake(true);
                }

                if (gameRotation.z !== b2Rotation) {
                    currentBody.SetAngle(gameRotation.z);
                    currentBody.SetAwake(true);
                }
            }
        }

        this._world.Step(deltaTime, this._velocityIterations, this._positionIterations);

        { //synchronize game world with physics world
            let body = this._world.GetBodyList();

            while (body) {
                const currentBody = body;
                body = body.GetNext();

                const entity = currentBody.GetUserData() as PhysicsObject2D;
                if (entity.destroyed) {
                    this._world.DestroyBody(currentBody);
                    continue;
                }

                const transform = entity.gameObject.transform;
                transform.position.x = currentBody.GetPosition().x;
                transform.position.y = currentBody.GetPosition().y;
                transform.eulerAngles.z = currentBody.GetAngle();
            }
        }
    }

    /**
     * bodyDef.userData must not be set.
     * @internal
     */
    public addRigidBody(gameObject: GameObject, rigidBody: RigidBody2D, bodyDef: b2.BodyDef): IPhysicsObject2D {
        let physicsObject = this._gameObjectToBodyMap.get(gameObject);
        if (!physicsObject) {
            physicsObject = new PhysicsObject2D(
                gameObject,
                this._world.CreateBody(bodyDef),
                () => this._gameObjectToBodyMap.delete(gameObject)
            );
            this._gameObjectToBodyMap.set(gameObject, physicsObject);
            return physicsObject.addRigidBody(rigidBody);
        } else {
            const physicsBody = physicsObject.addRigidBody(rigidBody);
            const body = physicsBody.body;
            body.SetType(bodyDef.type);
            body.SetPosition(bodyDef.position);
            body.SetAngle(bodyDef.angle);
            body.SetLinearVelocity(bodyDef.linearVelocity);
            body.SetAngularVelocity(bodyDef.angularVelocity);
            body.SetLinearDamping(bodyDef.linearDamping);
            body.SetAngularDamping(bodyDef.angularDamping);
            body.SetSleepingAllowed(bodyDef.allowSleep);
            body.SetAwake(bodyDef.awake);
            body.SetFixedRotation(bodyDef.fixedRotation);
            body.SetBullet(bodyDef.bullet);
            body.SetEnabled(bodyDef.enabled);
            body.SetUserData(bodyDef.userData);
            body.SetGravityScale(bodyDef.gravityScale);
            return physicsBody;
        }
    }

    /** @internal */
    public removeRigidBody(gameObject: GameObject): void {
        const physicsObject = this._gameObjectToBodyMap.get(gameObject);
        if (!physicsObject) throw new Error("PhysicsObject2D not found"); 
        physicsObject.removeRigidBody();
    }

    private createColliderDefaultBodyDef(gameObject: GameObject): b2.BodyDef {
        const bodyDef = new b2.BodyDef();
        bodyDef.type = b2.BodyType.b2_kinematicBody;
        bodyDef.position.x = gameObject.transform.position.x;
        bodyDef.position.y = gameObject.transform.position.y;
        bodyDef.angle = gameObject.transform.eulerAngles.z;
        return bodyDef;
    }

    /** @internal */
    public addCollider(gameObject: GameObject, collider: Collider2D, fixturedef: b2.FixtureDef): b2.Fixture {
        let physicsObject = this._gameObjectToBodyMap.get(gameObject);
        if (!physicsObject) {
            physicsObject = new PhysicsObject2D(
                gameObject,
                this._world.CreateBody(this.createColliderDefaultBodyDef(gameObject)),
                () => this._gameObjectToBodyMap.delete(gameObject)
            );
        }
        this._gameObjectToBodyMap.set(gameObject, physicsObject);
        return physicsObject.addCollider(collider, fixturedef);
    }

    /** @internal */
    public removeCollider(gameObject: GameObject, collider: Collider2D, fixture: b2.Fixture): void {
        const physicsObject = this._gameObjectToBodyMap.get(gameObject);
        if (!physicsObject) throw new Error("PhysicsObject2D not found");
        physicsObject.removeCollider(collider, fixture);
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

    // public get velocityThreshold(): number {
    //     throw new Error("Method not implemented.");
    // }

    // public set velocityThreshold(_value: number) {
    //     throw new Error("Method not implemented.");
    // }

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

    // public get reuseCollisionCallbacks(): boolean {
    //     return this._reuseCollisionCallbacks;
    // }

    // public set reuseCollisionCallbacks(value: boolean) {
    //     this._reuseCollisionCallbacks = value;
    // }

    public reuseCollisionCallbacks = true;
    
    public get collisionLayerMask(): CollisionLayerMaskConverter {
        return this._collisionLayerMaskConverter;
    }
}
