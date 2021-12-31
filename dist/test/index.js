import { Vector3 } from "three";
import { Bootstrapper } from "../engine/bootstrap/Bootstrapper";
import { Game } from "../engine/Game";
import { Camera } from "../engine/script/render/Camera";
import { CssSpriteRenderer } from "../engine/script/render/CssSpriteRenderer";
class TestBootstrapper extends Bootstrapper {
    run() {
        const instantlater = this.engine.instantlater;
        return this.sceneBuilder
            .withChild(instantlater.buildGameObject("camera", new Vector3(0, 0, 10))
            .withComponent(Camera, c => {
            c.viewSize = 100;
        }))
            .withChild(instantlater.buildGameObject("test_object")
            .withComponent(CssSpriteRenderer));
    }
}
function startTestGame(container) {
    const game = new Game(container);
    game.run(TestBootstrapper);
    game.inputHandler.startHandleEvents();
}
startTestGame(document.getElementById("game_view"));
