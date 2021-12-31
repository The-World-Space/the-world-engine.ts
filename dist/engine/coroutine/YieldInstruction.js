/**
 * base class for all yield instructions
 */
export class YieldInstruction {
}
/**
 * waits until the end of the frame after engine has rendererd every Camera
 */
export class WaitForEndOfFrame extends YieldInstruction {
    get instance() { return WaitForEndOfFrame._instance; }
}
WaitForEndOfFrame._instance = new WaitForEndOfFrame();
/**
 * suspends the coroutine execution for the given amount of seconds
 */
export class WaitForSeconds extends YieldInstruction {
    constructor(seconds) {
        super();
        this._seconds = seconds;
    }
    get seconds() { return this._seconds; }
}
/**
 * suspends the coroutine execution until the supplied delegate evaluates to true
 */
export class WaitUntil extends YieldInstruction {
    constructor(predicate) {
        super();
        this._predicate = predicate;
    }
    get predicate() { return this._predicate; }
}
/**
 * suspends the coroutine execution until the supplied delegate evaluates to false
 */
export class WaitWhile extends YieldInstruction {
    constructor(predicate) {
        super();
        this._predicate = predicate;
    }
    get predicate() { return this._predicate; }
}
