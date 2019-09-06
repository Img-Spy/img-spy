/// <reference types="node" />
import { OperatorFunction } from "rxjs";
interface ContentBundle<S> {
    input: S;
    content: Buffer;
}
declare const getFileContent: <S>(pathGetter: (input: S) => string) => OperatorFunction<S, ContentBundle<S>>;
export default getFileContent;
