import { Vector2, Vector3 } from "three/src/Three";
import { GameObjectBuilder } from "../../../engine/hierarchy_object/GameObjectBuilder";
import { Prefab } from "../../../engine/hierarchy_object/Prefab";
import { PlayerGridMovementController } from "../../../engine/script/controller/PlayerGridMovementController";
import { BoxCollider2D } from "../../../engine/script/physics2d/collider/BoxCollider2D";
import { CircleCollider2D } from "../../../engine/script/physics2d/collider/CircleCollider2D";
import { EdgeCollider2D } from "../../../engine/script/physics2d/collider/EdgeCollider2D";
import { PolygonCollider2D } from "../../../engine/script/physics2d/collider/PolygonCollider2D";
import { RigidBody2D, RigidbodyType2D } from "../../../engine/script/physics2d/RigidBody2D";
import { CssTextRenderer, TextAlign } from "../../../engine/script/render/CssTextRenderer";
import { RaycastTest } from "../script/RaycastTest";
import { TestLayer } from "../TestLayer";

/** @internal */
export class RaycastTestPrefab extends Prefab {

    public make(): GameObjectBuilder {
        const instantiater = this.instantiater;

        return this.gameObjectBuilder
            .withChild(instantiater.buildGameObject("title", new Vector3(0, 15, 0))
                .withComponent(CssTextRenderer, c => {
                    c.text = "Raycast Test";
                    c.fontSize = 20;
                    c.textWidth = 50;
                    c.textAlign = TextAlign.Center;
                }))

            .withChild(instantiater.buildGameObject("ground", new Vector3(0, -6, 0))
                .withComponent(RigidBody2D, c => {
                    c.bodyType = RigidbodyType2D.Static;
                    c.setLayerFromName<TestLayer>("level");
                })
                .withComponent(BoxCollider2D, c => {
                    c.size = new Vector2(31, 1);
                }))

            .withChild(instantiater.buildGameObject("ground_edge", new Vector3(0, 6, 0))
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
            
            .withChild(instantiater.buildGameObject("circle", new Vector3(2, -3, 0))
                .withComponent(RigidBody2D, c => {
                    c.bodyType = RigidbodyType2D.Static;
                    c.setLayerFromName<TestLayer>("level");
                })
                .withComponent(CircleCollider2D, c => {
                    c.radius = 1;
                }))

            .withChild(instantiater.buildGameObject("polygon", new Vector3(3, 5, 0))
                .withComponent(RigidBody2D, c => {
                    c.bodyType = RigidbodyType2D.Static;
                    c.setLayerFromName<TestLayer>("level");
                })
                .withComponent(PolygonCollider2D, c => {
                    c.setShapeToRegularPolygon(6, 1);
                }))

            .withChild(instantiater.buildGameObject("polygon2", new Vector3(6, 2, 0))
                .withComponent(RigidBody2D, c => {
                    c.bodyType = RigidbodyType2D.Static;
                    c.setLayerFromName<TestLayer>("level");
                })
                .withComponent(PolygonCollider2D, c => {
                    c.setShapeToRegularPolygon(10, 1);
                }))

            .withChild(instantiater.buildGameObject("polygon3", new Vector3(-3, 4, 0))
                .withComponent(RigidBody2D, c => {
                    c.bodyType = RigidbodyType2D.Static;
                    c.setLayerFromName<TestLayer>("level");
                })
                .withComponent(PolygonCollider2D, c => {
                    c.setShapeToRegularPolygon(3, 1);
                }))

            .withChild(instantiater.buildGameObject("polygon4", new Vector3(-6, -2, 0))
                .withComponent(RigidBody2D, c => {
                    c.bodyType = RigidbodyType2D.Static;
                    c.setLayerFromName<TestLayer>("level");
                })
                .withComponent(PolygonCollider2D, c => {
                    c.setShapeToRegularPolygon(6, 1);
                }))

            .withChild(instantiater.buildGameObject("raycast_test", new Vector3(0, 0, 0))
                .withComponent(RaycastTest)
                .withComponent(PlayerGridMovementController))
        ;
    }
}
