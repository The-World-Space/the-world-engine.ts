import { GameSetting } from "src/engine/bootstrap/setting/GameSetting";

describe("GameSetting Test", () => {
    test("GameSetting.createDefaultObject()", () => {
        const settingObject = GameSetting.createDefaultObject();
        
        expect(settingObject).toEqual({
            render: {
                useCss3DRenderer: true
            },
            physics: { }
        });
    });
});
