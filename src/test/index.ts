import { Game } from "../engine/Game";
import { NonPhysicsTestBootstrapper } from "./asset/NonPhysicsTestBootstrapper";

function startTestGame(container: HTMLElement) {
    const game = new Game(container);
    game.run(NonPhysicsTestBootstrapper);
    game.inputHandler.startHandleEvents();
}

startTestGame(document.body);
