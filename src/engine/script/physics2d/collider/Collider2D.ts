import type { Shape } from "../../../../box2d.ts/build/index";
import { FixtureDef, Filter, WorldManifold } from "../../../../box2d.ts/build/index";
import { Vector2 } from "three/src/Three";
import { Component } from "../../../hierarchy_object/Component";
import { PhysicsMaterial2D } from "../../../physics/2d/PhysicsMaterial2D";
import { CollisionLayerConst } from "../../../physics/CollisionLayerConst";
import type { ReadonlyVector2 } from "../../../math/ReadonlyVector2";
import type { WritableVector2 } from "../../../math/WritableVector2";
import type { CollisionLayer, CollisionLayerParm } from "../../../physics/CollisionLayer";
import type { FixtureGroup } from "../../../physics/2d/FixtureGroup";
import { ContactPoint2D } from "../../../physics/2d/ContactPoint2D";

/**
 * collider2d base component
 * 
 * you can't create collider2d component directly. use drived class. e.g. BoxCollider2D
 */
export class Collider2D extends Component {
    private _fixtureGroup: FixtureGroup|null = null;
    private _density = 1;
    private _material: PhysicsMaterial2D|null = null;
    private _isTrigger = false;
    private readonly _offset: Vector2 = new Vector2();
    private _collisionLayer: number|null = null;

    public onEnable(): void {
        this.createFixture();
        this._fixtureGroup!.body.SetAwake(true);
    }

    public onDisable(): void {
        this._fixtureGroup?.body.SetAwake(true);
        this.destroyFixture();
    }

    public onDestroy(): void {   
        this._material?.onChanged.removeListener(this.updateFixturesMaterialInfo);
    }

    private createFixture(): void {
        if (this._fixtureGroup) return;
        this._fixtureGroup = this.engine.physics2DProcessor.addCollider(this.gameObject, this);

        const shapes = this.createShapes();
        for (let i = 0; i < shapes.length; i++) {
            const shape = shapes[i];
            const fixtureDef = new FixtureDef();
            fixtureDef.userData = this;
            fixtureDef.density = this._density;
            fixtureDef.isSensor = this._isTrigger;
            fixtureDef.shape = shape;
            this._fixtureGroup.add(fixtureDef);
        }
        this.updateFixturesMaterialInfo();
        this.updateFixturesFilter();

        this._fixtureGroup.physicObject.rigidbody?.updateMass();
    }

    private destroyFixture(): void {
        if (this._fixtureGroup) {
            this.engine.physics2DProcessor.removeCollider(this.gameObject, this, this._fixtureGroup);
            this._fixtureGroup.physicObject.rigidbody?.updateMass();
            this._fixtureGroup = null;
        }
    }

    protected updateFixture(): void {
        if (this._fixtureGroup) {
            this.destroyFixture();
            this.createFixture();
            this._fixtureGroup!.body.SetAwake(true);
        }
    }

    private static readonly _filterBuffer = new Filter();

    /** @internal */
    public updateFixturesFilter(): void {
        if (!this._fixtureGroup) return;

        const filter = Collider2D._filterBuffer;
        const physicsObject = this._fixtureGroup.physicObject;
        const rigidBody = physicsObject.rigidbody;

        let layer: number;
        if (this._collisionLayer) {
            layer = this._collisionLayer;
        } else {
            if (rigidBody) {
                layer = rigidBody.layer;
            } else {
                layer = CollisionLayerConst.DefaultLayer;
            }
        }
        filter.categoryBits = layer;

        if (rigidBody && !rigidBody.simulated) {
            filter.maskBits = 0x0000;
        } else {
            filter.maskBits = this.engine.physics.collisionLayerMask.getMaskFromLayer(layer);
        }
        //filter.groupIndex

        this._fixtureGroup.foreachFixture(fixture => fixture.SetFilterData(filter));
    }

    /** @internal */
    public readonly updateFixturesMaterialInfo = (): void => {
        if (this._fixtureGroup) {
            let material: PhysicsMaterial2D|null = null;
            if (this._material) {
                material = this._material;
            } else if (this._fixtureGroup) {
                const rigidBodyMaterial = this._fixtureGroup.physicObject.sharedMaterial;
                if (rigidBodyMaterial) material = rigidBodyMaterial;
            }
            if (!material) material = new PhysicsMaterial2D();
            
            this._fixtureGroup.foreachFixture(fixture => {
                fixture.SetFriction(material!.friction);
                fixture.SetRestitution(material!.bounciness);
            });
        }
    };

    // private updateFixtureFilter(fixture: Fixture): void {
    //     const filter = Collider2D._filterBuffer;
    //     const physicsObject = fixture.GetBody().GetUserData() as IPhysicsObject2D;
    //     const rigidBody = physicsObject.rigidbody;

    //     let layer: number;
    //     if (this._collisionLayer) {
    //         layer = this.engine.physics.collisionLayerMask.nameToLayer(this._collisionLayer as any);
    //     } else {
    //         if (rigidBody) {
    //             layer = this.engine.physics.collisionLayerMask.nameToLayer(rigidBody.getCollisionLayer() as any);
    //         } else {
    //             layer = this.engine.physics.collisionLayerMask.nameToLayer(CollisionLayerConst.DefaultLayerName);
    //         }
    //     }
    //     filter.categoryBits = layer;

    //     if (rigidBody && !rigidBody.simulated) {
    //         filter.maskBits = 0x0000;
    //     } else {
    //         filter.maskBits = this.engine.physics.collisionLayerMask.getMaskFromLayer(layer);
    //     }
    //     //filter.groupIndex

    //     fixture.SetFilterData(filter);
    // }

    // private updateFixtureMaterialInfo(fixture: Fixture): void {
    //     if (fixture) {
    //         let material: PhysicsMaterial2D|null = null;
    //         if (this._material) {
    //             material = this._material;
    //         } else if (fixture) {
    //             const physicsObject = this._fixture.GetBody().GetUserData() as IPhysicsObject2D;
    //             const rigidBodyMaterial = physicsObject.sharedMaterial;
    //             if (rigidBodyMaterial) material = rigidBodyMaterial;
    //         }
    //         if (!material) material = new PhysicsMaterial2D();
            
    //         fixture.SetFriction(material.friction);
    //         fixture.SetRestitution(material.bounciness);
    //     }
    // };

    protected createShapes(): Shape[] {
        throw new Error("You should not use Collider2D directly but one of its subclasses. e.g. BoxCollider2D");
    }
    
    /**
     * The density of the collider used to calculate its mass (when auto mass is enabled). (default: 1)
     */
    public get density(): number {
        return this._density;
    }

    /**
     * The density of the collider used to calculate its mass (when auto mass is enabled). (default: 1)
     */
    public set density(value: number) {
        if (this._fixtureGroup) {
            const physicsObject = this._fixtureGroup.physicObject;
            if (physicsObject && physicsObject.rigidbody && !physicsObject.rigidbody.useAutoMass) {
                throw new Error("You cannot change the density of a collider when the rigid body is not using auto mass.");
            }
        }
        this._density = value;
        if (this._fixtureGroup) {
            this._fixtureGroup.foreachFixture(fixture => fixture.SetDensity(value));
        }
    }

    /**
     * The PhysicsMaterial2D that is applied to this collider. (default: null)
     */
    public get material(): PhysicsMaterial2D|null {
        return this._material;
    }

    /**
     * The PhysicsMaterial2D that is applied to this collider. (default: null)
     */
    public set material(value: PhysicsMaterial2D|null) {
        if (value) {
            if (!this._material) {
                this._material = new PhysicsMaterial2D(value.friction, value.bounciness);
                this._material.onChanged.addListener(this.updateFixturesMaterialInfo);
            } else {
                this._material.copy(value);
            }
        } else {
            this._material?.onChanged.removeListener(this.updateFixturesMaterialInfo);
            this._material = null;
        }
        this.updateFixturesMaterialInfo();
    }

    /**
     * Is this collider configured as a trigger? (default: false)
     */
    public get isTrigger(): boolean {
        return this._isTrigger;
    }

    /**
     * Is this collider configured as a trigger? (default: false)
     */
    public set isTrigger(value: boolean) {
        this._isTrigger = value;
        if (this._fixtureGroup) {
            this._fixtureGroup.foreachFixture(fixture => fixture.SetSensor(value));
        }
    }

    /**
     * The local offset of the collider geometry. (default: (0, 0))
     */
    public get offset(): ReadonlyVector2 {
        return this._offset;
    }

    /**
     * The local offset of the collider geometry. (default: (0, 0))
     */
    public set offset(value: ReadonlyVector2) {
        (this._offset as WritableVector2).copy(value);
        this.updateFixture();
    }

    /**
     * get collision layer of this collider as string.
     * @returns layer name
     */
    public getLayerToName<T extends CollisionLayer>(): CollisionLayerParm<T>|null {
        return this._collisionLayer ? this.engine.physics.collisionLayerMask.layerToName<T>(this._collisionLayer) : null;
    }

    /**
     * set collision layer of this collider from string.
     * @param value layer name
     */
    public setLayerFromName<T extends CollisionLayer>(value: CollisionLayerParm<T>|null): void {
        this._collisionLayer = value ? this.engine.physics.collisionLayerMask.nameToLayer(value) : null;
        this.updateFixturesFilter();
    }

    /**
     * collision layer of this collider. (default: null)
     */
    public get layer(): number|null {
        return this._collisionLayer;
    }

    /**
     * collision layer of this collider. (default: null)
     */
    public set layer(value: number|null) {
        this._collisionLayer = value;
        this.updateFixturesFilter();
    }

    /**
     * get collision layer as string. if collider collision layer is not set, it will return the rigidbody collision layer.
     * @returns layer name
     */
    public getThisOrRigidBodyLayerToName<T extends CollisionLayer>(): CollisionLayerParm<T> {
        if (this._collisionLayer) {
            return this.engine.physics.collisionLayerMask.layerToName<T>(this._collisionLayer);
        } else {
            return this._fixtureGroup?.physicObject.rigidbody?.getLayerToName<T>() ?? CollisionLayerConst.DefaultLayerName;
        }
    }

    /**
     * get collision layer. if collider collision layer is not set, it will return the rigidbody collision layer.
     * @returns layer
     */
    public getThisOrRigidBodyLayer(): number {
        if (this._collisionLayer) {
            return this._collisionLayer;
        } else {
            return this._fixtureGroup?.physicObject.rigidbody?.layer ?? CollisionLayerConst.DefaultLayer;
        }
    }

    // Cast	Casts the Collider shape into the Scene starting at the Collider position ignoring the Collider itself.
    // ClosestPoint	Returns a point on the perimeter of this Collider that is closest to the specified position.
    // Distance	Calculates the minimum separation of this collider against another collider.
    
    private readonly _worldManifold: WorldManifold = new WorldManifold();

    /**
     * Retrieves all contact points for this Collider.
     * @param out The array to store the contact points in.
     * @returns The number of contact points retrieved.
     */
    public getContacts(out: ContactPoint2D[]): number {
        if (!this._fixtureGroup) return 0;
        let insertPos = 0;
        let contactEdge = this._fixtureGroup.body.GetContactList();
        while (contactEdge) {
            const currentContactEdge = contactEdge;
            contactEdge = contactEdge.next;

            if (!this._fixtureGroup.contains(currentContactEdge.contact.GetFixtureA()) &&
                !this._fixtureGroup.contains(currentContactEdge.contact.GetFixtureB())) {
                continue;
            }
            
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

    // IsTouching	Check whether this collider is touching the collider or not.
    // IsTouchingLayers	Checks whether this collider is touching any colliders on the specified layerMask or not.
    // OverlapCollider	Get a list of all colliders that overlap this collider.
    // OverlapPoint	Check if a collider overlaps a point in space.
    // Raycast	Casts a ray into the Scene that starts at the Collider position and ignores the Collider itself.
}
