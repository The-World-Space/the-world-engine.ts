import { Vector2 } from "three";
import { PhysicsMaterial2D } from "../../physics/2d/PhysicsMaterial2D";
import { CollisionLayer, CollisionLayerMaskConverter } from "../../physics/CollisionLayerMaskConverter";

export type PhysicsSettingObject = {
    usePhysics2D: boolean,
    gravity: Vector2,
    defaultMaterial: PhysicsMaterial2D|null,
    velocityIterations: number,
    positionIterations: number,
    //velocityThreshold: number,
    timeToSleep: number,
    //linearSleepTolerance: number,
    //angularSleepTolerance: number,
    //defaultContactOffset: number,
    //queriesHitTriggers: boolean,
    //queriesStartInColliders: boolean,
    //callbacksOnDisable: boolean,
    //reuseCollisionCallbacks: boolean,
    collisionLayerMaskConverter: CollisionLayerMaskConverter
}

export class PhysicsSetting {
    private _physicsSettingObject: PhysicsSettingObject;

    public constructor(physicsSettingObject: PhysicsSettingObject) {
        this._physicsSettingObject = physicsSettingObject;
    }

    public static createDefaultObject(): PhysicsSettingObject {
        return {
            usePhysics2D: true,
            gravity: new Vector2(0, -9.81),
            defaultMaterial: null,
            velocityIterations: 8,
            positionIterations: 3,
            //velocityThreshold: 1,
            timeToSleep: 0.5,
            //linearSleepTolerance: 0.01,
            //angularSleepTolerance: 0.01,
            //defaultContactOffset: 0.01,
            //queriesHitTriggers: true,
            //queriesStartInColliders: true,
            //callbacksOnDisable: true,
            //reuseCollisionCallbacks: true,
            collisionLayerMaskConverter: new CollisionLayerMaskConverter({
                default: { default: true },
            })
        };
    }

    public usePhysics2D(value: boolean): this {
        this._physicsSettingObject.usePhysics2D = value;
        return this;
    }
    
    // #region CollisionLayer Collision Matrix Overloads

    public layerCollisionMatrix<T extends ["default"] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[0]]: boolean }
        }
    ): void;

    public layerCollisionMatrix<T extends ["default", string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[1]]: boolean }
        }
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[2]]: boolean }
        }
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string] = never>(
        collisionMatrix: T extends never ? never : object & {
            [key in T[0]]: { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean } & { [key in T[0]]: boolean }
        } & {
            [key in T[1]]: { [key in T[3]]: boolean } & { [key in T[2]]: boolean } & { [key in T[1]]: boolean }
        } & {
            [key in T[2]]: { [key in T[3]]: boolean } & { [key in T[2]]: boolean }
        } & {
            [key in T[3]]: { [key in T[3]]: boolean }
        }
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    public layerCollisionMatrix<T extends ["default", string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string, string] = never>(
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
    ): void;

    // #endregion
    
    public layerCollisionMatrix<T extends CollisionLayer>(
        collisionMatrix: { [key in T[number]]: { [key in T[number]]: boolean } }
    ): void {
        this._physicsSettingObject.collisionLayerMaskConverter = new CollisionLayerMaskConverter(collisionMatrix);
    }
}
