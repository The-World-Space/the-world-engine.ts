import { CollisionLayer, CollisionLayerMask } from "../../physics/CollisionLayerMask";

export class GameSetting {
    private readonly _renderSetting = new RenderSetting();
    private readonly _physicsSetting = new PhysicsSetting();

    public get renderSetting(): RenderSetting {
        return this._renderSetting;
    }

    public get physicsSetting(): PhysicsSetting {
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
    private _collisionLayerMask: CollisionLayerMask = CollisionLayerMask.make<["default"]>({
        default: { default: true },
    });

    public usePhysics2D(value: boolean): this {
        this._usePhysics2D = value;
        return this;
    }
    
    public layerCollisionMatrix<T extends CollisionLayer>(
        collisionMatrix: { [key in T[number]]: { [key in T[number]]: boolean } }
    ): CollisionLayerMask {
        return CollisionLayerMask.make(collisionMatrix);
    }

    /** @internal */
    public make(): PhysicsSettingObject {
        return {
            usePhysics2D: this._usePhysics2D,
            collisionLayerMask: this._collisionLayerMask,
        };
    }
}

type PhysicsSettingObject = {
    readonly usePhysics2D: boolean,
    readonly collisionLayerMask: CollisionLayerMask
}
