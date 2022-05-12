export type RenderSettingObject = { 
    useCss3DRenderer: boolean
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
     * for now, engine only support css3d renderer. this setting is for future.
     * @param value if true, use css3d renderer.
     * @returns this
     */
    public useCss3DRenderer(value: boolean): this {
        this._renderSettingObject.useCss3DRenderer = value;
        return this;
    }
}
