import { Color, Component, CssHtmlElementRenderer, CssTextRenderer, GameObject, PrefabRef, TextAlign } from "the-world-engine";
import { Vector3 } from "three/src/Three";

export class RandomSpawner1 extends Component {
    private readonly _range = 6;

    public spawnAtScene(): void {
        const instantiater = this.engine.instantiater;
        
        const x = Math.random() * this._range - this._range / 2;
        const y = Math.random() * this._range - this._range / 2;
        const position = new Vector3(x, y, 0);

        this.engine.scene.addChildFromBuilder(
            instantiater.buildGameObject("spawned-game-object", position)
                .withComponent(CssHtmlElementRenderer, c => {
                    const div = document.createElement("div");
                    div.style.backgroundColor = "black";
                    div.style.color = "white";
                    div.style.padding = "10px";
                    div.textContent = "Spawned At Scene";

                    c.element = div;
                    c.autoSize = true;
                    c.viewScale = 0.02;
                }));
    }

    public awake(): void {
        for (let i = 0; i < 10; i++) {
            this.spawnAtScene();
        }
    }
}

export class RandomSpawner2 extends Component {
    private readonly _range = 6;

    public spawnAtScene(): void {
        const instantiater = this.engine.instantiater;
        
        const x = Math.random() * this._range - this._range / 2;
        const y = Math.random() * this._range - this._range / 2;
        const position = new Vector3(x, y, 0);

        this.engine.scene.addChildFromBuilder(
            instantiater.buildGameObject("spawned-game-object", position)
                .withComponent(CssHtmlElementRenderer, c => {
                    const div = document.createElement("div");
                    div.style.backgroundColor = "black";
                    div.style.color = "white";
                    div.style.padding = "10px";
                    div.textContent = "Spawned At Scene";

                    c.element = div;
                    c.autoSize = true;
                    c.viewScale = 0.02;
                }));
    }

    public spawnAtGameObject(): void {
        const instantiater = this.engine.instantiater;
        
        const x = Math.random() * this._range - this._range / 2;
        const y = Math.random() * this._range - this._range / 2;
        const position = new Vector3(x, y, 0);

        this.gameObject.addChildFromBuilder(
            instantiater.buildGameObject("spawned-game-object", position)
                .withComponent(CssHtmlElementRenderer, c => {
                    const div = document.createElement("div");
                    div.style.backgroundColor = "black";
                    div.style.color = "white";
                    div.style.padding = "10px";
                    div.textContent = "Spawned At GameObject";

                    c.element = div;
                    c.autoSize = true;
                    c.viewScale = 0.02;
                }));
    }

    public awake(): void {
        for (let i = 0; i < 10; i++) {
            this.spawnAtGameObject();
        }
    }
}

export class RandomSpawner3 extends Component {
    private readonly _range = 6;

    public spawnAtScene(): void {
        const instantiater = this.engine.instantiater;
        
        const x = Math.random() * this._range - this._range / 2;
        const y = Math.random() * this._range - this._range / 2;
        const position = new Vector3(x, y, 0);

        this.engine.scene.addChildFromBuilder(
            instantiater.buildGameObject("spawned-game-object", position)
                .withComponent(CssHtmlElementRenderer, c => {
                    const div = document.createElement("div");
                    div.style.backgroundColor = "black";
                    div.style.color = "white";
                    div.style.padding = "10px";
                    div.textContent = "Spawned At Scene";

                    c.element = div;
                    c.autoSize = true;
                    c.viewScale = 0.02;
                }));
    }

    public spawnAtGameObject(): void {
        const instantiater = this.engine.instantiater;
        
        const x = Math.random() * this._range - this._range / 2;
        const y = Math.random() * this._range - this._range / 2;
        const position = new Vector3(x, y, 0);

        this.gameObject.addChildFromBuilder(
            instantiater.buildGameObject("spawned-game-object", position)
                .withComponent(CssHtmlElementRenderer, c => {
                    const div = document.createElement("div");
                    div.style.backgroundColor = "black";
                    div.style.color = "white";
                    div.style.padding = "10px";
                    div.textContent = "Spawned At GameObject";

                    c.element = div;
                    c.autoSize = true;
                    c.viewScale = 0.02;
                }));
    }

    public awake(): void {
        const textRenderer = this.gameObject.addComponent(CssTextRenderer)!;
        textRenderer.text = "Spawner";
        textRenderer.textColor = new Color(1, 0, 0);
        textRenderer.textAlign = TextAlign.Center;
        textRenderer.textWidth = 5;

        for (let i = 0; i < 10; i++) {
            this.spawnAtGameObject();
        }
    }
}

export class RandomSpawner4 extends Component {
    private readonly _range = 6;
    private readonly _spawnedObjects: GameObject[] = [];

    public spawnAtGameObject(): void {
        const instantiater = this.engine.instantiater;
        
        const x = Math.random() * this._range - this._range / 2;
        const y = Math.random() * this._range - this._range / 2;
        const position = new Vector3(x, y, 0);

        const spawnedObject = this.gameObject.addChildFromBuilder(
            instantiater.buildGameObject("spawned-game-object", position)
                .withComponent(CssHtmlElementRenderer, c => {
                    const div = document.createElement("div");
                    div.style.backgroundColor = "black";
                    div.style.color = "white";
                    div.style.padding = "10px";
                    div.textContent = "Spawned At GameObject";

                    c.element = div;
                    c.autoSize = true;
                    c.viewScale = 0.02;
                }));

        this._spawnedObjects.push(spawnedObject);
    }

    public destroyAllSpawnedObjects(): void {
        for (const spawnedObject of this._spawnedObjects) {
            spawnedObject.destroy();
        }
    }

    public awake(): void {
        const textRenderer = this.gameObject.addComponent(CssTextRenderer)!;
        textRenderer.text = "Spawner";
        textRenderer.textColor = new Color(1, 0, 0);
        textRenderer.textAlign = TextAlign.Center;
        textRenderer.textWidth = 5;

        this.engine.scene.addChildFromBuilder(
            this.engine.instantiater.buildGameObject("remove-all-spawned-objects-button", new Vector3(0, 0, 5))
                .withComponent(CssHtmlElementRenderer, c => {
                    const button = document.createElement("button");
                    button.textContent = "Remove All Spawned Objects";
                    button.style.backgroundColor = "#990000";
                    button.style.color = "white";
                    button.style.padding = "10px";
                    button.onclick = () => {
                        this.destroyAllSpawnedObjects();
                    };
                    c.element = button;
                    c.autoSize = true;
                    c.viewScale = 0.04;
                }));

        for (let i = 0; i < 10; i++) {
            this.spawnAtGameObject();
        }
    }
}

export class RandomSpawner5 extends Component {
    private readonly _range = 6;
    private readonly _spawnedObjects: GameObject[] = [];

    public spawnAtGameObject(): void {
        const instantiater = this.engine.instantiater;
        
        const x = Math.random() * this._range - this._range / 2;
        const y = Math.random() * this._range - this._range / 2;
        const position = new Vector3(x, y, 0);

        const spawnedObject = this.gameObject.addChildFromBuilder(
            instantiater.buildGameObject("spawned-game-object", position)
                .withComponent(CssHtmlElementRenderer, c => {
                    const div = document.createElement("div");
                    div.style.backgroundColor = "black";
                    div.style.color = "white";
                    div.style.padding = "10px";
                    div.textContent = "Spawned At GameObject";

                    c.element = div;
                    c.autoSize = true;
                    c.viewScale = 0.02;
                }));

        this._spawnedObjects.push(spawnedObject);
    }

    public destroyAllSpawnedObjects(): void {
        for (const spawnedObject of this._spawnedObjects) {
            spawnedObject.destroy();
        }
    }

    public awake(): void {
        const textRenderer = this.gameObject.addComponent(CssTextRenderer)!;
        textRenderer.text = "Spawner";
        textRenderer.textColor = new Color(1, 0, 0);
        textRenderer.textAlign = TextAlign.Center;
        textRenderer.textWidth = 5;

        const removeAllButtonRenderer = new PrefabRef<CssHtmlElementRenderer>();
        
        this.engine.scene.addChildFromBuilder(
            this.engine.instantiater.buildGameObject("remove-all-spawned-objects-button", new Vector3(0, 0, 5))
                .withComponent(CssHtmlElementRenderer, c => {
                    const button = document.createElement("button");
                    button.textContent = "Remove All Spawned Objects";
                    button.style.backgroundColor = "#990000";
                    button.style.color = "white";
                    button.style.padding = "10px";
                    button.onclick = () => {
                        this.destroyAllSpawnedObjects();
                    };
                    c.element = button;
                    c.autoSize = true;
                    c.viewScale = 0.04;
                })
                .getComponent(CssHtmlElementRenderer, removeAllButtonRenderer));

        this.engine.scene.addChildFromBuilder(
            this.engine.instantiater.buildGameObject("destroy-button", new Vector3(0, -2, 5))
                .withComponent(CssHtmlElementRenderer, c => {
                    const button = document.createElement("button");
                    button.textContent = "Destroy Remove All Spawned Objects Button";
                    button.style.backgroundColor = "#990000";
                    button.style.color = "white";
                    button.style.padding = "10px";
                    button.onclick = () => {
                        removeAllButtonRenderer.ref!.destroy();
                    };
                    c.element = button;
                    c.autoSize = true;
                    c.viewScale = 0.04;
                }));

        for (let i = 0; i < 10; i++) {
            this.spawnAtGameObject();
        }
    }
}
