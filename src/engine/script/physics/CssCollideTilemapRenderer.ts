//import { Quaternion, Vector3 } from "three";
//import { GameObject } from "../../engine/hierarchy_object/GameObject";
//import { CssSpriteRenderer } from "../render/CssSpriteRenderer";
import { CssTilemapRenderer } from "../render/CssTilemapRenderer";
//import { ZaxisInitializer } from "../render/ZaxisInitializer";

export class CssCollideTilemapRenderer extends CssTilemapRenderer {
    private readonly _collideMap: Map<`${number}_${number}`, boolean> = new Map();
    private _collideEnabled: boolean = false;

    public onEnable(): void {
        super.onEnable();
        this._collideEnabled = true;
    }

    public onDisable(): void {
        super.onDisable();
        this._collideEnabled = false;
    }

    public drawTile(column: number, row: number, imageIndex: number, atlasIndex?: number): void {
        super.drawTile(column, row, imageIndex, atlasIndex);
        const colideX = Math.ceil(column - this.columnCount / 2);
        const colideY = Math.ceil((this.rowCount - row) - this.rowCount / 2) - 1;
        //console.log(`${colideX}_${colideY}`);
        this._collideMap.set(`${colideX}_${colideY}`, true);
    }

    public drawTileFromTwoDimensionalArray(array: ({i: number, a: number}|null)[][], columnOffset: number, rowOffset: number): void {
        super.drawTileFromTwoDimensionalArray(array, columnOffset, rowOffset);
        for (let row = 0; row < array.length; row++) {
            for (let column = 0; column < array[row].length; column++) {
                if (array[row][column] !== null) {
                    //console.log(`${(column + columnOffset) - this.columnCount / 2}_${(this.rowCount - (row + rowOffset)) - this.rowCount / 2}`);
                    const colideX = Math.ceil(this.gameObject.transform.position.x / this.gridCellWidth + (column + columnOffset) - this.columnCount / 2);
                    const colideY = Math.ceil(this.gameObject.transform.position.y / this.gridCellHeight + (this.rowCount - (row + rowOffset)) - this.rowCount / 2) - 1;
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

    public clearTile(column: number, row: number): void {
        super.clearTile(column, row);
        const colideX = Math.ceil(column - this.columnCount / 2);
        const colideY = Math.ceil((this.rowCount - row) - this.rowCount / 2) - 1;
        this._collideMap.delete(`${colideX}_${colideY}`);
    }

    public addCollider(column: number, row: number): void {
        const colideX = Math.ceil(column - this.columnCount / 2);
        const colideY = Math.ceil((this.rowCount - row) - this.rowCount / 2) - 1;
        this._collideMap.set(`${colideX}_${colideY}`, true);
    }

    // private addDebugImage(x: number, y: number) {
    //     if (this.gameObject.transform.parentTransform instanceof GameObject) {
    //         this.gameObject.transform.parentTransform.addChildFromBuilder(
    //             this.engine.instantlater.buildGameObject("debugImage", new Vector3(x, y, 10000), new Quaternion(), new Vector3(0.5, 0.5, 0.5))
    //                 .withComponent(ZaxisInitializer)
    //                 .withComponent(CssSpriteRenderer));
    //     }
    // }

    public checkCollision(x: number, y: number, width: number, height: number): boolean {
        if (!this._collideEnabled) return false;
        const worldPosition = this.gameObject.transform.getWorldPosition(this._tempVector3);
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
