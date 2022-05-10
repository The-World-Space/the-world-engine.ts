import { GlobalConfig } from "@src/GlobalConfig"

describe("GlobalConfig Test", () => {
    it("defaultSpriteSrc must be url", () => {
        const src = GlobalConfig.defaultSpriteSrc;

        expect(src).toMatch(/^data:image\/png;base64,/);
    });
});
