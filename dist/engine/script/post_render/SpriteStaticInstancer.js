import { Component } from "../../hierarchy_object/Component";
import { CssSpriteRenderer } from "../render/CssSpriteRenderer";
import { ZaxisInitializer } from "../render/ZaxisInitializer";
import { ZaxisSorter } from "../render/ZaxisSorter";
import { GlobalConfig } from "../../../GlobalConfig";
export class SpriteInstance {
    constructor(width, height, position, rotation, scale, centerOffset) {
        this._width = width;
        this._height = height;
        this._position = position;
        this._rotation = rotation;
        this._scale = scale;
        this._centerOffset = centerOffset;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    get position() {
        return this._position.clone();
    }
    get rotation() {
        var _a;
        return (_a = this._rotation) === null || _a === void 0 ? void 0 : _a.clone();
    }
    get scale() {
        var _a;
        return (_a = this._scale) === null || _a === void 0 ? void 0 : _a.clone();
    }
    get centerOffset() {
        var _a;
        return (_a = this._centerOffset) === null || _a === void 0 ? void 0 : _a.clone();
    }
}
export class SpriteStaticInstancer extends Component {
    constructor() {
        super(...arguments);
        this._imageSource = GlobalConfig.defaultSpriteSrc;
        this._useZaxisSorter = false;
        this._zaxisSortOffset = 0;
        this._pointerEvents = true;
        this._initializeFunction = null;
    }
    start() {
        var _a;
        (_a = this._initializeFunction) === null || _a === void 0 ? void 0 : _a.call(this);
    }
    setInstances(instances) {
        if (!this.awakened && !this.awakening) {
            this._initializeFunction = () => this.setInstances(instances);
            return;
        }
        const instantlater = this.engine.instantlater;
        for (let i = 0; i < instances.length; i++) {
            const instance = instances[i];
            const spriteBuilder = instantlater.buildGameObject(`${this.gameObject.name}_instance_${i}`, instance.position, instance.rotation, instance.scale)
                .withComponent(CssSpriteRenderer, c => {
                c.asyncSetImagePath(this._imageSource);
                c.imageWidth = instance.width;
                c.imageHeight = instance.height;
                if (instance.centerOffset)
                    c.imageCenterOffset = instance.centerOffset;
                c.pointerEvents = this._pointerEvents;
            });
            if (this._useZaxisSorter) {
                spriteBuilder.withComponent(ZaxisSorter, c => c.offset = this._zaxisSortOffset);
            }
            else {
                spriteBuilder.withComponent(ZaxisInitializer);
            }
            this.gameObject.addChildFromBuilder(spriteBuilder);
        }
        this.gameObject.removeComponent(this);
    }
    get imageSource() {
        return this._imageSource;
    }
    set imageSource(value) {
        this._imageSource = value;
    }
    get useZindexSorter() {
        return this._useZaxisSorter;
    }
    set useZindexSorter(value) {
        this._useZaxisSorter = value;
    }
    get zindexSortOffset() {
        return this._zaxisSortOffset;
    }
    set zindexSortOffset(value) {
        this._zaxisSortOffset = value;
    }
    get pointerEvents() {
        return this._pointerEvents;
    }
    set pointerEvents(value) {
        this._pointerEvents = value;
    }
}
