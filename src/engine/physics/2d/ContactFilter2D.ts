import type { GameObject } from "../../hierarchy_object/GameObject";
import type { ReadonlyVector2 } from "../../math/ReadonlyVector2";
import type { Collider2D } from "../../script/physics2d/collider/Collider2D";

export class ContactFilter2D {
    public useTriggers = false;
    public useLayerMask = false;
    public useDepth = false;
    public useOutsideDepth = false;
    public useNormalAngle = false;
    public useOutsideNormalAngle = false;
    public layerMask = 0x00000000;
    public minDepth = 0;
    public maxDepth = 0;
    public minNormalAngle = 0;
    public maxNormalAngle = 0;
    public static normalAngleUpperLimit = 359.9999;
    public static noFilter: ContactFilter2D = new ContactFilter2D().noFilter();

    public noFilter(): ContactFilter2D {
        this.useTriggers = true;
        this.useLayerMask = false;
        this.layerMask = 0xffffffff;
        this.useDepth = false;
        this.useOutsideDepth = false;
        this.minDepth = Number.NEGATIVE_INFINITY;
        this.maxDepth = Number.POSITIVE_INFINITY;
        this.useNormalAngle = false;
        this.useOutsideNormalAngle = false;
        this.minNormalAngle = 0.0;
        this.maxNormalAngle = 359.9999;
        return this;
    }

    private checkConsistency(): void {
        if (this.minDepth >  this.maxDepth) {
            const minDepth = this.minDepth;
            this.minDepth = this.maxDepth;
            this.maxDepth = minDepth;
        }
        if (this.minNormalAngle >  this.maxNormalAngle) {
            const minNormalAngle = this.minNormalAngle;
            this.minNormalAngle = this.maxNormalAngle;
            this.maxNormalAngle = minNormalAngle;
        }
    }

    public clearLayerMask(): void {
        this.useLayerMask = false;
    }

    public setLayerMask(layerMask: number): void {
        this.layerMask = layerMask;
        this.useLayerMask = true;
    }

    public clearDepth(): void {
        this.useDepth = false;
    }

    public setDepth(minDepth: number, maxDepth: number): void {
        this.minDepth = minDepth;
        this.maxDepth = maxDepth;
        this.useDepth = true;
        this.checkConsistency();
    }

    public clearNormalAngle(): void {
        this.useNormalAngle = false;
    }

    public setNormalAngle(minNormalAngle: number, maxNormalAngle: number): void {
        this.minNormalAngle = minNormalAngle;
        this.maxNormalAngle = maxNormalAngle;
        this.useNormalAngle = true;
        this.checkConsistency();
    }

    public get isFiltering(): boolean {
        return !this.useTriggers || this.useLayerMask || this.useDepth || this.useNormalAngle;
    }

    public isFilteringTrigger(collider: Collider2D): boolean {
        return !this.useTriggers && collider.isTrigger;
    }

    public isFilteringLayerMask(layer: number): boolean {
        return this.useLayerMask && (this.layerMask & layer) == 0;
    }

    public isFilteringDepth(obj: GameObject): boolean {
        if (!this.useDepth) return false;

        if (this.minDepth >  this.maxDepth) {
            const minDepth = this.minDepth;
            this.minDepth = this.maxDepth;
            this.maxDepth = minDepth;
        }
        const z = obj.transform.position.z;
        const flag = z < this.minDepth || z > this.maxDepth;
        return this.useOutsideDepth ? !flag : flag;
    }

    public isFilteringNormalAngle(normal: ReadonlyVector2): boolean {
        return this.isFilteringNormalAngleUsingAngle(normal.angle());
    }

    private isFilteringNormalAngleUsingAngle(angle: number): boolean {
        if (!this.useNormalAngle) return false;

        if (this.minNormalAngle >  this.maxNormalAngle) {
            const minNormalAngle = this.minNormalAngle;
            this.minNormalAngle = this.maxNormalAngle;
            this.maxNormalAngle = minNormalAngle;
        }
        const flag = angle < this.minNormalAngle || angle > this.maxNormalAngle;
        return this.useOutsideNormalAngle ? !flag : flag;
    }
}
