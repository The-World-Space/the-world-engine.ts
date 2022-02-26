import { CoroutineIterator, CssTextRenderer, WaitForSeconds } from "../../..";
import { Component } from "../../../engine/hierarchy_object/Component";

/** @internal */
export class FpsCounter extends Component {
    public override readonly requiredComponents = [CssTextRenderer];

    private textRenderer: CssTextRenderer|null = null;

    public awake(): void {
        this.textRenderer = this.gameObject.getComponent(CssTextRenderer);
        this.startCorutine(this.showFps());
    }

    public *showFps(): CoroutineIterator {
        for (; ;) {
            const fps = 1 / this.engine.time.unscaledDeltaTime;
            this.textRenderer!.text = `FPS: ${fps.toFixed(2)}`;
            yield new WaitForSeconds(1);
        }
    }
}
