/**
 * readonly game state interface
 */
export interface IReadOnlyGameState {
    /**
     * get game state
     */
    get kind(): GameStateKind;
}

/** @internal */
export class GameState implements IReadOnlyGameState {
    private _gameStateKind: GameStateKind;

    public constructor(gameStateKind: GameStateKind) {
        this._gameStateKind = gameStateKind;
    }

    public get kind(): GameStateKind {
        return this._gameStateKind;
    }

    public set kind(gameStateKind: GameStateKind) {
        this._gameStateKind = gameStateKind;
    }
}

/**
 * game state kind
 */
export enum GameStateKind {
    WaitingForStart,
    Initializing,
    Running,
    Stopped,
    Finalizing,
    Finalized
}
