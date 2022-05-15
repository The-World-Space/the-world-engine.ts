import { Vector2 } from "three/src/Three";

import type { Physics2DLoader } from "../../physics/2d/Physics2DLoader";
import type { PhysicsMaterial2D } from "../../physics/2d/PhysicsMaterial2D";
import type { CollisionLayer } from "../../physics/CollisionLayer";
import * as CollisionLayerConstType from "../../physics/CollisionLayerConstType";

export type PhysicsSettingObject = {
    loader?: typeof Physics2DLoader,
    gravity?: Vector2,
    defaultMaterial?: PhysicsMaterial2D,
    velocityIterations?: number,
    positionIterations?: number,
    //velocityThreshold?: number,
    //defaultContactOffset?: number,
    queriesHitTriggers?: boolean,
    //queriesStartInColliders?: boolean,
    reuseCollisionCallbacks?: boolean,
    collisionLayerMaskMatrix?: object
}

export class PhysicsSetting {
    private _physicsSettingObject: PhysicsSettingObject;

    public constructor(physicsSettingObject: PhysicsSettingObject) {
        this._physicsSettingObject = physicsSettingObject;
    }

    public static createDefaultObject(): PhysicsSettingObject {
        return { };
    }

    /**
     * load physics engine from Physics2DLoader. you must call this method for use physics engine.
     * @param value Physics2DLoader
     * @returns this
     */
    public loader(value: typeof Physics2DLoader): PhysicsSetting {
        this._physicsSettingObject.loader = value;
        return this;
    }
    
    /**
     * The gravity applied to all rigid bodies in the Scene. (default: (0, -9.81))
     * @param value gravity
     * @returns this
     */
    public gravity(value: Vector2): this {
        this._physicsSettingObject.gravity = value;
        return this;
    }

    /**
     * default physics material of rigidbody. (default: null)
     * @param value default physics material
     * @returns this
     */
    public defaultMaterial(value: PhysicsMaterial2D): this {
        this._physicsSettingObject.defaultMaterial = value;
        return this;
    }

    /**
     * The number of iterations of the physics solver when considering objects' velocities. (default: 8)
     * 
     * A higher number of interations will improve accuracy at the expense of processing overhead.
     * @param value velocity iterations
     * @returns this
     */
    public velocityIterations(value: number): this {
        this._physicsSettingObject.velocityIterations = value;
        return this;
    }

    /**
     * The number of iterations of the physics solver when considering objects' positions. (default: 3)
     * 
     * A higher number of interations will improve accuracy at the expense of processing overhead.
     * @param value position iterations
     * @returns this
     */
    public positionIterations(value: number): this {
        this._physicsSettingObject.positionIterations = value;
        return this;
    }

    //public velocityThreshold(value: number): this {
    //    this._physicsSettingObject.velocityThreshold = value;
    //    return this;
    //}

    //public defaultContactOffset(value: number): this {
    //    this._physicsSettingObject.defaultContactOffset = value;
    //    return this;
    //}

    /**
     * specifies whether queries (raycasts, spherecasts, overlap tests, etc.) hit Triggers by default. (default: true)
     * @param value if true, queries hit Triggers by default.
     * @returns this
     */
    public queriesHitTriggers(value: boolean): this {
        this._physicsSettingObject.queriesHitTriggers = value;
        return this;
    }

    //public queriesStartInColliders(value: boolean): this {
    //    this._physicsSettingObject.queriesStartInColliders = value;
    //    return this;
    //}

    /**
     * Determines whether the garbage collector should reuse only a single instance of a Collision type for all collision callbacks.
     * 
     * When an Component.onCollisionEnter, Component.onCollisionStay or Component.onCollisionExit collision callback occurs,
     * the Collision object passed to it is created for each individual callback.
     * This means the garbage collector has to remove each object, which reduces performance.
     * 
     * When this option is true,
     * only a single instance of the Collision type is created and reused for each individual callback.
     * This reduces waste for the garbage collector to handle and improves performance.
     * 
     * You would only set this option to false if the Collision object is referenced outside of the collision callback for processing later,
     * so recycling the Collision object is not required.
     * 
     * (default: true)
     * @param value if true, reuse Collision object.
     * @returns this
     */
    public reuseCollisionCallbacks(value: boolean): this {
        this._physicsSettingObject.reuseCollisionCallbacks = value;
        return this;
    }
    
    // #region CollisionLayer Collision Matrix Overloads
    
    /**
     * Layer-based collision detection is a way to make a GameObject collide with another GameObject that is set up to a specific Layer or Layers.
     * 
     * layerCollisionMatrix can define layers and their collision behavior.
     * 
     * for example:
     * 
     * ```typescript
     * type MyLayer = ["default", "player", "enemy"];
     * 
     * this.setting.physics.layerCollisionMatrix<MyLayer>({
     *     default: { enemy: true, player: true, default: true },
     *     player:  { enemy: false, player: true },
     *     enemy:   { enemy: true }
     * });
     * ```
     * means that the default layer will collide with all layers,
     * the player layer will collide with the default and themself,
     * and the enemy layer will collide with the default and themself.
     * 
     * @param collisionMatrix The collision matrix.
     * @returns this
     */
    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[0]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[1]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[2]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[3]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[4]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[5]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[6]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[7]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[8]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[9]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[10]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[11]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[12]]: boolean } & { [key in T[11]]: boolean }
        } & {
            [key in T[12]]: { [key in T[12]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean }
        } & {
            [key in T[12]]: { [key in T[13]]: boolean } & { [key in T[12]]: boolean }
        } & {
            [key in T[13]]: { [key in T[13]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean }
        } & {
            [key in T[12]]: { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean }
        } & {
            [key in T[13]]: { [key in T[14]]: boolean } & { [key in T[13]]: boolean }
        } & {
            [key in T[14]]: { [key in T[14]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean }
        } & {
            [key in T[12]]: { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean }
        } & {
            [key in T[13]]: { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean }
        } & {
            [key in T[14]]: { [key in T[15]]: boolean } & { [key in T[14]]: boolean }
        } & {
            [key in T[15]]: { [key in T[15]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean }
        } & {
            [key in T[12]]: { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean }
        } & {
            [key in T[13]]: { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean }
        } & {
            [key in T[14]]: { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean }
        } & {
            [key in T[15]]: { [key in T[16]]: boolean } & { [key in T[15]]: boolean }
        } & {
            [key in T[16]]: { [key in T[16]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean }
        } & {
            [key in T[12]]: { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean }
        } & {
            [key in T[13]]: { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean }
        } & {
            [key in T[14]]: { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean }
        } & {
            [key in T[15]]: { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean }
        } & {
            [key in T[16]]: { [key in T[17]]: boolean } & { [key in T[16]]: boolean }
        } & {
            [key in T[17]]: { [key in T[17]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean }
        } & {
            [key in T[12]]: { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean }
        } & {
            [key in T[13]]: { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean }
        } & {
            [key in T[14]]: { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean }
        } & {
            [key in T[15]]: { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean }
        } & {
            [key in T[16]]: { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean }
        } & {
            [key in T[17]]: { [key in T[18]]: boolean } & { [key in T[17]]: boolean }
        } & {
            [key in T[18]]: { [key in T[18]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean }
        } & {
            [key in T[12]]: { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean }
        } & {
            [key in T[13]]: { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean }
        } & {
            [key in T[14]]: { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean }
        } & {
            [key in T[15]]: { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean }
        } & {
            [key in T[16]]: { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean }
        } & {
            [key in T[17]]: { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean }
        } & {
            [key in T[18]]: { [key in T[19]]: boolean } & { [key in T[18]]: boolean }
        } & {
            [key in T[19]]: { [key in T[19]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean }
        } & {
            [key in T[12]]: { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean }
        } & {
            [key in T[13]]: { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean }
        } & {
            [key in T[14]]: { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean }
        } & {
            [key in T[15]]: { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean }
        } & {
            [key in T[16]]: { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean }
        } & {
            [key in T[17]]: { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean }
        } & {
            [key in T[18]]: { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean }
        } & {
            [key in T[19]]: { [key in T[20]]: boolean } & { [key in T[19]]: boolean }
        } & {
            [key in T[20]]: { [key in T[20]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean }
        } & {
            [key in T[12]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean }
        } & {
            [key in T[13]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean }
        } & {
            [key in T[14]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean }
        } & {
            [key in T[15]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean }
        } & {
            [key in T[16]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean }
        } & {
            [key in T[17]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean }
        } & {
            [key in T[18]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean }
        } & {
            [key in T[19]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean }
        } & {
            [key in T[20]]: { [key in T[21]]: boolean } & { [key in T[20]]: boolean }
        } & {
            [key in T[21]]: { [key in T[21]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean }
        } & {
            [key in T[12]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean }
        } & {
            [key in T[13]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean }
        } & {
            [key in T[14]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean }
        } & {
            [key in T[15]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean }
        } & {
            [key in T[16]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean }
        } & {
            [key in T[17]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean }
        } & {
            [key in T[18]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean }
        } & {
            [key in T[19]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean }
        } & {
            [key in T[20]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean }
        } & {
            [key in T[21]]: { [key in T[22]]: boolean } & { [key in T[21]]: boolean }
        } & {
            [key in T[22]]: { [key in T[22]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean }
        } & {
            [key in T[12]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean }
        } & {
            [key in T[13]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean }
        } & {
            [key in T[14]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean }
        } & {
            [key in T[15]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean }
        } & {
            [key in T[16]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean }
        } & {
            [key in T[17]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean }
        } & {
            [key in T[18]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean }
        } & {
            [key in T[19]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean }
        } & {
            [key in T[20]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean }
        } & {
            [key in T[21]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean }
        } & {
            [key in T[22]]: { [key in T[23]]: boolean } & { [key in T[22]]: boolean }
        } & {
            [key in T[23]]: { [key in T[23]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean }
        } & {
            [key in T[12]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean }
        } & {
            [key in T[13]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean }
        } & {
            [key in T[14]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean }
        } & {
            [key in T[15]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean }
        } & {
            [key in T[16]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean }
        } & {
            [key in T[17]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean }
        } & {
            [key in T[18]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean }
        } & {
            [key in T[19]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean }
        } & {
            [key in T[20]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean }
        } & {
            [key in T[21]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean }
        } & {
            [key in T[22]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean }
        } & {
            [key in T[23]]: { [key in T[24]]: boolean } & { [key in T[23]]: boolean }
        } & {
            [key in T[24]]: { [key in T[24]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean }
        } & {
            [key in T[12]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean }
        } & {
            [key in T[13]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean }
        } & {
            [key in T[14]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean }
        } & {
            [key in T[15]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean }
        } & {
            [key in T[16]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean }
        } & {
            [key in T[17]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean }
        } & {
            [key in T[18]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean }
        } & {
            [key in T[19]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean }
        } & {
            [key in T[20]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean }
        } & {
            [key in T[21]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean }
        } & {
            [key in T[22]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean }
        } & {
            [key in T[23]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean }
        } & {
            [key in T[24]]: { [key in T[25]]: boolean } & { [key in T[24]]: boolean }
        } & {
            [key in T[25]]: { [key in T[25]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean }
        } & {
            [key in T[12]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean }
        } & {
            [key in T[13]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean }
        } & {
            [key in T[14]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean }
        } & {
            [key in T[15]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean }
        } & {
            [key in T[16]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean }
        } & {
            [key in T[17]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean }
        } & {
            [key in T[18]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean }
        } & {
            [key in T[19]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean }
        } & {
            [key in T[20]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean }
        } & {
            [key in T[21]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean }
        } & {
            [key in T[22]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean }
        } & {
            [key in T[23]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean }
        } & {
            [key in T[24]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean }
        } & {
            [key in T[25]]: { [key in T[26]]: boolean } & { [key in T[25]]: boolean }
        } & {
            [key in T[26]]: { [key in T[26]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean }
        } & {
            [key in T[12]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean }
        } & {
            [key in T[13]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean }
        } & {
            [key in T[14]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean }
        } & {
            [key in T[15]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean }
        } & {
            [key in T[16]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean }
        } & {
            [key in T[17]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean }
        } & {
            [key in T[18]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean }
        } & {
            [key in T[19]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean }
        } & {
            [key in T[20]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean }
        } & {
            [key in T[21]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean }
        } & {
            [key in T[22]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean }
        } & {
            [key in T[23]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean }
        } & {
            [key in T[24]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean }
        } & {
            [key in T[25]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean }
        } & {
            [key in T[26]]: { [key in T[27]]: boolean } & { [key in T[26]]: boolean }
        } & {
            [key in T[27]]: { [key in T[27]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean }
        } & {
            [key in T[12]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean }
        } & {
            [key in T[13]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean }
        } & {
            [key in T[14]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean }
        } & {
            [key in T[15]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean }
        } & {
            [key in T[16]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean }
        } & {
            [key in T[17]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean }
        } & {
            [key in T[18]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean }
        } & {
            [key in T[19]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean }
        } & {
            [key in T[20]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean }
        } & {
            [key in T[21]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean }
        } & {
            [key in T[22]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean }
        } & {
            [key in T[23]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean }
        } & {
            [key in T[24]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean }
        } & {
            [key in T[25]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean }
        } & {
            [key in T[26]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean }
        } & {
            [key in T[27]]: { [key in T[28]]: boolean } & { [key in T[27]]: boolean }
        } & {
            [key in T[28]]: { [key in T[28]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean }
        } & {
            [key in T[12]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean }
        } & {
            [key in T[13]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean }
        } & {
            [key in T[14]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean }
        } & {
            [key in T[15]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean }
        } & {
            [key in T[16]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean }
        } & {
            [key in T[17]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean }
        } & {
            [key in T[18]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean }
        } & {
            [key in T[19]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean }
        } & {
            [key in T[20]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean }
        } & {
            [key in T[21]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean }
        } & {
            [key in T[22]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean }
        } & {
            [key in T[23]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean }
        } & {
            [key in T[24]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean }
        } & {
            [key in T[25]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean }
        } & {
            [key in T[26]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean }
        } & {
            [key in T[27]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean }
        } & {
            [key in T[28]]: { [key in T[29]]: boolean } & { [key in T[28]]: boolean }
        } & {
            [key in T[29]]: { [key in T[29]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean }
        } & {
            [key in T[12]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean }
        } & {
            [key in T[13]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean }
        } & {
            [key in T[14]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean }
        } & {
            [key in T[15]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean }
        } & {
            [key in T[16]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean }
        } & {
            [key in T[17]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean }
        } & {
            [key in T[18]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean }
        } & {
            [key in T[19]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean }
        } & {
            [key in T[20]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean }
        } & {
            [key in T[21]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean }
        } & {
            [key in T[22]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean }
        } & {
            [key in T[23]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean }
        } & {
            [key in T[24]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean }
        } & {
            [key in T[25]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean }
        } & {
            [key in T[26]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean }
        } & {
            [key in T[27]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean }
        } & {
            [key in T[28]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean }
        } & {
            [key in T[29]]: { [key in T[30]]: boolean } & { [key in T[29]]: boolean }
        } & {
            [key in T[30]]: { [key in T[30]]: boolean }
        }
    ): this;

    public layerCollisionMatrix<T extends [CollisionLayerConstType.DefaultLayerName, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean } & { [key in T[3]]: boolean }
        } & {
            [key in T[4]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean } & { [key in T[4]]: boolean }
        } & {
            [key in T[5]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean } & { [key in T[5]]: boolean }
        } & {
            [key in T[6]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean } & { [key in T[6]]: boolean }
        } & {
            [key in T[7]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean } & { [key in T[7]]: boolean }
        } & {
            [key in T[8]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean } & { [key in T[8]]: boolean }
        } & {
            [key in T[9]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean } & { [key in T[9]]: boolean }
        } & {
            [key in T[10]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean } & { [key in T[10]]: boolean }
        } & {
            [key in T[11]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean } & { [key in T[11]]: boolean }
        } & {
            [key in T[12]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean } & { [key in T[12]]: boolean }
        } & {
            [key in T[13]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean } & { [key in T[13]]: boolean }
        } & {
            [key in T[14]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean } & { [key in T[14]]: boolean }
        } & {
            [key in T[15]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean } & { [key in T[15]]: boolean }
        } & {
            [key in T[16]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean } & { [key in T[16]]: boolean }
        } & {
            [key in T[17]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean } & { [key in T[17]]: boolean }
        } & {
            [key in T[18]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean } & { [key in T[18]]: boolean }
        } & {
            [key in T[19]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean } & { [key in T[19]]: boolean }
        } & {
            [key in T[20]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean } & { [key in T[20]]: boolean }
        } & {
            [key in T[21]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean } & { [key in T[21]]: boolean }
        } & {
            [key in T[22]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean } & { [key in T[22]]: boolean }
        } & {
            [key in T[23]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean } & { [key in T[23]]: boolean }
        } & {
            [key in T[24]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean } & { [key in T[24]]: boolean }
        } & {
            [key in T[25]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean } & { [key in T[25]]: boolean }
        } & {
            [key in T[26]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean } & { [key in T[26]]: boolean }
        } & {
            [key in T[27]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean } & { [key in T[27]]: boolean }
        } & {
            [key in T[28]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean } & { [key in T[28]]: boolean }
        } & {
            [key in T[29]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean } & { [key in T[29]]: boolean }
        } & {
            [key in T[30]]: { [key in T[31]]: boolean } & { [key in T[30]]: boolean }
        } & {
            [key in T[31]]: { [key in T[31]]: boolean }
        }
    ): this;

    // #endregion
    
    public layerCollisionMatrix<T extends CollisionLayer>(
        collisionMatrix: { [key in T[number]]: { [key in T[number]]: boolean } }
    ): this {
        this._physicsSettingObject.collisionLayerMaskMatrix = collisionMatrix;
        return this;
    }
}
