import type { Body, Fixture, FixtureDef } from "../../../box2d.ts/build";
import type { IPhysicsObject2D } from "./PhysicsObject2D";

export class FixtureGroup {
    private _body: Body;
    private _physicObject: IPhysicsObject2D;
    private _fixtures: Fixture[] = [];

    public constructor(body: Body, physicObject: IPhysicsObject2D) {
        this._body = body;
        this._physicObject = physicObject;
    }

    public add(fixtureDef: FixtureDef): Fixture {
        const fixture = this._body.CreateFixture(fixtureDef);
        this._fixtures.push(fixture);
        return fixture;
    }

    public remove(fixture: Fixture): void {
        const index = this._fixtures.indexOf(fixture);
        if (index === -1) throw new Error("Fixture not found");
        this._fixtures.splice(index, 1);
        this._body.DestroyFixture(fixture);
    }

    public clear(): void {
        for (let i = 0; i < this._fixtures.length; i++) {
            this._body.DestroyFixture(this._fixtures[i]);
        }
        this._fixtures.length = 0;
    }

    public foreachFixture(callback: (fixture: Fixture) => void): void {
        for (let i = 0; i < this._fixtures.length; i++) {
            callback(this._fixtures[i]);
        }
    }

    public get body(): Body {
        return this._body;
    }

    public get physicObject(): IPhysicsObject2D {
        return this._physicObject;
    }
}
