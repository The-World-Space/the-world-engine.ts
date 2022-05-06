import { GameSetting } from "@src/engine/bootstrap/setting/GameSetting";
import { PhysicsSetting } from "@src/engine/bootstrap/setting/PhysicsSetting";
import { RenderSetting } from "@src/engine/bootstrap/setting/RenderSetting";
import { Vector2 } from "three";

describe("GameSetting Test", () => {
    it("GameSetting.constructor", () => {
        const settingObject = GameSetting.createDefaultObject();
        const setting = new GameSetting(settingObject);

        expect(setting).toBeDefined();
        expect(setting.constructor).toEqual(GameSetting);
    });

    it("GameSetting.createDefaultObject()", () => {
        const settingObject = GameSetting.createDefaultObject();
        
        expect(settingObject).toEqual({
            render: {
                useCss3DRenderer: true
            },
            physics: { }
        });
    });

    it("GameSetting.render", () => {
        const settingObject = GameSetting.createDefaultObject();
        const setting = new GameSetting(settingObject);

        expect(setting.render).toBeDefined();
        expect(setting.render.constructor).toEqual(RenderSetting);
    });

    it("GameSetting.physics", () => {
        const settingObject = GameSetting.createDefaultObject();
        const setting = new GameSetting(settingObject);

        expect(setting.physics).toBeDefined();
        expect(setting.physics.constructor).toEqual(PhysicsSetting);
    });

    it("GameSetting.make()", () => {
        const settingObject = GameSetting.createDefaultObject();
        const setting = new GameSetting(settingObject);

        setting.physics
            .gravity(new Vector2(1, 2));

        const readonlySetting = setting.make();

        expect(readonlySetting.physics.gravity).toEqual(new Vector2(1, 2));
    });
});
