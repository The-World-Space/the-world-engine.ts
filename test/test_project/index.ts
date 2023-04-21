import { Game } from "../../src/engine/Game";
import { ComponentInitializeTestBootstrapper } from "./asset/ComponentInitializeTestBootstrapper";

function startTestGame(container: HTMLElement): void {
    const game = new Game(container);
    game.run(ComponentInitializeTestBootstrapper);
    game.inputHandler.startHandleEvents();
}

startTestGame(document.body);
