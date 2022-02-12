import { Game } from "../engine/Game";
import { TestBootstrapper } from "./TestBootstrapper";
//import { mutIteratableCollectionTest2 } from "./../engine/collection/CollectionTest";

function startTestGame(container: HTMLElement) {
    const game = new Game(container, {
        render: {
            useCss3DRenderer: true
        },
        physics: {
            usePhysics2D: true
        }
    });
    game.run(TestBootstrapper);
    game.inputHandler.startHandleEvents();
}

//mutIteratableCollectionTest1();
//mutIteratableCollectionTest2();
startTestGame(document.getElementById("game_view")!);
