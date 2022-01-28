import { Component } from "./Component";
import { ComponentEvent } from "./ComponentEvent";

/**
 * awake is called when the script instance is being loaded.
 * The order that Unity calls each GameObject"s Awake is not deterministic.
 * Because of this, you should not rely on one GameObject"s Awake being called before or after another
 * (for example, you should not assume that a reference set up by one GameObject"s Awake will be usable in another GameObject"s Awake).
 * Instead, you should use Awake to set up references between scripts, and use Start, which is called after all Awake calls are finished, to pass any information back and forth.
 * https://docs.unity3d.com/ScriptReference/MonoBehaviour.Awake.html
 */
type AwakeableComponent = Component & { awake(): void; };

function isAwakeableComponent(component: Component): component is AwakeableComponent {
    return (component as AwakeableComponent).awake !== undefined;
}

/**
 * start is called on the frame when a script is enabled just before any of the Update methods are called the first time.
 * https://docs.unity3d.com/ScriptReference/MonoBehaviour.Start.html
 */
type StartableComponent = Component & { start(): void; };

function isStartableComponent(component: Component): component is StartableComponent {
    return (component as StartableComponent).start !== undefined;
}

/**
 * onDestroy occurs when a component is destroyed
 */
type OnDestroyableComponent = Component & { onDestroy(): void; };

function isOnDestroyableComponent(component: Component): component is OnDestroyableComponent {
    return (component as OnDestroyableComponent).onDestroy !== undefined;
}

/**
 * this function is called when the object becomes enabled and active
 */
type OnEnableableComponent = Component & { onEnable(): void; };

function isOnEnableableComponent(component: Component): component is OnEnableableComponent {
    return (component as OnEnableableComponent).onEnable !== undefined;
}

/**
 * this function is called when the component becomes disabled
 */
type OnDisableableComponent = Component & { onDisable(): void; };

function isOnDisableableComponent(component: Component): component is OnDisableableComponent {
    return (component as OnDisableableComponent).onDisable !== undefined;
}

export class ComponentEventContainer {
    private readonly _awake: ComponentEvent|null = null;

    public constructor(component: Component) {
        if (isAwakeableComponent(component)) {
            this._awake = ComponentEvent.createAwakeEvent(component, component.awake);
        }
    }

    public get awake(): ComponentEvent|null {
        return this._awake;
    }
}
