//import { Quaternion, Vector3 } from "three/src/Three";
//import { GameObject } from "../../engine/hierarchy_object/GameObject";
//import { CssSpriteRenderer } from "../render/CssSpriteRenderer";
import { CssTilemapRenderer } from "../render/CssTilemapRenderer";
//import { ZaxisInitializer } from "../render/ZaxisInitializer";

/**
 * collision map with tilemap for grid system
 * there is limitation of tilemap size
 * 
 * this component will auto generate collision map from tilemap
 * 
 * coordinate system is row column (positive x is right, positive y is down)
 * 
 * important: grid position data is stored as string ("x_y" format)
 * so this component might not work properly if this component's gameObject.position is not integer
 */
export class CssCollideTilemapRenderer extends CssTilemapRenderer {
    private readonly _collideMap: Map<`${number}_${number}`, boolean> = new Map();
    private _collideEnabled = false;

    public override onEnable(): void {
        super.onEnable();
        this._collideEnabled = true;
    }

    public override onDisable(): void {
        super.onDisable();
        this._collideEnabled = false;
    }

    /**
     * draw tile at position. collide info will be automatically added
     * @param column column in tilemap
     * @param row row in tilemap
     * @param imageIndex index of image in imageSources
     * @param atlasIndex index of atlas in imageSources
     * @returns 
     */
    public override drawTile(column: number, row: number, imageIndex: number, atlasIndex?: number): void {
        super.drawTile(column, row, imageIndex, atlasIndex);
        const colideX = Math.ceil(column - this.columnCount / 2);
        const colideY = Math.ceil((this.rowCount - row) - this.rowCount / 2) - 1;
        //console.log(`${colideX}_${colideY}`);
        this._collideMap.set(`${colideX}_${colideY}`, true);
    }

    /**
     * draw tile from two dimensional array. collide info will be automatically added
     * 
     * array left upper corner is (0, 0) in tilemap
     * @param array array of image index. { i: 0, a: 1 } means imageSources[0] in atlas[1]
     * @param xOffset array x offset, if you want to add tile from array[1][3] to (2, 3) you should set xOffset = 1
     * @param yOffset array y offset, if you want to add tile from array[3][1] to (3, 2) you should set yOffset = 1
     * @returns 
     */
    public override drawTileFromTwoDimensionalArray(array: ({i: number, a: number}|null)[][], columnOffset: number, rowOffset: number): void {
        super.drawTileFromTwoDimensionalArray(array, columnOffset, rowOffset);
        for (let row = 0; row < array.length; row++) {
            for (let column = 0; column < array[row].length; column++) {
                if (array[row][column] !== null) {
                    //console.log(`${(column + columnOffset) - this.columnCount / 2}_${(this.rowCount - (row + rowOffset)) - this.rowCount / 2}`);
                    const colideX = Math.ceil(this.transform.localPosition.x / this.gridCellWidth + (column + columnOffset) - this.columnCount / 2);
                    const colideY = Math.ceil(this.transform.localPosition.y / this.gridCellHeight + (this.rowCount - (row + rowOffset)) - this.rowCount / 2) - 1;
                    this._collideMap.set(
                        `${colideX}_${colideY}`, true);
                    // this.addDebugImage(
                    //     ((column + columnOffset) - this.columnCount / 2) * this.tileWidth + this.tileWidth / 2,
                    //     ((this.rowCount - (row + rowOffset)) - this.rowCount / 2) * this.tileHeight - this.tileHeight / 2
                    // );
                }
            }
        }
    }

    /**
     * clear tile at position. collide info will be automatically removed
     * @param column column in tilemap
     * @param row row in tilemap
     * @returns 
     */
    public override clearTile(column: number, row: number): void {
        super.clearTile(column, row);
        const colideX = Math.ceil(column - this.columnCount / 2);
        const colideY = Math.ceil((this.rowCount - row) - this.rowCount / 2) - 1;
        this._collideMap.delete(`${colideX}_${colideY}`);
    }

    /**
     * add collider at position
     * @param column column in tilemap
     * @param row row in tilemap
     * @returns 
     */
    public addCollider(column: number, row: number): void {
        const colideX = Math.ceil(column - this.columnCount / 2);
        const colideY = Math.ceil((this.rowCount - row) - this.rowCount / 2) - 1;
        this._collideMap.set(`${colideX}_${colideY}`, true);
    }

    // private addDebugImage(x: number, y: number) {
    //     if (this.transform.parentTransform instanceof GameObject) {
    //         this.transform.parentTransform.addChildFromBuilder(
    //             this.engine.instantlater.buildGameObject("debug-image", new Vector3(x, y, 10000), new Quaternion(), new Vector3(0.5, 0.5, 0.5))
    //                 .withComponent(ZaxisInitializer)
    //                 .withComponent(CssSpriteRenderer));
    //     }
    // }

    /**
     * query that collides at position
     * @param x world position x
     * @param y world position y
     * @param width aabb collision width
     * @param height aabb collision height
     * @returns 
     */
    public checkCollision(x: number, y: number, width: number, height: number): boolean {
        if (!this._collideEnabled) return false;
        const worldPosition = this.transform.position;
        x -= worldPosition.x;
        y -= worldPosition.y;

        if (this.columnCount % 2 === 0) {
            x -= this.gridCellWidth;
        }
        if (this.rowCount % 2 === 0) {
            y -= this.gridCellHeight;
        }
        
        if (this.rowCount % 2 === 0) y += this.gridCellHeight / 2;
        if (this.columnCount % 2 === 0)  x += this.gridCellWidth / 2;
        const left = Math.floor(x / this.gridCellWidth);
        const right = Math.floor((x + width) / this.gridCellWidth);
        const top = Math.floor(y / this.gridCellHeight);
        const bottom = Math.floor((y + height) / this.gridCellHeight);
        //console.log(left, right, top, bottom);
        for (let row = top; row <= bottom; row++) {
            for (let column = left; column <= right; column++) {
                //console.log(`${column}_${row}`);
                if (this._collideMap.get(`${column}_${row}`) === true) {
                    return true;
                }
            }
        }
        return false;
    }
}
