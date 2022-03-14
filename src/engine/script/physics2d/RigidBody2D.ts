import * as b2 from "../../../box2d.ts/build/index";
import { Vector2 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { PhysicsMaterial2D } from "../../physics/2d/PhysicsMaterial2D";
import { ReadonlyVector2 } from "../../math/ReadonlyVector2";
import { WritableVector2 } from "../../math/WritableVector2";
import { IPhysicsObject2D } from "../../physics/2d/PhysicsObject2D";
import { Collider2D } from "./collider/Collider2D";
import { CollisionLayer, CollisionLayerParm } from "../../physics/CollisionLayer";
import { CollisionLayerConst } from "../../physics/CollisionLayerConst";
import { ContactPoint2D } from "../../physics/2d/ContactPoint2D";

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

    private _physicsObject: IPhysicsObject2D|null = null;
    private _body: b2.Body|null = null;

    private _bodyType: b2.BodyType = b2.BodyType.b2_dynamicBody; // Body Type
    // Material
    private _simulated = true; // Simulated
    private _useAutoMass = false; // https://stackoverflow.com/questions/14004179/box2d-set-mass-on-a-figure
    private _mass = 1; // Mass
    private _linearDrag = 0; // Linear Drag
    private _angularDrag = 0.05; // Angular Drag
    private _gravityScale = 1; // Gravity Scale
    private _collisionDetection: CollisionDetectionMode2D = CollisionDetectionMode2D.Discrete; // Collision Detection
    private _sleepMode: RigidbodySleepMode2D = RigidbodySleepMode2D.StartAwake; // Sleeping Mode
    private _freezeRotation = false; // Freeze Rotation
    private _collisionLayer: string = CollisionLayerConst.DefaultLayerName;

    private readonly _centerOfMass = new Vector2(NaN, NaN);
    private readonly _worldCenterOfMass = new Vector2(NaN, NaN);
    private _inertia = NaN;
    private readonly _linearVelocity = new Vector2();
    private _angularVelocity = 0;
    //private _useFullKinematicContacts = false;

    public awake(): void {
        if (this._physicsObject) return;

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
        this._physicsObject = this.engine.physics2DProcessor.addRigidBody(this.gameObject, this, bodyDef);
        this.updateSimulatedToCollider();

        this._body = this._physicsObject.body;

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
        this._physicsObject?.setSharedPhysicsMaterial(null);
        this.engine.physics2DProcessor.removeRigidBody(this.gameObject);
        this._physicsObject = null;
        this._body = null;
        this.updateSimulatedToCollider();
    }

    public onEnable(): void {
        this._simulated = true;
        this.getB2Body().SetEnabled(true);
        this.updateSimulatedToCollider();
    }

    public onDisable(): void {
        this._simulated = false;
        this._body?.SetEnabled(false);
        this.updateSimulatedToCollider();
    }

    private updateSimulatedToCollider(): void {
        if (!this._physicsObject) return;
        const colliders = this._physicsObject.colliders;
        for (let i = 0, l = colliders.length; i < l; i++) {
            const collider = colliders[i];
            collider.updateFixtureFilter();
        }
    }

    private getPhysicsObject(): IPhysicsObject2D {
        if (!this._physicsObject) this.awake();
        return this._physicsObject!;
    }

    private getB2Body(): b2.Body {
        if (!this._body) this.awake();
        return this._body!;
    }
    
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

    /** @internal */
    public updateMass(): void {
        if (!this._body) return;
        if (!this._useAutoMass) return;
        const massData = this._massData;
        this._body.GetMassData(massData);
        massData.mass = this._mass;
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
        return this.getPhysicsObject().sharedMaterial;
    }

    public set material(value: PhysicsMaterial2D|null) {
        this.getPhysicsObject().setSharedPhysicsMaterial(value);
    }

    public get simulated(): boolean {
        return this._simulated;
    }

    public set simulated(value: boolean) {
        this.enabled = value;
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
            return this.getB2Body().GetMass();
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

    public getCollisionLayer<T extends CollisionLayer>(): CollisionLayerParm<T> {
        return this._collisionLayer as CollisionLayerParm<T>;
    }

    public setCollisionLayer<T extends CollisionLayer>(value: CollisionLayerParm<T>) {
        this._collisionLayer = value as string;
    }
    
    public get centerOfMass(): ReadonlyVector2 {
        const localCenter = this.getB2Body().GetLocalCenter();
        this._centerOfMass.set(localCenter.x, localCenter.y);
        return this._centerOfMass;
    }

    public set centerOfMass(value: ReadonlyVector2) {
        (this._centerOfMass as WritableVector2).copy(value);
        this.updateMassData();
    }

    public get worldCenterOfMass(): ReadonlyVector2 {
        const center = this.getB2Body().GetWorldCenter();
        this._worldCenterOfMass
            .set(center.x, center.y);
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
        return this.getPhysicsObject().colliders.length;
    }

    private readonly _vec2Buffer = new b2.Vec2();

    public addForce(force: ReadonlyVector2, mode: ForceMode2D = ForceMode2D.Force): void {
        const body = this.getB2Body();
        if (mode === ForceMode2D.Impulse) {
            body.ApplyLinearImpulse(force, body.GetWorldCenter(), true);
        } else {
            body.ApplyForce(force, body.GetWorldCenter(), true);
        }
    }

    public addForceAtPosition(force: ReadonlyVector2, position: ReadonlyVector2, mode: ForceMode2D = ForceMode2D.Force): void {
        const body = this.getB2Body();
        const pos = this._vec2Buffer
            .Copy(position);
        if (mode === ForceMode2D.Impulse) {
            body.ApplyLinearImpulse(force, pos, true);
        } else {
            body.ApplyForce(force, pos, true);
        }
    }

    public addRelativeForce(relativeForce: ReadonlyVector2, mode: ForceMode2D = ForceMode2D.Force): void {
        const body = this.getB2Body();
        const f = body.GetWorldVector(relativeForce, this._vec2Buffer);
        if (mode === ForceMode2D.Impulse) {
            body.ApplyLinearImpulse(f, body.GetWorldCenter(), true);
        } else {
            body.ApplyForce(f, body.GetWorldCenter(), true);
        }
    }

    public addTorque(torque: number, mode: ForceMode2D = ForceMode2D.Force): void {
        const body = this.getB2Body();
        if (mode === ForceMode2D.Impulse) {
            body.ApplyAngularImpulse(torque, true);
        } else {
            body.ApplyTorque(torque, true);
        }
    }

    public getPoint(point: ReadonlyVector2, out?: Vector2): Vector2 {
        const buffer = out ?? new Vector2();
        const pos = this._vec2Buffer.Copy(point);
        return this.getB2Body().GetLocalPoint(pos, buffer);
    }

    public getPointVelocity(point: ReadonlyVector2, out?: Vector2): Vector2 {
        const buffer = out ?? new Vector2();
        const pos = this._vec2Buffer.Copy(point);
        return this.getB2Body().GetLinearVelocityFromWorldPoint(pos, buffer);
    }

    public getRelativePoint(relativePoint: ReadonlyVector2, out?: Vector2): Vector2 {
        const buffer = out ?? new Vector2();
        const pos = this._vec2Buffer.Copy(relativePoint);
        return this.getB2Body().GetWorldPoint(pos, buffer);
    }

    public getRelativePointVelocity(relativePoint: ReadonlyVector2, out?: Vector2): Vector2 {
        const buffer = out ?? new Vector2();
        const pos = this._vec2Buffer
            .Copy(relativePoint);
        return this.getB2Body().GetLinearVelocityFromWorldPoint(pos, buffer);
    }

    public getRelativeVector(relativeVector: ReadonlyVector2, out?: Vector2): Vector2 {
        const buffer = out ?? new Vector2();
        return this.getB2Body().GetWorldVector(relativeVector, buffer);
    }

    public getVector(vector: ReadonlyVector2, out?: Vector2): Vector2 {
        const buffer = out ?? new Vector2();
        return this.getB2Body().GetLocalVector(vector, buffer);
    }

    // Cast    All the Collider2D shapes attached to the Rigidbody2D are cast into the Scene starting at each Collider position ignoring the Colliders attached to the same Rigidbody2D.
    // ClosestPoint    Returns a point on the perimeter of all enabled Colliders attached to this Rigidbody that is closest to the specified position. https://rotatingcanvas.com/calculate-closest-point-of-box2d-body-in-libgdx/
    // Distance    Calculates the minimum distance of this collider against all Collider2D attached to this Rigidbody2D.
    
    public getAttachedColliders(out: Collider2D[]): number {
        const colliders = this.getPhysicsObject().colliders;
        if (out.length < colliders.length) {
            out.length = colliders.length;
        }
        for (let i = 0; i < colliders.length; i++) {
            out[i] = colliders[i];
        }
        return colliders.length;
    }
    
    private _worldManifold: b2.WorldManifold = new b2.WorldManifold();

    public getContacts(out: ContactPoint2D[]): number {
        let insertPos = 0;
        const b2Body = this.getB2Body();
        let contactEdge = b2Body.GetContactList();
        while (contactEdge) {
            const currentContactEdge = contactEdge;
            contactEdge = contactEdge.next;
            
            const manifold = currentContactEdge.contact.GetManifold();
            for (let i = 0; i < manifold.pointCount; i++) {
                if (!out[insertPos]) out[insertPos] = new ContactPoint2D();
                currentContactEdge.contact.GetWorldManifold(this._worldManifold);
                out[insertPos].setData(
                    currentContactEdge.contact,
                    manifold.points[i],
                    this._worldManifold.normal,
                    this._worldManifold.points[i],
                    this._worldManifold.separations[i]
                );
                insertPos += 1;
            }
        }
        return insertPos;
    }
    
    // IsTouching    Checks whether the collider is touching any of the collider(s) attached to this rigidbody or not.
    // IsTouchingLayers    Checks whether any of the collider(s) attached to this rigidbody are touching any colliders on the specified layerMask or not.
    // OverlapCollider    Get a list of all Colliders that overlap all Colliders attached to this Rigidbody2D.
    
    public overlapPoint(point: ReadonlyVector2): boolean {
        const pos = this._vec2Buffer.Copy(point);
        let fixture = this.getB2Body().GetFixtureList();
        while (fixture) {
            if (fixture.TestPoint(pos)) {
                return true;
            }
            fixture = fixture.GetNext();
        }
        return false;
    }

    public isSleeping(): boolean {
        return !this.getB2Body().IsAwake();
    }

    public sleep(): void {
        this.getB2Body().SetAwake(false);
    }

    public isAwake(): boolean {
        return this.getB2Body().IsAwake();
    }

    public wakeUp(): void {
        this.getB2Body().SetAwake(true);
    }
}
