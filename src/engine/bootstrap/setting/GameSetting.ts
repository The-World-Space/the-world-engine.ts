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
}

export class RenderSetting {
    /** @internal */
    public _useCss3DRenderer = true;

    public useCss3DRenderer(value: boolean): this {
        this._useCss3DRenderer = value;
        return this;
    }
}

export class PhysicsSetting {
    /** @internal */
    public _usePhysics2D = false;
    /** @internal */
    public _collisionLayerMask: CollisionLayerMask = CollisionLayerMask.make<["default"]>({
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
}
