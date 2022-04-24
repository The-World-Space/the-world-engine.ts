import { Game } from "../engine/Game";
import { TestBootstrapper } from "./asset/TestBootstrapper";

function startTestGame(container: HTMLElement): void {
    const game = new Game(container);
    game.run(TestBootstrapper);
    game.inputHandler.startHandleEvents();
}

startTestGame(document.body);
