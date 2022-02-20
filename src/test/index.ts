import { Game } from "../engine/Game";
import { TestBootstrapper } from "./asset/TestBootstrapper";
//import { mutIteratableCollectionTest2 } from "./../engine/collection/CollectionTest";

function startTestGame(container: HTMLElement) {
    const game = new Game(container);
    game.run(TestBootstrapper);
    game.inputHandler.startHandleEvents();
}

//mutIteratableCollectionTest1();
//mutIteratableCollectionTest2();
startTestGame(document.body);
