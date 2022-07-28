import { Game } from "../../src/engine/Game";
import { WebglTestBootstrapper } from "./asset/WebglTestBootstrapper";

function startTestGame(container: HTMLElement): void {
    const game = new Game(container);
    game.run(WebglTestBootstrapper);
    game.inputHandler.startHandleEvents();
}

startTestGame(document.body);
