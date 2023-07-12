import type { IEventContainer } from "../collection/EventContainer";
import { EventContainer } from "../collection/EventContainer";
import type { IReadonlyGameScreen } from "./IReadonlyGameScreen";

/** @internal */
export class GameScreen implements IReadonlyGameScreen {
    private _width: number;
    private _height: number;
    private readonly _onResizeEvent: EventContainer<(width: number, height: number) => void>;

    public constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
        this._onResizeEvent = new EventContainer();
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public get onResize(): IEventContainer<(width: number, height: number) => void> {
        return this._onResizeEvent;
    }

    public resize(width: number, height: number): void {
        this._width = width;
        this._height = height;
        this._onResizeEvent.invoke(width, height);
    }
}
