import { Vector2, Vector3 } from "three";
import { Component } from "../../hierarchy_object/Component";
export class ParallaxTranslater extends Component {
    constructor() {
        super(...arguments);
        this._disallowMultipleComponent = true;
        this._offsetX = 1.5;
        this._offsetY = 1.5;
        this._initializeCenterFromPosition = true;
        this._center = new Vector2();
        this._tempVector3 = new Vector3();
        this._tempVector2 = new Vector2();
    }
    start() {
        if (this._initializeCenterFromPosition) {
            this._center.set(this.gameObject.transform.position.x, this.gameObject.transform.position.y);
        }
    }
    update() {
        const cameraWorldPosition = this.engine
            .cameraContainer.camera.getWorldPosition(this._tempVector3);
        const cameraLocalPosition = this.gameObject.transform.parentTransform.worldToLocal(cameraWorldPosition);
        const cameraPosition = this._tempVector2.set(cameraLocalPosition.x, cameraLocalPosition.y);
        const cameraDistanceX = cameraPosition.x - this._center.x;
        const cameraDistanceY = cameraPosition.y - this._center.y;
        const offsetX = this._offsetX * cameraDistanceX;
        const offsetY = this._offsetY * cameraDistanceY;
        this.gameObject.transform.position.x = this._center.x + offsetX;
        this.gameObject.transform.position.y = this._center.y + offsetY;
    }
    get offsetX() {
        return this._offsetX;
    }
    set offsetX(value) {
        this._offsetX = value;
    }
    get offsetY() {
        return this._offsetY;
    }
    set offsetY(value) {
        this._offsetY = value;
    }
    get initializeCenterFromPosition() {
        return this._initializeCenterFromPosition;
    }
    set initializeCenterFromPosition(value) {
        this._initializeCenterFromPosition = value;
    }
    get center() {
        return this._center;
    }
    set center(value) {
        this._center.copy(value);
    }
}
