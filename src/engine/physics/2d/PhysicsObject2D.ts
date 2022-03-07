import * as b2 from "../../../box2d.ts/build/index";
import { GameObject } from "../../hierarchy_object/GameObject";
import { Collider2D } from "../../script/physics2d/collider/Collider2D";
import { RigidBody2D } from "../../script/physics2d/RigidBody2D";

export class PhysicsObject2D {
    public readonly gameObject: GameObject;
    private _rigidBody: RigidBody2D|null = null;
    private _colliders: Collider2D[];
    private _onDestroy: () => void;
    public readonly _body: b2.Body;

    public constructor(gameObject: GameObject, body: b2.Body, onDestroy: () => void) {
        this.gameObject = gameObject;
        this._colliders = [];
        this._body = body;
        this._onDestroy = onDestroy;
        body.SetUserData(this);
    }

    public addRigidBody(rigidBody: RigidBody2D): b2.Body {
        if (this._rigidBody) throw new Error("RigidBody already exists");
        this._rigidBody = rigidBody;
        return this._body;
    }

    public removeRigidBody(): void {
        this._rigidBody = null;
        this.checkDestroy();
    }

    public addCollider(collider: Collider2D, fixtureDef: b2.FixtureDef): b2.Fixture {
        this._colliders.push(collider);
        return this._body.CreateFixture(fixtureDef);
    }

    public removeCollider(collider: Collider2D, fixture: b2.Fixture): void {
        const index = this._colliders.indexOf(collider);
        if (index === -1) throw new Error("Collider not found");
        this._colliders.splice(index, 1);
        this._body.DestroyFixture(fixture);
        this.checkDestroy();
    }

    private checkDestroy(): void {
        if (this._colliders.length === 0 && this._rigidBody === null) {
            this._body.GetWorld().DestroyBody(this._body);
            this._onDestroy();
        }
    }
}
