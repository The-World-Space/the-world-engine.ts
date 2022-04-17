import { Game } from "../engine/Game";
import { TransformTestBootstrapper } from "./asset/TransformTestBootstrapper";

function startTestGame(container: HTMLElement) {
    const game = new Game(container);
    game.run(TransformTestBootstrapper);
    game.inputHandler.startHandleEvents();
}

startTestGame(document.body);
