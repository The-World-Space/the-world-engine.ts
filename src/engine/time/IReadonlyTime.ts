/**
 * readonly time interface
 */
export interface IReadonlyTime {
    /**
     * the interval in seconds from the last frame to the current one
     */
    get deltaTime(): number;

    /**
     * time when engine started
     */
    get startTime(): number;
    
    /**
     * time passed since the game started
     */
    get elapsedTime(): number;
}
