import { Game } from "../engine/Game";
import { TestBootstrapper } from "./TestBootstrapper";

function startTestGame(container: HTMLElement) {
    const game = new Game(container);
    game.run(TestBootstrapper);
    game.inputHandler.startHandleEvents();
}

startTestGame(document.getElementById("game_view")!);
