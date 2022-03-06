import * as b2 from "../../../box2d.ts/build/index";
import { Collider2D } from "./collider/Collider2D";
import { Vector2 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { PhysicsMaterial2D } from "../../physics/2d/PhysicsMaterial2D";
import { ReadonlyVector2 } from "../../math/ReadonlyVector2";
import { WritableVector2 } from "../../math/WritableVector2";

export enum RigidbodyType2D {
    Dynamic,
    Kinematic,
    Static
}

export enum CollisionDetectionMode2D {
    Discrete,
    Continuous
}

export enum RigidbodySleepMode2D {
    NeverSleep,
    StartAwake,
    StartAsleep
}

export enum ForceMode2D {
    Force,
    Impulse
}

export class RigidBody2D extends Component {
    public override readonly disallowMultipleComponent = true;

    private _body: b2.Body|null = null;

    private _bodyType: b2.BodyType = b2.BodyType.b2_dynamicBody; // Body Type
    private _material: PhysicsMaterial2D|null = null; // Material
    private _simulated = true; // Simulated
    private _useAutoMass = false; // https://stackoverflow.com/questions/14004179/box2d-set-mass-on-a-figure
    private _mass = 1; // Mass
    private _linearDrag = 0; // Linear Drag
    private _angularDrag = 0.05; // Angular Drag
    private _gravityScale = 1; // Gravity Scale
    private _collisionDetection: CollisionDetectionMode2D = CollisionDetectionMode2D.Discrete; // Collision Detection
    private _sleepMode: RigidbodySleepMode2D = RigidbodySleepMode2D.StartAwake; // Sleeping Mode
    private _freezeRotation = false; // Freeze Rotation

    private readonly _centerOfMass = new Vector2(NaN, NaN);
    private readonly _worldCenterOfMass = new Vector2(NaN, NaN);
    private _inertia = NaN;
    private readonly _linearVelocity = new Vector2();
    private _angularVelocity = 0;
    //private _useFullKinematicContacts = false;

    private readonly _attachedColliders: Collider2D[] = [];

    public awake(): void {
        const bodyDef = new b2.BodyDef();
        bodyDef.userData = this;
        bodyDef.type = this._bodyType;
        bodyDef.enabled = this._simulated;
        bodyDef.linearDamping = this._linearDrag;
        bodyDef.angularDamping = this._angularDrag;
        bodyDef.gravityScale = this._gravityScale;
        bodyDef.bullet = this._collisionDetection === CollisionDetectionMode2D.Continuous;
        bodyDef.allowSleep = this._sleepMode !== RigidbodySleepMode2D.NeverSleep;
        bodyDef.awake = this._sleepMode === RigidbodySleepMode2D.StartAwake || 
            this._sleepMode === RigidbodySleepMode2D.NeverSleep;
        bodyDef.fixedRotation = this._freezeRotation;
        bodyDef.position
            .Set(this.transform.position.x, this.transform.position.y);
        bodyDef.angle = this.transform.eulerAngles.z;
        bodyDef.linearVelocity.Copy(this._linearVelocity);
        bodyDef.angularVelocity = this._angularVelocity;
        this._body = this.engine.physics2DProcessor.observeBody(this.gameObject, bodyDef);
        const colliderList = this.gameObject.getComponents(Collider2D);
        for (let i = 0; i < colliderList.length; i++) {
            colliderList[i].createFixture(this);
        }

        if (isNaN(this._centerOfMass.x)) {
            const centerOfMass = this._body.GetLocalCenter();
            this._centerOfMass.set(centerOfMass.x, centerOfMass.y);
        }
        if (isNaN(this._inertia)) {
            this._inertia = this._body.GetInertia();
        }
        
        this.updateMassData();
    }

    public onDestroy(): void {
        this.engine.physics2DProcessor.unObserveBody(this.gameObject);
        this._body = null;
        this._material?.removeOnChangedEventListener(this._updateMaterialInfo);
    }
    
    /** @internal */
    public addFixture(fixtureDef: b2.FixtureDef, collider: Collider2D): b2.Fixture {
        const fixture = this._body!.CreateFixture(fixtureDef);
        this._attachedColliders.push(collider);

        //update center of mass
        const centerOfMass = this._body!.GetLocalCenter();
        this._centerOfMass.set(centerOfMass.x, centerOfMass.y);


        return fixture;
    }

    /** @internal */
    public removeFixture(fixture: b2.Fixture, collider: Collider2D): void {
        const index = this._attachedColliders.findIndex(c => c.instanceId === collider.instanceId);
        if (index >= 0) {
            this._attachedColliders.splice(index, 1);
        }
        this._body!.DestroyFixture(fixture);
    }

    private readonly _updateMaterialInfo = () => {
        const colliderList = this._attachedColliders;
        for (let i = 0; i < colliderList.length; i++) {
            colliderList[i].updateFixtureMaterialInfo();
        }
    };
    
    private readonly _massData: b2.MassData = new b2.MassData();

    private updateMassData(): void {
        if (!this._body) return;
        const massData = this._massData;
        this._body.GetMassData(massData);
        if (!this._useAutoMass) massData.mass = this._mass;
        massData.center.Copy(this._centerOfMass);
        massData.I = this._inertia;
        this._body.SetMassData(massData);
    }

    public get bodyType(): RigidbodyType2D {
        switch (this._bodyType) {
        case b2.BodyType.b2_staticBody:
            return RigidbodyType2D.Static;
        case b2.BodyType.b2_kinematicBody:
            return RigidbodyType2D.Kinematic;
        case b2.BodyType.b2_dynamicBody:
            return RigidbodyType2D.Dynamic;
        }
        throw new Error("Unknown body type");
    }

    public set bodyType(value: RigidbodyType2D) {
        switch (value) {
        case RigidbodyType2D.Dynamic:
            this._bodyType = b2.BodyType.b2_dynamicBody;
            break;
        case RigidbodyType2D.Kinematic:
            this._bodyType = b2.BodyType.b2_kinematicBody;
            break;
        case RigidbodyType2D.Static:
            this._bodyType = b2.BodyType.b2_staticBody;
            break;
        }
    }

    public get material(): PhysicsMaterial2D|null {
        return this._material;
    }

    public set material(value: PhysicsMaterial2D|null) {
        this._material?.removeOnChangedEventListener(this._updateMaterialInfo);
        this._material = value;
        this._updateMaterialInfo();
        this._material?.addOnChangedEventListener(this._updateMaterialInfo);
    }

    public get simulated(): boolean {
        return this._simulated;
    }

    public set simulated(value: boolean) {
        this._simulated = value;
        this._body?.SetEnabled(value);
    }

    public get useAutoMass(): boolean {
        return this._useAutoMass;
    }

    public set useAutoMass(value: boolean) {
        this._useAutoMass = value;
        if (this._body) {
            if (this._useAutoMass) this._mass = this._body.GetMass();
        }
        this.updateMassData();
    }

    public get mass(): number {
        if (this._useAutoMass) {
            if (this._body) return this._body.GetMass();
            throw new Error("Cannot get mass when body is not created");
        }
        return this._mass;
    }

    public set mass(value: number) {
        if (this._useAutoMass) throw new Error("Cannot set mass when useAutoMass is true");
        this._mass = value;
        this.updateMassData();
    }

    public get drag(): number {
        return this._linearDrag;
    }

    public set drag(value: number) {
        this._linearDrag = value;
        this._body?.SetLinearDamping(value);
    }

    public get angularDrag(): number {
        return this._angularDrag;
    }

    public set angularDrag(value: number) {
        this._angularDrag = value;
        this._body?.SetAngularDamping(value);
    }

    public get gravityScale(): number {
        return this._gravityScale;
    }

    public set gravityScale(value: number) {
        this._gravityScale = value;
        this._body?.SetGravityScale(value);
    }

    public get collisionDetection(): CollisionDetectionMode2D {
        return this._collisionDetection;
    }

    public set collisionDetection(value: CollisionDetectionMode2D) {
        this._collisionDetection = value;
        this._body?.SetBullet(value === CollisionDetectionMode2D.Continuous);
    }

    public get sleepMode(): RigidbodySleepMode2D {
        return this._sleepMode;
    }

    public set sleepMode(value: RigidbodySleepMode2D) {
        this._sleepMode = value;
        this._body?.SetSleepingAllowed(value !== RigidbodySleepMode2D.NeverSleep);
        this._body?.SetAwake(value === RigidbodySleepMode2D.StartAwake ||
            value === RigidbodySleepMode2D.NeverSleep);
    }

    public get freezeRotation(): boolean {
        return this._freezeRotation;
    }

    public set freezeRotation(value: boolean) {
        this._freezeRotation = value;
        this._body?.SetFixedRotation(value);
    }

    public get centerOfMass(): ReadonlyVector2 {
        if (isNaN(this._centerOfMass.x)) {
            throw new Error("Cannot get center of mass when body is not created");
        }
        return this._centerOfMass;
    }

    public set centerOfMass(value: ReadonlyVector2) {
        (this._centerOfMass as WritableVector2).copy(value);
        this.updateMassData();
    }

    public get worldCenterOfMass(): ReadonlyVector2 {
        if (this._body) {
            const center = this._body.GetWorldCenter();
            this._worldCenterOfMass
                .set(center.x, center.y);
        }
        if (isNaN(this._worldCenterOfMass.x)) {
            throw new Error("Cannot get world center of mass when body is not created");
        }
        return this._worldCenterOfMass;
    }

    public get inertia(): number {
        return this._inertia;
    }

    public set inertia(value: number) {
        this._inertia = value;
        this.updateMassData();
    }

    public get velocity(): ReadonlyVector2 {
        if (this._body) {
            const velocity = this._body.GetLinearVelocity();
            this._linearVelocity.set(velocity.x, velocity.y);
        }
        return this._linearVelocity;
    }

    public set velocity(value: ReadonlyVector2) {
        (this._linearVelocity as WritableVector2).copy(value);
        if (this._body) {
            this._body.SetLinearVelocity(value);
        }
    }

    public get angularVelocity(): number {
        if (this._body) {
            this._angularVelocity = this._body.GetAngularVelocity();
        }
        return this._angularVelocity;
    }

    public set angularVelocity(value: number) {
        this._angularVelocity = value;
        if (this._body) {
            this._body.SetAngularVelocity(value);
        }
    }

    public get attachedColliderCount(): number {
        return this._attachedColliders.length;
    }

    private readonly _vec2Buffer = new b2.Vec2();

    public addForce(force: ReadonlyVector2, mode: ForceMode2D = ForceMode2D.Force): void {
        if (this._body) {
            if (mode === ForceMode2D.Impulse) {
                this._body.ApplyLinearImpulse(force, this._body.GetWorldCenter(), true);
            } else {
                this._body.ApplyForce(force, this._body.GetWorldCenter(), true);
            }
        } else {
            throw new Error("Cannot add force when body is not created");
        }
    }

    public addForceAtPosition(force: ReadonlyVector2, position: ReadonlyVector2, mode: ForceMode2D = ForceMode2D.Force): void {
        if (this._body) {
            const pos = this._vec2Buffer
                .Copy(position);
            if (mode === ForceMode2D.Impulse) {
                this._body.ApplyLinearImpulse(force, pos, true);
            } else {
                this._body.ApplyForce(force, pos, true);
            }
        } else {
            throw new Error("Cannot add force when body is not created");
        }
    }

    public addRelativeForce(relativeForce: ReadonlyVector2, mode: ForceMode2D = ForceMode2D.Force): void {
        if (this._body) {
            const f = this._body.GetWorldVector(relativeForce, this._vec2Buffer);
            if (mode === ForceMode2D.Impulse) {
                this._body.ApplyLinearImpulse(f, this._body.GetWorldCenter(), true);
            } else {
                this._body.ApplyForce(f, this._body.GetWorldCenter(), true);
            }
        } else {
            throw new Error("Cannot add force when body is not created");
        }
    }

    public addTorque(torque: number, mode: ForceMode2D = ForceMode2D.Force): void {
        if (this._body) {
            if (mode === ForceMode2D.Impulse) {
                this._body.ApplyAngularImpulse(torque, true);
            } else {
                this._body.ApplyTorque(torque, true);
            }
        } else {
            throw new Error("Cannot add force when body is not created");
        }
    }

    public getPoint(point: ReadonlyVector2, out?: Vector2): Vector2 {
        const buffer = out ?? new Vector2();
        if (this._body) {
            const pos = this._vec2Buffer
                .Copy(point);
            return this._body.GetLocalPoint(pos, buffer);
        } else {
            throw new Error("Cannot get point when body is not created");
        }
    }

    public getPointVelocity(point: ReadonlyVector2, out?: Vector2): Vector2 {
        const buffer = out ?? new Vector2();
        if (this._body) {
            const pos = this._vec2Buffer
                .Copy(point);
            return this._body.GetLinearVelocityFromWorldPoint(pos, buffer);
        } else {
            throw new Error("Cannot get point velocity when body is not created");
        }
    }

    public getRelativePoint(relativePoint: ReadonlyVector2, out?: Vector2): Vector2 {
        const buffer = out ?? new Vector2();
        if (this._body) {
            const pos = this._vec2Buffer
                .Copy(relativePoint);
            return this._body.GetWorldPoint(pos, buffer);
        } else {
            throw new Error("Cannot get relative point when body is not created");
        }
    }

    public getRelativePointVelocity(relativePoint: ReadonlyVector2, out?: Vector2): Vector2 {
        const buffer = out ?? new Vector2();
        if (this._body) {
            const pos = this._vec2Buffer
                .Copy(relativePoint);
            return this._body.GetLinearVelocityFromWorldPoint(pos, buffer);
        } else {
            throw new Error("Cannot get relative point velocity when body is not created");
        }
    }

    public getRelativeVector(relativeVector: ReadonlyVector2, out?: Vector2): Vector2 {
        const buffer = out ?? new Vector2();
        if (this._body) {
            return this._body.GetWorldVector(relativeVector, buffer);
        } else {
            throw new Error("Cannot get relative vector when body is not created");
        }
    }

    public getVector(vector: ReadonlyVector2, out?: Vector2): Vector2 {
        const buffer = out ?? new Vector2();
        if (this._body) {
            return this._body.GetLocalVector(vector, buffer);
        } else {
            throw new Error("Cannot get vector when body is not created");
        }
    }

    // Cast    All the Collider2D shapes attached to the Rigidbody2D are cast into the Scene starting at each Collider position ignoring the Colliders attached to the same Rigidbody2D.
    // ClosestPoint    Returns a point on the perimeter of all enabled Colliders attached to this Rigidbody that is closest to the specified position.
    // Distance    Calculates the minimum distance of this collider against all Collider2D attached to this Rigidbody2D.
    // GetAttachedColliders    Returns all Collider2D that are attached to this Rigidbody2D.
    // GetContacts    Retrieves all contact points for all of the Collider(s) attached to this Rigidbody.
    // GetShapes    Gets all the PhysicsShape2D used by all Collider2D attached to the Rigidbody2D.
    // IsTouching    Checks whether the collider is touching any of the collider(s) attached to this rigidbody or not.
    // IsTouchingLayers    Checks whether any of the collider(s) attached to this rigidbody are touching any colliders on the specified layerMask or not.
    // OverlapCollider    Get a list of all Colliders that overlap all Colliders attached to this Rigidbody2D.
    // OverlapPoint    Check if any of the Rigidbody2D colliders overlap a point in space.
    
    public isSleeping(): boolean {
        if (this._body) {
            return !this._body.IsAwake();
        } else {
            throw new Error("Cannot check if body is sleeping when body is not created");
        }
    }

    public sleep(): void {
        if (this._body) {
            this._body.SetAwake(false);
        } else {
            throw new Error("Cannot sleep when body is not created");
        }
    }

    public isAwake(): boolean {
        if (this._body) {
            return this._body.IsAwake();
        } else {
            throw new Error("Cannot check if body is awake when body is not created");
        }
    }

    public wakeUp(): void {
        if (this._body) {
            this._body.SetAwake(true);
        } else {
            throw new Error("Cannot wake up body when body is not created");
        }
    }
}
