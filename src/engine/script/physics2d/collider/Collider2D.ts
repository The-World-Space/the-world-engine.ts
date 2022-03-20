import type { Shape } from "../../../../box2d.ts/build/index";
import { FixtureDef, Filter } from "../../../../box2d.ts/build/index";
import { Vector2 } from "three/src/Three";
import { Component } from "../../../hierarchy_object/Component";
import { PhysicsMaterial2D } from "../../../physics/2d/PhysicsMaterial2D";
import { CollisionLayerConst } from "../../../physics/CollisionLayerConst";
import type { ReadonlyVector2 } from "../../../math/ReadonlyVector2";
import type { WritableVector2 } from "../../../math/WritableVector2";
import type { CollisionLayer, CollisionLayerParm } from "../../../physics/CollisionLayer";
import type { FixtureGroup } from "../../../physics/2d/FixtureGroup";

export class Collider2D extends Component {
    private _fixtureGroup: FixtureGroup|null = null;
    private _density = 1;
    private _material: PhysicsMaterial2D|null = null;
    private _isTrigger = false;
    private _offset: Vector2 = new Vector2();
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
        this._material?.removeOnChangedEventListener(this.updateFixturesMaterialInfo);
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
    public readonly updateFixturesMaterialInfo = () => {
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
    
    public get density(): number {
        return this._density;
    }

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

    public get material(): PhysicsMaterial2D|null {
        return this._material;
    }

    public set material(value: PhysicsMaterial2D|null) {
        if (value) {
            if (!this._material) {
                this._material = new PhysicsMaterial2D(value.friction, value.bounciness);
                this._material.addOnChangedEventListener(this.updateFixturesMaterialInfo);
            } else {
                this._material.copy(value);
            }
        } else {
            this._material?.removeOnChangedEventListener(this.updateFixturesMaterialInfo);
            this._material = null;
        }
        this.updateFixturesMaterialInfo();
    }

    public get isTrigger(): boolean {
        return this._isTrigger;
    }

    public set isTrigger(value: boolean) {
        this._isTrigger = value;
        if (this._fixtureGroup) {
            this._fixtureGroup.foreachFixture(fixture => fixture.SetSensor(value));
        }
    }

    public get offset(): ReadonlyVector2 {
        return this._offset;
    }

    public set offset(value: ReadonlyVector2) {
        (this._offset as WritableVector2).copy(value);
        this.updateFixture();
    }

    public getLayerToName<T extends CollisionLayer>(): CollisionLayerParm<T>|null {
        return this._collisionLayer ? this.engine.physics.collisionLayerMask.layerToName<T>(this._collisionLayer) : null;
    }

    public setLayerFromName<T extends CollisionLayer>(value: CollisionLayerParm<T>|null) {
        this._collisionLayer = value ? this.engine.physics.collisionLayerMask.nameToLayer(value) : null;
        this.updateFixturesFilter();
    }

    public get layer(): number|null {
        return this._collisionLayer;
    }

    public set layer(value: number|null) {
        this._collisionLayer = value;
        this.updateFixturesFilter();
    }

    public getThisOrRigidBodyLayerToName<T extends CollisionLayer>(): CollisionLayerParm<T> {
        if (this._collisionLayer) {
            return this.engine.physics.collisionLayerMask.layerToName<T>(this._collisionLayer);
        } else {
            return this._fixtureGroup?.physicObject.rigidbody?.getLayerToName<T>() ?? CollisionLayerConst.DefaultLayerName;
        }
    }

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
    // GetContacts	Retrieves all contact points for this Collider.
    // IsTouching	Check whether this collider is touching the collider or not.
    // IsTouchingLayers	Checks whether this collider is touching any colliders on the specified layerMask or not.
    // OverlapCollider	Get a list of all colliders that overlap this collider.
    // OverlapPoint	Check if a collider overlaps a point in space.
    // Raycast	Casts a ray into the Scene that starts at the Collider position and ignores the Collider itself.
}
