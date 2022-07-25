import { Bootstrapper } from "@src/engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "@src/engine/bootstrap/SceneBuilder";
import { Component } from "@src/engine/hierarchy_object/Component";
import { CSS3DObject } from "@src/engine/render/CSS3DRenderer";
import { Camera, CameraType } from "@src/engine/script/render/Camera";
import { CssSpriteRenderer } from "@src/engine/script/render/CssSpriteRenderer";
import { Object3DContainer } from "@src/engine/script/three/Object3DContainer";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BoxGeometry, Mesh, MeshBasicMaterial, Vector3, WebGLRenderer } from "three/src/Three";

import { TopDownScenePrefab } from "./prefab/TopDownScenePrefab";

export class WebglTestBootstrapper extends Bootstrapper {
    public override run(): SceneBuilder {
        this.setting.render.useCss3DRenderer(true);

        const webGLRenderer = new WebGLRenderer();
        webGLRenderer.setPixelRatio( window.devicePixelRatio );
        this.setting.render.webGLRenderer(webGLRenderer);

        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera", new Vector3(0, 0, 10))
                .withComponent(Camera, c => {
                    c.cameraType = CameraType.Perspective;
                })
                .withComponent(class extends Component {
                    private _camera: Camera|null = null;
                    private _orbitControls: OrbitControls|null = null;

                    public awake(): void {
                        this._camera = this.gameObject.getComponent(Camera);
                    }

                    public start(): void {
                        const controls = this._orbitControls = new OrbitControls(this._camera!.threeCamera!, this.engine.domElement);
                        controls.listenToKeyEvents( window ); // optional
        
                        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
                        controls.dampingFactor = 0.05;
        
                        controls.screenSpacePanning = true;
        
                        controls.minDistance = 20;
                        controls.maxDistance = 50;
        
                        controls.maxPolarAngle = Math.PI / 2;
                    }

                    public update(): void {
                        this._orbitControls!.update();
                    }

                    public onDestroy(): void {
                        this._orbitControls!.dispose();
                        this._orbitControls = null;
                        this._camera = null;
                    }
                }))

            .withChild(instantiater.buildGameObject("sprite", new Vector3(0, 0, 10))
                .withComponent(CssSpriteRenderer, c => {
                    c.pointerEvents = true;
                }))

            .withChild(instantiater.buildPrefab("top_down_scene", TopDownScenePrefab,  new Vector3(0, -10, 0)).make())

            .withChild(instantiater.buildGameObject("csssprite-test")
                .withComponent(Object3DContainer, c => {
                    const div = document.createElement("div");
                    div.style.width = "100px";
                    div.style.height = "100px";
                    div.textContent = "Hello World";
                    const renderer = new CSS3DObject(div);
                    c.object3D = renderer;
                    (globalThis as any).sprite = c;
                }))

            .withChild(instantiater.buildGameObject("test-object", new Vector3(0, 0, -10))
                .withComponent(Object3DContainer, c => {
                    const geometry = new BoxGeometry(1, 1, 1);
                    const material = new MeshBasicMaterial({ color: 0x00ff00 });
                    const cube = new Mesh(geometry, material);
                    c.object3D = cube;
                    (globalThis as any).cube = c;
                }))
        ;
    }
}
