import type { Component } from "./Component";
import type { GameObject } from "./GameObject";

export type ComponentConstructor<T extends Component = Component> = new (gameObject: GameObject) => T;
