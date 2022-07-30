import { Bootstrapper } from "@src/engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "@src/engine/bootstrap/SceneBuilder";
import { CSS3DObject } from "@src/engine/render/CSS3DRenderer";
import { Camera, CameraType } from "@src/engine/script/render/Camera";
import { CssSpriteRenderer } from "@src/engine/script/render/CssSpriteRenderer";
import { Object3DContainer } from "@src/engine/script/three/Object3DContainer";
import { OutlineEffect } from "three/examples/jsm/effects/OutlineEffect";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
//import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { AmbientLight, BoxGeometry, DirectionalLight, Mesh, MeshPhongMaterial, PlaneGeometry, Quaternion, Vector2, Vector3, WebGLRenderer } from "three/src/Three";
import * as THREE from "three/src/Three";

import { TopDownScenePrefab } from "./prefab/TopDownScenePrefab";
import { OrbitControls } from "./script/OrbitControls";

export class WebglTestBootstrapper extends Bootstrapper {
    public override run(): SceneBuilder {
        this.setting.render.useCss3DRenderer(false);
        const webGLRenderer = new WebGLRenderer({ antialias: true });
        webGLRenderer.setPixelRatio(window.devicePixelRatio);
        webGLRenderer.shadowMap.enabled = true;
        webGLRenderer.toneMapping = THREE.ReinhardToneMapping;

        const outlineEffect = new OutlineEffect(webGLRenderer);

        // todo: support render pass
        // todo: support post processing

        //const renderScene = new RenderPass( scene, camera );

        const bloomPass = new UnrealBloomPass( new Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
        bloomPass.threshold = 0;
        bloomPass.strength = 1.5;
        bloomPass.radius = 0;

        const composer = new EffectComposer(webGLRenderer);
        //composer.addPass(renderScene);
        composer.addPass(bloomPass);
        this.setting.render.webGLRenderer(outlineEffect, webGLRenderer.domElement);

        const instantiater = this.instantiater;

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("camera", new Vector3(0, 0, 10))
                .withComponent(Camera, c => {
                    c.cameraType = CameraType.Perspective;
                })
                .withComponent(OrbitControls, c => {
                    c.enableDamping = false;
                    (globalThis as any).controls = c;
                }))
                
            .withChild(instantiater.buildGameObject("ambient-light")
                .withComponent(Object3DContainer, c => c.object3D = new AmbientLight(0x666666)))

            .withChild(instantiater.buildGameObject("directional-light", new Vector3(-1, 1, 1).normalize())
                .withComponent(Object3DContainer, c => c.object3D = new DirectionalLight(0x887766)))

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
