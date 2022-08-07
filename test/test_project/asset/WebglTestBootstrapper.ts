import { Bootstrapper } from "@src/engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "@src/engine/bootstrap/SceneBuilder";
import { Color } from "@src/engine/render/Color";
import { CSS3DObject } from "@src/engine/render/CSS3DRenderer";
import { WebGLPostProcessLoader } from "@src/engine/render/WebGLPostProcessLoader";
import { WebGLRendererLoader } from "@src/engine/render/WebGLRendererLoader";
import { Camera, CameraType } from "@src/engine/script/render/Camera";
import { CssSpriteRenderer } from "@src/engine/script/render/CssSpriteRenderer";
import { Object3DContainer } from "@src/engine/script/three/Object3DContainer";
import { AmbientLight, BoxGeometry, DirectionalLight, Mesh, MeshPhongMaterial, PlaneGeometry, Quaternion, Vector3, WebGLRenderer } from "three/src/Three";
import * as THREE from "three/src/Three";

import { TopDownScenePrefab } from "./prefab/TopDownScenePrefab";
import { OrbitControls } from "./script/OrbitControls";

export class WebglTestBootstrapper extends Bootstrapper {
    public override run(): SceneBuilder {
        this.setting.render.useCss3DRenderer(false);
        this.setting.render.webGLRendererLoader(WebGLRendererLoader);
        this.setting.render.webGLPostProcessLoader(WebGLPostProcessLoader);
        this.setting.render.webGLRenderer(() => {
            const webGLRenderer = new WebGLRenderer({ antialias: true });
            webGLRenderer.setPixelRatio(window.devicePixelRatio);
            webGLRenderer.shadowMap.enabled = true;
            webGLRenderer.toneMapping = THREE.ReinhardToneMapping;
            return webGLRenderer;
        });

        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera", new Vector3(0, 0, 10))
                .withComponent(Camera, c => {
                    c.backgroundColor = new Color(1, 1, 1);
                    c.cameraType = CameraType.Perspective;
                })
                .withComponent(OrbitControls, c => {
                    c.enableDamping = false;
                    (globalThis as any).controls = c;
                }))
                
            .withChild(instantiater.buildGameObject("ambient-light")
                .withComponent(Object3DContainer, c => c.object3D = new AmbientLight(0x666666)))

            .withChild(instantiater.buildGameObject("directional-light", new Vector3(-2, 0.5, 1))
                .withComponent(Object3DContainer, c => {
                    const directionalLight = new DirectionalLight(0x887766);
                    directionalLight.castShadow = true;
                    directionalLight.shadow.mapSize.width = 2048 * 2;
                    directionalLight.shadow.mapSize.height = 2048 * 2;
                    directionalLight.shadow.camera.near = 0.5;
                    directionalLight.shadow.camera.far = 500;
                    directionalLight.shadow.camera.left = -100;
                    directionalLight.shadow.camera.right = 100;
                    directionalLight.shadow.camera.top = 100;
                    directionalLight.shadow.camera.bottom = -100;
                    (globalThis as any).directionalLight = directionalLight;
                    c.object3D = directionalLight;
                }))

            .withChild(instantiater.buildGameObject("sprite", new Vector3(0, 0, 0))
                .active(true)
                .withComponent(CssSpriteRenderer, c => {
                    c.pointerEvents = true;
                }))

            .withChild(instantiater.buildPrefab("top_down_scene", TopDownScenePrefab, new Vector3(0, -10, 0)).make()
                .active(false))

            .withChild(instantiater.buildGameObject("csssprite-test")
                .withComponent(Object3DContainer, c => {
                    const div = document.createElement("div");
                    div.style.width = "100px";
                    div.style.height = "100px";
                    div.textContent = "Hello World";
                    const renderer = new CSS3DObject(div);
                    c.object3D = renderer;
                    c.enabled = false;
                }))

            .withChild(instantiater.buildGameObject("test-object", new Vector3(0, 0, 0))
                .withComponent(Object3DContainer, c => {
                    const geometry = new BoxGeometry(10, 10, 10);
                    const material = new MeshPhongMaterial({ color: 0x00ff00 });
                    const cube = new Mesh(geometry, material);
                    cube.castShadow = true;
                    cube.receiveShadow = true;
                    c.object3D = cube;
                    (globalThis as any).cube = c;
                }))
            
            .withChild(instantiater.buildGameObject("plane",
                new Vector3(0, -5, 0),
                new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2))
                .withComponent(Object3DContainer, c => {
                    const geometry = new PlaneGeometry(100, 100);
                    const material = new MeshPhongMaterial({ color: 0xffffff });
                    const plane = new Mesh(geometry, material);
                    plane.receiveShadow = true;
                    c.object3D = plane;
                }))
        ;
    }
}
