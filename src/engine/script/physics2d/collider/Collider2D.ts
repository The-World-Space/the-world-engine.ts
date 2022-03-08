import * as b2 from "../../../../box2d.ts/build/index";
import { Vector2 } from "three";
import { ReadonlyVector2 } from "../../../math/ReadonlyVector2";
import { Component } from "../../../hierarchy_object/Component";
import { WritableVector2 } from "../../../math/WritableVector2";
import { PhysicsMaterial2D } from "../../../physics/2d/PhysicsMaterial2D";
import { CollisionLayer, CollisionLayerParm } from "../../../physics/CollisionLayer";
import { CollisionLayerConst } from "../../../physics/CollisionLayerConst";
import { IPhysicsObject2D } from "../../../physics/2d/PhysicsObject2D";

export class Collider2D extends Component {
    private _fixture: b2.Fixture|null = null;
    private _density = 1;
    private _material: PhysicsMaterial2D|null = null;
    private _isTrigger = false;
    private _offset: Vector2 = new Vector2();
    private _collisionLayer: string = CollisionLayerConst.DefaultLayerName;

    private _fixtureCreated = false;

    public onEnable(): void {
        this.createFixture();
    }

    public onDisable(): void {
        this.destroyFixture();
    }

    public onDestroy(): void {   
        this._material?.removeOnChangedEventListener(this.updateFixtureMaterialInfo);
    }

    private createFixture(): void {
        if (this._fixtureCreated) return;
        const fixtureDef = new b2.FixtureDef();
        fixtureDef.density = this._density;
        fixtureDef.isSensor = this._isTrigger;
        fixtureDef.shape = this.createShape();

        const layer = this.engine.physics.collisionLayerMask.nameToLayer(this._collisionLayer as any);
        fixtureDef.filter.categoryBits = layer;
        fixtureDef.filter.maskBits = this.engine.physics.collisionLayerMask.getMaskFromLayer(layer);
        //fixtureDef.filter.groupIndex

        this._fixture = this.engine.physics2DProcessor.addCollider(this.gameObject, this, fixtureDef);
        this.updateFixtureMaterialInfo();

        this._fixtureCreated = true;
    }

    private destroyFixture(): void {
        if (this._fixture) {
            if (!this._fixtureCreated) return;
            this.engine.physics2DProcessor.removeCollider(this.gameObject, this, this._fixture);
            this._fixture = null;
            this._fixtureCreated = false;
        }
    }

    protected updateFixture(): void {
        if (this._fixture) {
            this.destroyFixture();
            this.createFixture();
        }
    }

    /** @internal */
    public readonly updateFixtureMaterialInfo = () => {
        if (this._fixture) {
            let material: PhysicsMaterial2D|null = null;
            if (this._material) {
                material = this._material;
            } else if (this._fixture) {
                const physicsObject = this._fixture.GetBody().GetUserData() as IPhysicsObject2D;
                const rigidBodyMaterial = physicsObject.sharedMaterial;
                if (rigidBodyMaterial) material = rigidBodyMaterial;
            }
            if (!material) material = new PhysicsMaterial2D();

            this._fixture.SetFriction(material.friction);
            this._fixture.SetRestitution(material.bounciness);
        }
    };

    protected createShape(): b2.Shape {
        throw new Error("You should not use Collider2D directly but one of its subclasses. e.g. BoxCollider2D");
    }
    
    public get density(): number {
        return this._density;
    }

    public set density(value: number) {
        if (this._fixture) {
            const physicsObject = this._fixture.GetBody().GetUserData() as IPhysicsObject2D;
            if (physicsObject && physicsObject.rigidBody && !physicsObject.rigidBody.useAutoMass) {
                throw new Error("You cannot change the density of a collider when the rigid body is not using auto mass.");
            }
        }
        this._density = value;
        if (this._fixture) {
            this._fixture.SetDensity(value);
        }
    }

    public get material(): PhysicsMaterial2D|null {
        return this._material;
    }

    public set material(value: PhysicsMaterial2D|null) {
        if (value) {
            if (!this._material) {
                this._material = new PhysicsMaterial2D(value.friction, value.bounciness);
                this._material.addOnChangedEventListener(this.updateFixtureMaterialInfo);
            } else {
                this._material.copy(value);
            }
        } else {
            this._material?.removeOnChangedEventListener(this.updateFixtureMaterialInfo);
            this._material = null;
        }
        this.updateFixtureMaterialInfo();
    }

    public get isTrigger(): boolean {
        return this._isTrigger;
    }

    public set isTrigger(value: boolean) {
        this._isTrigger = value;
        if (this._fixture) {
            this._fixture.SetSensor(value);
        }
    }

    public get offset(): ReadonlyVector2 {
        return this._offset;
    }

    public set offset(value: ReadonlyVector2) {
        (this._offset as WritableVector2).copy(value);
        this.updateFixture();
    }

    public getCollisionLayer<T extends CollisionLayer>(): CollisionLayerParm<T> {
        return this._collisionLayer as CollisionLayerParm<T>;
    }

    public setCollisionLayer<T extends CollisionLayer>(value: CollisionLayerParm<T>) {
        this._collisionLayer = value as string;
        this.updateFixture();
    }
}
