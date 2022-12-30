import type { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import type { Renderer, WebGLRenderer } from "three/src/Three";

/**
 * webgl global object.
 *
 * you can use Unsafe API by casting this to `WebGLGlobalObject`
 */
export interface IReadonlyWebGLGlobalObject {
    get renderer(): Omit<Renderer, "domElement">;
    get webglRenderer(): WebGLRenderer|null;
    get effectComposer(): EffectComposer|null;
}

/**
 * webgl global object.
 */
export class WebGLGlobalObject implements IReadonlyWebGLGlobalObject {
    private readonly _renderer: Omit<Renderer, "domElement">;
    private readonly _webglRenderer: WebGLRenderer|null;
    private _effectComposer: EffectComposer|null;

    public constructor(
        renderer: Omit<Renderer, "domElement">,
        webglRenderer: WebGLRenderer|null
    ) {
        this._renderer = renderer;
        this._webglRenderer = webglRenderer;
        this._effectComposer = null;
    }

    /** @internal */
    public dispose(): void {
        if (this._webglRenderer) this._webglRenderer.dispose();
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

    /**
     * set effect composer.
     *
     * this is unsafe API that use only for post process volume.
     */
    public set effectComposer(effectComposer: EffectComposer|null) {
        this._effectComposer = effectComposer;
    }
}
