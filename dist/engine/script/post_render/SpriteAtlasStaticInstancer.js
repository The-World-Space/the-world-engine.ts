import { Component } from "../../hierarchy_object/Component";
import { CssSpriteAtlasRenderer } from "../render/CssSpriteAtlasRenderer";
import { ZaxisInitializer } from "../render/ZaxisInitializer";
import { ZaxisSorter } from "../render/ZaxisSorter";
import { GlobalConfig } from "../../../GlobalConfig";
export class SpriteAtlasInstance {
    constructor(width, height, atlasIndex, position, rotation, scale, centerOffset) {
        this._width = width;
        this._height = height;
        this._atlasIndex = atlasIndex;
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
    get atlasIndex() {
        return this._atlasIndex;
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
export class SpriteAtlasStaticInstancer extends Component {
    constructor() {
        super(...arguments);
        this._imageSource = GlobalConfig.defaultSpriteSrc;
        this._useZaxisSorter = false;
        this._zaxisSortOffset = 0;
        this._rowCount = 1;
        this._columnCount = 1;
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
                .withComponent(CssSpriteAtlasRenderer, c => {
                c.imageWidth = instance.width;
                c.imageHeight = instance.height;
                c.imageIndex = instance.atlasIndex;
                c.asyncSetImage(this._imageSource, this._rowCount, this._columnCount);
                c.pointerEvents = this._pointerEvents;
                if (instance.centerOffset)
                    c.imageCenterOffset = instance.centerOffset;
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
    setSliceCount(rowCount, columnCount) {
        this._rowCount = rowCount;
        this._columnCount = columnCount;
    }
    get imageSource() {
        return this._imageSource;
    }
    set imageSource(value) {
        this._imageSource = value;
    }
    get rowCount() {
        return this._rowCount;
    }
    get columnCount() {
        return this._columnCount;
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
