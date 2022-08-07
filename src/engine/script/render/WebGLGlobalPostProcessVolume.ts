import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";

import { Component } from "../../hierarchy_object/Component";

export class WebGLGlobalPostProcessVolume extends Component {
    private _renderPass: RenderPass|null = null;
    private _effectComposer: EffectComposer|null = null;

    public awake(): void {
        this._renderPass;
        this._effectComposer;
    }
}
