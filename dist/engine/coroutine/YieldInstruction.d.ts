/**
 * base class for all yield instructions
 */
export declare class YieldInstruction {
}
/**
 * waits until the end of the frame after engine has rendererd every Camera
 */
export declare class WaitForEndOfFrame extends YieldInstruction {
    private static readonly _instance;
    get instance(): WaitForEndOfFrame;
}
/**
 * suspends the coroutine execution for the given amount of seconds
 */
export declare class WaitForSeconds extends YieldInstruction {
    private readonly _seconds;
    constructor(seconds: number);
    get seconds(): number;
}
/**
 * suspends the coroutine execution until the supplied delegate evaluates to true
 */
export declare class WaitUntil extends YieldInstruction {
    private readonly _predicate;
    constructor(predicate: () => boolean);
    get predicate(): () => boolean;
}
/**
 * suspends the coroutine execution until the supplied delegate evaluates to false
 */
export declare class WaitWhile extends YieldInstruction {
    private readonly _predicate;
    constructor(predicate: () => boolean);
    get predicate(): () => boolean;
}
