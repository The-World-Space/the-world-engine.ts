---
sidebar_position: 2
---

# Create Game

Let's find out how to create a game instance

## Create Bootstrapper

`Bootstrapper` is a class that is used to construct the game.

We have to inherit from `Bootstrapper` and create the our own `Bootstrapper` class.

```typescript title="./src/asset/Bootstrapper.ts"
import { 
    Bootstrapper as BaseBootstrapper,
    SceneBuilder
} from "the-world-engine";

export class Bootstrapper extends BaseBootstrapper {
    public run(): SceneBuilder {
        return this.sceneBuilder;
    }
}
```

## Make Game

you can create `Game` instance with `Bootstrapper`.

```typescript title="./src/index.ts"
import { Game } from "the-world-engine";
import { Bootstrapper } from "./asset/Bootstrapper";

const game = new Game(document.body); // game view is attached to the document.body
game.run(Bootstrapper); // run the game
game.inputHandler.startHandleEvents(); // start handle user input
```

## Add Camera to the Game

the game works only when at least one camera exists. Let's make a camera

```typescript title="./src/asset/Bootstrapper.ts"
import { 
    Bootstrapper as BaseBootstrapper,
    Camera,
    SceneBuilder
} from "the-world-engine";
import { Vector3 } from "three/src/Three";

export class Bootstrapper extends BaseBootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera", new Vector3(0, 0, 10))
                .withComponent(Camera))
        ;
    }
}
```

The game scene has the same structure as unity game engine object hierarchy system.

Here's the current state of the scene.
![tree-camera](/img/1-getting-started/2-create-game/tree-camera.png)

:::tip tip
You can use [Three.js Developer Tools](https://addons.mozilla.org/en-US/firefox/addon/three-js-developer-tools/) to inspect the scene.

But don't trust all the information from `Three.js Developer Tools`. There are some bugs.
:::

:::danger danger
Importing the three.js type from "three" instead of "three/src/three" will cause the bundle size to grow dramatically
because the bundled js file is included in the build.

so use "three/src/Three" instead of "three"
:::
