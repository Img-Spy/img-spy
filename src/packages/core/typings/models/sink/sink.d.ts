import { OperatorFunction } from "rxjs";
export declare class Sink<T = any> {
    private map;
    private subSinksUsed;
    constructor(map?: (input: T) => string);
    start<S>(mapFunc: (input: S) => T): OperatorFunction<S, S>;
    end<S>(mapFunc: (input: S) => T): OperatorFunction<S, S>;
    finalize(input: T): void;
}
