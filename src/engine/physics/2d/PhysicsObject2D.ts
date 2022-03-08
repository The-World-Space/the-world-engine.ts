import * as b2 from "../../../box2d.ts/build/index";
import { GameObject } from "../../hierarchy_object/GameObject";
import { Collider2D } from "../../script/physics2d/collider/Collider2D";
import { RigidBody2D } from "../../script/physics2d/RigidBody2D";
import { PhysicsMaterial2D } from "./PhysicsMaterial2D";

export interface IPhysicsObject2D {
    readonly body: b2.Body;
    get rigidBody(): RigidBody2D|null;
    get colliders(): readonly Collider2D[];
    get sharedMaterial(): PhysicsMaterial2D|null;
    setSharedPhysicsMaterial(material: PhysicsMaterial2D|null): void;
}

export class PhysicsObject2D implements IPhysicsObject2D {
    public readonly gameObject: GameObject;
    public readonly body: b2.Body;
    public destroyed = false; //is public for performance reasons
    private _onDestroy: () => void;
    private _sharedMaterial: PhysicsMaterial2D|null = null;
    private _rigidBody: RigidBody2D|null = null;
    private _colliders: Collider2D[] = [];

    public constructor(gameObject: GameObject, body: b2.Body, onDestroy: () => void) {
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
        this.body.SetType(b2.BodyType.b2_kinematicBody);
        this.body.SetBullet(false);
        this.body.SetEnabled(true);
        this.checkDestroy();
    }

    public addCollider(collider: Collider2D, fixtureDef: b2.FixtureDef): b2.Fixture {
        this._colliders.push(collider);
        return this.body.CreateFixture(fixtureDef);
    }

    public removeCollider(collider: Collider2D, fixture: b2.Fixture): void {
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

    public get rigidBody(): RigidBody2D|null {
        return this._rigidBody;
    }

    public get colliders(): readonly Collider2D[] {
        return this._colliders;
    }
}
