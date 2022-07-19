import { Game } from "../../src/engine/Game";
import { Topdown2dTestBootstrapper } from "./asset/Topdown2dTestBootstrapper";

function startTestGame(container: HTMLElement): void {
    const game = new Game(container);
    game.run(Topdown2dTestBootstrapper);
    game.inputHandler.startHandleEvents();
}

startTestGame(document.body);
