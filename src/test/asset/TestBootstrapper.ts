import { Vector2, Vector3 } from "three";
import { Camera, Color, CssCollideTilemapChunkRenderer, CssHtmlElementRenderer, CssSpriteAtlasRenderer, CssTextRenderer, EditorCameraController, EditorGridRenderer, GameObject, GlobalConfig, PlayerGridMovementController, PointerGridInputListener, PrefabRef, TextAlign } from "../..";
import { Bootstrapper } from "../../engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "../../engine/bootstrap/SceneBuilder";
import { Css2DPolygonRenderer } from "../../engine/script/render/Css2DPolygonRenderer";
import { CameraPrefab } from "./prefab/CameraPrefab";
import { SansFightRoomPrefab } from "./prefab/SansFightRoomPrefab";
import { TimeTest } from "./script/TimeTest";

/** @internal */
export class TestBootstrapper extends Bootstrapper {
    public run(): SceneBuilder {
        const instantiater = this.engine.instantiater;

        const trackObject = new PrefabRef<GameObject>();
        const gridMap = new PrefabRef<CssCollideTilemapChunkRenderer>();

        console.clear();

        return this.sceneBuilder
            .withChild(instantiater.buildPrefab("sans_fight_room", SansFightRoomPrefab, new Vector3(8, 8, 0))
                .getColideTilemapChunkRendererRef(gridMap)
                .make()
                .active(false)
            )

            .withChild(instantiater.buildGameObject("test_object")
                //.active(false)
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
                    c.enabled = false;
                    c.asyncSetImage(GlobalConfig.defaultSpriteSrc, 2, 3);
                    c.viewScale = 0.1;
                    c.imageIndex = 0;
                    c.pointerEvents = true;
                    c.imageFlipX = true;
                    c.imageFlipY = true;
                    c.imageWidth = 16;
                    c.imageHeight = 32;
                    c.centerOffset = new Vector2(0, 0);
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
                })
                .getGameObject(trackObject))
            
            .withChild(instantiater.buildGameObject("camera_parent")
                .withChild(instantiater.buildGameObject("editor_camera", new Vector3(0, 0, 100))
                    //.active(false)
                    .withComponent(Camera, c => {
                        c.viewSize = 230;
                    })
                    .withComponent(EditorCameraController, c => {
                        c.maxViewSize = 500;
                    })
                    .withComponent(EditorGridRenderer, c => {
                        c.renderWidth = 1000;
                        c.renderHeight = 1000;
                    }))
                .withChild(instantiater.buildPrefab("track_camera", CameraPrefab)
                    .withTrackTarget(trackObject)
                    .withBackgroundColor(new PrefabRef(new Color(0, 0, 0)))
                    .withViewSize(new PrefabRef(200))
                    .make()
                    .active(false)
                    .withComponent(EditorGridRenderer, c => {
                        //c.enabled = false;
                        c.renderWidth = 1000;
                        c.renderHeight = 1000;
                    })))
        ;
    }
}
