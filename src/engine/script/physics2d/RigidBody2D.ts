import { Vector2 } from "three/src/Three";

import type { Body } from "../../../box2d.ts/build/index";
import { BodyDef, BodyType, MassData, Vec2, WorldManifold } from "../../../box2d.ts/build/index";
import { Component } from "../../hierarchy_object/Component";
import type { ReadonlyVector2 } from "../../math/ReadonlyVector2";
import type { WritableVector2 } from "../../math/WritableVector2";
import { ContactPoint2D } from "../../physics/2d/ContactPoint2D";
import type { PhysicsMaterial2D } from "../../physics/2d/PhysicsMaterial2D";
import type { IPhysicsObject2D } from "../../physics/2d/PhysicsObject2D";
import type { CollisionLayer, CollisionLayerParm } from "../../physics/CollisionLayer";
import { CollisionLayerConst } from "../../physics/CollisionLayerConst";
import type { Collider2D } from "./collider/Collider2D";

/**
 * The physical behaviour type of the Rigidbody2D.
 */
export enum RigidbodyType2D {
    Dynamic,
    Kinematic,
    Static
}

/**
 * Controls how collisions are detected when a Rigidbody2D moves.
 */
export enum CollisionDetectionMode2D {
    Discrete,
    Continuous
}

/**
 * Settings for a Rigidbody2D's initial sleep state.
 */
export enum RigidbodySleepMode2D {
    NeverSleep,
    StartAwake,
    StartAsleep
}

/**
 * Option for how to apply a force using Rigidbody2D.AddForce.
 */
export enum ForceMode2D {
    Force,
    Impulse
}

/**
 * Rigidbody physics component for 2D.
 * 
 * Adding a Rigidbody2D component to a sprite puts it under the control of the physics engine. By itself, this means that the gameObject will be affected by gravity and can be controlled from scripts using forces. By adding the appropriate collider component, the sprite will also respond to collisions with other sprites. This behaviour comes entirely from physics system; very little code is required to get impressive and authentic physical behaviour and allows for "emergent" gameplay that was not explicitly coded into the game.
 * 
 * 
 * disallow multiple component
 */
export class RigidBody2D extends Component {
    public override readonly disallowMultipleComponent = true;

    private _physicsObject: IPhysicsObject2D|null = null;
    private _body: Body|null = null;

    private _bodyType: BodyType = BodyType.b2_dynamicBody; // Body Type
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
    private _collisionLayer: number = CollisionLayerConst.DefaultLayer;

    private readonly _centerOfMass = new Vector2(NaN, NaN);
    private readonly _worldCenterOfMass = new Vector2(NaN, NaN);
    private _inertia = NaN;
    private readonly _linearVelocity = new Vector2();
    private _angularVelocity = 0;
    //private _useFullKinematicContacts = false;

    public awake(): void {
        if (this._physicsObject) return;

        const bodyDef = new BodyDef();
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
        this.updateCollidersFilter();

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
        this.updateCollidersFilter();
    }

    public onEnable(): void {
        this._simulated = true;
        this.getB2Body().SetEnabled(true);
        this.updateCollidersFilter();
    }

    public onDisable(): void {
        this._simulated = false;
        this._body?.SetEnabled(false);
        this.updateCollidersFilter();
    }

    private updateCollidersFilter(): void {
        if (!this._physicsObject) return;
        const colliders = this._physicsObject.colliders;
        for (let i = 0, l = colliders.length; i < l; i++) {
            const collider = colliders[i];
            collider.updateFixturesFilter();
        }
    }

    private getPhysicsObject(): IPhysicsObject2D {
        if (!this._physicsObject) this.awake();
        return this._physicsObject!;
    }

    private getB2Body(): Body {
        if (!this._body) this.awake();
        return this._body!;
    }
    
    private readonly _massData: MassData = new MassData();

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

    /**
     * The physical behaviour type of the Rigidbody2D. (default: dynamic)
     */
    public get bodyType(): RigidbodyType2D {
        switch (this._bodyType) {
        case BodyType.b2_staticBody:
            return RigidbodyType2D.Static;
        case BodyType.b2_kinematicBody:
            return RigidbodyType2D.Kinematic;
        case BodyType.b2_dynamicBody:
            return RigidbodyType2D.Dynamic;
        }
        throw new Error("Unknown body type");
    }

    /**
     * The physical behaviour type of the Rigidbody2D. (default: dynamic)
     */
    public set bodyType(value: RigidbodyType2D) {
        switch (value) {
        case RigidbodyType2D.Dynamic:
            this._bodyType = BodyType.b2_dynamicBody;
            break;
        case RigidbodyType2D.Kinematic:
            this._bodyType = BodyType.b2_kinematicBody;
            break;
        case RigidbodyType2D.Static:
            this._bodyType = BodyType.b2_staticBody;
            break;
        }
    }

    /**
     * The PhysicsMaterial2D that is applied to all Collider2D attached to this Rigidbody2D. (default: null)
     */
    public get material(): PhysicsMaterial2D|null {
        return this.getPhysicsObject().sharedMaterial;
    }

    /**
     * The PhysicsMaterial2D that is applied to all Collider2D attached to this Rigidbody2D. (default: null)
     */
    public set material(value: PhysicsMaterial2D|null) {
        this.getPhysicsObject().setSharedPhysicsMaterial(value);
    }

    /**
     * Indicates whether the rigid body should be simulated or not by the physics system.
     * 
     * this value is same as the `enabled` property of the rigid body.
     */
    public get simulated(): boolean {
        return this._simulated;
    }

    /**
     * Indicates whether the rigid body should be simulated or not by the physics system.
     * 
     * this value is same as the `enabled` property of the rigid body.
     */
    public set simulated(value: boolean) {
        this.enabled = value;
    }

    /**
     * Should the total rigid-body mass be automatically calculated from the [[Collider2D.density]] of attached colliders? (default: false)
     */
    public get useAutoMass(): boolean {
        return this._useAutoMass;
    }

    /**
     * Should the total rigid-body mass be automatically calculated from the [[Collider2D.density]] of attached colliders? (default: false)
     */
    public set useAutoMass(value: boolean) {
        this._useAutoMass = value;
        if (this._body) {
            if (this._useAutoMass) this._mass = this._body.GetMass();
        }
        this.updateMassData();
    }

    /**
     * Mass of the Rigidbody.
     */
    public get mass(): number {
        if (this._useAutoMass) {
            return this.getB2Body().GetMass();
        }
        return this._mass;
    }

    /**
     * Mass of the Rigidbody.
     */
    public set mass(value: number) {
        if (this._useAutoMass) throw new Error("Cannot set mass when useAutoMass is true");
        this._mass = value;
        this.updateMassData();
    }

    /**
     * Coefficient of drag. (default: 0)
     */
    public get drag(): number {
        return this._linearDrag;
    }

    /**
     * Coefficient of drag. (default: 0)
     */
    public set drag(value: number) {
        this._linearDrag = value;
        this._body?.SetLinearDamping(value);
    }

    /**
     * Coefficient of angular drag. (default: 0.05)
     */
    public get angularDrag(): number {
        return this._angularDrag;
    }

    /**
     * Coefficient of angular drag. (default: 0.05)
     */
    public set angularDrag(value: number) {
        this._angularDrag = value;
        this._body?.SetAngularDamping(value);
    }

    /**
     * The degree to which this object is affected by gravity. (default: 1)
     */
    public get gravityScale(): number {
        return this._gravityScale;
    }

    /**
     * The degree to which this object is affected by gravity. (default: 1)
     */
    public set gravityScale(value: number) {
        this._gravityScale = value;
        this._body?.SetGravityScale(value);
    }
    
    /**
     * The method used by the physics engine to check if two objects have collided. (default: discrete)
     */
    public get collisionDetection(): CollisionDetectionMode2D {
        return this._collisionDetection;
    }

    /**
     * The method used by the physics engine to check if two objects have collided. (default: discrete)
     */
    public set collisionDetection(value: CollisionDetectionMode2D) {
        this._collisionDetection = value;
        this._body?.SetBullet(value === CollisionDetectionMode2D.Continuous);
    }

    /**
     * The sleep state that the rigidbody will initially be in. (default: startAwake)
     */
    public get sleepMode(): RigidbodySleepMode2D {
        return this._sleepMode;
    }

    /**
     * The sleep state that the rigidbody will initially be in. (default: startAwake)
     */
    public set sleepMode(value: RigidbodySleepMode2D) {
        this._sleepMode = value;
        this._body?.SetSleepingAllowed(value !== RigidbodySleepMode2D.NeverSleep);
        this._body?.SetAwake(value === RigidbodySleepMode2D.StartAwake ||
            value === RigidbodySleepMode2D.NeverSleep);
    }

    /**
     * Controls whether physics will change the rotation of the object. (default: false)
     */
    public get freezeRotation(): boolean {
        return this._freezeRotation;
    }

    /**
     * Controls whether physics will change the rotation of the object. (default: false)
     */
    public set freezeRotation(value: boolean) {
        this._freezeRotation = value;
        this._body?.SetFixedRotation(value);
    }

    /**
     * get collision layer of this rigidbody as string.
     * @returns layer name
     */
    public getLayerToName<T extends CollisionLayer>(): CollisionLayerParm<T> {
        return this.engine.physics.collisionLayerMask.layerToName(this._collisionLayer);
    }

    /**
     * set collision layer of this rigidbody from string.
     * @param value layer name
     */
    public setLayerFromName<T extends CollisionLayer>(value: CollisionLayerParm<T>): void {
        this._collisionLayer = this.engine.physics.collisionLayerMask.nameToLayer(value);
        this.updateCollidersFilter();
    }

    /**
     * collision layer of this rigidbody. (default: `CollisionLayerConst.DefaultLayer`)
     */
    public get layer(): number {
        return this._collisionLayer;
    }

    /**
     * collision layer of this rigidbody. (default: `CollisionLayerConst.DefaultLayer`)
     */
    public set layer(value: number) {
        this._collisionLayer = value;
        this.updateCollidersFilter();
    }
    
    /**
     * The center of mass of the rigidBody in local space.
     */
    public get centerOfMass(): ReadonlyVector2 {
        const localCenter = this.getB2Body().GetLocalCenter();
        this._centerOfMass.set(localCenter.x, localCenter.y);
        return this._centerOfMass;
    }

    /**
     * The center of mass of the rigidBody in local space.
     */
    public set centerOfMass(value: ReadonlyVector2) {
        (this._centerOfMass as WritableVector2).copy(value);
        this.updateMassData();
    }

    /**
     * Gets the center of mass of the rigidBody in global space.
     */
    public get worldCenterOfMass(): ReadonlyVector2 {
        const center = this.getB2Body().GetWorldCenter();
        this._worldCenterOfMass
            .set(center.x, center.y);
        return this._worldCenterOfMass;
    }

    /**
     * The Rigidbody's resistance to changes in angular velocity (rotation).
     */
    public get inertia(): number {
        return this._inertia;
    }

    /**
     * The Rigidbody's resistance to changes in angular velocity (rotation).
     */
    public set inertia(value: number) {
        this._inertia = value;
        this.updateMassData();
    }

    /**
     * Linear velocity of the Rigidbody in units per second.
     */
    public get velocity(): ReadonlyVector2 {
        if (this._body) {
            const velocity = this._body.GetLinearVelocity();
            this._linearVelocity.set(velocity.x, velocity.y);
        }
        return this._linearVelocity;
    }

    /**
     * Linear velocity of the Rigidbody in units per second.
     */
    public set velocity(value: ReadonlyVector2) {
        (this._linearVelocity as WritableVector2).copy(value);
        if (this._body) {
            this._body.SetLinearVelocity(value);
        }
    }

    /**
     * Angular velocity in degrees per second.
     */
    public get angularVelocity(): number {
        if (this._body) {
            this._angularVelocity = this._body.GetAngularVelocity();
        }
        return this._angularVelocity;
    }

    /**
     * Angular velocity in degrees per second.
     */
    public set angularVelocity(value: number) {
        this._angularVelocity = value;
        if (this._body) {
            this._body.SetAngularVelocity(value);
        }
    }

    /**
     * Returns the number of Collider2D attached to this Rigidbody2D.
     */
    public get attachedColliderCount(): number {
        return this.getPhysicsObject().colliders.length;
    }

    private readonly _vec2Buffer = new Vec2();

    /**
     * Apply a force to the rigidbody.
     * @param force Components of the force in the X and Y axes.
     * @param mode The method used to apply the specified force.
     */
    public addForce(force: ReadonlyVector2, mode: ForceMode2D = ForceMode2D.Force): void {
        const body = this.getB2Body();
        if (mode === ForceMode2D.Impulse) {
            body.ApplyLinearImpulse(force, body.GetWorldCenter(), true);
        } else {
            body.ApplyForce(force, body.GetWorldCenter(), true);
        }
    }

    /**
     * Apply a force at a given position in space.
     * @param force Components of the force in the X and Y axes.
     * @param position Position in world space to apply the force.
     * @param mode The method used to apply the specified force.
     */
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

    /**
     * Adds a force to the rigidbody2D relative to its coordinate system.
     * @param relativeForce Components of the force in the X and Y axes.
     * @param mode The method used to apply the specified force.
     */
    public addRelativeForce(relativeForce: ReadonlyVector2, mode: ForceMode2D = ForceMode2D.Force): void {
        const body = this.getB2Body();
        const f = body.GetWorldVector(relativeForce, this._vec2Buffer);
        if (mode === ForceMode2D.Impulse) {
            body.ApplyLinearImpulse(f, body.GetWorldCenter(), true);
        } else {
            body.ApplyForce(f, body.GetWorldCenter(), true);
        }
    }

    /**
     * Apply a torque at the rigidbody's centre of mass.
     * @param torque Torque to apply.
     * @param mode The force mode to use.
     */
    public addTorque(torque: number, mode: ForceMode2D = ForceMode2D.Force): void {
        const body = this.getB2Body();
        if (mode === ForceMode2D.Impulse) {
            body.ApplyAngularImpulse(torque, true);
        } else {
            body.ApplyTorque(torque, true);
        }
    }

    /**
     * Get a local space point given the point `point` in rigidBody global space.
     * @param point The global space point to transform into local space.
     * @param out Receives the local space point. if this is `undefined`, a new Vector2 will be created.
     * @returns The local space point.
     */
    public getPoint(point: ReadonlyVector2, out?: Vector2): Vector2 {
        const buffer = out ?? new Vector2();
        const pos = this._vec2Buffer.Copy(point);
        return this.getB2Body().GetLocalPoint(pos, buffer);
    }

    /**
     * The velocity of the rigidbody at the point Point in global space.
     * 
     * GetPointVelocity will take the angularVelocity of the rigidbody into account when calculating the velocity.
     * @param point The global space point to calculate velocity for.
     * @param out Receives the velocity. if this is `undefined`, a new Vector2 will be created.
     * @returns The velocity at the point.
     */
    public getPointVelocity(point: ReadonlyVector2, out?: Vector2): Vector2 {
        const buffer = out ?? new Vector2();
        const pos = this._vec2Buffer.Copy(point);
        return this.getB2Body().GetLinearVelocityFromWorldPoint(pos, buffer);
    }

    /**
     * Get a global space point given the point `relativePoint` in rigidBody local space.
     * @param relativePoint The local space point to transform into global space.
     * @param out Receives the global space point. if this is `undefined`, a new Vector2 will be created.
     * @returns The global space point.
     */
    public getRelativePoint(relativePoint: ReadonlyVector2, out?: Vector2): Vector2 {
        const buffer = out ?? new Vector2();
        const pos = this._vec2Buffer.Copy(relativePoint);
        return this.getB2Body().GetWorldPoint(pos, buffer);
    }

    /**
     * The velocity of the rigidbody at the point `Point` in local space.
     * @param relativePoint The local space point to calculate velocity for.
     * @param out Receives the velocity. if this is `undefined`, a new Vector2 will be created.
     * @returns The velocity at the point.
     */
    public getRelativePointVelocity(relativePoint: ReadonlyVector2, out?: Vector2): Vector2 {
        const buffer = out ?? new Vector2();
        const pos = this._vec2Buffer
            .Copy(relativePoint);
        return this.getB2Body().GetLinearVelocityFromWorldPoint(pos, buffer);
    }

    /**
     * Get a global space vector given the vector `relativeVector` in rigidBody local space.
     * @param relativeVector The local space vector to transform into a global space vector.
     * @param out Receives the global space vector. if this is `undefined`, a new Vector2 will be created.
     * @returns The global space vector.
     */
    public getRelativeVector(relativeVector: ReadonlyVector2, out?: Vector2): Vector2 {
        const buffer = out ?? new Vector2();
        return this.getB2Body().GetWorldVector(relativeVector, buffer);
    }

    /**
     * Get a local space vector given the vector `vector` in rigidBody global space.
     * @param vector The global space vector to transform into a local space vector.
     * @param out Receives the local space vector. if this is `undefined`, a new Vector2 will be created.
     * @returns The local space vector.
     */
    public getVector(vector: ReadonlyVector2, out?: Vector2): Vector2 {
        const buffer = out ?? new Vector2();
        return this.getB2Body().GetLocalVector(vector, buffer);
    }

    // Cast    All the Collider2D shapes attached to the Rigidbody2D are cast into the Scene starting at each Collider position ignoring the Colliders attached to the same Rigidbody2D.
    // ClosestPoint    Returns a point on the perimeter of all enabled Colliders attached to this Rigidbody that is closest to the specified position. https://rotatingcanvas.com/calculate-closest-point-of-box2d-body-in-libgdx/
    // Distance    Calculates the minimum distance of this collider against all Collider2D attached to this Rigidbody2D.
    
    /**
     * Returns all Collider2D that are attached to this Rigidbody2D.
     * 
     * Calculates all Collider2D that are attached to this Rigidbody2D and returns them in the results array.
     * 
     * if array size is not enough, it will be resized.
     * @param out An array of Collider2D used to receive the results.
     * @returns the number of Collider2D placed in the `out` array. 
     */
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
    
    private readonly _worldManifold: WorldManifold = new WorldManifold();

    /**
     * Retrieves all contact points for all of the Collider(s) attached to this Rigidbody.
     * @param out An array of ContactPoint2D used to receive the results.
     * @returns the number of ContactPoint2D placed in the `out` array.
     */
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
    
    /**
     * Check if any of the Rigidbody2D colliders overlap a point in space.
     * @param point A point in world space.
     * @returns True if any of the colliders overlap the point, false otherwise.
     */
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

    /**
     * Is the rigidbody "sleeping"?
     * @returns True if the rigidbody is sleeping, false otherwise.
     */
    public isSleeping(): boolean {
        return !this.getB2Body().IsAwake();
    }

    /**
     * Make the rigidbody "sleep".
     */
    public sleep(): void {
        this.getB2Body().SetAwake(false);
    }

    /**
     * Is the rigidbody "awake"?
     * @returns True if the rigidbody is awake, false otherwise.
     */
    public isAwake(): boolean {
        return this.getB2Body().IsAwake();
    }

    /**
     * Make the rigidbody "awake".
     */
    public wakeUp(): void {
        this.getB2Body().SetAwake(true);
    }
}
