import { Camera as ThreeCamera, EventDispatcher, Vector3 } from "three/src/Three";

import { Transform } from "../../hierarchy_object/Transform";
import { Camera } from "./Camera";

/**
 * duck-type camera that is compatible with object3d
 *
 * Use with raw three.js object
 */
export class DuckThreeCamera {
    private readonly _transform: Transform;

    private constructor(component: Camera, threeCamera: ThreeCamera) {
        this._transform = component.transform;

        const threeCameraProperties = Object.getOwnPropertyNames(threeCamera);
        for (const member of threeCameraProperties) {
            const threeCameraMember = (threeCamera as any)[member];
            Object.defineProperty(this, member, {
                get: () => threeCameraMember,
                set: (value: any) => {
                    (threeCamera as any)[member] = value;
                },
                configurable: true
            });
        }
        const derivedMembers = new Map<string, any>();
        this.getDerivedProtoypeMembers(threeCamera, derivedMembers);
        for (const [name, value] of derivedMembers) {
            (this as any)[name] = value.bind(threeCamera);
        }
        this.overrideMembers();
    }

    private getDerivedProtoypeMembers(object: any, result: Map<string, any>): void {
        const proto = object.__proto__;
        if (object !== EventDispatcher.prototype) {
            this.getDerivedProtoypeMembers(proto, result);
        }
        const protoMembers = Object.getOwnPropertyNames(proto);
        for (const member of protoMembers) {
            if (member === "constructor") continue;
            if (member.startsWith("_")) continue;
            const memberValue = (proto as any)[member];
            result.set(member, memberValue);
        }
    }

    private overrideMembers(): void {
        const transform = this._transform;
        const object3D = transform.unsafeGetObject3D();

        //traverse
        //traverseAncestors
        //traverseVisible

        const propertyNames = ["id", "uuid", "name", "parent", "children", "up", "position", "rotation", "quaternion", "scale", "matrix", "matrixWorld"];
        for (let i = 0; i < propertyNames.length; i++) {
            const propertyName = propertyNames[i];
            Object.defineProperty(this, propertyName, {
                get: () => (object3D as any)[propertyName],
                set: (value: any) => {
                    (object3D as any)[propertyName] = value;
                }
            });
        }

        const methodNames = [
            "add", "applyMatrix4", "applyQuaternion", "attach", "clear", "getWorldDirection", "getWorldPosition", "getWorldQuaternion",
            "getWorldScale", "localToWorld", "remove", "removeFromParent", "rotateOnAxis", "rotateOnWorldAxis", "rotateX", "rotateY", "rotateZ",
            "setRotationFromAxisAngle", "setRotationFromEuler", "setRotationFromMatrix", "setRotationFromQuaternion",
            "translateOnAxis", "translateX", "translateY", "translateZ", "updateMatrix", "updateMatrixWorld",
            "updateWorldMatrix", "worldToLocal"
        ];
        for (let i = 0; i < methodNames.length; i++) {
            const methodName = methodNames[i];
            (this as any)[methodName] = (object3D as any)[methodName].bind(object3D);
        }

        (this as any).lookAt = (target: Vector3|number, y?: number, z?: number): void => {
            (object3D as any).isCamera = true;
            if (typeof target === "number") {
                object3D.lookAt(target, y as number, z as number);
            } else {
                object3D.lookAt(target);
            }
            (object3D as any).isCamera = false;
        };
    }

    /** @internal */
    public static duckPool: Map<ThreeCamera, DuckThreeCamera> = new Map();

    /**
     * create duck type interface of camera component
     *
     * If this method is called without the camera's onEnable message being invoked error will be thrown
     *
     * This API is experimental because I'm currently looking for the most appropriate method
     * @param camera camera component
     * @param matrixAutoUpdate if true, the matrix will be updated automatically when the camera is updated
     * @returns three.js camera object duck type interface
     */
    public static createInterface(camera: Camera): ThreeCamera {
        if (camera.threeCamera === null) {
            throw new Error("DuckThreeCamera must be constructed after Camera onEnable message called");
        }

        let value = this.duckPool.get(camera.threeCamera);
        if (!value) {
            value = new DuckThreeCamera(camera, camera.threeCamera);
            this.duckPool.set(camera.threeCamera, value);
        }
        return value as unknown as ThreeCamera;
    }
}

Camera.removeCameraFromDuckPool = function(camera: ThreeCamera): void {
    DuckThreeCamera.duckPool.delete(camera);
};
