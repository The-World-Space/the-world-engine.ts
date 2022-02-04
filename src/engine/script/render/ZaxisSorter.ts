import { ZaxisSortable } from "./ZaxisSortable";

export class ZaxisSorter extends ZaxisSortable {
    public override readonly disallowMultipleComponent: boolean = true;

    private _offset = 0;
    private _runOnce = true;

    public start(): void { 
        this.update();
        if (!this._runOnce) return;
        this.gameObject.removeComponent(this);
    }

    public update(): void {
        const worldPosition = this.transform.position;
        worldPosition.z = -worldPosition.y + this._offset;

        this.gameObject.getComponentsInChildren().forEach(component => {
            const cAny = component as any;
            if (cAny.onSortByZaxis) {
                if (typeof cAny.onSortByZaxis === "function") {
                    cAny.onSortByZaxis(worldPosition.z);
                }
            }
        });
    }

    public get offset(): number {
        return this._offset;
    }

    public set offset(value: number) {
        this._offset = value;
    }

    public get runOnce(): boolean {
        return this._runOnce;
    }

    public set runOnce(value: boolean) {
        this._runOnce = value;
    }
}
