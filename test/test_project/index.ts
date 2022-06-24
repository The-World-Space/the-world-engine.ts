import { Game } from "../../src/engine/Game";
import { ObjectPoolTestBootstrapper } from "./asset/ObjectPoolTestBootstrapper";

function startTestGame(container: HTMLElement): void {
    const game = new Game(container);
    game.run(ObjectPoolTestBootstrapper);
    game.inputHandler.startHandleEvents();
}

startTestGame(document.body);
