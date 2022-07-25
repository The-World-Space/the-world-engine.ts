import type { Renderer } from "three/src/Three";

export type RenderSettingObject = { 
    useCss3DRenderer: boolean,
    webGLRenderer?: Renderer
};

export class RenderSetting {
    private _renderSettingObject: RenderSettingObject;

    public constructor(renderSettingObject: RenderSettingObject) {
        this._renderSettingObject = renderSettingObject;
    }

    public static createDefaultObject(): RenderSettingObject {
        return {
            useCss3DRenderer: true
        };
    }

    /**
     * if true, use css3d renderer. (default: true)
     * 
     * @param value if true, use css3d renderer.
     * @returns this
     */
    public useCss3DRenderer(value: boolean): this {
        this._renderSettingObject.useCss3DRenderer = value;
        return this;
    }

    /**
     * set webgl renderer. (default: undefined)
     * 
     * you need to inject webgl renderer for use.
     * 
     * @param value webgl renderer
     * @returns this
     */
    public webGLRenderer(value: Renderer): this {
        this._renderSettingObject.webGLRenderer = value;
        return this;
    }
}
