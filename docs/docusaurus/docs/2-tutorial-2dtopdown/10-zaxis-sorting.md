# Zaxis Sorting

In a towdown2d game, the object in front of you must be rendered before you,
and the object in the back must be rendered after it.

To implement this, you need to adjust the z-axis of the object.

These implementations are already available as engine built-in components so you don't need to implement them yourself.

There are two types of Zaxis sorting:

- **Sort Zaxis by Yaxis** - This method is mainly applied to elements that require a relative rendering order based on the player's position, such as objects in the scene.
- **Sort Zaxis by Camera distance** - This method is mainly used for elements that always have to be rendered behind, such as background, or always have to be rendered before, such as GUI.

## Sort Zaxis by Yaxis: `ZaxisSorter`

This component sorts the z-axis of the object based on the y-axis of the object.

This component allows you to adjust the render order for elements to be drawn as all objects in the 2d topdown game.

We'll apply it to the player.

```typescript title="src/asset/prefab/PlayerPrefab.ts"
export class PlayerPrefab extends Prefab {
    //...
    public override make(): GameObjectBuilder {
        return this.gameObjectBuilder
            //...
            .withComponent(MovementAnimationController)
            // Added: ZaxisSorter
            .withComponent(ZaxisSorter, c => {
                c.runOnce = false;
                c.offset = 0.5;
            })
        ;
    }
}
```

In the case of players, runOnce must be set to false because the position changes continuously.

The offset should also be centered on the foot. This value is different for each object, so you have to adjust it yourself.

**Description of the options:**

- `runOnce` - If true, the z-axis is only sorted once when the object is created. If false, the z-axis is sorted every frame. if object is moving, set false.
- `offset` - The offset value of the z-axis. The larger the value, the closer the object is to the camera.

## Sort Zaxis by Camera distance: `CameraRelativeZaxisSorter`

This component sorts the z-axis of the object based on the distance from the camera.

It is possible to use this component to adjust the zaxis of the object so that it is always rendered in the back or always in the front.

:::tip info
This component updates zaxis every frame, which is not good for performance, So if you're having a performance problem, I recommend you just put a very large constant so that it's always rendered front or back.

The `CSS3DRenderer` will not perform camera frustum culling, so no matter how large the value is, the object will be rendered
:::

We'll apply it to the background.

```typescript title="src/asset/prefab/BackgroundPrefab.ts"
//...
export class BackgroundPrefab extends Prefab {
    //...
    public override make(): GameObjectBuilder {

        return this.gameObjectBuilder
            // Added: CameraRelativeZaxisSorter
            .withComponent(CameraRelativeZaxisSorter, c => {
                c.offset = -100;
            })
            //...
```

```typescript title="src/asset/prefab/ForegroundPrefab.ts"
//...
export class IslandPrefab extends Prefab {
    //...
    public override make(): GameObjectBuilder {

        return this.gameObjectBuilder
            .withComponent(CameraRelativeZaxisSorter, c => {
                c.offset = -99;
            })
            //...
```

```typescript title="src/asset/prefab/DetailPrefab.ts"
//...
export class DetailPrefab extends Prefab {
    //...
    public override make(): GameObjectBuilder {
        return this.gameObjectBuilder
            .withComponent(CameraRelativeZaxisSorter, c => {
                c.offset = -98;
            })
            //...
```

We gave -100, -99 and -98 as offsets for the three background prefabs.
This ensures that the z-axis of the three objects always have a distance of -100, -99, and -98 relative to the camera.

It is possible to adjust what is rendered first by slightly varying the offset values in this way.
