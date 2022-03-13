import { Game } from "../engine/Game";
import { PhysicsTestBootstrapper } from "./asset/PhysicsTestBootstrapper";

function startTestGame(container: HTMLElement) {
    const game = new Game(container);
    game.run(PhysicsTestBootstrapper);
    game.inputHandler.startHandleEvents();
}

startTestGame(document.body);
