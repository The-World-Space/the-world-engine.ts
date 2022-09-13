import type { Body, Fixture, FixtureDef } from "../../../box2d.ts/build/index";
import type { IPhysicsObject2D } from "./PhysicsObject2D";

/** @internal */
export class FixtureGroup {
    private readonly _body: Body;
    private readonly _physicObject: IPhysicsObject2D;
    private readonly _fixtures: Set<Fixture> = new Set();

    public constructor(body: Body, physicObject: IPhysicsObject2D) {
        this._body = body;
        this._physicObject = physicObject;
    }

    public add(fixtureDef: FixtureDef): Fixture {
        const fixture = this._body.CreateFixture(fixtureDef);
        this._fixtures.add(fixture);
        return fixture;
    }

    public remove(fixture: Fixture): void {
        this._fixtures.delete(fixture);
        this._body.DestroyFixture(fixture);
    }

    public clear(): void {
        for (const fixture of this._fixtures) {
            this._body.DestroyFixture(fixture);
        }
        this._fixtures.clear();
    }

    public foreachFixture(callback: (fixture: Fixture) => void): void {
        for (const fixture of this._fixtures) {
            callback(fixture);
        }
    }

    public contains(fixture: Fixture): boolean {
        return this._fixtures.has(fixture);
    }

    public get body(): Body {
        return this._body;
    }

    public get physicObject(): IPhysicsObject2D {
        return this._physicObject;
    }
}
