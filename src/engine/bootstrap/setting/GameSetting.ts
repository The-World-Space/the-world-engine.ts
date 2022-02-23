import { CollisionLayer, CollisionLayerMaskConverter } from "../../physics/CollisionLayerMaskConverter";

export class GameSetting {
    private readonly _renderSetting = new RenderSetting();
    private readonly _physicsSetting = new PhysicsSetting();

    public get render(): RenderSetting {
        return this._renderSetting;
    }

    public get physics(): PhysicsSetting {
        return this._physicsSetting;
    }

    /** @internal */
    public make(): GameSettingObject {
        return {
            render: this._renderSetting.make(),
            physics: this._physicsSetting.make(),
        };
    }
}

export type GameSettingObject = {
    readonly render: RenderSettingObject;
    readonly physics: PhysicsSettingObject;
};

export class RenderSetting {
    public _useCss3DRenderer = true;

    public useCss3DRenderer(value: boolean): this {
        this._useCss3DRenderer = value;
        return this;
    }

    /** @internal */
    public make(): RenderSettingObject {
        return { useCss3DRenderer: this._useCss3DRenderer };
    }
}

type RenderSettingObject = { 
    readonly useCss3DRenderer: boolean
};

export class PhysicsSetting {
    private _usePhysics2D = false;
    private _collisionLayerMaskConverter: CollisionLayerMaskConverter = new CollisionLayerMaskConverter({
        default: { default: true },
    });

    public usePhysics2D(value: boolean): this {
        this._usePhysics2D = value;
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
        this._collisionLayerMaskConverter = new CollisionLayerMaskConverter(collisionMatrix);
    }

    /** @internal */
    public make(): PhysicsSettingObject {
        return {
            usePhysics2D: this._usePhysics2D,
            collisionLayerMask: this._collisionLayerMaskConverter,
        };
    }
}

export type PhysicsSettingObject = {
    readonly usePhysics2D: boolean,
    readonly collisionLayerMask: CollisionLayerMaskConverter
}
