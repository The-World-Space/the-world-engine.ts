import type { WebGLRendererLoader } from "@src/engine/render/WebGLRendererLoader";
import type { Renderer, WebGLRenderer } from "three/src/Three";

export type RenderSettingObject = {
    useCss3DRenderer: boolean,
    webGLRendererLoader?: typeof WebGLRendererLoader,
    webGLRendererInitilizer?: () => WebGLRenderer | (readonly [Omit<Renderer, "domElement">, HTMLCanvasElement])
};

export class RenderSetting {
    private readonly _renderSettingObject: RenderSettingObject;

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
     * webgl renderer loader.
     *
     * for use webgl renderer, you need to inject webgl renderer loader.
     * WebGLRendererLoader has dependency of WebGLRenderer.
     *
     * @param value webgl renderer loader
     * @returns this
     */
    public webGLRendererLoader(value: typeof WebGLRendererLoader): this {
        this._renderSettingObject.webGLRendererLoader = value;
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
    public webGLRenderer(func: () => WebGLRenderer): this;

    public webGLRenderer(func: () => readonly [Omit<Renderer, "domElement">, HTMLCanvasElement]): this;

    public webGLRenderer(func: () => WebGLRenderer | (readonly [Omit<Renderer, "domElement">, HTMLCanvasElement])): this {
        this._renderSettingObject.webGLRendererInitilizer = func;
        return this;
    }
}
