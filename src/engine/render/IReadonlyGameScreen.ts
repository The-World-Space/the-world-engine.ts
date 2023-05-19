import type { IEventContainer } from "../collection/EventContainer";

/**
 * readonly game screen interface
 */
export interface IReadonlyGameScreen {
    /**
     * get the width of the screen
     */
    get width(): number;

    /**
     * get the height of the screen
     */
    get height(): number;

    /**
     * onResize event listener
     */
    get onResize(): IEventContainer<(width: number, height: number) => void>;
}
