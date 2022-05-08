import { PhysicsSetting } from "@src/engine/bootstrap/setting/PhysicsSetting";
import { Physics2DLoader } from "@src/engine/physics/2d/Physics2DLoader";
import { PhysicsMaterial2D } from "@src/engine/physics/2d/PhysicsMaterial2D";
import { Vector2 } from "three/src/Three";

describe("PhysicsSetting Test", () => {
    it("PhysicsSetting.constructor()", () => {
        const settingObject = PhysicsSetting.createDefaultObject();
        const setting = new PhysicsSetting(settingObject);

        expect(setting.constructor).toEqual(PhysicsSetting);
    });

    it("PhysicsSetting.createDefaultObject()", () => {
        const settingObject = PhysicsSetting.createDefaultObject();
        expect(settingObject).toEqual({ });
    });

    it("PhysicsSetting.loader() undefined", () => {
        const settingObject = PhysicsSetting.createDefaultObject();

        expect(settingObject.loader).toBeUndefined();
    });

    it("PhysicsSetting.loader() defined", () => {
        const settingObject = PhysicsSetting.createDefaultObject();
        const setting = new PhysicsSetting(settingObject);

        setting.loader(Physics2DLoader);
        expect(settingObject.loader).toEqual(Physics2DLoader);
    });

    it("PhysicsSetting.gravity() undefined", () => {
        const settingObject = PhysicsSetting.createDefaultObject();

        expect(settingObject.gravity).toBeUndefined();
    });

    it("PhysicsSetting.gravity() defined", () => {
        const settingObject = PhysicsSetting.createDefaultObject();
        const setting = new PhysicsSetting(settingObject);

        setting.gravity(new Vector2(1, 1));
        expect(settingObject.gravity).toEqual(new Vector2(1, 1));
    });

    it("PhysicsSetting.defaultMaterial() undefined", () => {
        const settingObject = PhysicsSetting.createDefaultObject();

        expect(settingObject.defaultMaterial).toBeUndefined();
    });
    
    it("PhysicsSetting.defaultMaterial() defined", () => {
        const settingObject = PhysicsSetting.createDefaultObject();
        const setting = new PhysicsSetting(settingObject);

        setting.defaultMaterial(new PhysicsMaterial2D(0.1, 0.2));
        expect(settingObject.defaultMaterial).toEqual(new PhysicsMaterial2D(0.1, 0.2));
    });

    it("PhysicsSetting.velocityIterations() undefined", () => {
        const settingObject = PhysicsSetting.createDefaultObject();

        expect(settingObject.velocityIterations).toBeUndefined();
    });
    
    it("PhysicsSetting.velocityIterations() defined", () => {
        const settingObject = PhysicsSetting.createDefaultObject();
        const setting = new PhysicsSetting(settingObject);

        setting.velocityIterations(10);
        expect(settingObject.velocityIterations).toBe(10);
    });

    it("PhysicsSetting.positionIterations() undefined", () => {
        const settingObject = PhysicsSetting.createDefaultObject();

        expect(settingObject.positionIterations).toBeUndefined();
    });
    
    it("PhysicsSetting.positionIterations() defined", () => {
        const settingObject = PhysicsSetting.createDefaultObject();
        const setting = new PhysicsSetting(settingObject);

        setting.positionIterations(10);
        expect(settingObject.positionIterations).toBe(10);
    });

    it("PhysicsSetting.queriesHitTriggers() undefined", () => {
        const settingObject = PhysicsSetting.createDefaultObject();

        expect(settingObject.queriesHitTriggers).toBeUndefined();
    });
    
    it("PhysicsSetting.queriesHitTriggers() defined", () => {
        const settingObject = PhysicsSetting.createDefaultObject();
        const setting = new PhysicsSetting(settingObject);

        setting.queriesHitTriggers(true);
        expect(settingObject.queriesHitTriggers).toBe(true);
    });

    it("PhysicsSetting.reuseCollisionCallbacks() undefined", () => {
        const settingObject = PhysicsSetting.createDefaultObject();

        expect(settingObject.reuseCollisionCallbacks).toBeUndefined();
    });

    it("PhysicsSetting.reuseCollisionCallbacks() defined", () => {
        const settingObject = PhysicsSetting.createDefaultObject();
        const setting = new PhysicsSetting(settingObject);

        setting.reuseCollisionCallbacks(true);
        expect(settingObject.reuseCollisionCallbacks).toBe(true);
    });

    it("PhysicsSetting.layerCollisionMatrix() undefined", () => {
        const settingObject = PhysicsSetting.createDefaultObject();

        expect(settingObject.collisionLayerMaskMatrix).toBeUndefined();
    });
    
    it("PhysicsSetting.layerCollisionMatrix() defined 1", () => {
        const settingObject = PhysicsSetting.createDefaultObject();
        const setting = new PhysicsSetting(settingObject);

        setting.layerCollisionMatrix<["default"]>({
            default: { default: true }
        });

        expect(settingObject.collisionLayerMaskMatrix).toEqual({
            default: { default: true }
        });
    });

    
    it("PhysicsSetting.layerCollisionMatrix() defined 2", () => {
        const settingObject = PhysicsSetting.createDefaultObject();
        const setting = new PhysicsSetting(settingObject);

        setting.layerCollisionMatrix<["default", "player"]>({
            default: { player: true, default: true },
            player:  { player: true }
        });

        expect(settingObject.collisionLayerMaskMatrix).toEqual({
            default: { player: true, default: true },
            player:  { player: true }
        });
    });

    it("PhysicsSetting.layerCollisionMatrix() defined 3", () => {
        const settingObject = PhysicsSetting.createDefaultObject();
        const setting = new PhysicsSetting(settingObject);

        setting.layerCollisionMatrix<["default", "player", "enemy"]>({
            default: { enemy: true, player: true, default: true },
            player:  { enemy: true, player: true },
            enemy:   { enemy: true }
        });

        expect(settingObject.collisionLayerMaskMatrix).toEqual({
            default: { enemy: true, player: true, default: true },
            player:  { enemy: true, player: true },
            enemy:   { enemy: true }
        });
    });

    it("PhysicsSetting.layerCollisionMatrix() defined 4", () => {
        const settingObject = PhysicsSetting.createDefaultObject();
        const setting = new PhysicsSetting(settingObject);

        setting.layerCollisionMatrix<["default", "player", "enemy", "trigger"]>({
            default: { trigger: true, enemy: true, player: true, default: true },
            player:  { trigger: true, enemy: true, player: true },
            enemy:   { trigger: true, enemy: true },
            trigger: { trigger: true }
        });

        expect(settingObject.collisionLayerMaskMatrix).toEqual({
            default: { trigger: true, enemy: true, player: true, default: true },
            player:  { trigger: true, enemy: true, player: true },
            enemy:   { trigger: true, enemy: true },
            trigger: { trigger: true }
        });
    });

    it("PhysicsSetting.layerCollisionMatrix() defined 5", () => {
        const settingObject = PhysicsSetting.createDefaultObject();
        const setting = new PhysicsSetting(settingObject);

        setting.layerCollisionMatrix<["default", "player", "enemy", "trigger", "bullet"]>({
            default: { bullet: true, trigger: true, enemy: true, player: true, default: true },
            player:  { bullet: true, trigger: true, enemy: true, player: true },
            enemy:   { bullet: true, trigger: true, enemy: true },
            trigger: { bullet: true, trigger: true },
            bullet:  { bullet: true }
        });

        expect(settingObject.collisionLayerMaskMatrix).toEqual({
            default: { bullet: true, trigger: true, enemy: true, player: true, default: true },
            player:  { bullet: true, trigger: true, enemy: true, player: true },
            enemy:   { bullet: true, trigger: true, enemy: true },
            trigger: { bullet: true, trigger: true },
            bullet:  { bullet: true }
        });
    });
});
