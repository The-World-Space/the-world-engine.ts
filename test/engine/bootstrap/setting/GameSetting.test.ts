import { GameSetting } from "src/engine/bootstrap/setting/GameSetting";

describe("GameSetting Test", () => {
    test("GameSetting", () => {
        const setting = new GameSetting(GameSetting.createDefaultObject());
        expect(setting.render.useCss3DRenderer).toBe(true);
    });
});
