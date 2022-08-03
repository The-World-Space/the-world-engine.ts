import { Color, Component, CssTextRenderer } from "the-world-engine";
import {
    Vector2,
    Vector3
} from "three/src/Three";

export class DrawIndex extends Component {
    public column = 18;
    public row = 13;

    public awake(): void {
        for (let i = 0; i < this.row; i++) {
            for (let j = 0; j < this.column; j++) {
                this.spawnText(new Vector2(j + 0.5, this.row - 1 - i), i * this.column + j);
            }
        }
    }

    private spawnText(pos: Vector2, index: number): void {
        this.engine.scene.addChildFromBuilder(
            this.engine.instantiater.buildGameObject("text", new Vector3(pos.x, pos.y, 10))
                .withComponent(CssTextRenderer, c => {
                    c.text = index.toString();
                    c.textColor = new Color(0, 0, 0);
                    c.viewScale = 0.05;
                })
        );
    }
}
