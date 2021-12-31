/**
 * readonly game state interface
 */
export interface IReadonlyGameState {
    /**
     * get game state
     */
    get kind(): GameStateKind;
}
export declare class GameState implements IReadonlyGameState {
    private _gameStateKind;
    constructor(gameStateKind: GameStateKind);
    get kind(): GameStateKind;
    set kind(gameStateKind: GameStateKind);
}
/**
 * game state kind
 */
export declare enum GameStateKind {
    WaitingForStart = 0,
    Initializing = 1,
    Running = 2,
    Stopped = 3,
    Finalizing = 4,
    Finalized = 5
}
