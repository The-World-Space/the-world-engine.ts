import { PhysicsSetting } from "@src/engine/bootstrap/setting/PhysicsSetting";
import { Physics2DLoader } from "@src/engine/physics/2d/Physics2DLoader";

describe("PhysicsSetting Test", () => {
    it("PhysicsSetting.constructor()", () => {
        const settingObject = PhysicsSetting.createDefaultObject();
        const setting = new PhysicsSetting(settingObject);

        expect(setting).toBeDefined();
        expect(setting.constructor).toEqual(PhysicsSetting);
    });

    it("PhysicsSetting.createDefaultObject()", () => {
        const settingObject = PhysicsSetting.createDefaultObject();

        expect(settingObject).toEqual({ });
    });

    it("PhysicsSetting.loader()", () => {
        const settingObject = PhysicsSetting.createDefaultObject();
        const setting = new PhysicsSetting(settingObject);

        setting.loader(Physics2DLoader);

        expect(settingObject.loader).toEqual(Physics2DLoader);
    });
});
