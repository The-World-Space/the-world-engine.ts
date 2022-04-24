import { CoroutineIterator } from "../../../engine/coroutine/CoroutineIterator";
import { WaitForSeconds } from "../../../engine/coroutine/YieldInstruction";
import { Component } from "../../../engine/hierarchy_object/Component";
import { CssTextRenderer } from "../../../engine/script/render/CssTextRenderer";

/** @internal */
export class FpsCounter extends Component {
    public override readonly requiredComponents = [CssTextRenderer];

    private _textRenderer: CssTextRenderer|null = null;

    public awake(): void {
        this._textRenderer = this.gameObject.getComponent(CssTextRenderer);
        this.startCorutine(this.showFps());
    }

    public *showFps(): CoroutineIterator {
        for (; ;) {
            const fps = 1 / this.engine.time.unscaledDeltaTime;
            this._textRenderer!.text = `FPS: ${fps.toFixed(2)}`;
            yield new WaitForSeconds(1);
        }
    }
}
