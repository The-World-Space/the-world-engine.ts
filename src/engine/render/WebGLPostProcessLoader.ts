import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

export class WebGLPostProcessLoader {
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly EffectComposer: typeof EffectComposer = EffectComposer;
    /** @internal */
    // eslint-disable-next-line @typescript-eslint/naming-convention
    public static readonly RenderPass: typeof RenderPass = RenderPass;
}
