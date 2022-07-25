import { RenderSetting } from "@src/engine/bootstrap/setting/RenderSetting";

describe("RenderSetting Test", () => {
    it("RenderSetting.constructor()", () => {
        const settingObject = RenderSetting.createDefaultObject();
        const setting = new RenderSetting(settingObject);

        expect(setting.constructor).toEqual(RenderSetting);
    });

    it("RenderSetting.createDefaultObject()", () => {
        const settingObject = RenderSetting.createDefaultObject();

        expect(settingObject).toEqual({
            useCss3DRenderer: true
        });
    });

    it("RenderSetting.useCss3DRenderer() default", () => {
        const settingObject = RenderSetting.createDefaultObject();

        expect(settingObject.useCss3DRenderer).toEqual(true);
    });

    it("RenderSetting.useCss3DRenderer() defined", () => {
        const settingObject = RenderSetting.createDefaultObject();
        const setting = new RenderSetting(settingObject);
        setting.useCss3DRenderer(false);

        expect(settingObject.useCss3DRenderer).toEqual(false);
    });

    it("RenderSetting.webGLRenderer() default", () => {
        const settingObject = RenderSetting.createDefaultObject();

        expect(settingObject.webGLRenderer).toBeUndefined();
    });

    it("RenderSetting.webGLRenderer() defined", () => {
        const settingObject = RenderSetting.createDefaultObject();
        const setting = new RenderSetting(settingObject);
        const renderer = "mock renderer" as any;
        setting.webGLRenderer(renderer);

        expect(settingObject.webGLRenderer).toEqual(renderer);
    });
});
