import { Component } from "./Component";
import { GameObject } from "./GameObject";

export type ComponentConstructor<T extends Component = Component> = new (gameObject: GameObject) => T;
