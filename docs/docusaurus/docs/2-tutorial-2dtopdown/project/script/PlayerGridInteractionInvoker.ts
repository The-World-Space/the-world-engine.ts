import { Component, Directable, Direction, GridEventMap } from "the-world-engine";

export class PlayerGridInteractionInvoker extends Component {
    public override readonly disallowMultipleComponent = true;
    public override readonly requiredComponents = [Directable];
    
    private readonly _collideSize = 0.5;
    private readonly _tileWidth = 1;
    private readonly _tileHeight = 1;
    private readonly _gridEventMaps: GridEventMap[] = [];
    private _directable: Directable|null = null;

    private readonly onKeyDown = (e: KeyboardEvent): void => {
        if (e.key.toLowerCase() !== "e") return;
        
        const position = this.gameObject.transform.position;
        
        let xOffset;
        let yOffset;
        switch (this._directable!.direction) {
        case Direction.Up:
            xOffset = 0;
            yOffset = this._tileHeight;
            break;
        case Direction.Down:
            xOffset = 0;
            yOffset = -this._tileHeight;
            break;
        case Direction.Left:
            xOffset = -this._tileWidth;
            yOffset = 0;
            break;
        case Direction.Right:
            xOffset = this._tileWidth;
            yOffset = 0;
            break;
        }

        for (let i = 0; i < this._gridEventMaps.length; i++) {
            const gridEventMap = this._gridEventMaps[i];
            gridEventMap.tryInvokeEvent(
                position.x + xOffset,
                position.y + yOffset,
                this._collideSize,
                this._collideSize,
                this.gameObject
            );
        }
    };

    public awake(): void {
        this._directable = this.gameObject.getComponent(Directable);
    }

    public onEnable(): void {
        this.engine.input.onKeyDown.addListener(this.onKeyDown);
    }

    public onDisable(): void {
        this.engine.input.onKeyDown.removeListener(this.onKeyDown);
    }

    public addGridEventMap(gridEventMap: GridEventMap): void {
        this._gridEventMaps.push(gridEventMap);
    }
}
