import { Camera as ThreeCamera, Euler, EventDispatcher, Matrix4, Object3D, Quaternion, Vector3 } from "three/src/Three";

import { WritableVector3 } from "../../math/WritableVector3";
import { Camera } from "./Camera";

/**
 * duck-type camera that is compatible with object3d
 * 
 * Use with raw three.js object
 */
export class DuckThreeCamera {
    private constructor(component: Camera, threeCamera: ThreeCamera) {
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
            (this as any)[name] = value;
        }
        this.overrideMembers(component);
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

    private overrideMembers(component: Camera): void {
        const gameObject = component.gameObject;
        const transform = gameObject.transform;
        const object3D = transform.unsafeGetObject3D();

        const tempMatrix = new Matrix4();

        // override id property
        Object.defineProperty(this, "id", {
            get: () => object3D.id,
            set: (value: number) => {
                object3D.id = value;
            }
        });

        // override uuid property
        Object.defineProperty(this, "uuid", {
            get: () => object3D.uuid,
            set: (value: string) => {
                object3D.uuid = value;
            }
        });

        // override name property
        Object.defineProperty(this, "name", {
            get: () => object3D.name,
            set: (value: string) => {
                object3D.name = value;
            }
        });

        // override parent property
        Object.defineProperty(this, "parent", {
            get: () => object3D.parent,
            set: (value: Object3D) => {
                object3D.parent = value;
            }
        });

        // override children property
        Object.defineProperty(this, "children", {
            get: () => object3D.children,
            set: (value: Object3D[]) => {
                object3D.children = value;
            }
        });

        // override up property
        Object.defineProperty(this, "up", {
            get: () => object3D.up,
            set: (value: Vector3) => {
                object3D.up = value;
            }
        });

        // override position property
        Object.defineProperty(this, "position", {
            get: () => transform.localPosition,
            set: (value: Vector3) => {
                transform.localPosition.copy(value);
            }
        });

        // override rotation property
        Object.defineProperty(this, "rotation", {
            get: () => transform.localRotation,
            set: (value: Euler) => {
                transform.localEulerAngles.copy(value);
            }
        });

        // override quaternion property
        Object.defineProperty(this, "quaternion", {
            get: () => transform.localRotation,
            set: (value: Quaternion) => {
                transform.localRotation.copy(value);
            }
        });

        // override scale property
        Object.defineProperty(this, "scale", {
            get: () => transform.localScale,
            set: (value: Vector3) => {
                transform.localScale.copy(value);
            }
        });

        // override matrix property
        Object.defineProperty(this, "matrix", {
            get: () => transform.getLocalMatrix(),
            set: (value: Matrix4) => {
                transform.setLocalMatrix(value);
            }
        });

        // override matrixWorld property
        Object.defineProperty(this, "matrixWorld", {
            get: () => transform.getWorldMatrix(),
            set: (value: Matrix4) => {
                transform.setWorldMatrix(value);
            }
        });

        // override add
        (this as unknown as Object3D).add = (child: Object3D): Object3D => {
            return object3D.add(child);
        };

        // override applyMatrix4
        (this as unknown as Object3D).applyMatrix4 = (matrix: Matrix4): void => {
            tempMatrix.copy(transform.getLocalMatrix());
            tempMatrix.premultiply(matrix);
            tempMatrix.decompose(transform.localPosition, transform.localRotation, transform.localScale);
        };

        // override applyQuaternion
        (this as unknown as Object3D).applyQuaternion = (quaternion: Quaternion): Object3D => {
            transform.localRotation.premultiply(quaternion);
            return object3D;
        };

        // override attach
        (this as unknown as Object3D).attach = (child: Object3D): Object3D => {
            return object3D.attach(child);
        };

        // override clear
        (this as unknown as Object3D).clear = (): Object3D => {
            return object3D.clear();
        };

        // override getWorldDirection property
        (this as unknown as Object3D).getWorldDirection = (target: Vector3): Vector3 => {
            return transform.getForward(target);
        };

        // override getWorldPosition property
        (this as unknown as Object3D).getWorldPosition = (target: Vector3): Vector3 => {
            return target.copy(transform.position);
        };

        // override getWorldQuaternion property
        (this as unknown as Object3D).getWorldQuaternion = (target: Quaternion): Quaternion => {
            return target.copy(transform.rotation);
        };

        // override getWorldScale property
        (this as unknown as Object3D).getWorldScale = (target: Vector3): Vector3 => {
            return (target as WritableVector3).copy(transform.lossyScale) as Vector3;
        };

        // override localToWorld property
        (this as unknown as Object3D).localToWorld = (target: Vector3): Vector3 => {
            return transform.transformPoint(target);
        };

        // override lookAt
        (this as unknown as Object3D).lookAt = (target: Vector3): void => {
            transform.lookAt(target);
        };

        // override remove
        (this as unknown as Object3D).remove = (child: Object3D): Object3D => {
            return object3D.remove(child);
        };

        // override removeFromParent
        (this as unknown as Object3D).removeFromParent = (): Object3D => {
            return object3D.removeFromParent();
        };

        // override rotateOnAxis
        (this as unknown as Object3D).rotateOnAxis = (axis: Vector3, angle: number): Object3D => {
            transform.rotateOnAxis(axis, angle);
            return object3D;
        };

        // override rotateOnWorldAxis
        (this as unknown as Object3D).rotateOnWorldAxis = (axis: Vector3, angle: number): Object3D => {
            transform.rotateOnWorldAxis(axis, angle);
            return object3D;
        };

        // override rotateX
        (this as unknown as Object3D).rotateX = (angle: number): Object3D => {
            transform.rotateX(angle);
            return object3D;
        };

        // override rotateY
        (this as unknown as Object3D).rotateY = (angle: number): Object3D => {
            transform.rotateY(angle);
            return object3D;
        };

        // override rotateZ
        (this as unknown as Object3D).rotateZ = (angle: number): Object3D => {
            transform.rotateZ(angle);
            return object3D;
        };

        // override setRotationFromAxisAngle
        (this as unknown as Object3D).setRotationFromAxisAngle = (axis: Vector3, angle: number): void => {
            transform.setRotationFromAxisAngle(axis, angle);
        };

        // override setRotationFromEuler
        (this as unknown as Object3D).setRotationFromEuler = (euler: Euler): void => {
            transform.setRotationFromEuler(euler);
        };

        // override setRotationFromMatrix
        (this as unknown as Object3D).setRotationFromMatrix = (m: Matrix4): void => {
            transform.setRotationFromMatrix(m);
        };

        // override setRotationFromQuaternion
        (this as unknown as Object3D).setRotationFromQuaternion = (quaternion: Quaternion): void => {
            transform.localRotation.copy(quaternion);
        };

        // override translateOnAxis
        (this as unknown as Object3D).translateOnAxis = (axis: Vector3, distance: number): Object3D => {
            transform.translateOnAxis(axis, distance);
            return object3D;
        };

        // override translateX
        (this as unknown as Object3D).translateX = (distance: number): Object3D => {
            transform.translateX(distance);
            return object3D;
        };

        // override translateY
        (this as unknown as Object3D).translateY = (distance: number): Object3D => {
            transform.translateY(distance);
            return object3D;
        };

        // override translateZ
        (this as unknown as Object3D).translateZ = (distance: number): Object3D => {
            transform.translateZ(distance);
            return object3D;
        };

        //traverse
        //traverseAncestors
        //traverseVisible

        // override updateMatrix
        (this as unknown as Object3D).updateMatrix = (): void => {
            //empty because matrix is automatically updated by transform
        };

        // override updateMatrixWorld
        (this as unknown as Object3D).updateMatrixWorld = (): void => {
            //empty because matrix is automatically updated by transform
        };

        // override updateProjectionMatrix
        (this as unknown as Object3D).updateWorldMatrix = (): void => {
            //empty because matrix is automatically updated by transform
        };

        // override worldToLocal
        (this as unknown as Object3D).worldToLocal = (target: Vector3): Vector3 => {
            return transform.inverseTransformPoint(target);
        };
    }

    /** @internal */
    public static duckPool: Map<ThreeCamera, DuckThreeCamera> = new Map();

    /**
     * create duck type interface of camera component
     * 
     * this interface is guaranteed automatic updating of the matrix
     * 
     * If this method is called without the camera's enable message being invoked error will be thrown
     * @param camera camera component
     * @returns three.js camera object duck type interface
     */
    public static createInterface(camera: Camera): ThreeCamera {
        if (camera.threeCamera === null) {
            throw new Error("DuckThreeCamera must be constructed after Camera onEnable message called");
        }

        if (this.duckPool.has(camera.threeCamera)) {
            return this.duckPool.get(camera.threeCamera)! as unknown as ThreeCamera;
        }
        const duck = new DuckThreeCamera(camera, camera.threeCamera);
        this.duckPool.set(camera.threeCamera, duck);
        return duck as unknown as ThreeCamera;
    }
}

Camera.removeCameraFromDuckPool = function (camera: ThreeCamera): void {
    DuckThreeCamera.duckPool.delete(camera);
};
