import type { Body, Fixture, FixtureDef } from "../../../box2d.ts/build/index";
import { BodyType } from "../../../box2d.ts/build/index";
import { PhysicsMaterial2D } from "./PhysicsMaterial2D";
import type { GameObject } from "../../hierarchy_object/GameObject";
import type { Collider2D } from "../../script/physics2d/collider/Collider2D";
import type { RigidBody2D } from "../../script/physics2d/RigidBody2D";

/** @internal */
export interface IPhysicsObject2D {
    readonly gameObject: GameObject;
    readonly body: Body;
    get rigidbody(): RigidBody2D|null;
    get colliders(): readonly Collider2D[];
    get sharedMaterial(): PhysicsMaterial2D|null;
    setSharedPhysicsMaterial(material: PhysicsMaterial2D|null): void;
}

/** @internal */
export class PhysicsObject2D implements IPhysicsObject2D {
    public readonly gameObject: GameObject;
    public readonly body: Body;
    public destroyed = false; //is public for performance reasons
    private _onDestroy: () => void;
    private _sharedMaterial: PhysicsMaterial2D|null = null;
    private _rigidBody: RigidBody2D|null = null;
    private _colliders: Collider2D[] = [];

    public constructor(gameObject: GameObject, body: Body, onDestroy: () => void) {
        this.gameObject = gameObject;
        this.body = body;
        this._onDestroy = onDestroy;
        body.SetUserData(this);
    }

    public addRigidBody(rigidBody: RigidBody2D): IPhysicsObject2D {
        if (this._rigidBody) throw new Error("RigidBody already exists");
        this._rigidBody = rigidBody;
        return this;
    }

    public removeRigidBody(): void {
        this._rigidBody = null;
        this.body.SetType(BodyType.b2_kinematicBody);
        this.body.SetBullet(false);
        this.body.SetEnabled(true);
        this.checkDestroy();
    }

    public addCollider(collider: Collider2D, fixtureDef: FixtureDef): Fixture {
        this._colliders.push(collider);
        return this.body.CreateFixture(fixtureDef);
    }

    public removeCollider(collider: Collider2D, fixture: Fixture): void {
        const index = this._colliders.indexOf(collider);
        if (index === -1) throw new Error("Collider not found");
        this._colliders.splice(index, 1);
        this.body.DestroyFixture(fixture);
        this.checkDestroy();
    }

    private checkDestroy(): void {
        if (this._colliders.length === 0 && this._rigidBody === null) {
            this.destroyed = true;
            this._onDestroy();
        }
    }

    public setSharedPhysicsMaterial(material: PhysicsMaterial2D|null): void {
        if (material) {
            if (!this._sharedMaterial) {
                this._sharedMaterial = new PhysicsMaterial2D(material.friction, material.bounciness);
                this._sharedMaterial.addOnChangedEventListener(this.updateMaterialInfo);
            } else {
                this._sharedMaterial.copy(material);
            }
        } else {
            this._sharedMaterial?.removeOnChangedEventListener(this.updateMaterialInfo);
            this._sharedMaterial = null;
        }
        
        this.updateMaterialInfo();
    }

    private updateMaterialInfo = () => {
        for (let i = 0; i < this._colliders.length; i++) {
            this._colliders[i].updateFixtureMaterialInfo();
        }
    };

    public get sharedMaterial(): PhysicsMaterial2D|null {
        return this._sharedMaterial;
    }

    public get rigidbody(): RigidBody2D|null {
        return this._rigidBody;
    }

    public get colliders(): readonly Collider2D[] {
        return this._colliders;
    }
}
