import { Camera, Component, Coroutine, CoroutineIterator, CssHtmlElementRenderer } from "the-world-engine";
import { MathUtils } from "three/src/Three"; 

export class DialogController extends Component {
    public override readonly disallowMultipleComponent = true;
    public override readonly requiredComponents = [CssHtmlElementRenderer];

    private _dialogUi: CssHtmlElementRenderer|null = null;
    public camera: Camera|null = null;
    private _transitionCoroutine: Coroutine|null = null;
    private _textAnimationCoroutine: Coroutine|null = null;
    private _isShowing = false;
    private readonly _maxWidth = 10;

    private _initializeFunction: (() => void)|null = null;

    private readonly onScreenResize = (): void => {
        if (!this._dialogUi) return;
        const screen = this.engine.screen;
        const aspectRatio = screen.width / screen.height;

        const viewSize = this.camera!.viewSize;
        this._dialogUi!.elementWidth = Math.min(this._maxWidth, viewSize * 2 * aspectRatio - 1);
    };

    public awake(): void {
        this._dialogUi = this.gameObject.getComponent(CssHtmlElementRenderer)!;
        if (this.camera === null) {
            throw new Error("DialogController requires a camera component");
        }
        this._dialogUi.htmlElementEventHandler!.onmousedown = (): void => {
            this.hideUi();
        };
        this.onScreenResize();

        this._initializeFunction?.();
    }

    public onEnable(): void {
        this.engine.screen.onResize.addListener(this.onScreenResize);
    }

    public onDisable(): void {
        this.engine.screen.onResize.removeListener(this.onScreenResize);
    }

    private _lastViewSize = 0;

    public update(): void {
        const viewSize = this.camera!.viewSize;
        if (viewSize !== this._lastViewSize) {
            this.onScreenResize();
            if (this._transitionCoroutine) this.stopCoroutine(this._transitionCoroutine);
            this.transform.localPosition.y = this._isShowing ? -viewSize + 1.5 : -viewSize - 1.5;
            this._lastViewSize = viewSize;
        }
    }

    public showMessage(message: string): void {
        if (!this._dialogUi) {
            this._initializeFunction = (): void => this.showMessage(message);
            return;
        }

        this.showUi();
        if (this._textAnimationCoroutine) this.stopCoroutine(this._textAnimationCoroutine);
        this._textAnimationCoroutine = this.startCoroutine(this.showTextAnimation(message, 0.7));
    }

    private *showTextAnimation(text: string, duration: number): CoroutineIterator {
        let currentTime = 0;
        while (currentTime < duration) {
            this._dialogUi!.element!.firstChild!.textContent = text.substring(0, Math.floor(currentTime / duration * text.length));
            yield null;
            currentTime += this.engine.time.deltaTime;
        }
        this._dialogUi!.element!.firstChild!.textContent = text;
    }

    private showUi(): void {
        if (this._isShowing) return;
        this._isShowing = true;

        if (this._transitionCoroutine) this.stopCoroutine(this._transitionCoroutine);
        this._transitionCoroutine = this.startCoroutine(this.moveUiAnim(-this.camera!.viewSize + 1.5));
    }

    private hideUi(): void {
        if (!this._isShowing) return;
        this._isShowing = false;

        if (this._transitionCoroutine) this.stopCoroutine(this._transitionCoroutine);
        this._transitionCoroutine = this.startCoroutine(this.moveUiAnim(-this.camera!.viewSize - 1.5));
    }

    private *moveUiAnim(targetY: number): CoroutineIterator {
        const localPosition = this.transform.localPosition;
        while (Math.abs(localPosition.y - targetY) > 0.01) {
            const deltaTime = this.engine.time.deltaTime;
            localPosition.y = MathUtils.damp(localPosition.y, targetY, 8, deltaTime);
            yield null;
        }
        localPosition.y = targetY;
    }
}
