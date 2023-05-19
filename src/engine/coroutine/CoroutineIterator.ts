import type { YieldInstruction } from "./YieldInstruction";

export type CoroutineIterator = IterableIterator<YieldInstruction | null>;
