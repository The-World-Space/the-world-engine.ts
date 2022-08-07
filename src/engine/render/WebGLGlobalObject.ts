import type { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import type { Renderer, WebGLRenderer } from "three/src/Three";

/**
 * webgl global object.
 */
export class WebGLGlobalObject {
    private readonly _renderer: Omit<Renderer, "domElement">;
    private readonly _webglRenderer: WebGLRenderer|null;
    private readonly _effectComposer: EffectComposer|null;

    public constructor(
        renderer: Omit<Renderer, "domElement">,
        webglRenderer: WebGLRenderer|null,
        effectComposer: EffectComposer|null
    ) {
        this._renderer = renderer;
        this._webglRenderer = webglRenderer;
        this._effectComposer = effectComposer;
    }
    
    /**
     * get abstract renderer.
     */
    public get renderer(): Omit<Renderer, "domElement"> {
        return this._renderer;
    }

    /**
     * get webgl renderer.
     */
    public get webglRenderer(): WebGLRenderer|null {
        return this._webglRenderer;
    }

    /**
     * get effect composer.
     * 
     * if you not use post process, this value is null.
     */
    public get effectComposer(): EffectComposer|null {
        return this._effectComposer;
    }
}
