import { Game } from "../engine/Game";
import { EventTestBootstrapper } from "./asset/EventTestBootstrapper";

function startTestGame(container: HTMLElement): void {
    const game = new Game(container);
    game.run(EventTestBootstrapper);
    game.inputHandler.startHandleEvents();
}

startTestGame(document.body);
