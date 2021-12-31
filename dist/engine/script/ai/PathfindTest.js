import { Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
import { CssSpriteRenderer } from "../render/CssSpriteRenderer";
import { ZaxisInitializer } from "../render/ZaxisInitializer";
import { Pathfinder } from "./pathfind/Pathfinder";
export class PathfindTest extends Component {
    constructor() {
        super(...arguments);
        this._player = null;
        this._collideMaps = null;
        this._gridPointer = null;
        this._pathfinder = null;
        this._debugImages = [];
        this._onPointerDownBind = this.onPointerDown.bind(this);
    }
    start() {
        if (this._player === null) {
            throw new Error("Player not set");
        }
        if (this._collideMaps === null) {
            throw new Error("Collide maps not set");
        }
        if (this._gridPointer === null) {
            throw new Error("Grid pointer not set");
        }
        this._pathfinder = new Pathfinder(this._collideMaps);
        this._gridPointer.addOnPointerDownEventListener(this._onPointerDownBind);
    }
    onDestroy() {
        var _a;
        (_a = this._gridPointer) === null || _a === void 0 ? void 0 : _a.removeOnPointerDownEventListener(this._onPointerDownBind);
    }
    onPointerDown(event) {
        const start = this._player.positionInGrid;
        const end = event.gridPosition;
        const path = this._pathfinder.findPath(start, end);
        this.removeDebugImages();
        path === null || path === void 0 ? void 0 : path.forEach(p => {
            this.addDebugImage(p.x * this._collideMaps[0].gridCellWidth, p.y * this._collideMaps[0].gridCellHeight);
        });
    }
    addDebugImage(x, y) {
        const gameObjectRef = { ref: null };
        this.gameObject.addChildFromBuilder(this.engine.instantlater.buildGameObject("debugImage", new Vector3(x, y, 10000))
            .withComponent(ZaxisInitializer)
            .withComponent(CssSpriteRenderer, c => c.opacity = 0.5)
            .getGameObject(gameObjectRef));
        this._debugImages.push(gameObjectRef.ref);
    }
    removeDebugImages() {
        this._debugImages.forEach(image => {
            image.destroy();
        });
        this._debugImages = [];
    }
    get player() {
        return this._player;
    }
    set player(value) {
        this._player = value;
    }
    get collideMaps() {
        return this._collideMaps;
    }
    set collideMaps(value) {
        this._collideMaps = value;
    }
    get gridPointer() {
        return this._gridPointer;
    }
    set gridPointer(value) {
        this._gridPointer = value;
    }
}
