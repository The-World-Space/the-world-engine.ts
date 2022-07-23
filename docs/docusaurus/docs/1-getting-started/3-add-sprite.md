---
sidebar_position: 3
---

# Add Sprite

Let's find out how to add sprites to the game

## Use CssSpriteRenderer Component

you can use `CssSpriteRenderer` component to add sprites to the game.

```typescript title="./src/asset/Bootstrapper.ts"
import { 
    Bootstrapper as BaseBootstrapper,
    Camera,
    CssSpriteRenderer,
    SceneBuilder
} from "the-world-engine";
import { Vector3 } from "three/src/Three";

export class Bootstrapper extends BaseBootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera", new Vector3(0, 0, 10))
                .withComponent(Camera))
            
            .withChild(instantiater.buildGameObject("sprite1") // create a sprite!
                .withComponent(CssSpriteRenderer))
        ;
    }
}
```
![sprite1](/img/1-getting-started/3-add-sprite/sprite1.png)

## Change Sprite Position

you can change initial position of the `GameObject`.

```typescript title="./src/asset/Bootstrapper.ts"
//...
return this.sceneBuilder
    //...
    .withChild(instantiater.buildGameObject("sprite1", new Vector3(4, 0, 0)) // x is 4
        .withComponent(CssSpriteRenderer))
;
```
![sprite1](/img/1-getting-started/3-add-sprite/sprite1-position.png)

## Change Sprite Rotation and Scale

you can change initial rotation and scale of the `GameObject`.

```typescript title="./src/asset/Bootstrapper.ts"
//...
return this.sceneBuilder
    //...
    .withChild(instantiater.buildGameObject("sprite1",
        new Vector3(4, 0, 0),
        new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), 45 * MathUtils.DEG2RAD), // rotate 45 degree around z axis
        new Vector3(2, 1, 1) // stretch x by 2
    )
        .withComponent(CssSpriteRenderer))
;
```
![sprite1](/img/1-getting-started/3-add-sprite/sprite1-rotation-scale.png)

## Set Sprite Image

you can set image of the `CssSpriteRenderer` component from image path.

```typescript title="./src/asset/Bootstrapper.ts"
//...
.withChild(instantiater.buildGameObject("sprite1", new Vector3(0, 0, 0))
    .withComponent(CssSpriteRenderer, c => {
        c.asyncSetImageFromPath("https://c.tenor.com/jJalYO9p0PAAAAAd/hatsune-miku-plush.gif");
        c.imageWidth = 6;
        c.imageHeight = 6;
    }))
;
```
![sprite1](/img/1-getting-started/3-add-sprite/sprite1-image.png)
