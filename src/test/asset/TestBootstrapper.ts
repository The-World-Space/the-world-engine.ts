import { Quaternion, Vector2, Vector3 } from "three/src/Three";
import { Bootstrapper } from "../../engine/bootstrap/Bootstrapper";
import { SceneBuilder } from "../../engine/bootstrap/SceneBuilder";
import { SansFightRoomPrefab } from "./prefab/SansFightRoomPrefab";
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
import { GlobalConfig } from "../../GlobalConfig";
import { CssSpriteRenderer } from "../../engine/script/render/CssSpriteRenderer";
import { PlayerGridMovementController } from "../../engine/script/controller/PlayerGridMovementController";
import { Camera, CameraType } from "../../engine/script/render/Camera";
import { EditorCameraController } from "../../engine/script/controller/EditorCameraController";
import { EditorGridRenderer } from "../../engine/script/post_render/EditorGridRenderer";
import { CssTextRenderer } from "../../engine/script/render/CssTextRenderer";
import { Color } from "../../engine/render/Color";
import { BodyDisposer } from "./script/BodyDisposer";
import { Physics2DLoader } from "../../engine/physics/2d/Physics2DLoader";
import { CircleCollider2D } from "../../engine/script/physics2d/collider/CircleCollider2D";
import { PolygonCollider2D } from "../../engine/script/physics2d/collider/PolygonCollider2D";
import { EdgeCollider2D } from "../../engine/script/physics2d/collider/EdgeCollider2D";
import { RenderTestPrefab } from "./prefab/RenderTestPrefab";
import { ZaxisSorter } from "../../engine/script/render/ZaxisSorter";

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
                    c.setLayerFromName<TestLayer>("level");
                })
                .withComponent(BoxCollider2D, c => {
                    c.size = new Vector2(31, 1);
                }))

            .withChild(instantiater.buildGameObject("ground_edge", new Vector3(0, 10, 0))
                .withComponent(RigidBody2D, c => {
                    c.bodyType = RigidbodyType2D.Static;
                    c.setLayerFromName<TestLayer>("level");
                })
                .withComponent(EdgeCollider2D, c => {
                    c.points = [
                        new Vector2(-15, 0),
                        new Vector2(0, 2),
                        new Vector2(15, 0)
                    ];
                }))

            .withChild(instantiater.buildGameObject("box", new Vector3(0, 0, 0), new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), Math.PI / 4))
                .withComponent(RigidBody2D, c => {
                    c.bodyType = RigidbodyType2D.Dynamic;
                    c.setLayerFromName<TestLayer>("player");
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

            
            .withChild(instantiater.buildGameObject("circle", new Vector3(2, 0, 0))
                .withComponent(RigidBody2D, c => {
                    c.bodyType = RigidbodyType2D.Dynamic;
                    c.setLayerFromName<TestLayer>("level");
                })
                .withComponent(CircleCollider2D, c => {
                    c.radius = 1;
                })
                .withComponent(CssSpriteRenderer, c => {
                    c.imageWidth = 1;
                    c.imageHeight = 1;
                }))

            .withChild(instantiater.buildGameObject("polygon", new Vector3(3, 0, 0))
                .withComponent(RigidBody2D, c => {
                    c.bodyType = RigidbodyType2D.Dynamic;
                    c.setLayerFromName<TestLayer>("level");
                })
                .withComponent(PolygonCollider2D, c => {
                    c.setShapeToRegularPolygon(6, 1);
                }))

            .withChild(instantiater.buildGameObject("polygon2", new Vector3(3, 2, 0))
                .withComponent(RigidBody2D, c => {
                    c.bodyType = RigidbodyType2D.Dynamic;
                    c.setLayerFromName<TestLayer>("level");
                })
                .withComponent(PolygonCollider2D, c => {
                    c.setShapeToRegularPolygon(10, 1);
                }))

            .withChild(instantiater.buildGameObject("polygon3", new Vector3(3, 4, 0))
                .withComponent(RigidBody2D, c => {
                    c.bodyType = RigidbodyType2D.Dynamic;
                    c.setLayerFromName<TestLayer>("level");
                })
                .withComponent(PolygonCollider2D, c => {
                    c.setShapeToRegularPolygon(3, 1);
                }))

            .withChild(instantiater.buildGameObject("bound_1", new Vector3(0, -8, 0))
                .withComponent(BoxCollider2D, c => {
                    c.size = new Vector2(100, 1);
                    c.isTrigger = true;
                })
                .withComponent(BodyDisposer))

            .withChild(instantiater.buildPrefab("sans_fight_room", SansFightRoomPrefab, new Vector3(-28, -50, 0))
                .getColideTilemapChunkRendererRef(gridMap)
                .make()
                //.active(false)
            )

            .withChild(instantiater.buildGameObject("track_object")
                //.active(false)
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
                    c.centerOffset = new Vector2(0, 0.4);
                    c.renderMode = CssSpriteAtlasRenderMode.ObjectFit;
                })
                .withComponent(PlayerGridMovementController, c => {
                    c.setGridInfoFromCollideMap(gridMap.ref!);
                    c.addCollideMap(gridMap.ref!);
                })
                .withComponent(ZaxisSorter)
                .getGameObject(trackObject))

            .withChild(instantiater.buildPrefab("render_test", RenderTestPrefab, new Vector3(0, -25, 0)).make())
            
            .withChild(instantiater.buildGameObject("editor_camera", new Vector3(0, 0, 80))
                //.active(false)
                .withComponent(Camera, c => {
                    c.viewSize = 10;
                    c.backgroundColor = new Color(0, 0, 0);
                    c.cameraType = CameraType.Orthographic;
                })
                .withComponent(EditorCameraController, c => {
                    c.maxViewSize = 40;
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
        ;
    }
}
