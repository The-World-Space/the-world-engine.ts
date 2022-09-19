import { Component } from "./Component";

type ComponentMessages = 
    "start"|
    "update"|

    "awake"|
    "onEnable"|
    "onDisable"|
    "onDestroy"|

    "onCollisionEnter2D"|
    "onCollisionStay2D"|
    "onCollisionExit2D"|
    "onTriggerEnter2D"|
    "onTriggerStay2D"|
    "onTriggerExit2D"|

    "onWorldMatrixUpdated";

type ComponentKeys = keyof Component | ComponentMessages;

type InitializeDisallowedMembers = Exclude<ComponentKeys, "enabled"|"instanceId"|"initialized"|"exists">;

export type InitializeComponent<T extends Component> = Pick<T, Exclude<keyof T, InitializeDisallowedMembers>>;
