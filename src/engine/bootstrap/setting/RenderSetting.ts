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

    public useCss3DRenderer(value: boolean): this {
        this._renderSettingObject.useCss3DRenderer = value;
        return this;
    }
}
