import { Bootstrapper } from "@src/engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "@src/engine/bootstrap/SceneBuilder";
import { Component } from "@src/engine/hierarchy_object/Component";
import { Color } from "@src/engine/render/Color";
import { Camera, CameraType } from "@src/engine/script/render/Camera";
import { CssSpriteRenderer } from "@src/engine/script/render/CssSpriteRenderer";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BoxGeometry, Mesh, MeshBasicMaterial, Vector3, WebGLRenderer } from "three/src/Three";

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
                    c.backgroundColor = new Color(0.2, 0.2, 0.2);
                })
                .withComponent(class extends Component {
                    private _orbitControls: OrbitControls|null = null;

                    public start(): void {
                        const controls = this._orbitControls = new OrbitControls(this.engine.cameraContainer.camera!.threeCamera!, document.body);
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
                }))

            .withChild(instantiater.buildGameObject("sprite", new Vector3(0, 0, 10))
                .withComponent(CssSpriteRenderer, c => {
                    c.pointerEvents = true;
                }))

            .withChild(instantiater.buildGameObject("test-object")
                .withComponent(class extends Component {
                    public awake(): void {
                        const geometry = new BoxGeometry(1, 1, 1);
                        const material = new MeshBasicMaterial({ color: 0x00ff00 });
                        const cube = new Mesh(geometry, material);
                        this.transform.unsafeGetObject3D().add(cube);
                    }
                }))
        ;
    }
}
