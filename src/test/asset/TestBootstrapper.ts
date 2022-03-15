import { Bootstrapper } from "../../engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "../../engine/bootstrap/SceneBuilder";
import { Css2DPolygonRenderer } from "../../engine/script/render/Css2DPolygonRenderer";
import { CameraPrefab } from "./prefab/CameraPrefab";
import { SansFightRoomPrefab } from "./prefab/SansFightRoomPrefab";
import { TimeTest } from "./script/TimeTest";
import { FpsCounter } from "./script/FpsCounter";
import { TestLayer } from "./TestLayer";
import { RigidBody2D, RigidbodyType2D } from "../../engine/script/physics2d/RigidBody2D";
import { BoxCollider2D } from "../../engine/script/physics2d/collider/BoxCollider2D";
import { CssSpriteAtlasRenderer, CssSpriteAtlasRenderMode } from "../../engine/script/render/CssSpriteAtlasRenderer";
import { Spawner } from "./script/Spawner";
import { IframeDynamicBoxPrefab } from "./prefab/IframeDynamicBoxPrefab";
import { ContactTest } from "./script/ContactTest";
import { PhysicsController } from "./script/PhysicsController";
import { GameObject } from "../../engine/hierarchy_object/GameObject";
import { CssCollideTilemapChunkRenderer } from "../../engine/script/grid_physics2d/CssCollideTilemapChunkRenderer";
import { PrefabRef } from "../../engine/hierarchy_object/PrefabRef";
import { PointerGridInputListener } from "../../engine/script/input/PointerGridInputListener";
import { GlobalConfig } from "../../GlobalConfig";
import { CssSpriteRenderer } from "../../engine/script/render/CssSpriteRenderer";
import { PlayerGridMovementController } from "../../engine/script/controller/PlayerGridMovementController";
import { Camera, CameraType } from "../../engine/script/render/Camera";
import { EditorCameraController } from "../../engine/script/controller/EditorCameraController";
import { EditorGridRenderer } from "../../engine/script/post_render/EditorGridRenderer";
import { CssTextRenderer, TextAlign } from "../../engine/script/render/CssTextRenderer";
import { Color } from "../../engine/render/Color";
import { CssHtmlElementRenderer } from "../../engine/script/render/CssHtmlElementRenderer";
import { BodyDisposer } from "./script/BodyDisposer";
import { Physics2DLoader } from "../../engine/physics/2d/Physics2DLoader";
import { Vector3 } from "three/src/math/Vector3";
import { Vector2 } from "three/src/math/Vector2";
import { Quaternion } from "three/src/math/Quaternion";

/** @internal */
export class TestBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {

        console.clear();

        this.setting.render
            .useCss3DRenderer(true);

        this.setting.physics
            .loader(Physics2DLoader)
            .layerCollisionMatrix<TestLayer>({
                default: { player: true, level: true, default: true },
                level: { player: true, level: true },
                player: { player: true }
            });

        const instantiater = this.instantiater;

        const trackObject = new PrefabRef<GameObject>();
        const gridMap = new PrefabRef<CssCollideTilemapChunkRenderer>();

        return this.sceneBuilder
            .withChild(instantiater.buildGameObject("spawner")
                .withComponent(Spawner, c => {
                    c.prefabCtor = IframeDynamicBoxPrefab;
                    c.initSpawnCount = 3;
                }))

            .withChild(instantiater.buildGameObject("ground", new Vector3(0, -3, 0))
                .withComponent(RigidBody2D, c => {
                    c.bodyType = RigidbodyType2D.Static;
                    c.setCollisionLayer<TestLayer>("level");
                })
                .withComponent(BoxCollider2D, c => {
                    c.size = new Vector2(17, 1);
                }))

            .withChild(instantiater.buildGameObject("box", new Vector3(0, 0, 0), new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 4))
                .withComponent(RigidBody2D, c => {
                    c.bodyType = RigidbodyType2D.Dynamic;
                    c.setCollisionLayer<TestLayer>("player");
                })
                .withComponent(BoxCollider2D, c => {
                    c.size = new Vector2(1, 1);
                    c.edgeRadius = 1;
                })
                .withComponent(ContactTest)
                .withComponent(PhysicsController)
                .withComponent(CssSpriteRenderer, c => {
                    c.imageWidth = 1;
                    c.imageHeight = 1;
                }))

            .withChild(instantiater.buildGameObject("bound_1")
                .active(false)
                .withComponent(BoxCollider2D, c => {
                    c.size = new Vector2(1, 1);
                    c.isTrigger = true;
                })
                .withComponent(BodyDisposer))

            .withChild(instantiater.buildPrefab("sans_fight_room", SansFightRoomPrefab, new Vector3(0.5, 0.5, 0))
                .getColideTilemapChunkRendererRef(gridMap)
                .make()
                .active(false)
            )

            .withChild(instantiater.buildGameObject("test_object")
                .active(false)
                .withComponent(TimeTest, c => c.enabled = false)
                .withComponent(CssHtmlElementRenderer, c => {
                    c.enabled = false;
                    const element = document.createElement("div");
                    element.style.backgroundColor = "#dddddd";
                    element.appendChild(document.createTextNode("hi! i'm a test object!"));
                    element.appendChild(document.createElement("br"));
                    element.appendChild(document.createElement("br"));
                    element.appendChild(document.createTextNode("you can add html elements on game objects!"));
                    element.appendChild(document.createElement("br"));
                    element.appendChild(document.createElement("br"));
                    const button = document.createElement("button");
                    button.innerText = "click me!";
                    const counter = document.createElement("span");
                    counter.innerText = "0";
                    button.onclick = () => {
                        counter.innerText = (parseInt(counter.innerText) + 1).toString();
                    };
                    element.appendChild(button);
                    element.appendChild(document.createElement("br"));
                    element.appendChild(document.createTextNode("count: "));
                    element.appendChild(counter);
                    element.appendChild(document.createElement("br"));
                    const slider = document.createElement("input");
                    slider.type = "range";
                    slider.min = "0";
                    slider.max = "100";
                    slider.value = "0";
                    element.appendChild(slider);

                    c.element = element;
                    setTimeout(() => {
                        const div = document.createElement("div");
                        div.innerText = "hello world!";
                        div.style.backgroundColor = "#dddddd";
                        c.element = div;
                    }, 1000000);
                    c.viewScale = 0.5;
                    c.autoSize = false;
                    c.elementWidth = 100;
                    c.elementHeight = 100;
                    c.centerOffset = new Vector2(0.5, 0.5);
                })
                .withComponent(CssTextRenderer, c => {
                    c.enabled = false;
                    c.autoSize = false;
                    c.textWidth = 64;
                    c.fontFamily = "Sans";
                    c.textAlign = TextAlign.Center;
                })
                .withComponent(Css2DPolygonRenderer, c => {
                    c.enabled = true;
                    c.viewScale = 0.1;
                    c.setShapeToRegularPolygon(10, 60);
                    c.color = new Color(0, 0, 0, 1);
                })
                .withComponent(PointerGridInputListener, c => c.enabled = false))

            .withChild(instantiater.buildGameObject("track_object")
                .active(false)
                .withComponent(CssSpriteAtlasRenderer, c => {
                    //c.enabled = false;
                    c.asyncSetImage(GlobalConfig.defaultSpriteSrc, 2, 3);
                    c.viewScale = 1;
                    c.imageIndex = 0;
                    c.pointerEvents = true;
                    c.imageFlipX = true;
                    c.imageFlipY = true;
                    c.imageWidth = 1;
                    c.imageHeight = 2;
                    c.centerOffset = new Vector2(0, 0);
                    c.renderMode = CssSpriteAtlasRenderMode.ObjectFit;
                    //settimeout loop
                    setTimeout(() => {
                        c.imageIndex = 1;
                        setTimeout(() => {
                            c.imageIndex = 2;
                            setTimeout(() => {
                                c.imageIndex = 3;
                                setTimeout(() => {
                                    c.imageIndex = 4;
                                    setTimeout(() => {
                                        c.imageIndex = 5;
                                    }, 1000);
                                }, 1000);
                            }, 1000);
                        }, 1000);
                    }, 1000);
                })
                .withComponent(PlayerGridMovementController, c => {
                    c.setGridInfoFromCollideMap(gridMap.ref!);
                    c.addCollideMap(gridMap.ref!);
                })
                .getGameObject(trackObject))
            
            .withChild(instantiater.buildGameObject("camera_parent")
                .withChild(instantiater.buildGameObject("editor_camera", new Vector3(0, 0, 10))
                    //.active(false)
                    .withComponent(Camera, c => {
                        c.viewSize = 10;
                        c.backgroundColor = new Color(0, 0, 0);
                        c.cameraType = CameraType.Orthographic;
                    })
                    .withComponent(EditorCameraController, c => {
                        c.maxViewSize = 10;
                    })
                    .withComponent(EditorGridRenderer, c => {
                        c.enabled = false;
                        c.renderWidth = 100;
                        c.renderHeight = 100;
                    })
                    .withComponent(CssTextRenderer, c => {
                        c.pointerEvents = false;
                        c.text = "e : spawn object  d : despawn object";
                        c.textWidth = 18;
                        c.centerOffset = new Vector2(0, 3);
                    })
                    .withChild(instantiater.buildGameObject("fps_counter")
                        .withComponent(CssTextRenderer, c => {
                            c.autoSize = true;
                            c.centerOffset = new Vector2(-1.8, 1.8);
                            c.textColor = new Color(1, 1, 1);
                        })
                        .withComponent(FpsCounter)))

                .withChild(instantiater.buildPrefab("track_camera", CameraPrefab)
                    .withTrackTarget(trackObject)
                    .withBackgroundColor(new PrefabRef(new Color(0, 0, 0)))
                    .withViewSize(new PrefabRef(10))
                    .make()
                    .active(false)
                    .withComponent(EditorGridRenderer, c => {
                        //c.enabled = false;
                        c.renderWidth = 100;
                        c.renderHeight = 100;
                    })))
        ;
    }
}
