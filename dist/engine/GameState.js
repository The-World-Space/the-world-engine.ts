export class GameState {
    constructor(gameStateKind) {
        this._gameStateKind = gameStateKind;
    }
    get kind() {
        return this._gameStateKind;
    }
    set kind(gameStateKind) {
        this._gameStateKind = gameStateKind;
    }
}
/**
 * game state kind
 */
export var GameStateKind;
(function (GameStateKind) {
    GameStateKind[GameStateKind["WaitingForStart"] = 0] = "WaitingForStart";
    GameStateKind[GameStateKind["Initializing"] = 1] = "Initializing";
    GameStateKind[GameStateKind["Running"] = 2] = "Running";
    GameStateKind[GameStateKind["Stopped"] = 3] = "Stopped";
    GameStateKind[GameStateKind["Finalizing"] = 4] = "Finalizing";
    GameStateKind[GameStateKind["Finalized"] = 5] = "Finalized";
})(GameStateKind || (GameStateKind = {}));
