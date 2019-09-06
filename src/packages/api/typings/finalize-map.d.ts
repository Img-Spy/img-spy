import { OperatorFunction } from "rxjs";
declare const finalizeMap: <T>(mapFunc: (input: T) => T) => OperatorFunction<T, T>;
export default finalizeMap;
