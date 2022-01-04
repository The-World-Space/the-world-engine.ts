import { Vector2 } from "three";
import { PhysicsMaterial2D } from "./PhysicsMaterial2D";
import * as b2 from "../../box2d.ts/build/index";

export class Physics2DProcessor {
    //configuration variables
    private _defaultMaterial: PhysicsMaterial2D|null = null;
    private _velocityIterations: number = 8;
    private _positionIterations: number = 3;
    // private _velocityThreshold: number = 1;
    // private _maxLinearCorrection: number = 0.2;
    // private _maxAngularCorrection: number = 8;
    // private _maxTranslationSpeed: number = 100;
    // private _maxRotationSpeed: number = 360;
    // private _baumgarteScale: number = 0.2;
    // private _baumgarteTimeOfImpactScale: number = 0.75;
    // private _timeToSleep: number = 0.5;
    // private _linearSleepTolerance: number = 0.01;
    // private _angularSleepTolerance: number = 0.01;
    // private _defaultContactOffset: number = 0.01;
    // private _queriesHitTriggers: boolean = true;
    // private _queriesStartInColliders: boolean = true;
    // private _callbacksOnDisable: boolean = true;
    // private _reuseCollisionCallbacks: boolean = true;
    // private _autoSyncTransforms: boolean = false;

    //engine internal variables
    private readonly _world: b2.World = new b2.World(new b2.Vec2(0, -9.81));

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
}
