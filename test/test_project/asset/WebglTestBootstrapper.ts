import { Bootstrapper } from "@src/engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "@src/engine/bootstrap/SceneBuilder";
import { CSS3DObject } from "@src/engine/render/CSS3DRenderer";
import { Camera, CameraType } from "@src/engine/script/render/Camera";
import { CssSpriteRenderer } from "@src/engine/script/render/CssSpriteRenderer";
import { Object3DContainer } from "@src/engine/script/three/Object3DContainer";
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect";
import { AmbientLight, BoxGeometry, DirectionalLight, Mesh, MeshBasicMaterial, Vector3, WebGLRenderer } from "three/src/Three";

import { TopDownScenePrefab } from "./prefab/TopDownScenePrefab";
import { OrbitControls } from "./script/OrbitControls";

export class WebglTestBootstrapper extends Bootstrapper {
    public override run(): SceneBuilder {
        this.setting.render.useCss3DRenderer(true);

        const webGLRenderer = new WebGLRenderer({ antialias: true });
        webGLRenderer.setPixelRatio(window.devicePixelRatio);
        const effect = new OutlineEffect(webGLRenderer);
        this.setting.render.webGLRenderer(effect, webGLRenderer.domElement);

        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera", new Vector3(0, 0, 10))
                .withComponent(Camera, c => {
                    c.cameraType = CameraType.Perspective;
                })
                .withComponent(OrbitControls, c => {
                    c.target = new Vector3(0, 4, 0);
                    (globalThis as any).controls = c;
                }))
                
            .withChild(instantiater.buildGameObject("ambient-light")
                .withComponent(Object3DContainer, c => c.object3D = new AmbientLight(0x666666)))

            .withChild(instantiater.buildGameObject("directional-light", new Vector3(-1, 1, 1).normalize())
                .withComponent(Object3DContainer, c => c.object3D = new DirectionalLight(0x887766)))

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
