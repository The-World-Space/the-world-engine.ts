import { DeepReadonly } from "../../type/DeepReadonly";
import { RenderSetting, RenderSettingObject } from "./RenderSetting";
import { PhysicsSetting, PhysicsSettingObject } from "./PhysicsSetting";

export type GameSettingObject = {
    render: RenderSettingObject;
    physics: PhysicsSettingObject;
};

export class GameSetting {
    private _gameSettingObject: GameSettingObject;
    
    private readonly _renderSetting: RenderSetting;
    private readonly _physicsSetting: PhysicsSetting;

    public constructor(gameSettingObject: GameSettingObject) {
        this._gameSettingObject = gameSettingObject;

        this._renderSetting = new RenderSetting(this._gameSettingObject.render);
        this._physicsSetting = new PhysicsSetting(this._gameSettingObject.physics);
    }

    public static createDefaultObject(): GameSettingObject {
        return {
            render: RenderSetting.createDefaultObject(),
            physics: PhysicsSetting.createDefaultObject(),
        };
    }

    public get render(): RenderSetting {
        return this._renderSetting;
    }

    public get physics(): PhysicsSetting {
        return this._physicsSetting;
    }

    /** @internal */
    public make(): DeepReadonly<GameSettingObject> {
        return this._gameSettingObject;
    }
}
