/**
 * Based on http://www.emagix.net/academic/mscs-project/item/camera-sync-with-css3-and-webgl-threejs
 */
import * as THREE from "three";

const _position = new THREE.Vector3();
const _quaternion = new THREE.Quaternion();
const _scale = new THREE.Vector3();
const _matrix = new THREE.Matrix4();
const _matrix2 = new THREE.Matrix4();

export class OptimizedCSS3DRenderer {
    public domElement: HTMLElement;
    private _width = 0;
    private _height = 0;
    private _widthHalf = 0;
    private _heightHalf = 0;
    private _cache = {
        camera: {
            fov: 0,
            style: ""
        },
        objects: new WeakMap()
    };
    private _cameraElement: HTMLElement;

    public constructor() {
        const domElement = document.createElement("div");
        domElement.style.overflow = "hidden";
        this.domElement = domElement;

        // this.domElement.onscroll = () => { //block scroll to prevent camera bug
        //     this.domElement.scrollLeft = 0;
        //     this.domElement.scrollTop = 0;
        // };
        
        this._cameraElement = document.createElement("div");
        this._cameraElement.style.transformStyle = "preserve-3d";
        this._cameraElement.style.pointerEvents = "none";
        this.domElement.appendChild(this._cameraElement);
    }

    public getSize(): { width: number; height: number; } {
        return {
            width: this._width,
            height: this._height
        };
    }

    public render(renderObjects: readonly THREE.Object3D[], scene: THREE.Scene, camera: THREE.Camera): void {
        const fov = camera.projectionMatrix.elements[5] * this._heightHalf;
        if (this._cache.camera.fov !== fov) {
            this.domElement.style.perspective = (camera as any).isPerspectiveCamera ? fov + "px" : "";
            this._cache.camera.fov = fov;
        }

        if (scene.autoUpdate === true) scene.updateMatrixWorld();
        if (camera.parent === null) camera.updateMatrixWorld();
        
        let tx: number, ty: number;
        if ((camera as any).isOrthographicCamera) {
            tx = - ((camera as any).right + (camera as any).left) / 2;
            ty = ((camera as any).top + (camera as any).bottom) / 2;
        } else {
            tx = 1;
            ty = 1;
        }

        const cameraCSSMatrix = (camera as any).isOrthographicCamera 
            ? "scale(" + fov + ")" + "translate(" + this.epsilon(tx) + "px," + this.epsilon(ty) + "px)" + this.getCameraCSSMatrix(camera.matrixWorldInverse)
            : "translateZ(" + fov + "px)" + this.getCameraCSSMatrix(camera.matrixWorldInverse);
        
        const style = cameraCSSMatrix + "translate(" + this._widthHalf + "px," + this._heightHalf + "px)";

        if (this._cache.camera.style !== style) {
            this._cameraElement.style.transform = style;
            this._cache.camera.style = style;
        }

        for (let i = 0, l = renderObjects.length; i < l; i++) {
            this.renderObject(renderObjects[i], scene, camera, cameraCSSMatrix);
        }
    }

    public setSize(width: number, height: number): void {
        this._width = width;
        this._height = height;
        this._widthHalf = this._width / 2;
        this._heightHalf = this._height / 2;
        this.domElement.style.width = width + "px";
        this.domElement.style.height = height + "px";
        this._cameraElement.style.width = width + "px";
        this._cameraElement.style.height = height + "px";
    }

    private epsilon(value: number): number {
        return Math.abs(value) < 1e-10 ? 0 : value;
    }

    private getCameraCSSMatrix(matrix: THREE.Matrix4): string {
        const m = matrix.elements;
        const ep = this.epsilon;
        return "matrix3d(" + ep(m[0 ]) + "," + ep(-m[1 ]) + "," + ep(m[2 ]) + "," + ep(m[3 ]) + ","
                           + ep(m[4 ]) + "," + ep(-m[5 ]) + "," + ep(m[6 ]) + "," + ep(m[7 ]) + ","
                           + ep(m[8 ]) + "," + ep(-m[9 ]) + "," + ep(m[10]) + "," + ep(m[11]) + ","
                           + ep(m[12]) + "," + ep(-m[13]) + "," + ep(m[14]) + "," + ep(m[15]) + ")";
    }

    private getObjectCSSMatrix(matrix: THREE.Matrix4): string {
        const m = matrix.elements;
        const ep = this.epsilon;
        const matrix3d = "matrix3d(" + ep(m[0 ]) + "," + ep(m[1 ]) + "," + ep(m[2 ]) + "," + ep(m[3 ])
                               + "," + ep(-m[4]) + "," + ep(-m[5]) + "," + ep(-m[6]) + "," + ep(-m[7])
                               + "," + ep(m[8 ]) + "," + ep(m[9 ]) + "," + ep(m[10]) + "," + ep(m[11])
                               + "," + ep(m[12]) + "," + ep(m[13]) + "," + ep(m[14]) + "," + ep(m[15]) + ")";
        return "translate(-50%,-50%)" + matrix3d;
    }

    private renderObject(object: any, scene: THREE.Scene, camera: THREE.Camera, cameraCSSMatrix: string): void {
        if (object.isCSS3DObject) {
            object.onBeforeRender(this, scene, camera);
            let style;

            if (object.isCSS3DSprite) {
                // http://swiftcoder.wordpress.com/2008/11/25/constructing-a-billboard-matrix/
                _matrix.copy(camera.matrixWorldInverse);
                _matrix.transpose();
                if (object.rotation2D !== 0) _matrix.multiply(_matrix2.makeRotationZ(object.rotation2D));
                object.matrixWorld.decompose(_position, _quaternion, _scale);
                _matrix.setPosition(_position);
                _matrix.scale(_scale);

                _matrix.elements[3] = 0;
                _matrix.elements[7] = 0;
                _matrix.elements[11] = 0;
                _matrix.elements[15] = 1;

                style = this.getObjectCSSMatrix(_matrix);
            } else {
                style = this.getObjectCSSMatrix(object.matrixWorld);
            }

            const element = object.element;
            const cachedObject = this._cache.objects.get(object);

            if (cachedObject === undefined || cachedObject.style !== style) {
                element.style.transform = style;
                const objectData = {
                    style: style
                };
                this._cache.objects.set(object, objectData);
            }

            element.style.display = object.visible ? "" : "none";

            if (element.parentNode !== this._cameraElement) {
                this._cameraElement.appendChild(element);
            }
            object.onAfterRender(this, scene, camera);
        }

        for (let i = 0, l = object.children.length; i < l; ++i) {
            this.renderObject(object.children[i], scene, camera, cameraCSSMatrix);
        }
    }
}
