import { Bootstrapper } from "@src/engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "@src/engine/bootstrap/SceneBuilder";
import { CoroutineIterator } from "@src/engine/coroutine/CoroutineIterator";
import { WaitForSeconds } from "@src/engine/coroutine/YieldInstruction";
import { PrefabRef } from "@src/engine/hierarchy_object/PrefabRef";
import { Color } from "@src/engine/render/Color";
import { CSS3DObject } from "@src/engine/render/CSS3DRenderer";
import { WebGLRendererLoader } from "@src/engine/render/WebGLRendererLoader";
import { Camera, CameraType } from "@src/engine/script/render/Camera";
import { CssHtmlElementRenderer } from "@src/engine/script/render/CssHtmlElementRenderer";
import { CssSpriteRenderer } from "@src/engine/script/render/CssSpriteRenderer";
import { WebGLGlobalPostProcessVolume } from "@src/engine/script/render/WebGLGlobalPostProcessVolume";
import { Object3DContainer } from "@src/engine/script/three/Object3DContainer";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass";
import { SSAOPass } from "three/examples/jsm/postprocessing/SSAOPass"; 
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { AmbientLight, BoxGeometry, DirectionalLight, Mesh, MeshPhongMaterial, PlaneGeometry, Quaternion, Vector3, WebGLRenderer } from "three/src/Three";
import * as THREE from "three/src/Three";

import { TopDownScenePrefab } from "./prefab/TopDownScenePrefab";
import { OrbitControls } from "./script/OrbitControls";
import BlueCloudBk from "./source/cloudy_cubemap/bluecloud_bk.jpg";
import BlueCloudDn from "./source/cloudy_cubemap/bluecloud_dn.jpg";
import BlueCloudFt from "./source/cloudy_cubemap/bluecloud_ft.jpg";
import BlueCloudLf from "./source/cloudy_cubemap/bluecloud_lf.jpg";
import BlueCloudRt from "./source/cloudy_cubemap/bluecloud_rt.jpg";
import BlueCloudUp from "./source/cloudy_cubemap/bluecloud_up.jpg";
import DaylightBox from "./source/Daylight Box_0.png";

export class WebglTestBootstrapper extends Bootstrapper {
    public override run(): SceneBuilder {
        this.setting.render.useCss3DRenderer(true);
        this.setting.render.webGLRendererLoader(WebGLRendererLoader);
        this.setting.render.webGLRenderer(() => {
            const webGLRenderer = new WebGLRenderer({ antialias: true });
            webGLRenderer.setPixelRatio(window.devicePixelRatio);
            webGLRenderer.shadowMap.enabled = true;
            webGLRenderer.outputEncoding = THREE.sRGBEncoding;
            webGLRenderer.toneMapping = THREE.ReinhardToneMapping;
            webGLRenderer.toneMappingExposure = 2.3;
            return webGLRenderer;
        });

        const instantiater = this.instantiater;

        const camera1 = new PrefabRef<Camera>();

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("switch-camera-button")
                .withComponent(CssHtmlElementRenderer, c => {
                    const button = document.createElement("button");
                    button.innerText = "switch camera";
                    button.onclick = (): void => {
                        camera1.ref!.priority = camera1.ref!.priority === 1 ? -1 : 1;
                    };
                    c.element = button;
                }))
            .withChild(instantiater.buildGameObject("camera", new Vector3(0, 0, 10))
                .withComponent(Camera, c => {
                    c.backgroundColor = new THREE.CubeTextureLoader().load([
                        BlueCloudFt, BlueCloudBk, BlueCloudUp, BlueCloudDn, BlueCloudRt, BlueCloudLf
                    ]);
                    c.backgroundColor.mapping = THREE.CubeReflectionMapping;

                    (c as Camera).startCoroutine(function* (): CoroutineIterator {
                        yield new WaitForSeconds(3);
                        const daylightBox = new THREE.TextureLoader().load(DaylightBox);
                        daylightBox.mapping = THREE.EquirectangularReflectionMapping;
                        c.backgroundColor = daylightBox;
                        yield new WaitForSeconds(3);
                        c.backgroundColor = new Color(1, 0, 0);
                        yield new WaitForSeconds(3);
                        c.backgroundColor = new Color(0, 1, 0);
                    }());
                    c.cameraType = CameraType.Perspective;
                })
                .withComponent(OrbitControls, c => {
                    c.enableDamping = false;
                })
                .getComponent(Camera, camera1))

            .withChild(instantiater.buildGameObject("camera2", new Vector3(0, 0, 20))
                .withComponent(Camera, c => {
                    c.backgroundColor = new Color(1, 1, 1);
                    c.cameraType = CameraType.Perspective;
                }))

            .withChild(instantiater.buildGameObject("postprocess-volume")
                .withComponent(WebGLGlobalPostProcessVolume, c => {
                    c.initializer((scene, camera) => {
                        const ssaoPass = new SSAOPass(scene, camera);
                        return [[ssaoPass], (): void => {
                            (ssaoPass.fsQuad as FullScreenQuad).dispose();
                        }];
                    });
                    (globalThis as any).volume = c;
                }))
            
            .withChild(instantiater.buildGameObject("postprocess-volume")
                .withComponent(WebGLGlobalPostProcessVolume, c => {
                    c.willAddRenderPass = false;

                    c.initializer(() => {
                        const bloomPass = new UnrealBloomPass(new THREE.Vector2(1024, 1024), 1, 0.4, 0.8);
                        return [[bloomPass], (): void => {
                            bloomPass.dispose();
                        }];
                    });
                    (globalThis as any).volume2 = c;
                }))
                
            .withChild(instantiater.buildGameObject("ambient-light")
                .withComponent(Object3DContainer<AmbientLight>, c => {
                    c.setObject3D(new AmbientLight(0xFFFFFF), object3D => object3D.dispose());
                }))

            .withChild(instantiater.buildGameObject("directional-light", new Vector3(-2, 0.5, 1))
                .withComponent(Object3DContainer<DirectionalLight>, c => {
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
                    c.setObject3D(directionalLight, object3D => object3D.dispose());
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
                    c.setObject3D(renderer);
                    c.enabled = false;
                }))

            .withChild(instantiater.buildGameObject("test-object", new Vector3(0, 0, 0))
                .withComponent(Object3DContainer<Mesh<BoxGeometry, MeshPhongMaterial>>, c => {
                    const geometry = new BoxGeometry(10, 10, 10);
                    const material = new MeshPhongMaterial({ color: 0x00ff00 });
                    const cube = new Mesh(geometry, material);
                    cube.castShadow = true;
                    cube.receiveShadow = true;
                    c.setObject3D(cube, object3D => {
                        object3D.geometry.dispose();
                        object3D.material.dispose();
                    });
                }))
            
            .withChild(instantiater.buildGameObject("plane",
                new Vector3(0, -5, 0),
                new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2))
                .withComponent(Object3DContainer<Mesh<PlaneGeometry, MeshPhongMaterial>>, c => {
                    const geometry = new PlaneGeometry(100, 100);
                    const material = new MeshPhongMaterial({ color: 0xffffff });
                    const plane = new Mesh(geometry, material);
                    plane.receiveShadow = true;
                    c.setObject3D(plane, object3D => {
                        object3D.geometry.dispose();
                        object3D.material.dispose();
                    });
                }))
        ;
    }
}
