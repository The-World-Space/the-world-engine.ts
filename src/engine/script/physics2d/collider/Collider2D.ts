import { ReadonlyVector2 } from "../../../math/ReadonlyVector2";
import { Component } from "../../../hierarchy_object/Component";
import { RigidBody2D } from "../RigidBody2D";
import { Vector2 } from "three";
import * as b2 from "../../../../box2d.ts/build/index";
import { WritableVector2 } from "../../../math/WritableVector2";
import { PhysicsMaterial2D } from "../../../physics/2d/PhysicsMaterial2D";

export class Collider2D extends Component {
    public override readonly requiredComponents = [RigidBody2D];

    private _rigidBody: RigidBody2D|null = null;
    private _fixture: b2.Fixture|null = null;
    private _density = 1;
    private _material: PhysicsMaterial2D|null = null;
    private _isTrigger = false;
    private _offset: Vector2 = new Vector2();

    private _fixtureCreated = false;

    public awake(): void {
        this._rigidBody = this.gameObject.getComponent(RigidBody2D);
    }

    public onEnable(): void {
        this.createFixture();
    }

    public onDisable(): void {
        this.destroyFixture();
    }

    public onDestroy(): void {   
        this._material?.removeOnChangedEventListener(this.updateFixtureMaterialInfo);
    }

    public readonly filter = new b2.Filter();

    /** @internal */
    public createFixture(rigidBody?: RigidBody2D): void {
        if (this._fixtureCreated) return;
        const physicsMaterial = this.getPhysicsMaterial(rigidBody || this._rigidBody!);
        const fixtureDef = new b2.FixtureDef();
        fixtureDef.density = this._density;
        fixtureDef.friction = physicsMaterial.friction;
        fixtureDef.restitution = physicsMaterial.bounciness;
        fixtureDef.isSensor = this._isTrigger;
        fixtureDef.shape = this.createShape();
        fixtureDef.filter.Copy(this.filter);
        this._fixture = rigidBody!.addFixture(fixtureDef, this);
        this._fixtureCreated = true;
    }

    private destroyFixture(): void {
        if (this._fixture) {
            if (!this._fixtureCreated) return;
            this._rigidBody!.removeFixture(this._fixture, this);
            this._fixture = null;
            this._fixtureCreated = false;
        }
    }

    /** @internal */
    public updateFixture(): void {
        if (this._fixture) {
            this.destroyFixture();
            this.createFixture();
        }
    }

    /** @internal */
    public readonly updateFixtureMaterialInfo = () => {
        if (this._fixture) {
            const material = this.getPhysicsMaterial(this._rigidBody!);
            this._fixture.SetFriction(material.friction);
            this._fixture.SetRestitution(material.bounciness);
        }
    };

    protected createShape(): b2.Shape {
        throw new Error("You should not use Collider2D directly but one of its subclasses. e.g. BoxCollider2D");
    }

    private getPhysicsMaterial(rigidBody: RigidBody2D): PhysicsMaterial2D {
        if (this._material) return this._material;

        const rigidBodyMaterial = rigidBody.material;
        if (rigidBodyMaterial) return rigidBodyMaterial;

        return new PhysicsMaterial2D();
    }

    public get density(): number {
        return this._density;
    }

    public set density(value: number) {
        if (this._rigidBody && !this._rigidBody.useAutoMass) {
            throw new Error("You cannot change the density of a collider when the rigid body is not using auto mass.");
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
        this._material?.removeOnChangedEventListener(this.updateFixtureMaterialInfo);
        this._material = value;
        this.updateFixtureMaterialInfo();
        this._material?.addOnChangedEventListener(this.updateFixtureMaterialInfo);
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
}
