# Create Component

Let's create our `Component` and add them to the `GameObject`

:::tip tip
Component corresponds to Unity's [MonoBehaviour](https://docs.unity3d.com/ScriptReference/MonoBehaviour.html) class.
:::

## Rotator Component

Let's make a component that rotates objects at a constant speed

```typescript title="./src/asset/script/Rotator.ts"
import { Component } from "the-world-engine";

export class Rotator extends Component {
    private readonly _rotationSpeed: number = 1;
    
    public update(): void {
        this.gameObject.transform.rotateZ(
            this._rotationSpeed * this.engine.time.deltaTime);
    }
}
```