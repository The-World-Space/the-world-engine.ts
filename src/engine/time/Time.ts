export class Time {
    private _oldTime: number;

    private _time: number;
    private _unscaledTime: number;
    private _deltaTime: number;
    private _unscaledDeltaTime: number;
    private _timeScale: number;
    private _maximumDeltaTime: number = 1 / 3;

    public constructor() {
        this._oldTime = 0;
        this._time = 0;
        this._unscaledTime = 0;
        this._deltaTime = 0;
        this._unscaledDeltaTime = 0;
        this._timeScale = 1;
    }

    /** @internal */
    public start(): void {
        this._oldTime = performance.now();
    }

    /** @internal */
    public update(): void {
        const now = performance.now();
        let unscaledDeltaTime = (now - this._oldTime) / 1000;
        if (this._maximumDeltaTime < unscaledDeltaTime) {
            unscaledDeltaTime = this._maximumDeltaTime;
        }
        this._unscaledDeltaTime = unscaledDeltaTime;
        this._unscaledTime += unscaledDeltaTime;
        this._deltaTime = unscaledDeltaTime * this._timeScale;
        this._time += this._deltaTime;
        this._oldTime = now;
    }

    /**
     * The time at the beginning of this frame.
     */
    public get time(): number {
        return this._time;
    }

    /**
     * The timeScale-independent time for this frame (Read Only). This is the time in seconds since the start of the game.
     */
    public get unscaledTime(): number {
        return this._unscaledTime;
    }
    
    /**
     * the interval in seconds from the last frame to the current one.
     */
    public get deltaTime(): number {
        return this._deltaTime;
    }

    /**
     * The timeScale-independent interval in seconds from the last frame to the current one.
     */
    public get unscaledDeltaTime(): number {
        return this._unscaledDeltaTime;
    }

    /** 
     * The scale at which time passes. (default: 1)
     */
    public get timeScale(): number {
        return this._timeScale;
    }

    /** 
     * The scale at which time passes. (default: 1)
     */
    public set timeScale(value: number) {
        this._timeScale = value;
    }

    /**
     * The maximum value of Time.deltaTime in any given frame. This is a time in seconds that limits the increase of Time.time between two frames.
     * The default value is 0.333333, or one third of a second.
     * 
     * When a very slow frame happens, maximumDeltaTime limits the value of Time.deltaTime in the following frame to avoid undesirable side-effects from very large deltaTime values.
     */
    public get maximumDeltaTime(): number {
        return this._maximumDeltaTime;
    }

    /**
     * The maximum value of Time.deltaTime in any given frame. This is a time in seconds that limits the increase of Time.time between two frames.
     * The default value is 0.333333, or one third of a second.
     * 
     * When a very slow frame happens, maximumDeltaTime limits the value of Time.deltaTime in the following frame to avoid undesirable side-effects from very large deltaTime values.
     */
    public set maximumDeltaTime(value: number) {
        this._maximumDeltaTime = value;
    }
}
