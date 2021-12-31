/**
 * readonly game state interface
 */
export interface IReadonlyGameState {
    /**
     * get game state
     */
    get kind(): GameStateKind;
}

export class GameState implements IReadonlyGameState {
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
